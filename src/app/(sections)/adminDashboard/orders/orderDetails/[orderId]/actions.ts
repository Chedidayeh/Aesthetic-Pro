'use server'


import { createAffiliateNotification, getUser } from "@/actions/actions";
import { db } from "@/db";
import { OrderStatus, OrderType } from "@prisma/client";
import { platform } from "os";
import { createNotification } from "../../../notifications/action";


export const getOrderWithItemsAndProducts = async (orderId : string) => {
    try {
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  store : true
                }
              },
              frontsellerDesign : true,
              backsellerDesign : true,
              frontclientDesign : true,
              backclientDesign :true,
            },
          },
          user : true,
          commission : true
        },
      });
  
      return order;
    } catch (error) {
      console.error('Error retrieving order with items and products:', error);
      throw new Error('Failed to retrieve order with items and products from database');
    }
  };


  export const changeStatus = async (orderId: string, status: OrderStatus) => {
    try {
      // Define the data object to update based on status
      let dataToUpdate: any = { status: status };
  
      // If status is 'DELIVERED', set isPaid to true; otherwise, set it to false
      dataToUpdate.isPaid = status === OrderStatus.DELIVERED;
  
      // Update the order in the database
      const updatedOrder = await db.order.update({
        where: { id: orderId },
        data: dataToUpdate,
      });
  
      return updatedOrder;
    } catch (error) {
      console.error('Error changing order status:', error);
      throw new Error('Failed to change order status in the database');
    }
    
  };

  export const changeType = async (orderId: string, type: OrderType) => {
    try {
      // Update the order status in the database
      const updatedOrder = await db.order.update({
        where: { id: orderId },
        data: { type: type },
      });
  
      return updatedOrder;
    } catch (error) {
      console.error('Error changing order status:', error);
      throw new Error('Failed to change order status in the database');
    }
  };







    // profit for products
 export async function calculateTotalSellerProfiForProducts(orderId : string) {
    try {
      // Fetch the order with its items and related products
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              product: {
                include : {
                  store : true
                }
              }
            }
          }
        }
      });
  
      if (!order) {
        throw new Error('Order not found');
      }
  
      // Initialize total profit for the order
    let totalOrderProfit = 0;

    // Calculate total seller profit for each product in each order item
    const orderItemProfits = order.orderItems.map(item => {
      if (item.product) {
      const totalProfit = item.product.sellerProfit * item.quantity;
      totalOrderProfit += totalProfit;
      return {
        productId: item.productId,
        storeName : item.product.store.storeName,
        productQuantity : item.quantity,
        productTitle: item.productTitle,
        totalProfit
      };
      }
      else {
        return {
          productId: null,
          storeName : "Not found",
          productQuantity: item.quantity,
          productTitle: 'Product not found',
          totalProfit: 0
        }
      }
      
    });

    // Return the result including the total order profit
    return {
      orderId,
      orderItemProfits,
      totalOrderProfit
    };
    } catch (error) {
      console.error('Error calculating total seller profit:', error);
      throw error;
    }
  }

    // update for products
  export async function updateRevenueAndSalesForProducts(orderId: string, platformProfit: number , totalIncome : number) {
    try {
      // Fetch the order with its items and related products
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  store: true, // Include store information for each product
                },
              },
            },
          },
          commission : true
        },
      });
  
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.commission) {
        // Fetch the affiliate link
        const affiliateLink = await db.affiliateLink.findUnique({
          where: { id: order.commission.affiliateLinkId },
          include: { affiliate: true }, // Include the affiliate relation to access totalIncome
        });
      
        if (affiliateLink) {
          // Update total sales for the affiliate link
          await db.affiliateLink.update({
            where: { id: affiliateLink.id },
            data: {
              totalSales: { increment: 1 }, // Increment total sales
            },
          });
      
          // Update total income for the affiliate
          await db.affiliate.update({
            where: { id: affiliateLink.affiliateId }, // Ensure this field exists in your AffiliateLink
            data: {
              totalIncome: { increment: order.commission.profit }, // Increment total income
            },
          });

          const product = await db.product.findFirst({
            where: { id: affiliateLink.productId },
          })

          const notificationContent = `Great News: Your affiliate product "${product!.title}" has been sold`;

          await createAffiliateNotification(affiliateLink.affiliateId,notificationContent , "Admin")

        }
      }
      

  
      // Filter out order items with null productId
      const validOrderItems = order.orderItems.filter((item) => item.productId !== null);
  
      // Update each product's revenue and increment total sales
      const updatePromises = validOrderItems.map(async (item) => {
        if (!item.product) {
          return
        }
  
        const newRevenue = item.product.sellerProfit * item.quantity;
  
        // Update product's revenue and total sales
        await db.product.update({
          where: { id: item.productId! },
          data: {
            revenue: { increment: newRevenue },
            totalSales: { increment: 1 },
          },
        });

        await checkAndSetTopSales(item.productId!)

        // Update store's revenue and total sales
        if (item.product.store) {
          await db.store.update({
            where: { id: item.product.store.id },
            data: {
              revenue: { increment: newRevenue },
              totalSales: { increment: 1 },
            },
          });
          const notificationContent = `Great News: Your product "${item.product.title}" has been sold`;

          await createNotification(item.product.store.id,notificationContent , "Admin")
        } else {
          throw new Error(`Store not found for product ${item.product.id}`);
        }
      });
  
      // Wait for all updates to complete
      await Promise.all(updatePromises);
  
      // Mark order as updated
      await db.order.update({
        where: { id: order.id },
        data: {
          updated: true,
        },
      });

  
      // Update platform profit
      const user = await getUser(); // Assuming this function gets the current user
      if (user) {
        await db.platform.update({
          where: { userId: user.id },
          data: {
            profit: { increment: platformProfit },
            totalIncome : { increment: totalIncome }
          },
        });
      } else {
        throw new Error('User not found');
      }
  
      return {
        message: 'Product revenue and total sales updated successfully.',
      };
    } catch (error) {
      console.error('Error updating product revenue and total sales:', error);
      throw error;
    }
  }











// profit for designs
export async function calculateTotalSellerProfitForDesigns(orderId: string) {
  try {
    // Fetch the order with its items and related designs
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            frontsellerDesign: {
              include : {
                store : true
              }
            },
            backsellerDesign: {
              include : {
                store : true
              }
            },
            frontclientDesign: true,
            backclientDesign: true,
          }
        }
      }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Initialize total profit for the order
    let totalOrderProfit = 0;

    // Calculate total seller profit for each design in each order item
    const orderItemProfits = order.orderItems.flatMap(item => {
      const profits = [];
      let designId = ''
      let designName = ''
      // Calculate profit for front designs
      if (item.frontsellerDesign) {
        designId = item.frontsellerDesign.id
        designName = item.frontsellerDesign.name
        const frontProfit = item.frontsellerDesign.sellerProfit * item.quantity;
        totalOrderProfit += frontProfit;
        profits.push({
          store : item.frontsellerDesign.store!.storeName,
          designId,
          designName,
          designType: 'front seller Design',
          productQuantity: item.quantity,
          totalProfit: frontProfit
        });
      }

      if (item.frontclientDesign) {
        designId = item.frontclientDesign.id
        designName = item.frontclientDesign.name ?? "client design"
        profits.push({
          store : "No store",
          designId,
          designName,
          designType: 'front client Design',
          productQuantity: item.quantity,
          totalProfit: 0
        });
      }

      // Calculate profit for back designs
      if (item.backsellerDesign) {
        designId = item.backsellerDesign.id
        designName = item.backsellerDesign.name
        const backProfit = item.backsellerDesign.sellerProfit * item.quantity;
        totalOrderProfit += backProfit;
        profits.push({
          store : item.backsellerDesign.store!.storeName,
          designId,
          designName,
          designType: 'back seller Design',
          productQuantity: item.quantity,
          totalProfit: backProfit
        });
      }

      if (item.backclientDesign) {
        designId = item.backclientDesign.id
        designName = item.backclientDesign.name ?? "client design"
        profits.push({
          store : "No store",
          designId,
          designName,          
          designType: 'back client Design',
          productQuantity: item.quantity,
          totalProfit: 0
        });
      }

      return profits;
    });

    // Return the result including the total order profit
    return {
      orderId,
      orderItemProfits,
      totalOrderProfit
    };
  } catch (error) {
    console.error('Error calculating total seller profit:', error);
    throw error;
  }
}

// Update revenue and sales for seller designs and their respective stores
export async function updateRevenueAndSalesForDesigns(orderId: string, platformProfit: number , totalIncome : number) {
  try {
    // Fetch the order with its items and related products
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            frontsellerDesign: true, // Include front seller design
            backsellerDesign: true,  // Include back seller design
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Prepare to update both front and back seller designs
    const updatePromises = [];

    // Function to update revenue and sales for a design and its store
    const updateDesignAndStore = async (designId: string, quantity: number) => {
      const design = await db.sellerDesign.findUnique({
        where: { id: designId },
        include: {
          store: true,
        },
      });

      if (!design) {
        throw new Error(`Seller Design with id ${designId} not found`);
      }

      const newRevenue = design.sellerProfit * quantity;

      // Update design's revenue and total sales
      await db.sellerDesign.update({
        where: { id: designId },
        data: {
          revenue: { increment: newRevenue },
          totalSales: { increment: 1 },
        },
      });

      // Update store's revenue and total sales
      if (design.store) {
        await db.store.update({
          where: { id: design.store.id },
          data: {
            revenue: { increment: newRevenue },
            totalSales: { increment: 1 },
          },
        });
        const notificationContent = `Great News: Your Design "${design.name}" has been sold`;

        await createNotification(design.store.id,notificationContent , "Admin")
      } else {
        throw new Error(`Store not found for seller design ${designId}`);
      }
    };

    // Iterate through order items and update seller designs
    for (const item of order.orderItems) {
      if (item.frontsellerDesignId) {
        updatePromises.push(updateDesignAndStore(item.frontsellerDesignId, item.quantity));
      }
      if (item.backsellerDesignId) {
        updatePromises.push(updateDesignAndStore(item.backsellerDesignId, item.quantity));
      }
    }

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    // Mark order as updated
    await db.order.update({
      where: { id: order.id },
      data: {
        updated: true,
      },
    });

    // Update platform profit
    const user = await getUser(); // Assuming this function gets the current user
    if (user) {
      await db.platform.update({
        where: { userId: user.id },
        data: {
          profit: { increment: platformProfit },
          totalIncome : { increment: totalIncome }
        },
      });
    } else {
      throw new Error('User not found');
    }

    return {
      message: 'Seller design revenue and total sales updated successfully.',
    };
  } catch (error) {
    console.error('Error updating seller design revenue and total sales:', error);
    throw error;
  }
}




async function checkAndSetTopSales(productId : string) {
  try {
    // Find the product by ID
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Check if total sales are equal to or greater than 20
    if (product.totalSales >= 10) {
      // Update the product to set topSales to true
      await db.product.update({
        where: { id: productId },
        data: { topSales: true },
      });
      console.log(`Product ${productId} is now marked as topSales`);
    } else {
      console.log(`Product ${productId} does not meet the sales threshold`);
    }
  } catch (error) {
    console.error('Error checking and setting topSales:', error);
  }
}


export async function getAllPodProductsOrdersIds() {
    const orders = await db.order.findMany()
    return orders.map(order => order.id)
}

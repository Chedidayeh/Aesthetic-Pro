'use server'

import { auth } from "@/auth";
import { db } from "@/db"
import { Collection, Order, OrderItem, Product, SellerDesign, UserType } from "@prisma/client";

export async function createPlatform(userId:string) {

  await db.platform.create({
    data:{
      userId : userId
    }
  })
  
}

  // get the auth user
export async function getUser() {
  try {
      const session = await auth()
      if(!session) return
      const user = await db.user.findUnique({
        where:{ id : session.user.id}
      })
      return user
  } catch (error) {
    console.log(error)
    throw error
    
  }
  
}

export const updateUserRole = async (userId: string, newRole: UserType): Promise<void> => {
  try {
    await db.user.update({
      where: { id: userId },
      data: { userType: newRole },
    });
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw new Error("Failed to update user role");
  }
};

export async function banUser(userId:string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { isUserBanned: true },
    });
  } catch (error) {
    console.error("Failed to update user type:", error);
    throw new Error("Failed to update user type");
  }
  
}



// Manage new added products : 
export async function updateNewProductStatus(): Promise<void> {
  const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
  const currentDate = new Date();

  // Fetch all products
  const products: Product[] = await db.product.findMany({
    where: {NewProduct : true}
  });

  // Iterate over each product
  for (const product of products) {
    const productAgeInMillis = currentDate.getTime() - new Date(product.createdAt).getTime();
    
    if (productAgeInMillis > oneWeekInMillis) {
      // Update the NewProduct field to false if more than a week has passed
      await db.product.update({
        where: { id: product.id },
        data: { NewProduct: false },
      });
    }
  }
}


// get user by type 
export async function getUsersByType() {
  try {
    const users = await db.user.findMany({
      where: {
        userType: {
          in: [UserType.SELLER, UserType.USER , UserType.ADMIN , UserType.FACTORY ]
        }
      }
    });
    return users;
  } catch (error) {
    console.error('Error retrieving users:', error);
    throw error;
  }
}

// delete user by id 
export async function deleteUserById(userId : string) {
  try {
    
    await db.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
}


// get the categories
export async function getAllCategories() {
  try {
    const categories = await db.category.findMany({
      include: {
        colors: true,
        sizes: true,
        frontBorders: true,
        backBorders: true,
      },
    })
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error;
  }
}

// returns an array of all the available categories 

export async function getAllPodProductsCategories() {
  try {
    const categories = await db.product.findMany({
      where : {isProductAccepted : true},
      select: {
        category: true,
      },
      distinct: ['category']
    });
    return categories.map(product => product.category);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    throw error;
  }
}

// returns an array of all the available collections 

export async function getAllPodProductsCollections() {
  try {
    const collections = await db.product.findMany({
      where : {isProductAccepted : true , privateProduct : false},
      select: {
        collection: true,
      },
      distinct: ['collection']
    });
    return collections.map(product => product.collection);
  } catch (error) {
    console.error("Error retrieving collections:", error);
    throw error;
  }
}

// get categorie by id
export async function getCategorieById(catId : string) {
  try {
    const categorie = await db.category.findUnique({
      where: { id: catId },
      include: {
        colors: true,
        sizes: true,
        frontBorders: true,
        backBorders: true,
      },
    })
    return categorie
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}


// get seller Store by userId
export async function getStoreByUserId(userId : string) {
  try {
    const store = await db.store.findUnique({
      where: {
        userId: userId
      },
      include: {
        products: true,
        designs: true,
      },
    });

    if (!store) {
      throw new Error('Store not found for the given userId');
    }

    return store;
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
}




export async function fetchOrdersByStoreId(storeId: string) {

  try {
    // Step 1: Fetch orders with order items related to products of the store
    const orders = await db.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              storeId: storeId,
            },
          },
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders;
  } catch (error) {
    console.log(error)
  }
}




// Helper function to check if the design of an item exists in the store
async function checkDesignInStore(orderItemId: string, storeId: string) {
  try {
    // Fetch the order item with its related designs
    const orderItem = await db.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        frontsellerDesign: true,
        backsellerDesign: true,
      },
    });

    // If the order item or designs do not exist, return false
    if (!orderItem || (!orderItem.frontsellerDesign && !orderItem.backsellerDesign)) {
      return false;
    }

    // Check if the design's store ID matches the provided store ID
    if ((orderItem.frontsellerDesign && orderItem.frontsellerDesign.storeId === storeId) ||
        (orderItem.backsellerDesign && orderItem.backsellerDesign.storeId === storeId)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking design in store:", error);
    return false;
  }
}




// get the orders of the store products
interface Orderwithitems extends Order {
  orderItems: OrderItemwithdesigns[];
}
interface OrderItemwithdesigns extends OrderItem {
  frontDesignName?: string | null;
  backDesignName?: string | null;
}
export async function getDesignsOrdersForStore(storeId: string, userId: string) {

  // Fetch the store based on storeId and userId
  const store = await db.store.findUnique({
    where: {  id: storeId, userId: userId  },
    include: {
      designs: true,
    },
  });

  // Check if the store exists and belongs to the user
  if (!store) {
    throw new Error("Store not found for the given user");
  }

  // Extract design IDs from the store's designs
  const designIds = store.designs.map(design => design.id);

  // Fetch orders containing any of the store's designs
  const orders = await db.order.findMany({
    where: {
      orderItems: {
        some: {
          OR: [
            {
              frontsellerDesignId: {
                in: designIds,
              },
            },
            {
              backsellerDesignId: {
                in: designIds,
              },
            }
          ]
        },
      },
    },
    include: {
      orderItems: {
        include: {
          frontsellerDesign: true,
          backsellerDesign: true,
        },
      },
    },
  });

  // Filter and format orders
  const filteredOrders = await Promise.all(orders.map(async order => {
    const filteredOrderItems = await Promise.all(order.orderItems.map(async item => {
      const isFrontDesignInStore = item.frontsellerDesignId ? await checkDesignInStore(item.id, storeId) : false;
      const isBackDesignInStore = item.backsellerDesignId ? await checkDesignInStore(item.id, storeId) : false;

      if (isFrontDesignInStore && item.frontsellerDesign?.isDesignForSale) {
        return {
          ...item,
          frontDesignName: item.frontsellerDesign.name,
          backDesignName: item.backsellerDesign ? item.backsellerDesign.name : null,
        };
      } else if (isBackDesignInStore && item.backsellerDesign?.isDesignForSale) {
        return {
          ...item,
          frontDesignName: item.frontsellerDesign ? item.frontsellerDesign.name : null,
          backDesignName: item.backsellerDesign.name,
        };
      } else {
        return null;
      }
    }));

    return {
      ...order,
      orderItems: filteredOrderItems.filter(item => item !== null),
    };
  }));

  return filteredOrders.filter(order => order.orderItems.length > 0) as Orderwithitems[];
}





// get the orders of the store design
export async function getDesignOrders(storeId: string, userId: string) {
  const store = await db.store.findUnique({
    where: { id: storeId },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const orders = await db.order.findMany({
    where: {
      userId: userId,
      orderItems: {
        some: {
          OR: [
            {
              frontsellerDesign: {
                storeId: storeId,
                isDesignForSale: true,
              },
            },
            {
              backsellerDesign: {
                storeId: storeId,
                isDesignForSale: true,
              },
            },
          ],
        },
      },
    },
    include: {
      orderItems: {
        include: {
          frontsellerDesign: true,
          backsellerDesign: true,
        },
      },
    },
  });

  return orders;
}





// get the deisgns that were ordered
interface OrderedDesign extends SellerDesign {
  orderCount: number;
  totalOrderedQuantity: number; // New field for total ordered quantity

}
export async function getOrderedDesignsByStoreId(storeId: string): Promise<OrderedDesign[]> {
  try {
    // Find all distinct designs from the specified store that have valid orders
    const orderedDesigns = await db.sellerDesign.findMany({
      where: {
        storeId: storeId,
        isDesignForSale: true,
        OR: [
          { frontOrders: { some: {
            order: {
              status: {
                not: 'CANCELED'
              },
              type: {
                not: 'CANCELED'
              }
            }
          } } },
          { backOrders: { some: {
            order: {
              status: {
                not: 'CANCELED'
              },
              type: {
                not: 'CANCELED'
              }
            }
          } } } 
        ]
      },
      include: {
        frontOrders: {
          include: {
            order: true
          }
        },
        backOrders: {
          include: {
            order: true
          }
        }
      }
    });

    // Calculate the order count for each design
    const designsWithOrderCount = orderedDesigns.map(design => {
      // Filter orders to exclude those with CANCELED status or type
      const validFrontOrders = design.frontOrders.filter(orderItem =>
        orderItem.order.status !== 'CANCELED' && orderItem.order.type !== 'CANCELED'
      );

      const validBackOrders = design.backOrders.filter(orderItem =>
        orderItem.order.status !== 'CANCELED' && orderItem.order.type !== 'CANCELED'
      );

      // Calculate total ordered quantity for the product
      const totalFrontOrderedQuantity = validFrontOrders.reduce((total, orderItem) => {
        return total + orderItem.quantity; // Accumulate quantity from each order item
      }, 0);

       // Calculate total ordered quantity for the product
       const totalBackOrderedQuantity = validBackOrders.reduce((total, orderItem) => {
        return total + orderItem.quantity; // Accumulate quantity from each order item
      }, 0);


      return {
        ...design,
        orderCount: validFrontOrders.length + validBackOrders.length, // Count the number of valid orders for the design
        totalOrderedQuantity: totalFrontOrderedQuantity + totalBackOrderedQuantity // Count the number of valid orders for the design

      };
    });

    return designsWithOrderCount;
  } catch (error) {
    console.error('Error fetching ordered designs for store:', error);
    throw error; // Handle or rethrow as needed
  }
}




// get the products that were ordered
interface OrderedProduct extends Product {
  orderCount: number;
  totalOrderedQuantity: number; // New field for total ordered quantity
}
export async function getOrderedProductsByStoreId(storeId: string): Promise<OrderedProduct[]> {
  try {
    // Find all distinct products from the specified store that have valid orders
    const orderedProducts = await db.product.findMany({
      where: {
        storeId: storeId,
        order: {
          some: {
            order: {
              status: {
                not: 'CANCELED'
              },
              type: {
                not: 'CANCELED'
              }
            }
          }
        }
      },
      include: {
        order: {
          include: {
            order: true // Include related orders
          }
        }
      }
    });

    // Calculate the order count for each product
    const productsWithOrderCount = orderedProducts.map(product => {
      // Filter orders to exclude those with CANCELED status or type
      const validOrders = product.order.filter(orderItem => 
        orderItem.order.status !== 'CANCELED' && orderItem.order.type !== 'CANCELED'
      );

      // Calculate total ordered quantity for the product
      const totalOrderedQuantity = validOrders.reduce((total, orderItem) => {
        return total + orderItem.quantity; // Accumulate quantity from each order item
      }, 0);

      return {
        ...product,
        orderCount: validOrders.length,
        totalOrderedQuantity: totalOrderedQuantity
      };
      });

    return productsWithOrderCount;
  } catch (error) {
    console.error('Error fetching ordered products for store:', error);
    throw error; // Handle or rethrow as needed
  }
}


// get all orders 
export async function getAllOrder(){
  try {
    const order = await db.order.findMany({
      include: {
        user: true, // Include the user relation
        orderItems: true // Include the orderItems relation
      },
    });
      return order
      } catch (error) {
        console.log(error)
        return null
      }
    }

  // get order by orderId 
  export async function getOrder(orderId: string): Promise<Order | null> {
    try {
      const order = await db.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          user: true, // Include the user relation
          orderItems: true // Include the orderItems relation
        },
      });
        return order
        } catch (error) {
          console.log(error)
          return null
        }
      }







// return the products of the given ids
export async function getProductsByIds(productIds : string[]) {
  try {
    // Fetch products where the id is in the list of productIds
    const products = await db.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      include : {
        store : true
      }
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}






export async function fetchTrendingProducts() {
  try {
    const trendingProducts = await db.product.findMany({
      where: {
        isProductAccepted : true,
         privateProduct : false
      },
      include : {
        store : true
      },
      orderBy: {
        totalViews: 'desc',
      },
      take: 10,
    });

    return trendingProducts;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


    // fetch all products
export async function fetchAllProducts() {
  try {
    const products = await db.product.findMany({
      where : {isProductAccepted : true , privateProduct : false},
      include : {
        store : true
      },
      orderBy: {
        totalViews: 'desc',
      },
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  }




  // fetch products group by collection 
export async function getProductsGroupedByCollection() {
    try {
      // Fetch all products from the database
      const products = await db.product.findMany({
        where : {isProductAccepted : true , privateProduct : false} ,
        include : {store : true} ,       
        orderBy: {totalViews: 'desc'}
        });
  
      // Group products by collection
      const groupedByCollection = products.reduce((acc, product) => {
        const collection = product.collection;
  
        if (!acc[collection]) {
          acc[collection] = [];
        }
  
        acc[collection].push(product);
        return acc;
      }, {} as Record<string, typeof products>);
  
      return groupedByCollection;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }


  // for the new released products
 export async function fetchNewProducts() {
    try {
      const products = await db.product.findMany({
        where : {isProductAccepted : true , NewProduct : true , privateProduct : false},
        orderBy: {
          createdAt: 'desc'
        },
        include : {
          store : true
        }
      });

      if(products!.length>16) {
        updateNewProductStatus()
      }

  
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }


// For the best selling products
export async function fetchBestSellingProducts() {
  try {
    // Fetch all products with totalSales greater than 9
    const productsToUpdate = await db.product.findMany({
      where: {
        isProductAccepted: true,
        privateProduct : false,
        totalSales: { gt: 9 },
      },
    });

    // Update the topSales field to true for all qualifying products in one batch
    const productIds = productsToUpdate.map((product) => product.id);

    if (productIds.length > 0) {
      await db.product.updateMany({
        where: { id: { in: productIds } },
        data: { topSales: true },
      });
    }

    // Fetch the products again to get the updated topSales values
    const bestSellingProducts = await db.product.findMany({
      where: { topSales: true, isProductAccepted: true , privateProduct : false },
      include: {
        store: true,
      },
      orderBy: {
        totalSales: 'desc',
      },
    });

    return bestSellingProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}


  // fetch products by category
export async function fetchProductsByCategory(category : string) {
    try {
      const products = await db.product.findMany({
        where: {
          category: category,
          isProductAccepted : true,
           privateProduct : false
        },
        include : {
          store : true
        },
        orderBy: {totalViews: 'desc'}
      });
      return products;
    } catch (error) {
      console.error(`Error fetching products by category: ${error}`);
    } 
  }



  // fetch products by collection
  export async function fetchProductsByCollection(collection : Collection) {
    try {
      const products = await db.product.findMany({
        where: {
          collection: collection,
          isProductAccepted : true, 
          privateProduct : false
        },
        include : {
          store : true
        },
        orderBy: {totalViews: 'desc'}
      });
      return products;
    } catch (error) {
      console.error(`Error fetching products by category: ${error}`);
    } 
  }



// Prioritizing New Products from Followed Stores
export const getFollowedStoreProductsFirst = async (userId: string) => {
  const followedStores = await db.storeFollow.findMany({
    where: { userId },
    select: { storeId: true },
  });

  const storeIds = followedStores.map((follow) => follow.storeId);

  // Fetch new products from followed stores first
  const followedStoreProducts = await db.product.findMany({
    where: { storeId: { in: storeIds }, isProductAccepted : true, 
    privateProduct : false },
    include : {
      store : true
    },
    orderBy: { createdAt: 'desc' },
  });

  return followedStoreProducts;
};










  // fetch design by id 

  export async function fetchDesignById(designId : string) {

    try {
      const design = await db.sellerDesign.findFirst({
        where: { id: designId }
      });
  
      return design?.imageUrl
    } catch (error) {

      console.log(error)
      return null
      
    }
  }









        // fav list functions

// check if a product exists in a user fav list
export async function checkProductInFavList(productId: string, userId: string) {
  try {
    // Find the user's favorite list including products
    const favList = await db.favList.findUnique({
      where: {
        userId: userId,
      },
      include: {
        products: true,
      },
    });

    if (!favList || !favList.products) {
      // If the favorite list doesn't exist or it has no products, the product can't be in it
      return false;
    }

    // Check if the product exists in the favorite list items
    const isProductInFavList = favList.products.some(product => product.id === productId);

    return isProductInFavList;
  } catch (error) {
    console.error("Error checking product in favList:", error);
    throw error; // Propagate the error for handling elsewhere
  }
}


  // add product to a user fav list :
  export async function addProductToFavList(productId: string, userId: string) {
    try {
      // Find or create a favorite list for the user
      let favList = await db.favList.findFirst({
        where: {
          userId: userId,
        },
      });
  
      if (!favList) {
        favList = await db.favList.create({
          data: {
            userId: userId,
          },
        });
      }
  
      const product = await db.product.findUnique({ where: { id: productId } });
      
      if (product && favList) {
        await db.favList.update({
          where: { id: favList.id },
          data: {
            products: { connect: { id: productId } }
          }
        });

        return true
      }
  
      return false
    } catch (error) {
      console.error("Error adding product to favList:", error);
      return null;
    }
  }


  // remove product from user's fav list
export async function removeProductFromFavList(productId: string, userId: string) {
  try {
    // Find the user's favorite list including products
    const favList = await db.favList.findUnique({
      where: {
        userId: userId,
      },
      include: {
        products: true,
      },
    });

    if (!favList || !favList.products) {
      // If the favorite list doesn't exist or it has no products, nothing to remove
      return false;
    }

    // Check if the product exists in the favorite list items
    const productIndex = favList.products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
      // If the product is not found in the favorite list, return false
      return false;
    }

    // Remove the product from the favorite list
    await db.favList.update({
      where: { id: favList.id },
      data: {
        products: {
          disconnect: { id: productId }
        }
      }
    });

    return true;
  } catch (error) {
    console.error("Error removing product from favList:", error);
    throw error; // Propagate the error for handling elsewhere
  }
}










        // cart functions

// check if a product exists in a user cart :
export async function checkProductInCart(productId: string , userId: string): Promise<boolean> {
  try {
    // Find the user's cart and include selectedProducts
    const userCart = await db.cart.findUnique({
      where: { userId: userId },
      include: { selectedProducts: true },
    });

    // If user has no cart or cart is empty, return false
    if (!userCart || userCart.selectedProducts.length === 0) {
      return false;
    }

    // Check if the product exists in the user's cart
    const existingProduct = userCart.selectedProducts.some(product => product.productId === productId);

    return existingProduct;

  } catch (error) {
    console.error('Error checking product in cart:', error);
    throw error; // Throw error for the caller to handle
  }
}


// add product to a user cart : 
export async function addProductToCart( 
  productId: string ,
  userId: string,
  price:number,
  category:string,
  size : string,
  color : string,
  quantity : number,
  productImgs : string[]


): Promise<boolean | null> {
  try {

    // Create or find user's cart
    let userCart = await db.cart.findUnique({
      where: { userId: userId },
    });

    if (!userCart) {
      userCart = await db.cart.create({
        data: {
          userId: userId,
        },
      });
    }

    const user = await db.user.findUnique({
      where: { id: userId } , 
      include : {
        cart : {
          include : {
            selectedProducts : true
          }
        }
      }
    })
    

    // Check if product with productId already exists in the cart
    const existingCartProduct = user?.cart?.selectedProducts.find(
      (product) => (product.productId === productId && product.category === category
        && product.size === size && product.color === color
        && product.quantity === quantity
        && product.price === price
      )
    );

    if(existingCartProduct) return false


    // Add product to the cart
    await db.cartProduct.create({
      data: {
        productId: productId,
        cartId: userCart.id,
        price:price,
        quantity:quantity,
        color:color,
        size:size,
        category:category,
        productImg: productImgs,
      },
    });

    return true; // Successfully added product to cart
  } catch (error) {
    console.error(`Error adding product to cart for user ${userId}:`, error);
    return null; // Handle error as per your application's needs
  }
}












//return unreded notififcations for a store
export async function getUnreadNotificationsForStore(storeId : string) {
  try {
    const unreadNotifications = await db.notification.findMany({
      where: {
        storeId: storeId,
        isViewed: false,
      },
      orderBy : {
        createdAt : 'desc'
      }
    });

    return unreadNotifications;
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
}



//get the platform model
export async function getPlatformForTheWebsite() {
  const platform = await db.platform.findFirst({
  })
  return platform

}

// get the count infos for the admin dashboard :
export async function getTotalCounts() {
  const [
    userCount, 
    productCount, 
    storeCount, 
    sellerDesignCount , 
    awaitingActionProductCount,
    awaitingActionDesignCount,
  ] = await Promise.all([
    db.user.count(),
    db.product.count(),
    db.store.count(),
    db.sellerDesign.count({
      where: {isDesignForSale : true}
    }),
    db.product.count({
      where : {isProductAccepted : false , isProductRefused : false}
    }),
    db.sellerDesign.count({
      where : {isDesignAccepted : false , isDesignRefused : false , isDesignForSale : true} 
    })

  ])
  return {
    userCount,
    productCount,
    storeCount,
    sellerDesignCount,
    awaitingActionProductCount,
    awaitingActionDesignCount
  };
}

// get the count infos for the admin dashboard side bar :
export async function getSideBarTotalCounts() {
  const [
    printedOrdersCount,
    awaitingActionProductCount,
    awaitingActionDesignCount,
    storeRequestsCount,
    affiliateRequestsCount,
    returnedOrders,
  ] = await Promise.all([
    db.order.count({
      where : {printed : true , type : "CONFIRMED" , status: {
        not: "DELIVERED"
      }}
    }),


    db.product.count({
      where : {isProductAccepted : false , isProductRefused : false}
    }),


    db.sellerDesign.count({
      where : {isDesignAccepted : false , isDesignRefused : false , isDesignForSale : true} 
    }),

    db.paymentRequest.count({
      where : { status : "PENDING"}
    }),

    db.affiliatePaymentRequest.count({
      where : { status : "PENDING"}
    }),

    db.order.count({
      where : {printed : true , type : "CONFIRMED" , status: {
        not: "DELIVERED" ,
      } , isPaid : false}
    }),

  ])


  return {
    printedOrdersCount,
    awaitingActionProductCount,
    awaitingActionDesignCount,
    storeRequestsCount,
    affiliateRequestsCount,
    returnedOrders,

  };
}


// get the count for factory dashboard
export async function getFactoryDashboardCounts() {
  const [confirmedOrdersCount, deliveredOrdersCount, canceledOrdersCount , totalOrdersCount , notPrintedOrders] = await Promise.all([
    db.order.count({where : { type : "CONFIRMED" }}),
    db.order.count({where : { status : "DELIVERED"}}),
    db.order.count({where : { status : "CANCELED"}}),
    db.order.count(),
    db.order.count({where : { type : "CONFIRMED" , printed:false }}),

  ]);

  return {
    confirmedOrdersCount,
    deliveredOrdersCount,
    canceledOrdersCount,
    totalOrdersCount,
    notPrintedOrders
  };
}













// Return a list of strings containing categories, tags, and titles and collection that start with the same characters as the given query
export async function searchPodProducts(query: string) {
  try {
      const decodedQuery = decodeURIComponent(query).toLowerCase(); // Decode the URI-encoded query string and convert to lowercase

      // Fetch all products from the database
      const products = await db.product.findMany({
        where : {isProductAccepted : true},
          select: {
              category: true,
              title: true,
              tags: true,
          },
      });

      // Filter products where category, title, or tags start with the query (case insensitive)
      const results: string[] = [];

      products.forEach((product) => {
          if (product.category.toLowerCase().startsWith(decodedQuery) || product.category.toLowerCase().includes(decodedQuery) ) {
              results.push(product.category);
          }
          if (product.title.toLowerCase().startsWith(decodedQuery) || product.title.toLowerCase().includes(decodedQuery) ) {
              results.push(product.title);
          }
          if (product.tags.some(tag => tag.toLowerCase().startsWith(decodedQuery)) || product.tags.some(tag => tag.toLowerCase().includes(decodedQuery))) {
              results.push(...product.tags.filter(tag => tag.toLowerCase().startsWith(decodedQuery)));
          }
      });

      // Deduplicate and return results
      const uniqueResults = [...new Set(results)]; // Remove duplicates

      return uniqueResults;
  } catch (error) {
      console.error('Error searching products:', error);
      throw error;
  }
}






// affiliate program

export async function getAffiliateLinksAndCommissions(userId: string) {
  try {
    const affiliate = await db.affiliate.findUnique({
      where: {
        userId: userId, // Fetch the affiliate account by userId
      },
      include: {
        links: {
          include: {
            commission: true, // Include related commissions for each affiliate link
          },
        },
        affiliatePaymentRequest : true
      },
    });

    return affiliate
  }
catch (error) {
  console.error('Error fetching affiliate links and commissions:', error);
}}

export async function getAffiliatePaymentRequest(userId: string) {
  try {
    const affiliate = await db.affiliate.findUnique({
      where: {
        userId: userId, // Fetch the affiliate account by userId
      },
      include: {
        affiliatePaymentRequest : true
      },
    });

    return affiliate
  }
catch (error) {
  console.error('Error fetching affiliate links and commissions:', error);
}}

export async function getAffiliateStats(userId: string) {
  try {
    // Fetch the affiliate account by userId
    const affiliate = await db.affiliate.findUnique({
      where: {
        userId: userId,
      },
      include: {
        links: {
          include: {
            commission: true, // Include commissions for each link
          },
        },
      },
    });

    if (!affiliate) {
      throw new Error(`Affiliate account not found for userId: ${userId}`);
    }

    // Calculate total income, total clicks, and total sales
    const totalIncome = affiliate.links.reduce((acc, link) => {
      const linkIncome = link.commission.reduce((commissionAcc, commission) => {
        return commissionAcc + commission.profit;
      }, 0);
      return acc + linkIncome;
    }, 0);

    const totalClicks = affiliate.links.reduce((acc, link) => acc + link.totalViews, 0);
    const totalSales = affiliate.links.reduce((acc, link) => acc + link.totalSales, 0);

    return {
      totalIncome,
      totalClicks,
      totalSales,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error calculating affiliate stats.');
  }
}

// return all commissions :
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllCommissionsByAffiliateId(affiliateId: string) {
  try {
    const affiliateLinks = await prisma.affiliateLink.findMany({
      where: {
        affiliateId: affiliateId, // Filter by affiliate ID
      },
      include: {
        commission: true, // Include related commissions for each affiliate link
        product: true,    // Include the related product
      },
    });

    // Check if the affiliate has any links
    if (affiliateLinks.length === 0) {
      return []
    }

    // Extract and return all commissions for each affiliate link
    const commissions = affiliateLinks.flatMap(link =>
      link.commission.map(commission => ({
        commissionId: commission.id,
        affiliateLinkId: link.id,
        productTitle: link.product?.title || 'Unknown Product', // Access the product title
        profit: commission.profit,
        createdAt: commission.createdAt,
      }))
    );

    return commissions;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving commissions.');
  }
}

// 
export async function getUnreadAffiliateNotifications(affiliateId : string) {
  try {
    const unreadNotifications = await db.affiliateNotification.findMany({
      where: {
        affiliateId: affiliateId,
        isViewed: false,
      },
    });

    return unreadNotifications;
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
}


// create notis : 
export async function createAffiliateNotification(affiliateId : string, content : string, sender : string) {
  try {
    const notification = await db.affiliateNotification.create({
      data: {
        affiliateId: affiliateId,
        content: content,
        sender: sender,
      },
    });
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false
  }
}
















  
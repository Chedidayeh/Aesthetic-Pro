'use server'

import { getPlatformForTheWebsite } from "@/actions/actions";
import { db } from "@/db";
import { sendOrderEmail } from "@/lib/mailer";
import { Order } from "@prisma/client";
import { log } from "console";

// Define the interface for cart products
interface FormattedCartProduct {
    cartProductId: string;
    productId: string;
    title?: string;
    description?: string;
    price?: number;
    quantity?: number;
    color?: string;
    size?: string;
    category?: string;
    productImgs?: string[];
    frontDesignId?: string;
    backDesignId?: string;
  }


  // Function to create an order and return a boolean indicating success
  export async function createOrderInDb(
    userId: string,
    shippingAddress: string,
    clientName: string,
    phoneNumber: string,
    orderAmount: number,
    cartProducts: FormattedCartProduct[],
    fee: number,
    sessionId: any,
  ) {
    try {
      let order; // Declare order variable outside for later use
      
      // Start a transaction for atomicity
      await db.$transaction(async (tx) => {
        // Step 1: Create the order
        order = await tx.order.create({
          data: {
            amount: orderAmount,
            shippingAddress,
            phoneNumber,
            clientName,
            userId,
            shippingFee: fee,
            orderItems: {
              create: cartProducts.map((product) => ({
                productId: product.productId,
                productPrice: product.price ?? 1,
                productTitle: product.title ?? '',
                quantity: product.quantity ?? 1,
                productColor: product.color ?? '',
                productSize: product.size ?? '',
                productCategory: product.category ?? '',
                capturedMockup: product.productImgs ?? [],
                frontsellerDesignId: product.frontDesignId ?? undefined,
                backsellerDesignId: product.backDesignId ?? undefined,
              })),
            },
          },
          include: {
            user: true,
            orderItems: true,
          },
        });
  
        // Step 2: Only after order is created, proceed to check for affiliate session and create commission
        if (sessionId) {
          const affiliateClick = await tx.affiliateClick.findFirst({
            where: { sessionId },
          });
  
          if (affiliateClick?.affiliateLinkId) {
            const affiliateLink = await tx.affiliateLink.findUnique({
              where: { id: affiliateClick?.affiliateLinkId },
              select: { product: true },
            });
  
            const product = cartProducts.find(
              (product) => product.productId === affiliateLink?.product?.id
            );
  
            if (product) {
              const platform = await getPlatformForTheWebsite();
              const commissionAmount = product.price! * product.quantity! * (platform!.affiliateUserProfit / 100);
              const integerPart = Math.floor(commissionAmount);
  
              // Create commission after ensuring order is fully created
              await tx.commission.create({
                data: {
                  affiliateLinkId: affiliateClick.affiliateLinkId!,
                  orderId: order.id,
                  profit: integerPart,
                },
              });
            }
          }
        }
  
        // Step 3: Send order email after order creation and commission handling
        await sendOrderEmail(order);
  
      }, {
        timeout: 20000, // Set the timeout for the transaction (20 seconds)
      });
  
      // Return success only after transaction completes
      return { orderId: order!.id as string, success: true };
      
    } catch (error) {
      console.error('Error creating order:', error);
      return { orderId: null, success: false };
    }
  }
  
  



// fetch a user cart products
  export async function fetchCartProducts(userId: string) {
    try {
      // Find the user and include the cart and its products
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          cart: {
            include: {
              selectedProducts: {
                include: {
                  product: true, // Include the original product details
                },
              },
            },
          },
        },
      });
  
      if (!user || !user.cart) {
        return
      }
  
      const cartProducts = user.cart.selectedProducts;
  
      // Format or process the cart products as needed
      const formattedCartProducts = cartProducts.map(cartProduct => ({
        cartProductId: cartProduct.id,
        productId: cartProduct.productId,
        title: cartProduct.product?.title,
        description: cartProduct.product?.description,
        price: cartProduct.price,
        quantity: cartProduct.quantity,
        color: cartProduct.color,
        size: cartProduct.size,
        category: cartProduct.category,
        productImgs: cartProduct.productImg,
        frontDesignId : cartProduct.product?.frontDesignId,
        backDesignId : cartProduct.product?.backDesignId
  
      }));
  
      return formattedCartProducts as FormattedCartProduct[]
    } catch (error) {
      console.error('Error fetching cart products:', error);
      throw error;
    }
  }


// remove product from user cart
export async function removeProductFromCart( cartProductId: string ,userId: string,): Promise<boolean | null> {
  try {
    // Find the user's cart
    const userCart = await db.cart.findUnique({
      where: { userId: userId },
      include: { selectedProducts: true }, // Include related CartProducts
    });

    // If user has no cart, return false (nothing to remove)
    if (!userCart) {
      console.error('User does not have a cart.');
      return false;
    }

    // Check if the product exists in the user's cart
    const existingProduct = userCart.selectedProducts.find(product => product.id === cartProductId);

    // If product does not exist in the cart, return false
    if (!existingProduct) {
      console.error('Product does not exist in the user\'s cart.');
      return false;
    }

    // Remove the product from the cart
    await db.cartProduct.delete({
      where: {
        id: existingProduct.id,
      },
    });

    return true; // Successfully removed product from cart

  } catch (error) {
    console.error('Error removing product from cart:', error);
    return null; // Return null or handle error as per your application's needs
  }
}


// Function to empty user's cart
export async function emptyUserCart(userId: string): Promise<boolean | null> {
  try {
    // Find the user's cart including selectedProducts
    const userCart = await db.cart.findUnique({
      where: { userId: userId },
      include: { selectedProducts: true },
    });

    // If user has no cart, return false (nothing to empty)
    if (!userCart) {
      console.error('User does not have a cart.');
      return false;
    }

    // Delete all products from the user's cart
    if (userCart.selectedProducts.length > 0) {
      await db.cartProduct.deleteMany({
        where: {
          cartId: userCart.id,
        },
      });
    }

    return true; // Successfully emptied user's cart

  } catch (error) {
    console.error('Error emptying user\'s cart:', error);
    return null; // Return null or handle error as per your application's needs
  }
}
  

// emails

import { Order, OrderItem, User } from "@prisma/client";


export const generateVerificationEmailHTML = (username: string, token: string) => {
    const domain = process.env.NEXT_PUBLIC_BASE_URL 

    const emailHTML = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              padding: 20px;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              border: 1px solid #dcdcdc;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .logo .part1 {
              color: #000;
            }
            .logo .part2 {
              color: #0070f3;
            }
            .message {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(90deg, #007291, #00a3c4);
              color: #fff !important;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 6px;
              font-weight: bold;
              margin-top: 20px;
              transition: background 0.3s ease;
            }
            .button:hover {
              background: linear-gradient(90deg, #005f7a, #008b9f);
            }
            .footer {
              font-size: 12px;
              color: #777;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" alt="AestheticPro Logo" style="max-width: 200px; margin-bottom: 1px;">
            </div>
            <p class="message">Hi ${username},</p>
            <p class="message">Welcome to AestheticPro.tn ! We're excited to have you on board.</p>
            <p class="message">To complete your account setup, please verify your email by clicking the button below:</p>
            <a class="button" href="${domain}/auth/verify-email/${token}" aria-label="Verify Email">Verify Email</a>
            <p class="message">If you didn't create an account with AestheticPro.tn , please ignore this email.</p>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} AestheticPro.tn . All rights reserved.</p>
              <p>AestheticPro.tn  Inc., Korba city, Nabeul, Tunisia</p>
            </div>
          </div>
        </body>
      </html>
    `;
    return emailHTML;
};

  
export const generateResetPassEmailHTML = (username: string, token: string) => {
    const domain = process.env.NEXT_PUBLIC_BASE_URL 
    const emailHTML = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              padding: 20px;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              border: 1px solid #dcdcdc;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .logo .part1 {
              color: #000;
            }
            .logo .part2 {
              color: #0070f3;
            }
            .message {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 10px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(90deg, #007291, #00a3c4);
              color: #fff !important;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 6px;
              font-weight: bold;
              margin-top: 20px;
              transition: background 0.3s ease;
            }
            .button:hover {
              background: linear-gradient(90deg, #005f7a, #008b9f);
              color: #fff !important;
            }
            .footer {
              font-size: 12px;
              color: #777;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" alt="AestheticPro Logo" style="max-width: 200px; margin-bottom: 1px;">
            </div>
            <p class="message">Hi ${username},</p>
            <p class="message">You requested to reset your password. Please click the button below to proceed:</p>
            <a class="button" href="${domain}/auth/reset-password/${token}" aria-label="Reset Password">Reset Password</a>
            <p class="message">If you did not request a password reset, please ignore this email or contact support if you have any questions.</p>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} AestheticPro.tn . All rights reserved.</p>
              <p>AestheticPro.tn  Inc., Korba city, Nabeul, Tunisia</p>
            </div>
          </div>
        </body>
      </html>
    `;
    return emailHTML;
};


export const generateDesignRejectedEmailHTML = (username: string, designName: string, reason: string) => {
  const emailHTML = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid #dcdcdc;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .logo .part1 {
            color: #000;
          }
          .logo .part2 {
            color: #0070f3;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .reason {
            font-weight: bold;
            color: #ff4d4f;
          }
          .footer {
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
              <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" alt="AestheticPro Logo" style="max-width: 100px; margin-bottom: 1px;">
          </div>
          <p class="message">Hi ${username},</p>
          <p class="message">We regret to inform you that your design "${designName}" has been rejected.</p>
          <p class="message">Reason for rejection: <span class="reason">${reason}</span></p>
          <p class="message">Please ensure that your designs adhere to our selling terms and policies to avoid further issues.</p>
          <p class="message">If you repeatedly violate our terms, you risk being banned from our platform.</p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AestheticPro.tn . All rights reserved.</p>
            <p>Contact us: astheticprocontact@gmail.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
  return emailHTML;
};



export const generateProductRejectedEmailHTML = (username: string, productName: string, reason: string) => {
  const emailHTML = `
    <html>
      <head>
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid #dcdcdc;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .logo .part1 {
            color: #000;
          }
          .logo .part2 {
            color: #0070f3;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .reason {
            font-weight: bold;
            color: #ff4d4f;
          }
          .footer {
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
              <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" alt="AestheticPro Logo" style="max-width: 100px; margin-bottom: 1px;">
          </div>
          <p class="message">Hi ${username},</p>
          <p class="message">We regret to inform you that your product "${productName}" has been rejected.</p>
          <p class="message">Reason for rejection: <span class="reason">${reason}</span></p>
          <p class="message">Please ensure that your products adhere to our selling terms and policies to avoid further issues.</p>
          <p class="message">If you repeatedly violate our terms, you risk being banned from our platform.</p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AestheticPro.tn . All rights reserved.</p>
            <p>Contact us: astheticprocontact@gmail.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
  return emailHTML;
};

interface OrderWithItems extends Order {
  orderItems : OrderItem[]
  user : User
}
export const generateOrderEmailHTML = (order: OrderWithItems) => {
  const orderItemsHTML = order.orderItems.map(item => `
    <div class="order-item">
      <div class="order-item-details">
        <div style="display: flex; justify-content: center; align-items: center;">
          ${item.capturedMockup.map(mockup => `<img src="${mockup}" alt="Product Mockup" style="max-width: 300px; margin-right: 10px;">`).join('')}
        </div>
        <p><strong>Product Title:</strong> ${item.productTitle}</p>
        <p><strong>Category:</strong> ${item.productCategory}</p>
        <p><strong>Size:</strong> ${item.productSize}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
      </div>
    </div>
    <hr style="border: 0; border-top: 1px solid #dcdcdc; margin: 20px 0;">
  `).join('');
  
  

  const emailHTML = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          padding: 20px;
          margin: 0;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: #fff;
          border: 1px solid #dcdcdc;
          border-radius: 8px;
          padding: 20px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .logo .part1 {
          color: #000;
        }
        .logo .part2 {
          color: #0070f3;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header img {
          max-width: 100px;
          margin-bottom: 10px;
        }
        .header h1 {
          font-size: 24px;
          margin: 0;
        }
        .content {
          font-size: 16px;
          line-height: 1.6;
        }
        .order-details {
          margin-top: 20px;
          border-top: 1px solid #dcdcdc;
          padding-top: 20px;
        }
        .order-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .order-item img {
          max-width: 100px;
          margin-right: 20px;
        }
        .order-item-details {
          flex-grow: 1;
        }
        .footer {
          font-size: 12px;
          color: #777;
          margin-top: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
              <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" alt="AestheticPro Logo" style="max-width: 100px; margin-bottom: 1px;">
          </div>
        <h1 style="font-size: 28px; font-weight: bold; color: #333;">We Appreciate Your Order! 💖</h1>
        <p style="font-size: 16px; color: #555; margin-top: 8px;">Thank you for your trust.</p>
        </div>
        <div class="content">
          <p>Hi ${order.user.name},</p>
          <p>We are currently processing your order and will call you to confirm the details shortly.</p>
          <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order Amount:</strong> ${order.amount} TND</p>
            <hr style="border: 0; border-top: 1px solid #dcdcdc; margin: 20px 0;">
            <h3>Order Items :</h3>
            ${orderItemsHTML}
          </div>
        </div>
        <div class="footer">
          <p>&copy; AestheticPro.tn . All rights reserved.</p>
          <p>Contact us: astheticprocontact@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return emailHTML;
};


export const generateLevelUpEmailHTML = (
  username: string,
  storeName: string,
  newLevel: number,
  isHighestLevel: boolean
) => {
  const emailHTML = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #dcdcdc; border-radius: 8px; padding: 20px; text-align: center;">
          <div style="margin-bottom: 10px;">
            <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" 
                 alt="Company Logo - AestheticPro" style="max-width: 100px; margin-bottom: 10px;">
          </div>
          <h1 style="font-size: 24px; font-weight: bold; color: #0070f3; margin-bottom: 20px;">Congratulations, ${username} 🎉 !</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Your store <strong style="color: #0070f3;">${storeName}</strong> has reached <strong>Level ${newLevel}</strong> on our platform!
          </p>
          ${
            isHighestLevel
              ? `
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 20px;">
            You've unlocked <strong style="color: #0070f3;">unlimited products and designs creation</strong> for your store!
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">We are excited to see your store thrive with these new privileges. Keep up the fantastic work!</p>
          `
              : `
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            You're now one step closer to unlocking the highest level and all its exclusive benefits!
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Continue striving for success to make your store even more remarkable.
          </p>
          `
          }
          <div style="margin-top: 20px; font-size: 12px; color: #777;">
            <p>&copy; ${new Date().getFullYear()} AestheticPro.tn. All rights reserved.</p>
            <p>Contact us: <a href="mailto:astheticprocontact@gmail.com" style="color: #0070f3;">astheticprocontact@gmail.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
  return emailHTML;
};




  
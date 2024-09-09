import { generateDesignRejectedEmailHTML, generateOrderEmailHTML, generateProductRejectedEmailHTML, generateResetPassEmailHTML, generateVerificationEmailHTML } from '@/components/EmailTemplate';
import { Order, OrderItem, User } from '@prisma/client';
import nodemailer from 'nodemailer';

const email = process.env.GMAIL_ACCOUNT;
const pass = process.env.GMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email service
  auth: {
    user: email,
    pass: pass,
  },
});



export const sendVerificationEmail = (receiverEmail: string, username: string, token: string) => {
  const mailOptions = {
    from: email,
    to: receiverEmail,
    subject: 'Verify your email',
    html: generateVerificationEmailHTML(username, token),
  };

  return transporter.sendMail(mailOptions);
};



export const sendResetPassEmail = (receiverEmail: string, username: string, token: string) => {
  const mailOptions = {
    from: email,
    to: receiverEmail,
    subject: 'Reset your password',
    html: generateResetPassEmailHTML(username, token),
  };

  return transporter.sendMail(mailOptions);
};




export const sendDesignRejetedEmail = (receiverEmail : string, username: string, designName: string, reason: string) => {
  const mailOptions = {
    from: email,
    to: receiverEmail,
    subject: 'Your Design was rejected',
    html: generateDesignRejectedEmailHTML(username, designName , reason),
  };

  return transporter.sendMail(mailOptions);
};





export const sendProductRejetedEmail = (receiverEmail : string, username: string, productName: string, reason: string) => {
  const mailOptions = {
    from: email,
    to: receiverEmail,
    subject: 'Your Product was rejected',
    html: generateProductRejectedEmailHTML(username, productName , reason),
  };

  return transporter.sendMail(mailOptions);
};

interface OrderWithItems extends Order {
  orderItems : OrderItem[]
  user : User
}


export const sendOrderEmail = (
  order: OrderWithItems,
) => {
  const mailOptions = {
    from: email,
    to: order.user.email,
    subject: 'Thanks for your Order',
    html: generateOrderEmailHTML(order),
  };

  return transporter.sendMail(mailOptions);
};

const nodemailer = require('nodemailer');

// Load environment variables for SMTP configuration
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || SMTP_PORT === 465;
const EMAIL_FROM = process.env.EMAIL_FROM || `"Bole Animal Feed" <${SMTP_USER || 'no-reply@boleanimalfeed.com'}>`;
const EMAIL_ADMIN_TO = process.env.EMAIL_ADMIN_TO || 'info@boleanimalfeed.com';

let transporter = null;

// Initialize Nodemailer transporter if credentials are provided
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  // Verify transporter connection
  transporter.verify((err) => {
    if (err) {
      console.error('❌ SMTP configuration error:', err.message);
    } else {
      console.log('📧 SMTP Server connected successfully - Email alerts active');
    }
  });
} else {
  console.warn('⚠️ SMTP credentials not configured. Email notifications are disabled.');
}

/**
 * Sends a clean, styled HTML email
 */
async function sendMail({ to, subject, html }) {
  if (!transporter) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject} (SMTP not configured)`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html
    });
    console.log(`📧 Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
  }
}

/**
 * Send order confirmation to customer
 */
async function sendOrderConfirmation(order) {
  if (!order.customer_email) return;

  const trackingLink = `${process.env.WEBSITE_URL || 'http://localhost:5000'}/track?ref=${order.order_ref}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
      <div style="background-color: #14532d; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bole Animal Feed</h1>
        <p style="color: #fde047; margin: 5px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Confirmation</p>
      </div>
      
      <div style="padding: 20px;">
        <h2 style="color: #14532d; margin-top: 0;">Thank you for your order, ${order.customer_name}!</h2>
        <p>We have received your order and are currently processing it. Here are your order details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f9fafb;">
            <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Order Reference:</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 16px; color: #14532d; font-weight: bold;">${order.order_ref}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Feed Type:</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${order.product_name}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Quantity:</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${order.quantity} Bags (50kg each)</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Total Price:</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #14532d;">${Number(order.total_price).toLocaleString()} ETB</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Fulfillment:</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-transform: capitalize;">${order.delivery_method === 'delivery' ? `Delivery to: ${order.delivery_address}` : 'Pickup from Factory (Bole Michael)'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Payment Method:</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-transform: uppercase;">${order.payment_method} ${order.payment_txn_ref ? `(Txn Ref: ${order.payment_txn_ref})` : ''}</td>
          </tr>
        </table>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${trackingLink}" style="background-color: #c2410c; color: #ffffff; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Track Your Order Live</a>
        </div>
        
        <p style="font-size: 13px; color: #6b7280; text-align: center;">You can track the progress of your dispatch, verify your invoice, and print receipts via the link above.</p>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 12px; color: #6b7280; text-align: center;">
        <p style="font-weight: bold; margin: 0;">Bole Animal Feed Processing PLC</p>
        <p style="margin: 3px 0;">Bole Michael, Addis Ababa, Ethiopia | +251 939 277 772</p>
      </div>
    </div>
  `;

  await sendMail({
    to: order.customer_email,
    subject: `🌾 Order Confirmation: ${order.order_ref} - Bole Animal Feed`,
    html
  });
}

/**
 * Send administrative alert for a new order
 */
async function sendAdminOrderAlert(order) {
  const adminDashboardLink = `${process.env.WEBSITE_URL || 'http://localhost:5000'}/admin/orders`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; color: #1f2937;">
      <div style="background-color: #c2410c; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">🚨 New Order Received</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>A new order has been submitted on the Bole Animal Feed website:</p>
        
        <h3 style="border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Order Summary</h3>
        <p><strong>Order Ref:</strong> ${order.order_ref}</p>
        <p><strong>Customer Name:</strong> ${order.customer_name}</p>
        <p><strong>Phone:</strong> ${order.customer_phone}</p>
        <p><strong>Email:</strong> ${order.customer_email || 'Not provided'}</p>
        <p><strong>Product Ordered:</strong> ${order.product_name}</p>
        <p><strong>Quantity:</strong> ${order.quantity} Bags</p>
        <p><strong>Total Value:</strong> ${Number(order.total_price).toLocaleString()} ETB</p>
        <p><strong>Fulfillment Mode:</strong> ${order.delivery_method === 'delivery' ? `Delivery to: ${order.delivery_address}` : 'Factory Pickup'}</p>
        <p><strong>Payment Method:</strong> ${order.payment_method} ${order.payment_txn_ref ? `(Txn: ${order.payment_txn_ref})` : ''}</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${adminDashboardLink}" style="background-color: #14532d; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Open Admin Dashboard</a>
        </div>
      </div>
    </div>
  `;

  await sendMail({
    to: EMAIL_ADMIN_TO,
    subject: `🚨 NEW ORDER Alert: ${order.order_ref} - ${order.customer_name}`,
    html
  });
}

/**
 * Send administrative alert for a new contact form message
 */
async function sendAdminMessageAlert(message) {
  const adminMessagesLink = `${process.env.WEBSITE_URL || 'http://localhost:5000'}/admin/messages`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; color: #1f2937;">
      <div style="background-color: #1e3a8a; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">✉️ New Contact Message Received</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>A customer has sent a message via the Contact Form:</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0 0 10px;"><strong>From:</strong> ${message.name}</p>
          <p style="margin: 0 0 10px;"><strong>Phone:</strong> ${message.phone}</p>
          <p style="margin: 0 0 10px;"><strong>Email:</strong> ${message.email || 'Not provided'}</p>
          <p style="margin: 0 0 10px;"><strong>Subject:</strong> ${message.subject}</p>
          <p style="margin: 10px 0 0; border-top: 1px solid #d1d5db; padding-top: 10px; font-style: italic;">
            "${message.message}"
          </p>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${adminMessagesLink}" style="background-color: #14532d; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">View in Admin Panel</a>
        </div>
      </div>
    </div>
  `;

  await sendMail({
    to: EMAIL_ADMIN_TO,
    subject: `✉️ New Contact Message: ${message.subject} - from ${message.name}`,
    html
  });
}

module.exports = {
  sendOrderConfirmation,
  sendAdminOrderAlert,
  sendAdminMessageAlert
};

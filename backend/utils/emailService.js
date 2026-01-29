import nodemailer from "nodemailer";

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email service error:", error.message);
  } else {
    console.log("✅ Email service is ready to send emails");
  }
});

// Send order confirmation email to user and admin
const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const adminEmails = (process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email);

  const itemsHTML = orderDetails.items
    .map(
      (item) =>
        `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price / 100).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  const userEmailHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; }
          .order-info { background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .item-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .item-table th { background-color: #4CAF50; color: white; padding: 10px; text-align: left; }
          .footer { background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
          .total { font-size: 18px; font-weight: bold; color: #4CAF50; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmation</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${orderDetails.firstName}</strong>,</p>
            <p>Thank you for your order! Your order has been successfully placed.</p>
            
            <div class="order-info">
              <h3>Order Details:</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> ${
                orderDetails.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Online (Stripe)"
              }</p>
              <p><strong>Status:</strong> ⏳ ${orderDetails.status || "Pending Confirmation"}</p>
            </div>

            <h3>Ordered Items:</h3>
            <table class="item-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <div class="order-info">
              <h3>Delivery Address:</h3>
              <p>${orderDetails.address.firstName} ${orderDetails.address.lastName}</p>
              <p>${orderDetails.address.street}</p>
              <p>${orderDetails.address.city}, ${orderDetails.address.state} ${orderDetails.address.zipcode}</p>
              <p>📞 ${orderDetails.address.phone}</p>
            </div>

            <div class="order-info" style="text-align: right;">
              <p>Subtotal: ₹${(orderDetails.amount).toFixed(2)}</p>
              <p>Delivery: Free</p>
              <p class="total">Total: ₹${(orderDetails.amount).toFixed(2)}</p>
            </div>

            <p>You will receive a confirmation email from our admin team shortly. Track your order in the "My Orders" section.</p>
            <p>Thank you for choosing EatSprint! 🍔</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
            <p>&copy; 2024 EatSprint. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const adminEmailHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; }
          .alert { background-color: #FFF3CD; border: 1px solid #FFC107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .order-info { background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .item-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .item-table th { background-color: #FF9800; color: white; padding: 10px; text-align: left; }
          .footer { background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
          .total { font-size: 18px; font-weight: bold; color: #FF9800; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 New Order Received</h1>
          </div>
          <div class="content">
            <p>A new order has been placed on EatSprint!</p>
            
            <div class="alert">
              <strong>⚠️ Action Required:</strong> Please review and confirm this order.
            </div>

            <div class="order-info">
              <h3>Order Details:</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> ${
                orderDetails.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Online (Stripe)"
              }</p>
              <p><strong>Payment Status:</strong> ${
                orderDetails.paymentMethod === "cod" || !orderDetails.payment
                  ? "⏳ Pending"
                  : "✅ Paid"
              }</p>
            </div>

            <h3>Customer Details:</h3>
            <div class="order-info">
              <p><strong>Name:</strong> ${orderDetails.firstName} ${orderDetails.address.lastName}</p>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Phone:</strong> ${orderDetails.address.phone}</p>
              <p><strong>Address:</strong> ${orderDetails.address.street}, ${orderDetails.address.city}, ${orderDetails.address.state} ${orderDetails.address.zipcode}</p>
            </div>

            <h3>Ordered Items:</h3>
            <table class="item-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <div class="order-info" style="text-align: right;">
              <p class="total">Total Amount: ₹${(orderDetails.amount).toFixed(2)}</p>
            </div>

            <p><strong>Next Step:</strong> Log in to your admin panel to confirm and prepare this order.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 EatSprint. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    // Send to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - Order #${orderDetails.orderId.toString().slice(-8)}`,
      html: userEmailHTML,
    });
    console.log(`✅ Order confirmation email sent to user: ${userEmail}`);

    // Send to admin(s)
    for (const adminEmail of adminEmails) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `🔔 New Order Received - Order #${orderDetails.orderId.toString().slice(-8)}`,
        html: adminEmailHTML,
      });
      console.log(`✅ Order notification email sent to admin: ${adminEmail}`);
    }
  } catch (error) {
    console.error("❌ Email service error:", error.message);
  }
};

// Send order confirmation email after payment verification
const sendOrderConfirmedEmail = async (userEmail, orderDetails) => {
  const itemsHTML = orderDetails.items
    .map(
      (item) =>
        `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price / 100).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  const emailHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .header { background-color: #27AE60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; }
          .success-box { background-color: #D4EDDA; border: 1px solid #28A745; padding: 15px; border-radius: 5px; margin: 20px 0; color: #155724; }
          .order-info { background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${orderDetails.firstName}</strong>,</p>
            
            <div class="success-box">
              <h2>🎉 Your order has been confirmed!</h2>
              <p>Our kitchen is preparing your delicious food right now. Your order will be delivered soon!</p>
            </div>

            <div class="order-info">
              <h3>Order Summary:</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Confirmation Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Status:</strong> 🟢 Confirmed</p>
              <p><strong>Estimated Delivery:</strong> 30-45 minutes</p>
            </div>

            <h3>Your Order:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #27AE60; color: white;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <div class="order-info" style="text-align: right;">
              <p class="total" style="font-size: 18px; font-weight: bold; color: #27AE60;">Total: ₹${(orderDetails.amount).toFixed(2)}</p>
            </div>

            <div class="order-info">
              <h3>Delivery To:</h3>
              <p>${orderDetails.address.firstName} ${orderDetails.address.lastName}</p>
              <p>${orderDetails.address.street}</p>
              <p>${orderDetails.address.city}, ${orderDetails.address.state} ${orderDetails.address.zipcode}</p>
            </div>

            <p><strong>📍 Track your order:</strong> Log in to your account to see real-time updates on your delivery status.</p>
            <p>Thank you for ordering from EatSprint! 🍽️</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
            <p>&copy; 2024 EatSprint. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `✅ Order Confirmed - Order #${orderDetails.orderId.toString().slice(-8)}`,
      html: emailHTML,
    });
    console.log(`✅ Order confirmed email sent to user: ${userEmail}`);
  } catch (error) {
    console.error("❌ Email service error:", error.message);
  }
};

// Send order status update email
const sendOrderStatusUpdateEmail = async (userEmail, orderDetails, newStatus) => {
  const statusEmojis = {
    "Food Processing": "👨‍🍳",
    "Out for Delivery": "🚴",
    Delivered: "✅",
    Cancelled: "❌",
    "COD - Pending": "⏳",
    "COD - Confirmed": "✅",
  };

  const emoji = statusEmojis[newStatus] || "📦";

  const emailHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; }
          .status-box { background-color: #E3F2FD; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; }
          .footer { background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
          .status-text { font-size: 24px; font-weight: bold; color: #2196F3; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Order Status Update</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${orderDetails.firstName}</strong>,</p>
            <p>Your order status has been updated!</p>
            
            <div class="status-box">
              <p class="status-text">${emoji} ${newStatus}</p>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Updated At:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Status Details:</h3>
              ${getStatusMessage(newStatus)}
            </div>

            <p><strong>📍 Track your order:</strong> Check "My Orders" in your account for live updates.</p>
            <p>Thank you for choosing EatSprint! 🍔</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
            <p>&copy; 2024 EatSprint. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `${emoji} Order Status: ${newStatus}`,
      html: emailHTML,
    });
    console.log(`✅ Status update email sent to user: ${userEmail}`);
  } catch (error) {
    console.error("❌ Email service error:", error.message);
  }
};

// Helper function for status messages
const getStatusMessage = (status) => {
  const messages = {
    "Food Processing": "<p>👨‍🍳 Your food is being prepared in our kitchen. Our chefs are working their magic!</p>",
    "Out for Delivery":
      "<p>🚴 Your order is on its way! Our delivery partner will reach you soon. Stay tuned!</p>",
    Delivered:
      "<p>✅ Your order has been delivered! We hope you enjoyed your meal. Thanks for ordering!</p>",
    Cancelled: "<p>❌ Your order has been cancelled. If you have any questions, please contact support.</p>",
    "COD - Pending":
      "<p>⏳ Your COD order is pending confirmation. We will confirm it shortly.</p>",
    "COD - Confirmed":
      "<p>✅ Your COD order has been confirmed! Prepare to pay on delivery.</p>",
  };

  return messages[status] || `<p>📦 Your order status is now: ${status}</p>`;
};

// Send thank you email after order is delivered
const sendOrderDeliveredThankYouEmail = async (userEmail, orderDetails) => {
  const itemsHTML = orderDetails.items
    .map((item) => `<li style="padding: 8px 0;">🍔 ${item.name} x${item.quantity}</li>`)
    .join("");

  const emailHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            padding: 0;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 40px 20px; 
            text-align: center;
            position: relative;
          }
          .header h1 { 
            margin: 10px 0;
            font-size: 28px;
            font-weight: bold;
          }
          .emoji-large {
            font-size: 50px;
            margin: 15px 0;
            display: block;
          }
          .content { 
            padding: 30px 30px; 
            background: white;
          }
          .order-summary {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .order-summary h3 {
            margin-top: 0;
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
          }
          .order-items {
            list-style: none;
            padding: 0;
            margin: 15px 0;
          }
          .order-items li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .order-items li:last-child {
            border-bottom: none;
          }
          .button-section {
            text-align: center;
            margin: 30px 0;
          }
          .button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 35px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            font-weight: bold;
            margin: 5px;
          }
          .divider {
            height: 2px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            margin: 30px 0;
          }
          .footer-thank-you {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 50px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .footer-thank-you::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -10%;
            width: 120%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: moveBackground 20s linear infinite;
          }
          .footer-thank-you-content {
            position: relative;
            z-index: 2;
          }
          .thank-you-heading {
            font-size: 36px;
            font-weight: bold;
            margin: 0 0 15px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          .thank-you-message {
            font-size: 18px;
            margin: 15px 0;
            line-height: 1.8;
            font-weight: 500;
          }
          .thank-you-emoji {
            font-size: 40px;
            margin: 10px 0;
            display: block;
          }
          .rating-prompt {
            background: rgba(255,255,255,0.15);
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 14px;
          }
          .rating-prompt p {
            margin: 5px 0;
          }
          .footer-info {
            background: #f8f9fa;
            padding: 25px 30px;
            text-align: center;
            color: #555;
            border-top: 3px solid #667eea;
          }
          .footer-info h4 {
            margin-top: 0;
            color: #667eea;
          }
          .footer-info p {
            margin: 8px 0;
            font-size: 13px;
          }
          .discount-code {
            background: #fff3cd;
            border: 2px dashed #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            text-align: center;
          }
          .discount-code p {
            margin: 5px 0;
          }
          .code {
            font-size: 20px;
            font-weight: bold;
            color: #ff6b00;
            letter-spacing: 2px;
          }
          @keyframes moveBackground {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="emoji-large">✅</span>
            <h1>Order Delivered!</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">We hope you enjoyed your meal</p>
          </div>
          
          <div class="content">
            <p>Hi <strong>${orderDetails.firstName}</strong>,</p>
            
            <div class="order-summary">
              <h3>📦 Order Summary</h3>
              <p><strong>Order ID:</strong> #${orderDetails.orderId.toString().slice(-8).toUpperCase()}</p>
              <p><strong>Delivered on:</strong> ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Total Amount Paid:</strong> <span style="color: #667eea; font-weight: bold;">₹${orderDetails.amount.toFixed(2)}</span></p>
              
              <h4 style="color: #555; margin-top: 15px; margin-bottom: 10px;">Items Ordered:</h4>
              <ul class="order-items">
                ${itemsHTML}
              </ul>
            </div>

            <div class="discount-code">
              <p style="font-size: 13px; margin: 5px 0;">🎁 Next Order Discount:</p>
              <div class="code">WELCOME10</div>
              <p style="font-size: 12px; margin: 5px 0; color: #666;">Get 10% off on your next order!</p>
            </div>

            <div class="button-section">
              <a href="http://localhost:5173" class="button">🍔 Order Again Now</a>
              <a href="http://localhost:5173/myorders" class="button">📋 View My Orders</a>
            </div>
          </div>

          <div class="divider"></div>

          <div class="footer-thank-you">
            <div class="footer-thank-you-content">
              <span class="thank-you-emoji">🙏❤️</span>
              <h2 class="thank-you-heading">Thank You!</h2>
              <p class="thank-you-message">
                We truly appreciate your business and trust in EatSprint!
              </p>
              <p class="thank-you-message">
                Your feedback means the world to us. Please take a moment to rate your experience.
              </p>
              <div class="rating-prompt">
                <p>⭐ How was your order?</p>
                <p style="font-size: 12px;">Your ratings help us serve you better</p>
              </div>
            </div>
          </div>

          <div class="footer-info">
            <h4>Got Feedback?</h4>
            <p>We'd love to hear from you! Your comments help us improve our service.</p>
            <p style="font-size: 12px; color: #999; margin-top: 15px;">
              📧 Email: support@eatsprint.com | 📞 Call: 1800-EATSPRINT
            </p>
            <p style="font-size: 11px; color: #bbb; margin-top: 20px;">
              &copy; 2024 EatSprint | All rights reserved | <a href="#" style="color: #667eea; text-decoration: none;">Privacy Policy</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🙏 Thank You for Your Order - Order #${orderDetails.orderId.toString().slice(-8).toUpperCase()}`,
      html: emailHTML,
    });
    console.log(`✅ Thank you email sent to user: ${userEmail}`);
  } catch (error) {
    console.error("❌ Email service error:", error.message);
  }
};

// Send contact form submission to admin
const sendContactFormEmail = async (contactData) => {
  const adminEmails = (process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email);

  const emailHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            padding: 0;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%);
            color: white; 
            padding: 30px 20px; 
            text-align: center;
          }
          .header h1 { 
            margin: 10px 0;
            font-size: 28px;
            font-weight: bold;
          }
          .emoji-icon {
            font-size: 40px;
            margin-bottom: 10px;
            display: block;
          }
          .content { 
            padding: 30px 30px; 
            background: white;
          }
          .alert-box {
            background: #FFF3CD;
            border: 2px solid #FFC107;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 25px;
            text-align: center;
            color: #856404;
            font-weight: 500;
          }
          .form-data {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .form-field {
            margin-bottom: 18px;
          }
          .form-field:last-child {
            margin-bottom: 0;
          }
          .field-label {
            font-size: 12px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
            display: block;
          }
          .field-value {
            font-size: 15px;
            color: #333;
            font-weight: 600;
            padding: 10px;
            background: white;
            border-radius: 5px;
            border-left: 3px solid #FF6B6B;
            padding-left: 12px;
          }
          .message-section {
            background: #e8e8ff;
            border: 2px solid #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .message-section h3 {
            color: #667eea;
            margin-top: 0;
            font-size: 16px;
          }
          .message-content {
            background: white;
            padding: 15px;
            border-radius: 5px;
            color: #555;
            line-height: 1.6;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .action-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .action-box p {
            margin: 8px 0;
            font-size: 14px;
          }
          .footer { 
            background: #f1f1f1; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #ddd;
          }
          .timestamp {
            font-size: 12px;
            color: #999;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="emoji-icon">📬</span>
            <h1>New Contact Form Submission</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Someone has filled out the contact form</p>
          </div>
          
          <div class="content">
            <div class="alert-box">
              ⚡ Action Required: Please review and respond to this message
            </div>

            <div class="form-data">
              <div class="form-field">
                <span class="field-label">📝 Full Name</span>
                <div class="field-value">${contactData.name}</div>
              </div>

              <div class="form-field">
                <span class="field-label">📧 Email Address</span>
                <div class="field-value"><a href="mailto:${contactData.email}" style="color: #667eea; text-decoration: none;">${contactData.email}</a></div>
              </div>

              <div class="form-field">
                <span class="field-label">📞 Phone Number</span>
                <div class="field-value">${contactData.phone || 'Not provided'}</div>
              </div>

              <div class="form-field">
                <span class="field-label">🎯 Subject</span>
                <div class="field-value">${contactData.subject}</div>
              </div>
            </div>

            <div class="message-section">
              <h3>💬 Customer's Message:</h3>
              <div class="message-content">${contactData.message}</div>
            </div>

            <div class="action-box">
              <p>Please respond to the customer within 24 hours</p>
              <p style="font-size: 12px; opacity: 0.9;">Reply directly to: <strong>${contactData.email}</strong></p>
            </div>

            <div class="timestamp">
              <strong>Submitted at:</strong> ${new Date().toLocaleString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>

          <div class="footer">
            <p><strong>EatSprint Contact System</strong></p>
            <p>This is an automated message from your contact form.</p>
            <p>&copy; 2024 EatSprint. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    // Send to all admin emails
    for (const adminEmail of adminEmails) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `📬 New Contact Form: ${contactData.subject}`,
        html: emailHTML,
      });
      console.log(`✅ Contact form email sent to admin: ${adminEmail}`);
    }
    return true;
  } catch (error) {
    console.error("❌ Email service error:", error.message);
    return false;
  }
};

export {
  sendOrderConfirmationEmail,
  sendOrderConfirmedEmail,
  sendOrderStatusUpdateEmail,
  sendOrderDeliveredThankYouEmail,
  sendContactFormEmail,
};

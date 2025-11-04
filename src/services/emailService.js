import { Resend } from 'resend'

// Initialize Resend
// NOTE: For production, move this to a backend/serverless function (Supabase Edge Function)
// to keep the API key secure. Never expose API keys in client-side code.
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

const FROM_EMAIL = 'onboarding@resend.dev' // Change to your verified domain
const SHOP_NAME = 'Fuck DJ Trump Shop'
const SHOP_URL = window.location.origin

// Email template styles
const emailStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    margin: 0;
    padding: 0;
    background-color: #f3f4f6;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  }
  .header {
    background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
    padding: 40px 20px;
    text-align: center;
  }
  .header h1 {
    color: #ffffff;
    margin: 0;
    font-size: 28px;
  }
  .content {
    padding: 40px 30px;
  }
  .order-number {
    background-color: #fef3c7;
    border-left: 4px solid #f59e0b;
    padding: 15px;
    margin: 20px 0;
  }
  .order-number strong {
    color: #f59e0b;
    font-size: 18px;
  }
  .status-badge {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
    margin: 10px 0;
  }
  .status-pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  .status-shipped {
    background-color: #ddd6fe;
    color: #5b21b6;
  }
  .status-delivered {
    background-color: #d1fae5;
    color: #065f46;
  }
  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  .items-table th {
    background-color: #f3f4f6;
    padding: 12px;
    text-align: left;
    border-bottom: 2px solid #e5e7eb;
  }
  .items-table td {
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
  }
  .total-row {
    font-weight: bold;
    font-size: 18px;
    background-color: #fef3c7;
  }
  .button {
    display: inline-block;
    padding: 14px 28px;
    background-color: #f97316;
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin: 20px 0;
  }
  .button:hover {
    background-color: #ea580c;
  }
  .address-box {
    background-color: #f9fafb;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
  }
  .footer {
    background-color: #f3f4f6;
    padding: 30px 20px;
    text-align: center;
    font-size: 14px;
    color: #6b7280;
  }
  .footer a {
    color: #f97316;
    text-decoration: none;
  }
`

// Order Confirmation Email Template
function orderConfirmationTemplate(orderData) {
  const { order, items } = orderData
  const address = order.shipping_address

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
          <p style="color: #fed7aa; margin: 10px 0 0 0;">Thank you for your purchase</p>
        </div>

        <!-- Content -->
        <div class="content">
          <p>Hi ${order.customer_name},</p>
          <p>Thank you for shopping with us! We've received your order and will begin processing it right away.</p>

          <!-- Order Number -->
          <div class="order-number">
            <strong>Order Number: ${order.order_number}</strong>
          </div>

          <span class="status-badge status-pending">⏳ Order Pending</span>

          <!-- Order Items -->
          <h2>Order Details</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.product_name || item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="2">Total</td>
                <td>$${order.total_amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Shipping Address -->
          <h2>Shipping Address</h2>
          <div class="address-box">
            <strong>${address.firstName} ${address.lastName}</strong><br>
            ${address.address}<br>
            ${address.apartment ? `${address.apartment}<br>` : ''}
            ${address.city}, ${address.state} ${address.zipCode}<br>
            ${address.country}
          </div>

          <!-- Contact Info -->
          <p><strong>Order Confirmation Sent To:</strong><br>
          📧 ${order.customer_email}<br>
          📞 ${order.customer_phone}</p>

          <!-- CTA Button -->
          <center>
            <a href="${SHOP_URL}/my-orders" class="button">View Order Status</a>
          </center>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <strong>What's next?</strong><br>
            We'll send you an email as soon as your order ships. You can track your order status anytime in your account.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Need help? <a href="${SHOP_URL}/profile">Contact Support</a></p>
          <p style="margin-top: 10px;">© ${new Date().getFullYear()} ${SHOP_NAME}. All rights reserved.</p>
          <p style="margin-top: 10px;">
            <a href="${SHOP_URL}">Visit Store</a> ·
            <a href="${SHOP_URL}/my-orders">My Orders</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Order Shipped Email Template
function orderShippedTemplate(orderData) {
  const { order, items } = orderData
  const address = order.shipping_address

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Shipped</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🚚 Your Order Has Shipped!</h1>
          <p style="color: #fed7aa; margin: 10px 0 0 0;">Your package is on its way</p>
        </div>

        <!-- Content -->
        <div class="content">
          <p>Hi ${order.customer_name},</p>
          <p>Great news! Your order has been shipped and is on its way to you.</p>

          <!-- Order Number -->
          <div class="order-number">
            <strong>Order Number: ${order.order_number}</strong>
          </div>

          <span class="status-badge status-shipped">🚚 Shipped</span>

          <p style="background-color: #ddd6fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Estimated Delivery:</strong> 3-5 business days<br>
            Your package should arrive by <strong>${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong>
          </p>

          <!-- Order Items -->
          <h2>Shipped Items</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.product_name || item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="2">Total</td>
                <td>$${order.total_amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Shipping Address -->
          <h2>Shipping To</h2>
          <div class="address-box">
            <strong>${address.firstName} ${address.lastName}</strong><br>
            ${address.address}<br>
            ${address.apartment ? `${address.apartment}<br>` : ''}
            ${address.city}, ${address.state} ${address.zipCode}<br>
            ${address.country}
          </div>

          <!-- CTA Button -->
          <center>
            <a href="${SHOP_URL}/my-orders" class="button">Track Your Order</a>
          </center>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            We'll send you another email once your package is delivered. If you have any questions, feel free to contact our support team.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Need help? <a href="${SHOP_URL}/profile">Contact Support</a></p>
          <p style="margin-top: 10px;">© ${new Date().getFullYear()} ${SHOP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Order Delivered Email Template
function orderDeliveredTemplate(orderData) {
  const { order, items } = orderData

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Delivered</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>✅ Order Delivered!</h1>
          <p style="color: #fed7aa; margin: 10px 0 0 0;">Your package has arrived</p>
        </div>

        <!-- Content -->
        <div class="content">
          <p>Hi ${order.customer_name},</p>
          <p>Your order has been successfully delivered! We hope you love your purchase.</p>

          <!-- Order Number -->
          <div class="order-number">
            <strong>Order Number: ${order.order_number}</strong>
          </div>

          <span class="status-badge status-delivered">✅ Delivered</span>

          <p style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            🎉 <strong>Thank you for shopping with us!</strong><br>
            We hope you're happy with your purchase. Your satisfaction is our priority.
          </p>

          <!-- Order Items -->
          <h2>Your Order</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.product_name || item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="2">Total</td>
                <td>$${order.total_amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- CTA Buttons -->
          <center>
            <a href="${SHOP_URL}/my-orders" class="button">View Order Details</a>
            <br>
            <a href="${SHOP_URL}/shop" class="button" style="background-color: #6b7280; margin-top: 10px;">Shop Again</a>
          </center>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <strong>Love your purchase?</strong> Share it with friends or shop for more great items!
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Have an issue? <a href="${SHOP_URL}/profile">Contact Support</a></p>
          <p style="margin-top: 10px;">© ${new Date().getFullYear()} ${SHOP_NAME}. All rights reserved.</p>
          <p style="margin-top: 10px;">
            <a href="${SHOP_URL}">Continue Shopping</a> ·
            <a href="${SHOP_URL}/my-orders">Order Again</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(order, items) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [order.customer_email],
      subject: `Order Confirmation - ${order.order_number}`,
      html: orderConfirmationTemplate({ order, items }),
    })

    if (error) {
      console.error('Error sending order confirmation email:', error)
      return { success: false, error }
    }

    console.log('Order confirmation email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return { success: false, error }
  }
}

// Send order shipped email
export async function sendOrderShippedEmail(order, items) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [order.customer_email],
      subject: `Your Order Has Shipped - ${order.order_number}`,
      html: orderShippedTemplate({ order, items }),
    })

    if (error) {
      console.error('Error sending order shipped email:', error)
      return { success: false, error }
    }

    console.log('Order shipped email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending order shipped email:', error)
    return { success: false, error }
  }
}

// Send order delivered email
export async function sendOrderDeliveredEmail(order, items) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [order.customer_email],
      subject: `Order Delivered - ${order.order_number}`,
      html: orderDeliveredTemplate({ order, items }),
    })

    if (error) {
      console.error('Error sending order delivered email:', error)
      return { success: false, error }
    }

    console.log('Order delivered email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending order delivered email:', error)
    return { success: false, error }
  }
}

// Generic status update email (for processing, cancelled, etc.)
export async function sendOrderStatusUpdateEmail(order, items, previousStatus) {
  const statusMessages = {
    processing: {
      subject: `Your Order is Being Processed - ${order.order_number}`,
      title: '📦 Order Processing',
      message: 'Good news! We\'re now processing your order and will ship it soon.',
      badge: 'processing'
    },
    cancelled: {
      subject: `Order Cancelled - ${order.order_number}`,
      title: '❌ Order Cancelled',
      message: 'Your order has been cancelled. If you didn\'t request this, please contact support.',
      badge: 'cancelled'
    }
  }

  const statusInfo = statusMessages[order.status]
  if (!statusInfo) return { success: false, error: 'Unknown status' }

  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${emailStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusInfo.title}</h1>
          </div>
          <div class="content">
            <p>Hi ${order.customer_name},</p>
            <p>${statusInfo.message}</p>
            <div class="order-number">
              <strong>Order Number: ${order.order_number}</strong>
            </div>
            <center>
              <a href="${SHOP_URL}/my-orders" class="button">View Order Details</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${SHOP_NAME}</p>
          </div>
        </div>
      </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [order.customer_email],
      subject: statusInfo.subject,
      html,
    })

    if (error) {
      console.error('Error sending status update email:', error)
      return { success: false, error }
    }

    console.log('Status update email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending status update email:', error)
    return { success: false, error }
  }
}

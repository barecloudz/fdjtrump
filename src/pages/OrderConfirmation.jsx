import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, Package, Truck, Home, Mail, Phone, MapPin } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [orderItems, setOrderItems] = useState(location.state?.items || [])
  const [loading, setLoading] = useState(!order)

  useEffect(() => {
    // If order not passed via state, fetch from database
    if (!order && orderId) {
      fetchOrder()
    }
  }, [orderId, order])

  const fetchOrder = async () => {
    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError) throw orderError

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)

      if (itemsError) throw itemsError

      setOrder(orderData)
      setOrderItems(itemsData)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order not found</h2>
          <p className="text-gray-600 mb-6">We couldn't find this order</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  const shippingAddress = order.shipping_address || {}

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <CheckCircle className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-green-100 text-lg">
            Thank you for your purchase
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-gray-800">{order.order_number}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="font-semibold">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Order Status */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-4">Order Status</h3>
            <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 capitalize">{order.status}</p>
                  <p className="text-sm text-gray-600">We're processing your order</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200" />
              <div className="absolute top-5 left-0 h-1 bg-primary" style={{ width: '25%' }} />

              <div className="relative flex flex-col items-center z-10">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium">Confirmed</p>
              </div>

              <div className="relative flex flex-col items-center z-10">
                <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mb-2">
                  <Package className="w-5 h-5" />
                </div>
                <p className="text-xs text-gray-500">Processing</p>
              </div>

              <div className="relative flex flex-col items-center z-10">
                <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mb-2">
                  <Truck className="w-5 h-5" />
                </div>
                <p className="text-xs text-gray-500">Shipped</p>
              </div>

              <div className="relative flex flex-col items-center z-10">
                <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mb-2">
                  <Home className="w-5 h-5" />
                </div>
                <p className="text-xs text-gray-500">Delivered</p>
              </div>
            </div>
          </div>

          {/* Confirmation Email Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 mb-1">Order confirmation sent</p>
                <p className="text-sm text-blue-700">
                  We've sent a confirmation email to <span className="font-medium">{order.customer_email}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-4">Order Items</h3>
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.product_name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">Included</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">${order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Contact Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Shipping Address
            </h3>
            <div className="text-gray-700 space-y-1">
              <p className="font-medium">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              <p>{shippingAddress.address}</p>
              {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
              </p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Contact Information
            </h3>
            <div className="text-gray-700 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{order.customer_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{order.customer_phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => navigate('/my-orders')}
            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-white text-gray-700 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-white text-gray-700 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Print Receipt
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-gray-600 text-sm mb-4">
            If you have any questions about your order, please contact our customer support.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="text-primary font-medium hover:underline"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

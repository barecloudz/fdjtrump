import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  ShoppingBag,
  RotateCcw,
  MapPin,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCart } from '../contexts/CartContext'

export default function MyOrders() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [reordering, setReordering] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)

      // Get order IDs from localStorage
      const orderIdsJson = localStorage.getItem('my_orders')
      if (!orderIdsJson) {
        setOrders([])
        return
      }

      const orderIds = JSON.parse(orderIdsJson)

      if (orderIds.length === 0) {
        setOrders([])
        return
      }

      // Fetch orders from Supabase
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('id', orderIds)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewOrderDetails = async (order) => {
    setSelectedOrder(order)
    setShowModal(true)

    // Fetch order items
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)

      if (error) throw error
      setOrderItems(data || [])
    } catch (error) {
      console.error('Error loading order items:', error)
    }
  }

  const handleReorder = async () => {
    if (!orderItems.length) return

    setReordering(true)

    // Fetch current product data to ensure items still exist
    const productIds = orderItems.map(item => item.product_id)
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)

    if (error) {
      console.error('Error fetching products:', error)
      alert('Some products are no longer available')
      setReordering(false)
      return
    }

    // Add each product to cart
    let addedCount = 0
    orderItems.forEach(item => {
      const product = products.find(p => p.id === item.product_id)
      if (product) {
        addToCart(product, item.quantity)
        addedCount++
      }
    })

    setReordering(false)
    setShowModal(false)

    if (addedCount > 0) {
      // Show success message and navigate to cart
      setTimeout(() => {
        navigate('/cart')
      }, 500)
    } else {
      alert('No items could be added to cart')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      processing: <Package className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
    }
    return icons[status] || <Package className="w-4 h-4" />
  }

  const getStatusProgress = (status) => {
    const progress = {
      pending: 25,
      processing: 50,
      shipped: 75,
      delivered: 100,
      cancelled: 0,
    }
    return progress[status] || 0
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4 flex items-center z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold ml-2">My Orders</h1>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-600">Order Number</p>
                      <p className="font-bold text-gray-900">
                        {order.order_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold text-primary text-lg">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </div>
                </div>

                {/* Order Progress Bar */}
                {order.status !== 'cancelled' && (
                  <div className="px-4 py-3 bg-gray-50">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>Order placed</span>
                      <span>Delivered</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                        style={{ width: `${getStatusProgress(order.status)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Order Actions */}
                <div className="p-4 flex gap-3">
                  <button
                    onClick={() => viewOrderDetails(order)}
                    className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 flex items-center justify-center gap-2"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => {
                        viewOrderDetails(order)
                      }}
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="hidden sm:inline">Reorder</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order Details
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedOrder.order_number}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Status Timeline */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Status
                </h3>
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200" />
                  <div
                    className="absolute top-5 left-0 h-1 bg-primary transition-all"
                    style={{ width: `${getStatusProgress(selectedOrder.status)}%` }}
                  />

                  <div className="relative flex flex-col items-center z-10">
                    <div
                      className={`w-10 h-10 ${
                        getStatusProgress(selectedOrder.status) >= 25
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-500'
                      } rounded-full flex items-center justify-center mb-2`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-center font-medium">Confirmed</p>
                  </div>

                  <div className="relative flex flex-col items-center z-10">
                    <div
                      className={`w-10 h-10 ${
                        getStatusProgress(selectedOrder.status) >= 50
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-500'
                      } rounded-full flex items-center justify-center mb-2`}
                    >
                      <Package className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-center font-medium">Processing</p>
                  </div>

                  <div className="relative flex flex-col items-center z-10">
                    <div
                      className={`w-10 h-10 ${
                        getStatusProgress(selectedOrder.status) >= 75
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-500'
                      } rounded-full flex items-center justify-center mb-2`}
                    >
                      <Truck className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-center font-medium">Shipped</p>
                  </div>

                  <div className="relative flex flex-col items-center z-10">
                    <div
                      className={`w-10 h-10 ${
                        getStatusProgress(selectedOrder.status) >= 100
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-500'
                      } rounded-full flex items-center justify-center mb-2`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-center font-medium">Delivered</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 font-medium">
                      {selectedOrder.shipping_address.firstName}{' '}
                      {selectedOrder.shipping_address.lastName}
                    </p>
                    <p className="text-gray-700">
                      {selectedOrder.shipping_address.address}
                    </p>
                    {selectedOrder.shipping_address.apartment && (
                      <p className="text-gray-700">
                        {selectedOrder.shipping_address.apartment}
                      </p>
                    )}
                    <p className="text-gray-700">
                      {selectedOrder.shipping_address.city},{' '}
                      {selectedOrder.shipping_address.state}{' '}
                      {selectedOrder.shipping_address.zipCode}
                    </p>
                    <p className="text-gray-700">
                      {selectedOrder.shipping_address.country}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Order Items ({orderItems.length})
                </h3>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center pb-3 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.product_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ${selectedOrder.total_amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">
                    ${selectedOrder.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedOrder.status === 'delivered' && (
                <button
                  onClick={handleReorder}
                  disabled={reordering}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {reordering ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding to cart...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Reorder
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

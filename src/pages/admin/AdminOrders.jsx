import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  Package,
  Search,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Filter,
  RefreshCw,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import {
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderStatusUpdateEmail,
} from '../../services/emailService'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
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

  const updateOrderStatus = async (orderId, newStatus) => {
    const previousStatus = selectedOrder?.status

    try {
      setUpdating(true)
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)

      if (error) throw error

      // Update local state
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
      setOrders(updatedOrders)

      let updatedOrder = selectedOrder
      if (selectedOrder?.id === orderId) {
        updatedOrder = { ...selectedOrder, status: newStatus }
        setSelectedOrder(updatedOrder)
      } else {
        updatedOrder = updatedOrders.find(o => o.id === orderId)
      }

      // Send status update email based on new status
      try {
        if (newStatus === 'shipped') {
          const emailResult = await sendOrderShippedEmail(updatedOrder, orderItems)
          if (emailResult.success) {
            console.log('Shipped email sent successfully')
          }
        } else if (newStatus === 'delivered') {
          const emailResult = await sendOrderDeliveredEmail(updatedOrder, orderItems)
          if (emailResult.success) {
            console.log('Delivered email sent successfully')
          }
        } else if (newStatus === 'processing' || newStatus === 'cancelled') {
          const emailResult = await sendOrderStatusUpdateEmail(updatedOrder, orderItems, previousStatus)
          if (emailResult.success) {
            console.log('Status update email sent successfully')
          }
        }
      } catch (emailError) {
        console.error('Error sending status update email:', emailError)
        // Don't block status update if email fails
      }

    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0),
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

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Management</h1>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-500">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
            <p className="text-sm text-gray-600">Processing</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <Truck className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.shipped}</p>
            <p className="text-sm text-gray-600">Shipped</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
            <p className="text-sm text-gray-600">Delivered</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.totalRevenue.toFixed(0)}
            </p>
            <p className="text-sm text-gray-600">Revenue</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Orders will appear here once customers start purchasing'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.order_number}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.customer_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer_email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">
                          ${order.total_amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            order.payment_status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.payment_status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-primary hover:text-orange-600 font-medium text-sm flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-gray-900 mb-1">
                        {order.order_number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.customer_name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        ${order.total_amount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => viewOrderDetails(order)}
                    className="w-full py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                {/* Order Status Update */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Order Status
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) =>
                        updateOrderStatus(selectedOrder.id, e.target.value)
                      }
                      disabled={updating}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updating && (
                      <div className="flex items-center px-4">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedOrder.customer_email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedOrder.customer_phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {new Date(selectedOrder.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shipping_address && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Shipping Address
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">
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
                    Order Items
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Product
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            Qty
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                            Price
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orderItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.product_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 py-3 text-right font-semibold text-gray-900"
                          >
                            Total:
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-primary">
                            ${selectedOrder.total_amount.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

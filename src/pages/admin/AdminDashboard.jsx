import AdminLayout from '../../components/admin/AdminLayout'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  Package, DollarSign, ShoppingCart, TrendingUp, TrendingDown,
  AlertTriangle, Users, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { format, subDays } from 'date-fns'

export default function AdminDashboard({ products }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
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

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0)
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
  const lowStockProducts = products.filter(p => (p.stock || 0) < 10)
  const activeProducts = products.filter(p => p.status === 'active' || !p.status)

  // Revenue trend data (last 7 days)
  const revenueTrend = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayOrders = orders.filter(o => {
      const orderDate = format(new Date(o.created_at), 'yyyy-MM-dd')
      return orderDate === dateStr
    })
    return {
      date: format(date, 'MMM dd'),
      revenue: dayOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0),
      orders: dayOrders.length
    }
  })

  // Category distribution
  const categoryData = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized'
    const existing = acc.find(item => item.name === category)
    if (existing) {
      existing.value++
    } else {
      acc.push({ name: category, value: 1 })
    }
    return acc
  }, [])

  // Order status distribution
  const orderStatusData = orders.reduce((acc, order) => {
    const status = order.status || 'pending'
    const existing = acc.find(item => item.name === status)
    if (existing) {
      existing.value++
    } else {
      acc.push({ name: status, value: 1 })
    }
    return acc
  }, [])

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']

  // Recent activity
  const recentActivity = [
    ...orders.slice(0, 3).map(order => ({
      type: 'order',
      message: `New order #${order.order_number}`,
      amount: `$${parseFloat(order.total_amount).toFixed(2)}`,
      time: new Date(order.created_at)
    })),
    ...products.slice(0, 2).map(product => ({
      type: 'product',
      message: `Product added: ${product.name}`,
      amount: `$${product.price.toFixed(2)}`,
      time: new Date(product.created_at)
    }))
  ].sort((a, b) => b.time - a.time).slice(0, 5)

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      label: 'Total Orders',
      value: orders.length,
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      label: 'Products',
      value: products.length,
      change: `${activeProducts.length} active`,
      trend: 'neutral',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      label: 'Avg Order Value',
      value: `$${avgOrderValue.toFixed(2)}`,
      change: '-2.4%',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
          </div>
          <div className="flex gap-2">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.trend === 'up' && (
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    {stat.change}
                  </span>
                )}
                {stat.trend === 'down' && (
                  <span className="flex items-center text-red-600 text-sm font-medium">
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                    {stat.change}
                  </span>
                )}
                {stat.trend === 'neutral' && (
                  <span className="text-gray-600 text-sm">{stat.change}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} name="Revenue ($)" />
                <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Low Stock Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-600 text-sm">All products are well stocked!</p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-600">SKU: {product.sku || 'N/A'}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                      {product.stock || 0} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'order' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'order' ? (
                        <ShoppingCart className={`w-5 h-5 ${activity.type === 'order' ? 'text-blue-600' : 'text-purple-600'}`} />
                      ) : (
                        <Package className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-600">{format(activity.time, 'MMM dd, h:mm a')}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">{activity.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

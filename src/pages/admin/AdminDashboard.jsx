import { Link } from 'react-router-dom'
import { Package, BarChart3, Settings, LogOut } from 'lucide-react'

export default function AdminDashboard({ products }) {
  const stats = {
    totalProducts: products.length,
    onSale: products.filter(p => p.discount > 0).length,
    popular: products.filter(p => p.popular).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Fuck DJ Trump Shop</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-primary">{stats.totalProducts}</p>
              </div>
              <Package className="w-12 h-12 text-primary/20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">On Sale</p>
                <p className="text-3xl font-bold text-accent">{stats.onSale}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-accent/20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Popular Items</p>
                <p className="text-3xl font-bold text-green-600">{stats.popular}</p>
              </div>
              <Settings className="w-12 h-12 text-green-600/20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="flex items-center gap-3 p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span className="font-semibold">Manage Products</span>
            </Link>
            <a
              href="/"
              className="flex items-center gap-3 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">View Store</span>
            </a>
          </div>
        </div>

        {/* Recent Products */}
        {products.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Recent Products</h2>
            <div className="space-y-3">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                  </div>
                  {product.discount > 0 && (
                    <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

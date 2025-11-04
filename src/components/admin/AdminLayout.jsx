import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Package, LayoutDashboard, ShoppingCart, Settings, LogOut, Store, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      navigate('/admin')
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-900 text-white p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Store className="w-6 h-6 text-blue-400" />
          <div>
            <h1 className="font-bold">FDJ Trump Shop</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gray-900 text-white flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          lg:transform-none
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="font-bold text-lg">FDJ Trump Shop</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t border-gray-800">
          <a
            href="/"
            target="_blank"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mb-2"
          >
            <Store className="w-5 h-5" />
            <span className="font-medium">View Store</span>
          </a>
          <button
            onClick={() => {
              handleLogout()
              closeMobileMenu()
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto lg:mt-0 mt-0">
          {children}
        </main>
      </div>
    </div>
  )
}

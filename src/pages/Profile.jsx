import { Link, useNavigate } from 'react-router-dom'
import { User, Settings, Shield, ChevronRight, Package, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?')
    if (confirmed) {
      await signOut()
      navigate('/')
    }
  }

  // If not logged in, redirect to login
  if (!user) {
    navigate('/onboarding')
    return null
  }

  const userName = user.user_metadata?.full_name || 'User'
  const userEmail = user.email || ''

  // Get user's initials for avatar
  const getInitials = () => {
    if (!user.user_metadata?.full_name) return 'U'
    const names = user.user_metadata.full_name.split(' ')
    return names.map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 pb-12">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* User Info */}
      <div className="px-4 -mt-8 mb-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">{getInitials()}</span>
          </div>
          <h2 className="text-xl font-bold">{userName}</h2>
          <p className="text-gray-600">{userEmail}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-2">
        <Link
          to="/my-orders"
          className="w-full flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <span className="flex-1 text-left font-medium">My Orders</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <span className="flex-1 text-left font-medium">My Account</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
          <span className="flex-1 text-left font-medium">Settings</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <a
          href="/admin"
          className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm"
        >
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="flex-1 text-left font-medium">Admin Panel</span>
          <ChevronRight className="w-5 h-5 text-white/80" />
        </a>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors shadow-sm mt-4"
        >
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <span className="flex-1 text-left font-medium">Logout</span>
          <ChevronRight className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </div>
  )
}

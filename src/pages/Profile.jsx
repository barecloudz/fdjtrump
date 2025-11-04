import { User, Settings, Shield, ChevronRight } from 'lucide-react'

export default function Profile() {
  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 pb-12">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* User Info */}
      <div className="px-4 -mt-8 mb-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-bold">Customer</h2>
          <p className="text-gray-600">customer@example.com</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-2">
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
      </div>
    </div>
  )
}

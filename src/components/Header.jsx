import { Link } from 'react-router-dom'
import { Menu, Settings, Bell } from 'lucide-react'

export default function Header() {
  return (
    <div className="bg-white sticky top-0 z-40 shadow-sm">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-white">F</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Fuck DJ Trump</h1>
              <p className="text-xs text-gray-500">Shop</p>
            </div>
          </Link>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

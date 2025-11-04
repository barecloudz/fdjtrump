import { Link, useLocation } from 'react-router-dom'
import { Home, Heart, MessageCircle, Calendar, User } from 'lucide-react'

export default function BottomNav() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex flex-col items-center">
          <Home
            className={`w-6 h-6 ${isActive('/') ? 'text-primary' : 'text-gray-400'}`}
            fill={isActive('/') ? 'currentColor' : 'none'}
          />
        </Link>
        <Link to="/flash-sale" className="flex flex-col items-center">
          <Heart
            className={`w-6 h-6 ${isActive('/flash-sale') ? 'text-primary' : 'text-gray-400'}`}
            fill={isActive('/flash-sale') ? 'currentColor' : 'none'}
          />
        </Link>
        <Link to="/shop" className="flex flex-col items-center">
          <MessageCircle
            className={`w-6 h-6 ${isActive('/shop') ? 'text-primary' : 'text-gray-400'}`}
            fill={isActive('/shop') ? 'currentColor' : 'none'}
          />
        </Link>
        <button className="flex flex-col items-center">
          <Calendar className="w-6 h-6 text-gray-400" />
        </button>
        <Link to="/profile" className="flex flex-col items-center">
          <User
            className={`w-6 h-6 ${isActive('/profile') ? 'text-primary' : 'text-gray-400'}`}
            fill={isActive('/profile') ? 'currentColor' : 'none'}
          />
        </Link>
      </div>
    </nav>
  )
}

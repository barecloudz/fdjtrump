import { Link, useLocation } from 'react-router-dom'
import { Home, Heart, MessageCircle, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

export default function BottomNav() {
  const location = useLocation()
  const { cartItemsCount } = useCart()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex flex-col items-center">
          <Home
            className={`w-6 h-6 ${isActive('/') ? 'text-primary' : 'text-gray-400'}`}
            fill={isActive('/') ? 'currentColor' : 'none'}
          />
        </Link>
        <Link to="/donate" className="flex flex-col items-center">
          <Heart
            className={`w-6 h-6 ${isActive('/donate') ? 'text-pink-500' : 'text-gray-400'}`}
            fill={isActive('/donate') ? 'currentColor' : 'none'}
          />
        </Link>
        <Link to="/shop" className="flex flex-col items-center">
          <MessageCircle
            className={`w-6 h-6 ${isActive('/shop') ? 'text-primary' : 'text-gray-400'}`}
            fill={isActive('/shop') ? 'currentColor' : 'none'}
          />
        </Link>
        <Link to="/cart" className="flex flex-col items-center relative">
          <ShoppingCart
            className={`w-6 h-6 ${isActive('/cart') ? 'text-primary' : 'text-gray-400'}`}
            fill={isActive('/cart') ? 'currentColor' : 'none'}
          />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemsCount > 99 ? '99+' : cartItemsCount}
            </span>
          )}
        </Link>
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

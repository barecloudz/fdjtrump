import { Link } from 'react-router-dom'
import { LogIn } from 'lucide-react'

export default function Header() {
  // TODO: Replace with actual auth state when authentication is implemented
  const isLoggedIn = false

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

          {/* Right side - Login/Profile */}
          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <Link
                to="/onboarding"
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium text-sm hover:shadow-lg transition-shadow"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            ) : (
              <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">U</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

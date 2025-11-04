import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import FlashSale from './pages/FlashSale'
import Profile from './pages/Profile'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import MyOrders from './pages/MyOrders'
import SearchResults from './pages/SearchResults'
import PasswordRecovery from './pages/auth/PasswordRecovery'
import SetupNewPassword from './pages/auth/SetupNewPassword'
import Onboarding from './pages/auth/Onboarding'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductsNew from './pages/admin/AdminProductsNew'
import AdminOrders from './pages/admin/AdminOrders'
import AdminSettings from './pages/admin/AdminSettings'
import BottomNav from './components/BottomNav'
import MobileLayout from './components/MobileLayout'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { CartProvider } from './contexts/CartContext'

function AppContent({ isAdmin, setIsAdmin, products, refreshProducts }) {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isAuthRoute = location.pathname.startsWith('/password-recovery') ||
                      location.pathname.startsWith('/setup-password') ||
                      location.pathname.startsWith('/onboarding')

  return (
    <>
      {/* Auth routes (no layout) */}
      {isAuthRoute && (
        <Routes>
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route path="/setup-password" element={<SetupNewPassword />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      )}

      {/* Main app routes */}
      {!isAdminRoute && !isAuthRoute && (
        <MobileLayout>
          <Routes>
            <Route path="/" element={<><Home products={products} /><BottomNav /></>} />
            <Route path="/shop" element={<><Shop products={products} /><BottomNav /></>} />
            <Route path="/flash-sale" element={<><FlashSale products={products} /><BottomNav /></>} />
            <Route path="/search" element={<><SearchResults products={products} /><BottomNav /></>} />
            <Route path="/cart" element={<><Cart /><BottomNav /></>} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/my-orders" element={<><MyOrders /><BottomNav /></>} />
            <Route path="/profile" element={<><Profile /><BottomNav /></>} />
            <Route path="/product/:id" element={<><ProductDetail products={products} /><BottomNav /></>} />
          </Routes>
        </MobileLayout>
      )}

      {/* Admin routes */}
      {isAdminRoute && (
        <Routes>
          <Route path="/admin" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
          <Route
            path="/admin/dashboard"
            element={isAdmin ? <AdminDashboard products={products} /> : <Navigate to="/admin" />}
          />
          <Route
            path="/admin/products"
            element={isAdmin ? <AdminProductsNew products={products} refreshProducts={refreshProducts} /> : <Navigate to="/admin" />}
          />
          <Route
            path="/admin/orders"
            element={isAdmin ? <AdminOrders /> : <Navigate to="/admin" />}
          />
          <Route
            path="/admin/settings"
            element={isAdmin ? <AdminSettings /> : <Navigate to="/admin" />}
          />
        </Routes>
      )}
    </>
  )
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshProducts = () => {
    loadProducts()
  }

  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <AppContent
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            products={products}
            refreshProducts={refreshProducts}
          />
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App

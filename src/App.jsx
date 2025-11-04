import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import FlashSale from './pages/FlashSale'
import Profile from './pages/Profile'
import ProductDetail from './pages/ProductDetail'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboardNew from './pages/admin/AdminDashboardNew'
import AdminProductsNew from './pages/admin/AdminProductsNew'
import AdminOrders from './pages/admin/AdminOrders'
import AdminSettings from './pages/admin/AdminSettings'
import BottomNav from './components/BottomNav'
import MobileLayout from './components/MobileLayout'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

function AppContent({ isAdmin, setIsAdmin, products, refreshProducts }) {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && (
        <MobileLayout>
          <Routes>
            <Route path="/" element={<><Home products={products} /><BottomNav /></>} />
            <Route path="/shop" element={<><Shop products={products} /><BottomNav /></>} />
            <Route path="/flash-sale" element={<><FlashSale products={products} /><BottomNav /></>} />
            <Route path="/profile" element={<><Profile /><BottomNav /></>} />
            <Route path="/product/:id" element={<><ProductDetail products={products} /><BottomNav /></>} />
          </Routes>
        </MobileLayout>
      )}

      {isAdminRoute && (
        <Routes>
          <Route path="/admin" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
          <Route
            path="/admin/dashboard"
            element={isAdmin ? <AdminDashboardNew products={products} /> : <Navigate to="/admin" />}
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
  )
}

export default App

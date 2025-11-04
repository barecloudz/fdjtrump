import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import FlashSale from './pages/FlashSale'
import Profile from './pages/Profile'
import ProductDetail from './pages/ProductDetail'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import BottomNav from './components/BottomNav'
import MobileLayout from './components/MobileLayout'
import { useState, useEffect } from 'react'

function AppContent({ isAdmin, setIsAdmin, products, saveProducts }) {
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
            element={isAdmin ? <AdminDashboard products={products} /> : <Navigate to="/admin" />}
          />
          <Route
            path="/admin/products"
            element={isAdmin ? <AdminProducts products={products} setProducts={saveProducts} /> : <Navigate to="/admin" />}
          />
        </Routes>
      )}
    </>
  )
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [products, setProducts] = useState([])

  useEffect(() => {
    // Load products from localStorage
    const savedProducts = localStorage.getItem('products')
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
  }, [])

  const saveProducts = (newProducts) => {
    setProducts(newProducts)
    localStorage.setItem('products', JSON.stringify(newProducts))
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <AppContent
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          products={products}
          saveProducts={saveProducts}
        />
      </div>
    </BrowserRouter>
  )
}

export default App

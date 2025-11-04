import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { Zap } from 'lucide-react'

export default function FlashSale({ products }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 30, seconds: 45 })
  const [selectedDiscount, setSelectedDiscount] = useState(16)

  const discountTabs = [16, 34, 50, 67, 80]
  const saleProducts = products.filter(p => p.discount > 0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header with Countdown */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold mb-2">Flash Sale</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm">Choose Your Discount</span>
          <div className="flex gap-1 text-xs">
            <div className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</div>
            <span>:</span>
            <div className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <span>:</span>
            <div className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</div>
          </div>
        </div>
      </div>

      {/* Discount Tabs */}
      <div className="p-4 border-b">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {discountTabs.map((discount) => (
            <button
              key={discount}
              onClick={() => setSelectedDiscount(discount)}
              className={`flex-shrink-0 px-4 py-2 rounded-full border-2 transition-colors ${
                selectedDiscount === discount
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              {discount}%
            </button>
          ))}
        </div>
      </div>

      {/* Flash Sale Badge */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">20% Discount</h2>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {saleProducts.length > 0 ? (
            saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Flash Sale Items</h3>
              <p className="text-gray-600 text-sm">Check back later for amazing deals!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

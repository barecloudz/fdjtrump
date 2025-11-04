import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import Header from '../components/Header'
import { ChevronRight, ShoppingBag, Settings, Menu, ArrowRight, Play, Clock } from 'lucide-react'

export default function Home({ products }) {
  const newItems = products.slice(0, 6)
  const mostPopular = products.filter(p => p.popular).slice(0, 6)
  const flashSaleItems = products.slice(0, 6)
  const justForYou = products.slice(0, 6)

  // Flash sale countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 36, seconds: 58 })

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

  const categories = [
    { name: 'Clothing', count: 109, color: 'bg-gradient-to-br from-orange-300 to-yellow-400' },
    { name: 'Shoes', count: 530, color: 'bg-gradient-to-br from-red-400 to-pink-400' },
    { name: 'Bags', count: 87, color: 'bg-gradient-to-br from-pink-300 to-purple-300' },
    { name: 'Lingerie', count: 218, color: 'bg-gradient-to-br from-blue-300 to-cyan-300' }
  ]

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header with logo */}
      <Header />

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white border-b">
        <SearchBar products={products} placeholder="Search for products..." />
      </div>

      {/* Greeting */}
      <div className="px-4 pt-6 pb-4 bg-white">
        <h1 className="text-3xl font-bold text-gray-900">Hello, Romina!</h1>
      </div>

      {/* Announcement */}
      <div className="px-4 pb-6 bg-white">
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Announcement</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas hendrerit luctus libero ac vulputate.
            </p>
          </div>
          <button className="ml-3 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="px-4 py-6 bg-white">
        <h2 className="font-bold text-xl mb-4">Recently viewed</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-2xl">👗</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Orders */}
      <div className="px-4 py-6 bg-white mt-2">
        <h2 className="font-bold text-xl mb-4">My Orders</h2>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-blue-50 text-blue-600 rounded-full font-medium flex-1">
            To Pay
          </button>
          <button className="px-6 py-3 bg-blue-50 text-blue-600 rounded-full font-medium flex-1 relative">
            To Recieve
            <span className="absolute top-1 right-3 w-2.5 h-2.5 bg-green-500 rounded-full"></span>
          </button>
          <button className="px-6 py-3 bg-blue-50 text-blue-600 rounded-full font-medium flex-1">
            To Review
          </button>
        </div>
      </div>

      {/* Stories */}
      <div className="px-4 py-6 bg-white mt-2">
        <h2 className="font-bold text-xl mb-4">Stories</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { gradient: 'from-blue-400 to-blue-600', live: true },
            { gradient: 'from-pink-300 to-pink-400', live: false },
            { gradient: 'from-cyan-300 to-blue-400', live: false },
            { gradient: 'from-yellow-300 to-orange-400', live: false }
          ].map((story, i) => (
            <div key={i} className="flex-shrink-0 w-44 h-72 relative rounded-2xl overflow-hidden shadow-lg">
              <div className={`w-full h-full bg-gradient-to-br ${story.gradient} flex items-center justify-center`}>
                <span className="text-6xl">🛍️</span>
              </div>
              {story.live && (
                <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                  Live
                </div>
              )}
              <button className="absolute bottom-3 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* New Items */}
      {newItems.length > 0 && (
        <div className="px-4 py-6 bg-white mt-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">New Items</h2>
            <button className="flex items-center gap-1 text-blue-600 font-medium">
              See All
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {newItems.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>
      )}

      {/* Most Popular */}
      {mostPopular.length > 0 && (
        <div className="px-4 py-6 bg-white mt-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">Most Popular</h2>
            <button className="flex items-center gap-1 text-blue-600 font-medium">
              See All
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {mostPopular.map((product, idx) => (
              <div key={product.id} className="flex-shrink-0 w-32">
                <div className="relative">
                  <img
                    src={product.image || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-lg mb-2"
                  />
                  <div className="absolute bottom-2 left-2 flex gap-1 text-xs">
                    <span className="bg-white/90 px-1.5 py-0.5 rounded font-bold">1780</span>
                    <span className="bg-white/90 px-1.5 py-0.5 rounded font-medium text-gray-600">
                      {['New', 'Sale', 'Hot'][idx % 3]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="px-4 py-6 bg-white mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Categories</h2>
          <button className="flex items-center gap-1 text-blue-600 font-medium">
            See All
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className={`aspect-square ${category.color} rounded-xl flex items-center justify-center text-4xl`}>
                  {category.name === 'Clothing' ? '👕' : category.name === 'Shoes' ? '👟' : category.name === 'Bags' ? '👜' : '👙'}
                </div>
                <div className={`aspect-square ${category.color} rounded-xl opacity-80`}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">{category.name}</span>
                <span className="text-sm text-gray-500">{category.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale */}
      <div className="px-4 py-6 bg-white mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Flash Sale</h2>
          <div className="flex items-center gap-2 text-blue-600">
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">
              {String(timeLeft.hours).padStart(2, '0')} {String(timeLeft.minutes).padStart(2, '0')} {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {flashSaleItems.slice(0, 6).map((product) => (
            <div key={product.id} className="relative">
              <img
                src={product.image || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -20%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="px-4 py-6 bg-white mt-2">
        <h2 className="font-bold text-xl mb-4">Top Products</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-red-400 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-2xl">🔥</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Just For You */}
      <div className="px-4 py-6 bg-white mt-2 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-bold text-xl">Just For You</h2>
          <span className="text-blue-600">⭐</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {justForYou.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {products.length === 0 && (
        <div className="p-8 text-center bg-white mt-2">
          <div className="max-w-sm mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-6">Start adding products from the admin panel to see them here.</p>
            <a
              href="/admin"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Admin Panel
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

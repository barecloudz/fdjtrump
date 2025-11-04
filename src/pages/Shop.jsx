import ProductCard from '../components/ProductCard'
import { ChevronRight, Search } from 'lucide-react'

export default function Shop({ products }) {
  const categories = [
    { name: 'Clothing', icon: '👕' },
    { name: 'Shoes', icon: '👟' },
    { name: 'Bags', icon: '👜' },
    { name: 'Lingerie', icon: '🩱' },
    { name: 'Watch', icon: '⌚' },
    { name: 'Hoodies', icon: '🧥' },
  ]

  const saleProducts = products.filter(p => p.discount > 0).slice(0, 2)
  const topProducts = products.slice(0, 6)
  const newItems = products.slice(0, 3)

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 border-b sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">Shop</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Search className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Big Sale Banner */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Big Sale</h2>
          <p className="text-white/90">Up to 50% off!</p>
        </div>
      </div>

      {/* Categories */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Categories</h2>
          <button className="text-primary text-sm flex items-center">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category) => (
            <button
              key={category.name}
              className="bg-gradient-to-br from-blue-100 to-pink-100 rounded-lg p-4 text-center"
            >
              <div className="text-3xl mb-1">{category.icon}</div>
              <div className="text-sm font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Top Products</h2>
            <button className="text-primary text-sm flex items-center">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {topProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                {product.image && (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Items */}
      {newItems.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">New Items</h2>
            <button className="text-primary text-sm flex items-center">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {newItems.map((product) => (
              <div key={product.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.image && (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && (
        <div className="p-8 text-center border-t">
          <p className="text-gray-600 mb-4">No products available yet.</p>
          <a href="/admin" className="text-primary font-semibold underline">
            Add products in Admin Panel
          </a>
        </div>
      )}
    </div>
  )
}

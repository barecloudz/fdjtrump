import ProductCard from '../components/ProductCard'
import { ChevronRight, ShoppingBag } from 'lucide-react'

export default function Home({ products }) {
  const newItems = products.slice(0, 4)
  const mostPopular = products.filter(p => p.popular).slice(0, 4)

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold">Hello!</h1>
            <p className="text-blue-100">Welcome to Fuck DJ Trump Shop</p>
          </div>
          <ShoppingBag className="w-8 h-8 text-white/80" />
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="p-4">
        <h2 className="font-semibold mb-3">Recently viewed</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>

      {/* My Orders */}
      <div className="p-4 border-t">
        <h2 className="font-semibold mb-3">My Orders</h2>
        <div className="flex gap-2">
          {['To Pay', 'To Receive', 'To Review'].map((status) => (
            <button key={status} className="px-4 py-2 bg-gray-100 rounded-full text-sm">
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Stories */}
      <div className="p-4 border-t">
        <h2 className="font-semibold mb-3">Stories</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-32">
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-400 to-pink-400 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>

      {/* New Items */}
      {newItems.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">New Items</h2>
            <button className="text-primary text-sm flex items-center">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {newItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Most Popular */}
      {mostPopular.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Most Popular</h2>
            <button className="text-primary text-sm flex items-center">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mostPopular.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && (
        <div className="p-8 text-center border-t">
          <div className="max-w-sm mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-6">Start adding products from the admin panel to see them here.</p>
            <a
              href="/admin"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Go to Admin Panel
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

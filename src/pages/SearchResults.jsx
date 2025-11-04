import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import ProductCard from '../components/ProductCard'

export default function SearchResults({ products }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''

  const [filteredProducts, setFilteredProducts] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [minDiscount, setMinDiscount] = useState(0)
  const [sortBy, setSortBy] = useState('relevance')

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  useEffect(() => {
    filterAndSortProducts()
  }, [query, products, selectedCategories, priceRange, minDiscount, sortBy])

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())

      if (!matchesSearch) return false

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false
      }

      // Price filter
      const finalPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price
      if (finalPrice < priceRange[0] || finalPrice > priceRange[1]) {
        return false
      }

      // Discount filter
      if ((product.discount || 0) < minDiscount) {
        return false
      }

      return true
    })

    // Sort
    filtered = [...filtered].sort((a, b) => {
      const aPrice = a.discount ? a.price * (1 - a.discount / 100) : a.price
      const bPrice = b.discount ? b.price * (1 - b.discount / 100) : b.price

      switch (sortBy) {
        case 'price-low':
          return aPrice - bPrice
        case 'price-high':
          return bPrice - aPrice
        case 'discount':
          return (b.discount || 0) - (a.discount || 0)
        case 'popular':
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'relevance':
        default:
          // Score by how well it matches
          const aScore = a.name.toLowerCase() === query.toLowerCase() ? 2 :
                        a.name.toLowerCase().includes(query.toLowerCase()) ? 1 : 0
          const bScore = b.name.toLowerCase() === query.toLowerCase() ? 2 :
                        b.name.toLowerCase().includes(query.toLowerCase()) ? 1 : 0
          return bScore - aScore
      }
    })

    setFilteredProducts(filtered)
  }

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 1000])
    setMinDiscount(0)
    setSortBy('relevance')
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 1000 ||
    minDiscount > 0

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <SearchBar products={products} autoFocus={false} />
          </div>
        </div>

        {/* Results count and filter button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
            {query && ` for "${query}"`}
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-colors ${
              hasActiveFilters
                ? 'border-primary bg-orange-50 text-primary'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Filters Sidebar - Desktop */}
        <div
          className={`hidden md:block w-64 bg-white border-r p-4 space-y-6 sticky top-36 h-fit ${
            showFilters ? '' : 'md:hidden'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Discount
            </label>
            <select
              value={minDiscount}
              onChange={(e) => setMinDiscount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="0">Any</option>
              <option value="10">10% or more</option>
              <option value="20">20% or more</option>
              <option value="30">30% or more</option>
              <option value="50">50% or more</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {showFilters && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filters & Sort</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Highest Discount</option>
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Discount
                  </label>
                  <select
                    value={minDiscount}
                    onChange={(e) => setMinDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="0">Any</option>
                    <option value="10">10% or more</option>
                    <option value="20">20% or more</option>
                    <option value="30">30% or more</option>
                    <option value="50">50% or more</option>
                  </select>
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      clearFilters()
                      setShowFilters(false)
                    }}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 p-4">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeft className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search with different keywords
              </p>
              <button
                onClick={clearFilters}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

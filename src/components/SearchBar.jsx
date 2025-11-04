import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'

export default function SearchBar({ products, placeholder = "Search products...", autoFocus = false }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const navigate = useNavigate()
  const searchRef = useRef(null)

  useEffect(() => {
    // Generate suggestions when search term changes
    if (searchTerm.trim().length > 0) {
      const filtered = products
        .filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5) // Limit to 5 suggestions

      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchTerm, products])

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.id}`)
    setSearchTerm('')
    setShowSuggestions(false)
  }

  const handleClear = () => {
    setSearchTerm('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text

    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="font-semibold text-primary">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <p className="text-xs text-gray-500 px-3 py-2">Suggestions</p>
            {suggestions.map((product) => {
              const finalPrice = product.discount
                ? (product.price * (1 - product.discount / 100)).toFixed(2)
                : product.price.toFixed(2)

              return (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {highlightMatch(product.name, searchTerm)}
                    </p>
                    {product.category && (
                      <p className="text-xs text-gray-500">
                        {highlightMatch(product.category, searchTerm)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">${finalPrice}</p>
                    {product.discount > 0 && (
                      <p className="text-xs text-gray-400 line-through">
                        ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {searchTerm.trim() && (
            <div className="border-t p-2">
              <button
                onClick={handleSearch}
                className="w-full px-3 py-2 text-sm text-primary hover:bg-orange-50 rounded-lg text-left font-medium"
              >
                View all results for "{searchTerm}"
              </button>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {showSuggestions && searchTerm.trim() && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-6 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-600 mb-1">No products found</p>
          <p className="text-sm text-gray-500">Try searching with different keywords</p>
        </div>
      )}
    </div>
  )
}

import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, Plus, Minus, ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../contexts/CartContext'

export default function ProductDetail({ products }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isInCart, getItemQuantity } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <button onClick={() => navigate('/')} className="text-primary underline">
            Go back home
          </button>
        </div>
      </div>
    )
  }

  const discountedPrice = product.discount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price.toFixed(2)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1))
  }

  const currentCartQuantity = getItemQuantity(product.id)

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button className="p-2">
            <Share2 className="w-6 h-6" />
          </button>
          <button className="p-2">
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-gray-100">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

        {product.description && (
          <p className="text-gray-600 mb-4">{product.description}</p>
        )}

        <div className="flex items-center gap-3 mb-6">
          {product.discount > 0 && (
            <span className="text-gray-400 text-lg line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
          <span className="text-primary text-2xl font-bold">
            ${discountedPrice}
          </span>
          {product.discount > 0 && (
            <span className="bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {product.category && (
          <div className="mb-4">
            <span className="text-sm text-gray-600">Category: </span>
            <span className="text-sm font-medium">{product.category}</span>
          </div>
        )}

        {/* Show current cart quantity if in cart */}
        {currentCartQuantity > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">
              <Check className="w-4 h-4 inline mr-1" />
              {currentCartQuantity} item{currentCartQuantity > 1 ? 's' : ''} in cart
            </p>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-2 block">Quantity</label>
          <div className="flex items-center gap-4">
            <button
              onClick={decrementQuantity}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={addedToCart}
            className={`flex-1 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              addedToCart
                ? 'bg-green-500 text-white'
                : 'bg-primary text-white hover:bg-orange-600'
            }`}
          >
            {addedToCart ? (
              <>
                <Check className="w-5 h-5" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

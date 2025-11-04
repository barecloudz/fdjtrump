import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

export default function Cart() {
  const navigate = useNavigate()
  const {
    cartItems,
    cartItemsCount,
    cartTotal,
    cartSubtotal,
    cartDiscount,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00'
  }

  const getItemPrice = (item) => {
    const price = item.price || 0
    const discount = item.discount || 0
    return price - (price * discount) / 100
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center z-10">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold ml-2">Shopping Cart</h1>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-center mb-6">
            Looks like you haven't added anything to your cart yet
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold ml-2">Shopping Cart</h1>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear your cart?')) {
              clearCart()
            }
          }}
          className="text-red-500 text-sm font-medium hover:text-red-600"
        >
          Clear All
        </button>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-3">
        {cartItems.map((item) => {
          const itemPrice = getItemPrice(item)
          const itemTotal = itemPrice * item.quantity

          return (
            <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">
                    {item.name}
                  </h3>

                  {item.category && (
                    <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-bold">
                      ${formatPrice(itemPrice)}
                    </span>
                    {item.discount > 0 && (
                      <>
                        <span className="text-gray-400 text-sm line-through">
                          ${formatPrice(item.price)}
                        </span>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                          {item.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Item Total */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-600">Item Total:</span>
                <span className="font-bold text-lg text-gray-800">
                  ${formatPrice(itemTotal)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cart Summary - Fixed Bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t shadow-lg">
        <div className="p-4 space-y-3">
          {/* Summary Details */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Subtotal ({cartItemsCount} item{cartItemsCount > 1 ? 's' : ''})
              </span>
              <span className="font-medium">${formatPrice(cartSubtotal)}</span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="text-green-600 font-medium">
                  -${formatPrice(cartDiscount)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-500 text-xs">Calculated at checkout</span>
            </div>

            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-2xl text-primary">
                ${formatPrice(cartTotal)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const hasDiscount = product.discount && product.discount > 0

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="relative aspect-square bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.discount}% OFF
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-gray-400 text-sm line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-primary font-bold">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-primary font-bold">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

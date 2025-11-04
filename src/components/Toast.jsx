import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white min-w-[300px]`}>
        {type === 'success' ? (
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
        ) : (
          <XCircle className="w-6 h-6 flex-shrink-0" />
        )}
        <p className="flex-1 font-medium">{message}</p>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

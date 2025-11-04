import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Onboarding() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: 'Hello',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non consectetur turpis. Morbi eu eleifend lacus.',
      emoji: '🛍️',
      gradient: 'from-pink-300 to-pink-400'
    },
    {
      title: 'Ready?',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      emoji: '👯‍♀️',
      gradient: 'from-blue-300 to-pink-300'
    }
  ]

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const handleStart = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full -translate-x-1/2 -translate-y-1/4"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100 rounded-full translate-x-1/3 -translate-y-1/4"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Main card */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Image section */}
          <div className={`h-96 bg-gradient-to-br ${slides[currentSlide].gradient} flex items-center justify-center`}>
            <div className="text-9xl">
              {slides[currentSlide].emoji}
            </div>
          </div>

          {/* Content section */}
          <div className="p-10 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {slides[currentSlide].title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {slides[currentSlide].description}
            </p>

            {/* Show button only on last slide */}
            {currentSlide === slides.length - 1 && (
              <button
                onClick={handleStart}
                className="w-full bg-blue-600 text-white text-xl font-medium py-5 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-blue-700"
              >
                Let's Start
              </button>
            )}
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex gap-3 mt-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-blue-600 w-8'
                  : 'bg-blue-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Touch/Click area for next slide (only if not on last slide) */}
      {currentSlide < slides.length - 1 && (
        <div
          onClick={handleNext}
          className="absolute inset-0 cursor-pointer z-0"
        />
      )}
    </div>
  )
}

export default Onboarding

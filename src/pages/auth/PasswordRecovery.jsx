import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PasswordRecovery() {
  const navigate = useNavigate()
  const [code, setCode] = useState(['', '', '', ''])
  const [phoneNumber] = useState('+98*******00')
  const [attempts, setAttempts] = useState(0)
  const [showError, setShowError] = useState(false)
  const inputRefs = [useRef(), useRef(), useRef(), useRef()]

  const handleInputChange = (index, value) => {
    if (value.length > 1) {
      value = value[0]
    }

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handleSendAgain = () => {
    if (attempts >= 3) {
      setShowError(true)
      return
    }
    setAttempts(attempts + 1)
    setCode(['', '', '', ''])
    inputRefs[0].current?.focus()
    // Here you would trigger the API to resend the code
    console.log('Resending code...')
  }

  const handleCancel = () => {
    navigate('/login')
  }

  const handleSubmit = () => {
    const fullCode = code.join('')
    if (fullCode.length === 4) {
      // Verify code logic here
      navigate('/setup-password')
    }
  }

  useEffect(() => {
    const fullCode = code.join('')
    if (fullCode.length === 4) {
      handleSubmit()
    }
  }, [code])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full translate-x-1/3 -translate-y-1/3"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Avatar */}
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center mb-8 shadow-xl">
          <div className="text-6xl">👩‍💼</div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Password Recovery</h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-6 max-w-sm">
          Enter 4-digits code we sent you on your phone number
        </p>

        {/* Phone number */}
        <p className="text-xl font-medium text-gray-800 mb-8">{phoneNumber}</p>

        {/* Code inputs */}
        <div className="flex gap-4 mb-16">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-16 text-center text-2xl font-semibold border-2 border-blue-200 rounded-full focus:border-blue-500 focus:outline-none transition-colors bg-blue-50"
            />
          ))}
        </div>

        {/* Send Again button */}
        <button
          onClick={handleSendAgain}
          className="w-full max-w-sm bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xl font-medium py-4 rounded-full mb-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          Send Again
        </button>

        {/* Cancel button */}
        <button
          onClick={handleCancel}
          className="text-gray-600 text-lg font-medium hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-pink-200 flex items-center justify-center">
                  <span className="text-pink-500 text-4xl font-bold">!</span>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-800 text-lg leading-relaxed mb-8">
              You reached out maximum amount of attempts. Please, try later.
            </p>
            <button
              onClick={() => {
                setShowError(false)
                navigate('/login')
              }}
              className="w-full bg-gray-900 text-white text-lg font-medium py-4 rounded-full hover:bg-gray-800 transition-colors"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PasswordRecovery

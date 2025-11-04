import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SetupNewPassword() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const handleSave = () => {
    if (newPassword && newPassword === repeatPassword) {
      // Save password logic here
      console.log('Password saved successfully')
      navigate('/onboarding')
    } else {
      alert('Passwords do not match!')
    }
  }

  const handleCancel = () => {
    navigate('/login')
  }

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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Setup New Password</h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-12 max-w-sm">
          Please, setup a new password for your account
        </p>

        {/* Form */}
        <div className="w-full max-w-md space-y-6 mb-16">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-6 py-5 bg-gray-50 border-0 rounded-2xl text-gray-400 placeholder-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full px-6 py-5 bg-gray-50 border-0 rounded-2xl text-gray-400 placeholder-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full max-w-md bg-blue-600 text-white text-xl font-medium py-5 rounded-full mb-6 shadow-lg hover:shadow-xl transition-shadow hover:bg-blue-700"
        >
          Save
        </button>

        {/* Cancel button */}
        <button
          onClick={handleCancel}
          className="text-gray-600 text-lg font-medium hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default SetupNewPassword

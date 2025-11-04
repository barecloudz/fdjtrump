import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, DollarSign, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { sendDonationConfirmationEmail } from '../services/emailService'

export default function Donate() {
  const navigate = useNavigate()
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  })

  const presetAmounts = [5, 10, 25, 50, 100, 250]

  const getDonationAmount = () => {
    if (selectedAmount === 'custom') {
      return parseFloat(customAmount) || 0
    }
    return selectedAmount || 0
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    const amount = getDonationAmount()
    if (!amount || amount <= 0) {
      newErrors.amount = 'Please select or enter a donation amount'
    } else if (amount < 1) {
      newErrors.amount = 'Minimum donation is $1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsProcessing(true)

    try {
      const donationAmount = getDonationAmount()

      // Create donation order in Supabase
      const { data: donation, error: donationError } = await supabase
        .from('donations')
        .insert({
          donor_name: `${formData.firstName} ${formData.lastName}`,
          donor_email: formData.email,
          amount: donationAmount,
          message: formData.message || null,
          status: 'completed'
        })
        .select()
        .single()

      if (donationError) {
        console.error('Error creating donation:', donationError)
        alert('There was an error processing your donation. Please try again.')
        return
      }

      // Send confirmation email
      try {
        await sendDonationConfirmationEmail(donation)
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
        // Don't block the flow if email fails
      }

      // Navigate to confirmation page
      navigate(`/donation-confirmation/${donation.id}`)
    } catch (error) {
      console.error('Error processing donation:', error)
      alert('There was an error processing your donation. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <Heart className="w-10 h-10" fill="white" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Help an Immigrant Today</h1>
            <p className="text-lg opacity-90">
              Your donation makes a real difference in someone's life
            </p>
          </div>
        </div>
      </div>

      {/* Donation Form */}
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Selection */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Select Donation Amount</h2>

            {/* Preset Amounts */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {presetAmounts.map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomAmount('')
                    setErrors(prev => ({ ...prev, amount: null }))
                  }}
                  className={`py-4 px-4 rounded-lg border-2 font-semibold transition-all ${
                    selectedAmount === amount
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setSelectedAmount('custom')
                  setErrors(prev => ({ ...prev, amount: null }))
                }}
                className={`w-full py-4 px-4 rounded-lg border-2 font-semibold mb-3 transition-all ${
                  selectedAmount === 'custom'
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                Custom Amount
              </button>

              {selectedAmount === 'custom' && (
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setErrors(prev => ({ ...prev, amount: null }))
                    }}
                    placeholder="Enter amount"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {errors.amount && (
              <p className="text-red-500 text-sm mt-2">{errors.amount}</p>
            )}
          </div>

          {/* Donor Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Your Information</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData({ ...formData, firstName: e.target.value })
                      setErrors(prev => ({ ...prev, firstName: null }))
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData({ ...formData, lastName: e.target.value })
                      setErrors(prev => ({ ...prev, lastName: null }))
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    setErrors(prev => ({ ...prev, email: null }))
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="3"
                  placeholder="Leave a message of support..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="max-w-2xl mx-auto">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" fill="white" />
                    Donate ${getDonationAmount().toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

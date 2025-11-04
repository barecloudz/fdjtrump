import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, Check, Home, Share2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function DonationConfirmation() {
  const { donationId } = useParams()
  const navigate = useNavigate()
  const [donation, setDonation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDonation()
  }, [donationId])

  const loadDonation = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('id', donationId)
        .single()

      if (error) throw error
      setDonation(data)
    } catch (error) {
      console.error('Error loading donation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: 'I just donated to help immigrants!',
      text: 'Join me in making a difference. Every contribution helps.',
      url: window.location.origin
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback - copy link
      navigator.clipboard.writeText(window.location.origin)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    )
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Donation not found</p>
          <button
            onClick={() => navigate('/')}
            className="text-orange-500 hover:underline"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 animate-bounce">
            <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold mb-3">Thank You!</h1>
          <p className="text-lg opacity-90">
            Your generous donation has been received
          </p>
        </div>
      </div>

      {/* Donation Details */}
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {/* Impact Message */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start">
            <Heart className="w-12 h-12 text-pink-500 mr-4 flex-shrink-0" fill="currentColor" />
            <div>
              <h2 className="text-xl font-semibold mb-2">You're Making a Difference!</h2>
              <p className="text-gray-600">
                Your ${donation.amount.toFixed(2)} donation will directly help immigrants in need.
                Thank you for your compassion and generosity.
              </p>
            </div>
          </div>
        </div>

        {/* Donation Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Donation Summary</h3>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Donation ID</span>
              <span className="font-mono text-sm">{donation.id.slice(0, 8)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Donor Name</span>
              <span className="font-medium">{donation.donor_name}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Email</span>
              <span className="text-sm">{donation.donor_email}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Date</span>
              <span>{new Date(donation.created_at).toLocaleDateString()}</span>
            </div>

            {donation.message && (
              <div className="py-2 border-b border-gray-100">
                <span className="text-gray-600 block mb-1">Your Message</span>
                <p className="text-sm italic text-gray-700">"{donation.message}"</p>
              </div>
            )}

            <div className="flex justify-between py-3 pt-4">
              <span className="text-lg font-semibold">Total Donation</span>
              <span className="text-2xl font-bold text-orange-500">
                ${donation.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            📧 A confirmation email has been sent to <strong>{donation.donor_email}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-lg font-semibold flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Your Impact
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </button>
        </div>

        {/* Additional Impact Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Your donation helps provide essential services, legal assistance,
            and support to immigrants building new lives.
          </p>
        </div>
      </div>
    </div>
  )
}

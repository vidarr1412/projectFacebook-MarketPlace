import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import emailjs from '@emailjs/browser'

export default function ListingDetail() {
  const { query } = useRouter()
  const [listing, setListing] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const formRef = useRef()

  useEffect(() => {
    if (query.id) {
      supabase
        .from('listings')
        .select('*')
        .eq('id', query.id)
        .single()
        .then(({ data }) => setListing(data))
    }
  }, [query.id])

  const handleSendEmail = async (e) => {
    e.preventDefault()
    setSending(true)

    try {
      const result = await emailjs.sendForm(
        'service_kgnzy01',
        'template_5430vjp',
        formRef.current,
        '2NJW8I3MXFf2Xs7EJ'
      )
      console.log(result.text)
      alert('Message sent successfully!')
      setMessage('')
    } catch (error) {
      console.error(error.text)
      alert('Failed to send message.')
    } finally {
      setSending(false)
    }
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18191a] text-white">
        <p className="text-lg text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#18191a] text-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-[#242526] rounded-2xl shadow-lg p-6">
        <img
          src={listing.image_url}
          alt={listing.title}
          className="w-full h-80 object-cover rounded-lg border border-[#3a3b3c]"
          onError={(e) => (e.target.src = '/placeholder.jpg')}
        />

        <div className="mt-6 space-y-3">
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <p className="text-gray-300 text-sm">Category: <span className="font-medium text-white">{listing.category}</span></p>
          <p className="text-lg text-white font-semibold">PHP{parseFloat(listing.price).toLocaleString()}</p>
          <p className="text-gray-300">{listing.description}</p>
        </div>

        <form ref={formRef} onSubmit={handleSendEmail} className="mt-8 space-y-4">
          {/* Hidden fields for EmailJS */}
          <input type="hidden" name="to_email" value={listing.email} />
          <input type="hidden" name="listing_title" value={listing.title} />

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Your Message to Seller:
            </label>
            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Type your message here..."
              className="w-full h-32 bg-[#3a3b3c] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className={`mt-2 px-6 py-2 rounded text-white font-medium transition ${
              sending ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {sending ? 'Sending...' : '📩 Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}

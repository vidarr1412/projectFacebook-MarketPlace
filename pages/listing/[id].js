import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import emailjs from '@emailjs/browser'
import { FiArrowLeft, FiBell, FiUser } from 'react-icons/fi'

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
      await emailjs.sendForm(
        'service_kgnzy01',
        'template_5430vjp',
        formRef.current,
        '2NJW8I3MXFf2Xs7EJ'
      )
      alert('Message sent successfully!')
      setMessage('')
    } catch (error) {
      console.error(error)
      alert('Failed to send message.')
    } finally {
      setSending(false)
    }
  }

  const getRelativeTime = (dateString) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInSeconds = Math.floor((now - past) / 1000)

    const units = [
      { name: 'year', seconds: 31536000 },
      { name: 'month', seconds: 2592000 },
      { name: 'day', seconds: 86400 },
      { name: 'hour', seconds: 3600 },
      { name: 'minute', seconds: 60 },
      { name: 'second', seconds: 1 },
    ]

    for (let unit of units) {
      const value = Math.floor(diffInSeconds / unit.seconds)
      if (value > 0) {
        return `${value} ${unit.name}${value > 1 ? 's' : ''} ago`
      }
    }

    return 'just now'
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Header */}
      <header className="h-14 bg-white dark:bg-gray-800 flex items-center justify-between px-4 sm:px-6 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 w-full z-50">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 w-8 h-8 flex items-center justify-center text-white font-bold rounded-full">F</div>
            <h1 className="text-lg font-semibold">Marketplace</h1>
          </a>
        </div>
     <div className="flex items-center gap-4 mr-4">

         <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                       <FiBell className="text-gray-600 dark:text-white text-lg" />
                     </button>
                     <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-semibold text-gray-700 dark:text-white">
                       <FiUser />
                     </div>
        </div>
      </header>

      {/* Go Back + Content */}
      <div className="pt-20 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Go Back Button */}
        <div className="mb-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
          >
            <FiArrowLeft />
            Go back to Home
          </a>
        </div>

        {/* Main Listing Content */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="w-full lg:w-2/3 bg-gray-200">
            <img
              src={listing.image_url}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = '/placeholder.jpg')}
            />
          </div>

          {/* Sidebar Details */}
          <div className="w-full lg:w-1/3 p-6 space-y-5">
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-xl font-semibold text-gray-800">₱{parseFloat(listing.price).toLocaleString()}</p>
            <p className="text-gray-600 text-sm">
              Listed {getRelativeTime(listing.created_at)}<br />
              <span className="text-gray-500">in {listing.location || 'Palo Alto, CA'}</span>
            </p>
            <p className="text-sm text-gray-500">Category: <span className="text-black">{listing.category}</span></p>

            <div>
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap">{listing.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Seller Information</h3>
              <p className="text-sm text-gray-700">{listing.email}</p>
            </div>

            <form ref={formRef} onSubmit={handleSendEmail} className="space-y-3 mt-6">
              <h3 className="font-semibold">Message Seller</h3>

              <input type="hidden" name="to_email" value={listing.email} />
              <input type="hidden" name="listing_title" value={listing.title} />

              <div>
                <label className="text-sm block text-gray-600">Your Email</label>
                <input
                  type="email"
                  name="from_email"
                  required
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 bg-white placeholder:text-gray-400"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="text-sm block text-gray-600">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 bg-white placeholder:text-gray-400 resize-none"
                  placeholder="I'm interested in your item!"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className={`w-full py-2 rounded text-white font-medium transition ${
                  sending ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

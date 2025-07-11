import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import {
  FiBell,
  FiUser,
  FiArrowLeft,
} from 'react-icons/fi'

export default function CreateListing() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    email: '',
    category: '',
    location: 'Palo Alto, CA',
  })
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef(null)

  const handleUpload = async () => {
    if (!image) throw new Error('No image selected.')
    const fileExt = image.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = fileName

    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(filePath, image, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data, error: urlError } = supabase.storage
      .from('listing-images')
      .getPublicUrl(filePath)

    if (urlError) throw urlError

    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      const imageUrl = await handleUpload()

      const { error } = await supabase.from('listings').insert([{
        ...form,
        price: parseFloat(form.price),
        image_url: imageUrl,
      }])

      if (error) throw error
      router.push('/')
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setPreviewUrl(null)
    fileInputRef.current.value = null
  }

  const triggerFileSelect = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Header */}
      <header className="h-14 bg-white dark:bg-gray-800 flex items-center justify-between px-4 sm:px-6 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 w-8 h-8 flex items-center justify-center text-white font-bold rounded-full">F</div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Marketplace</h1>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiBell className="text-gray-600 dark:text-white text-lg" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-semibold text-gray-700 dark:text-white">
            <FiUser />
          </div>
        </div>
      </header>

      {/* Go Back Button - always above title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-medium mb-4"
        >
          <FiArrowLeft />
          Go back to Home
        </a>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 sm:px-6 pb-10">
        {/* Left Form */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block mb-2 font-medium">Photos</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              {!previewUrl && (
                <div
                  onClick={triggerFileSelect}
                  className="cursor-pointer w-40 h-40 bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-gray-600 hover:bg-gray-300 transition"
                >
                  <span className="text-sm font-medium">Upload Photo</span>
                </div>
              )}
              {previewUrl && (
                <div className="relative w-full h-40 mt-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded border shadow"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-80"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                required
                placeholder="What are you selling?"
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                required
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800"
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                defaultValue=""
              >
                <option value="" disabled>Select a category</option>
                {[
                  'Vehicles', 'Property Rentals', 'Apparel', 'Classifieds',
                  'Electronics', 'Entertainment', 'Family', 'Free Stuff',
                  'Garden & Outdoor'
                ].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800"
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={form.location}
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                required
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 resize-none"
                rows={4}
                placeholder="Describe your item..."
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3 rounded text-white font-medium transition ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {uploading ? 'Uploading...' : 'Create Listing'}
            </button>
          </form>
        </div>

        {/* Right Preview */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-bold mb-4">Preview</h2>
          <div className="bg-white rounded-lg h-185 p-4">
            <div className="h-60 bg-gray-100 flex items-center justify-center overflow-hidden h-120">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="object-cover h-120 w-full" />
              ) : (
                <div className="text-gray-400 italic">No image selected</div>
              )}
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{form.title || 'Title'}</h3>
              <p className="text-xl font-bold text-gray-900 mb-4">
                {form.price ? `₱${parseFloat(form.price).toLocaleString()}` : 'Price'}
              </p>
              <p className="text-sm text-gray-500">
                Listed just now<br />
                in {form.location || 'Location'}
              </p>
              <p className="text-sm mt-2">
                <span className="text-xl font-bold text-gray-900 mb-4">Seller Information</span><br />
                {form.email || 'seller@email.com'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

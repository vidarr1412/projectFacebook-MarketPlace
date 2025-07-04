import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export default function CreateListing() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    email: '',
    category: ''
  })
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleUpload = async () => {
    if (!image) throw new Error('No image selected.')
    const fileExt = image.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = fileName

    const { error: uploadError } = await supabase
      .storage
      .from('listing-images')
      .upload(filePath, image, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload failed:', uploadError)
      throw uploadError
    }

    const { data, error: urlError } = supabase
      .storage
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

      const { error } = await supabase.from('listings').insert([
        {
          ...form,
          price: parseFloat(form.price),
          image_url: imageUrl
        }
      ])

      if (error) throw error
      router.push('/')
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#18191a] text-white py-10 px-4">
      <div className="max-w-2xl mx-auto bg-[#242526] p-8 rounded-2xl shadow-lg border border-[#3a3b3c]">
        <h1 className="text-3xl font-bold mb-6 text-center">Create a New Listing</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block mb-1 text-sm">Title</label>
            <input
              type="text"
              required
              className="w-full bg-[#3a3b3c] border border-[#555] text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm">Description</label>
            <textarea
              required
              rows={4}
              className="w-full bg-[#3a3b3c] border border-[#555] text-white p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 text-sm">Price (PHP)</label>
            <input
              type="number"
              required
              className="w-full bg-[#3a3b3c] border border-[#555] text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm">Contact Email</label>
            <input
              type="email"
              required
              className="w-full bg-[#3a3b3c] border border-[#555] text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Category */}
    <div>
  <label className="block mb-1 text-sm">Category</label>
  <select
    required
    className="w-full bg-[#3a3b3c] border border-[#555] text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={(e) => setForm({ ...form, category: e.target.value })}
    defaultValue=""
  >
    <option value="" disabled>Select a category</option>
    <option value="Electronics">Electronics</option>
    <option value="Clothing">Clothing</option>
    <option value="Books">Books</option>
    <option value="Home">Home</option>
    <option value="Toys">Toys</option>
    <option value="Food">Food</option>
  </select>
</div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 text-sm">Image</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-white bg-[#3a3b3c] p-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-3 rounded text-white font-medium transition ${
              uploading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {uploading ? 'Uploading...' : 'Submit Listing'}
          </button>
        </form>
      </div>
    </div>
  )
}

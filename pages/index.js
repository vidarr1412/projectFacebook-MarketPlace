import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { Button } from '../components/ui/button'
import { FiSun, FiMoon, FiBell, FiUser, FiSearch, FiPlusCircle } from 'react-icons/fi'
import { FiArchive, FiHelpCircle } from 'react-icons/fi'

export default function Home() {
  const [listings, setListings] = useState([])
  const [originalListings, setOriginalListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("latest")
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const categoryList = [
    'Vehicles', 'Property Rentals', 'Apparel', 'Classifieds',
    'Electronics', 'Entertainment', 'Family', 'Free Stuff',
    'Garden & Outdoor', 'Hobbies', 'Home Goods', 'Home Improvement',
    'Home Sales', 'Musical Instruments', 'Office Supplies', 'Pet Supplies',
    'Sporting Goods', 'Toys & Games', 'Buy and sell groups'
  ]

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error) {
        setListings(data)
        setOriginalListings(data)
      }

      setLoading(false)
    }

    fetchListings()
  }, [])

  useEffect(() => {
    let filtered = [...originalListings]

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((listing) =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter((listing) => listing.category === categoryFilter)
    }

    if (priceFilter === "low") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    } else if (priceFilter === "high") {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    }

    if (dateFilter === "latest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (dateFilter === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    }

    setListings(filtered)
  }, [searchQuery, priceFilter, dateFilter, categoryFilter, originalListings])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])
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

  return (
    
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Header */}
      <header className="h-14 bg-white dark:bg-gray-800 flex items-center justify-between px-4 sm:px-6 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button className="sm:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="h-6 w-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="bg-blue-600 w-8 h-8 flex items-center justify-center text-white font-bold rounded-full ml-[25px]">F</div>
          <h1 className="text-lg font-semibold">Marketplace</h1>
        </div>

        <div className="flex items-center gap-3 mr-[50px]">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
            {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
          </button>
          <div className="hidden sm:flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiBell className="text-gray-600 dark:text-white text-lg" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-semibold text-gray-700 dark:text-white">
              <FiUser />
            </div>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={`bg-white dark:bg-gray-800 w-100 ml-[50px] mt-[50px] p-4 space-y-6 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3.5rem)] overflow-y-auto z-20 fixed sm:relative transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}>
          <div className="space-y-2">
               <Button asChild className="w-full justify-start gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 h-14">
           
              <FiPlusCircle /> <Link href="/create">Create Listing</Link>
            </Button>
     <Button disabled className="w-full justify-start gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
  <FiArchive /> Your listings
</Button>

<Button disabled className="w-full justify-start gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
  <FiHelpCircle /> Seller help
</Button>

          </div>

         <div>
    <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-4">Filters</h2>
  </div>

  {/* Price and Date Filters */}
  <div className="space-y-3">
    <h3 className="text-sm font-bold text-gray-700 dark:text-white">Price</h3>
    <select
      value={priceFilter}
      onChange={(e) => setPriceFilter(e.target.value)}
      className="w-full p-2 border dark:bg-gray-700 dark:text-white rounded"
    >
      <option value="all">All</option>
      <option value="low">Lowest</option>
      <option value="high">Highest</option>
    </select>

    <h3 className="text-sm font-bold text-gray-700 dark:text-white">Date</h3>
    <select
      value={dateFilter}
      onChange={(e) => setDateFilter(e.target.value)}
      className="w-full p-2 border dark:bg-gray-700 dark:text-white rounded"
    >
      <option value="latest">Latest</option>
      <option value="oldest">Oldest</option>
    </select>
  </div>

  {/* Category Filter */}
  <div className="space-y-2 mt-6">
    <h3 className="text-sm font-bold text-gray-700 dark:text-white">Categories</h3>
    <ul className="space-y-1">
      {categoryList.map((cat) => (
        <li key={cat}>
          <button
            className={`w-full text-left px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 ${
              categoryFilter === cat ? 'bg-blue-200 dark:bg-blue-800 font-medium' : ''
            }`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        </li>
      ))}
    </ul>
  </div>
        </aside>

        {/* Listings */}
         <div className="ml-[-150px] mr-[50px]">
        <main className="flex-1 p-4 mt-[50px] sm:ml-64 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-10">Today's picks</h2>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-3">
          
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
  <div className="relative flex-1">
    <input
      type="text"
      placeholder="Search listings..."
      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded px-3 py-2 pr-10"
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <FiSearch className="absolute top-2.5 right-3 text-gray-500 dark:text-gray-300" />
  </div>
  <Button className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
    Search
  </Button>
</div>

          </div>

      {loading ? (
  <p className="text-gray-500 dark:text-gray-400">Loading listings...</p>
) : listings.length === 0 ? (
  <p className="text-gray-500 dark:text-gray-400">No listings found.</p>
) : (
  <div className="mr-[400px]">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {listings.map((listing) => (
        <Link key={listing.id} href={`/listing/${listing.id}`}>
          <div className="bg-white dark:bg-gray-800 rounded shadow hover:shadow-lg transition overflow-hidden cursor-pointer">
            <img
              src={listing.image_url}
              alt={listing.title}
              className="w-full h-48 object-cover"
              onError={(e) => (e.target.src = '/placeholder.jpg')}
            />

          <div className="p-3">
  <p className="font-semibold text-lg">
    ₱{parseFloat(listing.price).toLocaleString()}
  </p>
  <p className="text-sm">{listing.title}</p>
  <p className="text-xs text-gray-500 dark:text-gray-400">{listing.category}</p>
  <p className="text-xs text-gray-400 dark:text-gray-500 italic">
    {getRelativeTime(listing.created_at)}
  </p>
</div>

          </div>
        </Link>
      ))}
    </div>
  </div>
)}

        </main>
        </div>
      </div>
    </div>
  )
}

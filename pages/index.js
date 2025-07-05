import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { Button } from '../components/ui/button'
import {
  FiSun, FiMoon, FiBell, FiUser, FiSearch,
  FiPlusCircle, FiArchive, FiHelpCircle, FiHome,
  FiMonitor,
  FiShoppingBag,
  FiBookOpen,
  FiSmartphone,
  FiFilm,
  FiUsers,
  FiGift,

  FiHeart
} from 'react-icons/fi'

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
    'Garden & Outdoor', 'Hobbies'
  ]
// Match icon with each category in order:
const categoryIcons = {
  'Vehicles': <FiMonitor />,
  'Property Rentals': <FiHome />,
  'Apparel': <FiShoppingBag />,
  'Classifieds': <FiBookOpen />,
  'Electronics': <FiSmartphone />,
  'Entertainment': <FiFilm />,
  'Family': <FiUsers />,
  'Free Stuff': <FiGift />,
  'Garden & Outdoor': <FiSun />,
  'Hobbies': <FiHeart />
}
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
    document.documentElement.classList.toggle("dark", darkMode)
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
      {/* HEADER */}
      <header className="fixed top-0 left-0 z-50 w-full h-14 bg-white dark:bg-gray-800 flex items-center justify-between px-4 sm:px-6 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button className="sm:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="h-6 w-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <a href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 w-8 h-8 flex items-center justify-center text-white font-bold rounded-full">F</div>
            <h1 className="text-lg font-semibold">Marketplace</h1>
          </a>
        </div>
        <div className="flex items-center gap-3">
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

      {/* MAIN LAYOUT */}
      <div className="flex pt-14">
        {/* SIDEBAR */}
        <aside
  className={`bg-white dark:bg-gray-800 w-[260px] p-4 space-y-6 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3.5rem)] overflow-y-auto fixed sm:static top-14 left-0 z-40 transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 shadow-md sm:shadow-none`}
>
  {/* Primary Navigation */}
  <div className="space-y-2">
<Button
  asChild
  className="w-full justify-start gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-white bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 transition"
>
  <Link href="/create" className="flex items-center gap-3">
    <FiPlusCircle className="text-2xl" /> {/* Bigger and properly aligned */}
    <span>Create Listing</span>
  </Link>
</Button>

    <button
      disabled
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-not-allowed"
    >
      <FiArchive className="text-xl" />
      Your Listings
    </button>

    <button
      disabled
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-not-allowed"
    >
      <FiHelpCircle className="text-xl" />
      Seller Help
    </button>
  </div>

  {/* Filters Section */}
  <div>
    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Filters</h2>

    <div className="space-y-4">
      {/* Price Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-1">Price</h3>
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All</option>
          <option value="low">Lowest</option>
          <option value="high">Highest</option>
        </select>
      </div>

      {/* Date Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-1">Date</h3>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>

    {/* Categories */}
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Categories</h3>
      <ul className="space-y-1">
  {categoryList.map((cat) => (
  <li key={cat}>
    <button
      onClick={() => setCategoryFilter(cat)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition font-medium ${
        categoryFilter === cat
          ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-white'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <span className="text-lg">{categoryIcons[cat]}</span>
      <span>{cat}</span>
    </button>
  </li>
))}

      </ul>
    </div>
  </div>
</aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 sm:ml-[160px] px-4 sm:px-8 max-w-[1400px] mx-auto ">
          <h2 className="text-xl font-semibold mt-6 mb-4">Today's picks</h2>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-3 mb-6">
            <div className="relative w-full sm:w-auto flex-1">
              <input
                type="text"
                placeholder="Search listings..."
                className="w-full px-4 py-2 pr-10 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute top-2.5 right-3 text-gray-500 dark:text-gray-300" />
            </div>
            <div className="w-full sm:w-auto">
              <Button className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">Search</Button>
            </div>
          </div>

          {loading ? (
            <p>Loading listings...</p>
          ) : listings.length === 0 ? (
            <p>No listings found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      <p className="font-semibold text-lg">₱{parseFloat(listing.price).toLocaleString()}</p>
                      <p className="text-sm">{listing.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{listing.category}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 italic">{getRelativeTime(listing.created_at)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

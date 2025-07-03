import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import SearchBar from '../components/ui/search-bar'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'

export default function Home() {
  const [listings, setListings] = useState([])
  const [originalListings, setOriginalListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("latest")

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

    if (priceFilter === "low") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    } else if (priceFilter === "high") {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    }

    if (dateFilter === "latest") {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
    } else if (dateFilter === "oldest") {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      )
    }

    setListings(filtered)
  }, [searchQuery, priceFilter, dateFilter, originalListings])

  const categoryList = ["Electronics", "Clothing", "Books", "Home", "Toys", "Food"]

  return (
    <div className="min-h-screen bg-[#18191a] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Filters */}
        <div className="w-full max-w-[220px] space-y-6">
          
          {/* Search */}
          <SearchBar onSearch={setSearchQuery} />

          {/* Price Filter */}
          <div className="border border-[#3a3b3c] bg-[#242526] p-4 rounded-md space-y-2">
            <h2 className="text-lg font-semibold mb-2">Create New Listing</h2>

            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/create">Choose Listing Type</Link>
            </Button>

            <Button disabled className="w-full bg-[#3a3b3c] text-white cursor-not-allowed">
              Your Listings
            </Button>

            <Button disabled className="w-full bg-[#3a3b3c] text-white cursor-not-allowed">
              Seller Help
            </Button>
       
          <div className="flex flex-col items-start">
            
            <Label htmlFor="price-filter" className="text-xs text-gray-300 mb-1">Price</Label>
            <Select
              id="price-filter"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full"
            >
              <option value="all">All</option>
              <option value="low">Lowest</option>
              <option value="high">Highest</option>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col items-start">
            <Label htmlFor="date-filter" className="text-xs text-gray-300 mb-1">Date</Label>
            <Select
              id="date-filter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </Select>
          </div>

          {/* Category List */}
          <div className="flex flex-col items-start">
            <Label className="text-xs text-gray-300 mb-2">Categories</Label>
            <ul className="space-y-1 text-sm text-white">
              {categoryList.map((cat) => (
                <li key={cat} className="cursor-pointer hover:underline">
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Create New Listing Section */}
             </div>
        </div>

        {/* Main Listings */}
        <div className="flex-1">
          {loading ? (
            <p className="text-center text-gray-400 text-lg">Loading listings...</p>
          ) : listings.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">No listings found.</p>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {listings.map((listing) => (
                <Link key={listing.id} href={`/listing/${listing.id}`}>
                  <Card className="bg-[#242526] hover:shadow-xl transition-shadow rounded-md cursor-pointer">
                    <img
                      src={listing.image_url}
                      alt={listing.title}
                      className="w-full h-44 object-cover"
                      onError={(e) => (e.target.src = '/placeholder.jpg')}
                    />
                    <CardContent className="p-2">
                      <p className="text-white font-semibold text-sm mb-1">
                        PHP{parseFloat(listing.price).toLocaleString()}
                      </p>
                      <p className="text-white text-sm leading-tight truncate">
                        {listing.title}
                      </p>
                      <p className="text-gray-400 text-xs">{listing.category}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

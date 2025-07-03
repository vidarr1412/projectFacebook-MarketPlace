import { useState } from "react"

export default function SearchBar({ placeholder = "Search listings...", onSearch }) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full sm:max-w-sm flex items-center bg-[#3a3b3c] rounded-md px-3 py-2 shadow-sm">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
      />
      <button type="submit" className="text-blue-400 hover:text-blue-500 ml-2">
        🔍
      </button>
    </form>
  )
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="bg-[#3a3b3c] text-white px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </select>
  )
}

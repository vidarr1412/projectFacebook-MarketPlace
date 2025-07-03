import React from "react"

export function Button({ children, className = "", asChild = false, ...props }) {
  const Comp = asChild ? "span" : "button"
  return (
    <Comp
      className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition ${className}`}
      {...props}
    >
      {children}
    </Comp>
  )
}

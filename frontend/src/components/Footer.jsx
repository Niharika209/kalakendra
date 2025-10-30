import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-100 py-6">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
        <div className="text-sm">© {new Date().getFullYear()} Kalakendra. All rights reserved.</div>
      </div>
    </footer>
  )
}

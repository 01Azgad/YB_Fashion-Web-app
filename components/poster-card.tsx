"use client"

import React, { useState } from "react"

export default function PosterCard({ src, alt }: { src: string; alt?: string }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="flex-none w-36 md:w-48 lg:w-56 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-md bg-gray-900">
        <img
          src={src}
          alt={alt || "design"}
          className={`w-full h-52 md:h-64 object-cover transition-transform duration-300 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        {/* Hover overlay with gradient */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
            <p className="text-white text-sm font-semibold truncate">{alt || "Design"}</p>
          </div>
        )}
      </div>
    </div>
  )
}

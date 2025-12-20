"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface ParallaxGalleryProps {
  className?: string
}

export function ParallaxGallery({ className }: ParallaxGalleryProps) {
  const [scrollY, setScrollY] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const images = [
    "/images/choir-bcfc.png",
    "/images/choir-lpep.png",
    "/images/choir-b2b-2.png",
    "/images/choir-b2b-1.png",
    "/images/choir-tet.png",
    "/images/choir-tcc.png",
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    // Change active image every 5 seconds
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(interval)
    }
  }, [images.length])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* Images */}
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
            index === activeImageIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={`DLSU Chorale performance ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Musical note decorations */}
      <div className="absolute top-10 left-10 text-white/10 text-7xl z-20 transform -rotate-12">♪</div>
      <div className="absolute bottom-20 right-10 text-white/10 text-8xl z-20 transform rotate-12">♫</div>
      <div className="absolute top-1/3 right-20 text-white/10 text-6xl z-20 transform rotate-45">♩</div>
      <div className="absolute bottom-1/3 left-20 text-white/10 text-9xl z-20 transform -rotate-6">♬</div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09331f]/50 to-transparent z-20" />
    </div>
  )
}

"use client"

import React, { useState, useEffect } from "react"

type Props = {
  image?: string
  video?: string
  title?: string
  subtitle?: string
  cta?: string
  ctaHref?: string
}

export default function ShowcaseHero({
  image,
  video,
  title = "Bespoke Fashion, Tailored to You",
  subtitle = "Connect with Nigeria''s finest tailors. Get custom African fashion delivered to your door.",
  cta = "Get Started",
  ctaHref = "/customize",
}: Props) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(!!video)

  useEffect(() => {
    setIsVideoLoaded(!!video)
  }, [video])

  return (
    <section className="relative w-full h-screen max-h-[700px] bg-black overflow-hidden">
      {video ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={video}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setIsVideoLoaded(true)}
          onError={() => setIsVideoLoaded(false)}
        />
      ) : image ? (
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={image}
          alt={title}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black drop-shadow-xl leading-tight max-w-4xl">
          {title}
        </h2>
        <p className="mt-6 max-w-3xl text-xl md:text-2xl text-white/95 drop-shadow-lg font-light">
          {subtitle}
        </p>
        <div className="mt-8">
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded bg-white px-8 py-3 font-bold text-black transition-all duration-200 hover:bg-white/90 hover:shadow-lg active:scale-95"
          >
            {cta}
            <span>›</span>
          </a>
        </div>
      </div>
    </section>
  )
}

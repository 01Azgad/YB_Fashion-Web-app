"use client"

import React from "react"
import PosterCard from "./poster-card"

type Item = { src: string; alt?: string }

export default function Row({ title, items }: { title: string; items: Item[] }) {
  return (
    <section className="px-4 md:px-8 py-8 bg-gradient-to-b from-background/50 to-background">
      <h3 className="mb-4 text-xl md:text-2xl font-bold text-foreground">{title}</h3>
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
        {items.map((it, i) => (
          <PosterCard key={i} src={it.src} alt={it.alt} />
        ))}
      </div>
    </section>
  )
}

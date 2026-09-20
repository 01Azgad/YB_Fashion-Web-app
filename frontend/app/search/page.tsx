"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Star, ArrowLeft } from "lucide-react"

const categories = ["All", "Men", "Women", "Traditional", "Weddings"]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  
  // NEW: State for our fetched tailors
  const [tailors, setTailors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // NEW: Fetch tailors from Django on mount
  useEffect(() => {
    const fetchTailors = async () => {
      try {
        // We will need to make sure this endpoint exists in your Django backend!
        const response = await fetch('http://127.0.0.1:8000/api/tailors/')
        if (response.ok) {
          const data = await response.json()
          setTailors(data)
        }
      } catch (error) {
        console.error('Failed to fetch tailors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTailors()
  }, [])

  // Filter logic: matches both the search text and the selected category
  const filteredTailors = tailors.filter((tailor) => {
    // Adding fallbacks just in case some backend fields are null
    const tailorName = tailor.business_name || tailor.username || "Unknown Tailor"
    const tailorSpecialty = tailor.specialty || "General"
    const tailorCategory = tailor.category || "All"

    const matchesSearch = tailorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tailorSpecialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || tailorCategory === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur px-4 py-4">
        <div className="container mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tailors, specialties, or styles..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Find Your Tailor</h1>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tailors Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">Loading tailors...</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTailors.length > 0 ? (
              filteredTailors.map((tailor) => (
                <Card key={tailor.id} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4 border-2 border-primary/10">
                      <AvatarImage src={tailor.profile_image ? `http://127.0.0.1:8000${tailor.profile_image}` : ""} />
                      <AvatarFallback className="bg-primary/5 text-xl font-semibold text-primary">
                        {(tailor.business_name || tailor.username || "T").substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="font-semibold text-lg text-foreground">{tailor.business_name || tailor.username}</h3>
                    
                    <div className="flex items-center gap-1 mt-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= (tailor.rating || 5) ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                        />
                      ))}
                    </div>

                    <Badge variant="secondary" className="mb-6">
                      {tailor.specialty || "Bespoke Tailoring"}
                    </Badge>

                    <Link href={`/tailor/${tailor.id}`} className="w-full mt-auto">
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Portfolio
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No tailors found</p>
                <p className="text-sm">Try adjusting your search or category filter.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
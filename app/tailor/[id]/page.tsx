"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Search,
  Menu,
  Star,
  MapPin,
  MessageSquare,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect, use } from "react"
import { BrandLogo } from "@/components/brand-logo"

const navLinks = [
  { label: "Men", href: "#" },
  { label: "Women", href: "#" },
  { label: "Traditional", href: "#" },
  { label: "Weddings", href: "#" },
]

const reviews = [
  {
    id: 1,
    author: "Ngozi Okafor",
    rating: 5,
    text: "Adaeze is absolutely incredible! My wedding dress was perfect - exactly what I envisioned. Her attention to detail is unmatched. Highly recommend!",
    date: "2 weeks ago",
  },
  {
    id: 2,
    author: "Chidi Okoro",
    rating: 5,
    text: "Best tailor in Abuja! My suit fit perfectly and the craftsmanship is top-notch. The entire process was smooth and professional.",
    date: "1 month ago",
  },
  {
    id: 3,
    author: "Aminata Bello",
    rating: 4,
    text: "Very satisfied with my Ankara dress. Beautiful work and great communication throughout. Will definitely order again!",
    date: "1.5 months ago",
  },
  {
    id: 4,
    author: "Kehinde Adigun",
    rating: 5,
    text: "My traditional outfit turned out amazing. Adaeze understood my vision and brought it to life beautifully. Worth every naira!",
    date: "2 months ago",
  },
]

function Header() {
  // Check for logged in user state
  const [user, setUser] = useState<{name: string} | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse user data")
      }
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <BrandLogo textClassName="hidden font-semibold text-foreground sm:inline-block" />

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden flex-1 max-w-md mx-8 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tailors, styles..."
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <Link href="/dashboard">
              <Avatar className="h-9 w-9 cursor-pointer border border-primary/20 transition-opacity hover:opacity-80">
                <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col gap-6 pt-6">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tailors, styles..."
                  className="w-full pl-10"
                />
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-2 pt-4 border-t">
                {user ? (
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full">Go to Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full">Log In</Button>
                    </Link>
                    <Link href="/signup" className="w-full">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-primary text-primary"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  )
}

function Footer() {
  const footerLinks = [
    { label: "Support", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
  ]

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ]

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo */}
          <BrandLogo variant="dark" textClassName="font-semibold" />

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-background/70 transition-colors hover:text-background"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="text-background/70 transition-colors hover:text-background"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-background/10 pt-8 text-center">
          <p className="text-sm text-background/50">
            {new Date().getFullYear()} YB Fashion Design. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Accept params to get the dynamic ID from the URL
export default function TailorProfilePage({ params }: { params: Promise<{id: string }> }) {
  const resolvedParams = use(params)
  const tailorId = resolvedParams.id
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  
  // State for dynamically fetched portfolio items
  const [portfolioItems, setPortfolioItems] = useState([])
  const [ tailorInfo, setTailorInfo ] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch Portfolio Items on component mount based on the specific Tailor ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Appended the tailor_id parameter to ensure we only get this tailor's work
        const [portfolioRes, tailorRes] = await Promise.all ([
          fetch(`http://127.0.0.1:8000/api/portfolio/?tailor_id=${tailorId}`),
          fetch(`http://127.0.0.1:8000/api/tailors/${tailorId}/`)
        ]);
        if (portfolioRes.ok) {
          const pData = await portfolioRes.json()
          setPortfolioItems(pData)
        }

        if (tailorRes.ok) {
          const tData = await tailorRes.json()
          setTailorInfo(tData)
        }
      } catch (error) {
        console.error('Failed to fetch portfolio:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [tailorId]) // Added tailorId as a dependency

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Profile Header Section */}
        <div className="relative">
          {/* Banner Background */}
          <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/10 md:h-64" />

          {/* Profile Content */}
          <div className="container mx-auto px-4">
            <div className="relative -mt-24 flex flex-col items-center gap-6 md:-mt-32 md:flex-row md:items-end md:gap-8">
              {/* Profile Picture - Overlapping Banner */}
              <div className="relative">
                <Avatar className="h-48 w-48 border-4 border-background shadow-lg md:h-56 md:w-56">
                  <AvatarImage
                    src="/tailor-profile.jpg"
                    alt="Adaeze Okonkwo"
                  />
                  <AvatarFallback className="bg-primary/10 text-4xl font-semibold text-primary">
                    AO
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="flex-1 pb-4 text-center md:text-left">
                <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                  {tailorInfo?.business_name || tailorInfo?.username || "Loading..."}
                </h1>

                <div className="mt-2 flex items-center justify-center gap-2 md:justify-start">
                  <StarRating rating={tailorInfo?.rating || 5} />
                  <span className="text-sm font-medium text-foreground">
                    {tailorInfo?.rating || 5}.0 (Reviews coming soon)
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-center gap-2 text-muted-foreground md:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{tailorInfo?.location || "Nigeria"}</span>
                </div>

                <p className="mt-4 max-w-md text-foreground">
                  {tailorInfo?.bio || "Expert tailor specializing in bespoke fashion."}
                </p>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                  <Link 
                    href={`/messages?tailor_id=${tailorId}&tailor_name=${encodeURIComponent(tailorInfo?.business_name || tailorInfo?.username || 'Tailor')}`} 
                    className="w-full sm:w-auto"
                  >
                    <Button variant="outline" size="lg" className="w-full gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Message Tailor
                    </Button>
                  </Link>
                  
                  <Link 
                    href={`/measurements?tailor_id=${tailorId}&tailor_name=${encodeURIComponent(tailorInfo?.business_name || tailorInfo?.username || 'Tailor')}`} 
                    className="w-full sm:w-auto"
                  >
                    <Button size="lg" className="w-full">Book This Tailor</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Portfolio
              </h2>
              <p className="mt-2 text-muted-foreground">
                Explore a selection of bespoke creations
              </p>
            </div>

            {/* DYNAMIC Masonry Grid */}
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading gorgeous designs...</p>
            ) : portfolioItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No designs uploaded yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {portfolioItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-secondary/10">
                      <img
                        src={`http://127.0.0.1:8000${item.image}`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div
                      className={`absolute inset-0 flex items-end bg-gradient-to-t from-foreground/80 via-transparent to-transparent transition-opacity duration-300 ${
                        hoveredItem === item.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="w-full p-4 text-background">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm font-bold text-primary">₦{item.price}</p>
                        <p className="text-sm text-background/80 line-clamp-1 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="bg-secondary/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Customer Reviews
              </h2>
              <p className="mt-2 text-muted-foreground">
                What clients say about working with Adaeze
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="flex flex-col transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="flex flex-col gap-4 p-6">
                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-foreground leading-relaxed">
                      {review.text}
                    </p>

                    {/* Author */}
                    <div className="border-t pt-4">
                      <p className="font-semibold text-foreground">
                        {review.author}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
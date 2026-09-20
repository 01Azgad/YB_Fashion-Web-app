"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BrandLogo } from "@/components/brand-logo"
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
  Users,
  Ruler,
  Truck,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react"
import Link from "next/link"
import ShowcaseHero from "@/components/showcase-hero"
import Row from "@/components/row"

const heroVideos = [
  "/videos/hero-1.mp4",
  "/videos/hero-2.mp4",
  "/videos/hero-3.mp4",
  "/videos/hero-4.mp4",
]

const navLinks = [
  { label: "Men", href: "#" },
  { label: "Women", href: "#" },
  { label: "Traditional", href: "#" },
  { label: "Weddings", href: "#" },
]

const featuredTailors = [
  {
    id: 1,
    name: "Adaeze Okonkwo",
    avatar: "",
    initials: "AO",
    rating: 5,
    specialty: "Bridal",
  },
  {
    id: 2,
    name: "Chukwuma Nwosu",
    avatar: "",
    initials: "CN",
    rating: 4,
    specialty: "Senator Styles",
  },
  {
    id: 3,
    name: "Fatima Bello",
    avatar: "",
    initials: "FB",
    rating: 5,
    specialty: "Ankara",
  },
  {
    id: 4,
    name: "Olumide Adeyemi",
    avatar: "",
    initials: "OA",
    rating: 4,
    specialty: "Agbada",
  },
]

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <BrandLogo
          href="/"
          className=""
          textClassName="hidden font-semibold text-foreground sm:inline-block"
        />

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

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>

        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col gap-6 pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tailors, styles..."
                  className="w-full pl-10"
                />
              </div>

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

              <div className="flex flex-col gap-2 pt-4 border-t">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      icon: Users,
      title: "Browse Portfolios",
      description:
        "Explore skilled tailors and their work. View ratings, specialties, and previous creations to find your perfect match.",
    },
    {
      icon: Ruler,
      title: "Submit Measurements",
      description:
        "Use our digital measurement guide to submit accurate sizes. Choose from premium fabrics and customize every detail.",
    },
    {
      icon: Truck,
      title: "Track & Receive",
      description:
        "Monitor your order in real-time from cutting to stitching. Get your bespoke garment delivered right to your doorstep.",
    },
  ]

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Get your custom outfit in three simple steps
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center"
            >
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+40px)] top-8 hidden h-0.5 w-[calc(100%-80px)] bg-border md:block" />
              )}

              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                  {index + 1}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
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

function FeaturedTailorsSection() {
  return (
    <section className="bg-secondary/50 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Featured Tailors
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover top-rated craftsmen in your area
            </p>
          </div>
          <Button variant="ghost" className="hidden sm:flex">
            View All
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTailors.map((tailor) => (
            <Card
              key={tailor.id}
              className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage src={tailor.avatar} alt={tailor.name} />
                  <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                    {tailor.initials}
                  </AvatarFallback>
                </Avatar>

                <h3 className="mt-4 font-semibold text-foreground">
                  {tailor.name}
                </h3>

                <StarRating rating={tailor.rating} />

                <Badge variant="secondary" className="mt-3">
                  {tailor.specialty}
                </Badge>

                <Link href={`/tailor/${tailor.id}`} className="mt-4 w-full block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    View Portfolio
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline">View All Tailors</Button>
        </div>
      </div>
    </section>
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
          <BrandLogo variant="dark" textClassName="font-semibold" />

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

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("")

  useEffect(() => {
    const randomVideo = heroVideos[Math.floor(Math.random() * heroVideos.length)]
    setVideoUrl(randomVideo)
  }, [])

  const sampleItems = [
    { src: "/native-wear.jpg", alt: "Native Wear" },
    { src: "/ankara-dress.jpg", alt: "Ankara Dress" },
    { src: "/suit-bespoke.jpg", alt: "Bespoke Suit" },
    { src: "/agbada-traditional.jpg", alt: "Traditional Agbada" },
    { src: "/wedding-dress.jpg", alt: "Wedding Dress" },
    { src: "/tailor-profile.jpg", alt: "Custom Design" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <ShowcaseHero
          video={videoUrl}
          title="Bespoke Fashion, Tailored to You"
          subtitle="Connect with Nigeria's finest tailors. From traditional Agbada to modern Senator styles, get custom African fashion delivered to your door."
          cta="Get Started"
          ctaHref="/customize"
        />
        <section className="bg-background">
          <HowItWorksSection />
          <FeaturedTailorsSection />

          <div className="bg-gradient-to-b from-background to-black/5 px-0 py-12">
            <Row title="Featured Designs" items={sampleItems} />
            <Row title="Popular Right Now" items={sampleItems.slice(0, 5)} />
            <Row title="Trending Styles" items={sampleItems.slice(1)} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

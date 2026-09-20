'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Search,
  Menu,
  Upload,
  HelpCircle,
  X,
  ShoppingCart,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { BrandLogo } from '@/components/brand-logo'

const navLinks = [
  { label: 'Men', href: '#' },
  { label: 'Women', href: '#' },
  { label: 'Traditional', href: '#' },
  { label: 'Weddings', href: '#' },
]

const garmentTypes = [
  { id: 'agbada', name: 'Agbada', image: '/agbada-traditional.jpg' },
  { id: 'senator', name: 'Senator Style', image: '/suit-bespoke.jpg' },
  { id: 'suit', name: 'Bespoke Suit', image: '/suit-bespoke.jpg' },
  { id: 'dress', name: 'Custom Dress', image: '/wedding-dress.jpg' },
  { id: 'ankara', name: 'Ankara Design', image: '/ankara-dress.jpg' },
  { id: 'native', name: 'Native Wear', image: '/native-wear.jpg' },
]

const fabricOptions = [
  { id: 'cotton', name: 'Premium Cotton', color: '#E8E0D5' },
  { id: 'silk', name: 'Silk Blend', color: '#D4A574' },
  { id: 'wool', name: 'Fine Wool', color: '#4A4A4A' },
  { id: 'linen', name: 'Linen', color: '#F5E6D3' },
  { id: 'ankara', name: 'Ankara Print', color: '#C94C4C' },
  { id: 'damask', name: 'Gold Damask', color: '#D4AF37' },
]

const measurementFields = [
  { id: 'neck', label: 'Neck', placeholder: 'e.g., 15.5' },
  { id: 'chest', label: 'Chest', placeholder: 'e.g., 38.0' },
  { id: 'waist', label: 'Waist', placeholder: 'e.g., 32.0' },
  { id: 'hips', label: 'Hips', placeholder: 'e.g., 38.5' },
  { id: 'sleeve', label: 'Sleeve Length', placeholder: 'e.g., 24.5' },
  { id: 'trouser', label: 'Trouser Length', placeholder: 'e.g., 30.0' },
]

function Header() {
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
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm">
            Log In
          </Button>
          <Button size="sm">Sign Up</Button>
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
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
                <Button className="w-full">Sign Up</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-16 border-t bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <BrandLogo
              className="mb-4"
              variant="dark"
              textClassName="font-semibold text-background"
            />
            <p className="text-sm text-background/80">
              Connecting you with skilled tailors for bespoke African fashion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Browse Tailors
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Become a Tailor
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-background mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-background mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-sm text-background/60">
          <p>&copy; 2024 YB Fashion Design. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function FloatingLabelInput({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
      <input
        type="text"
        id={id}
        placeholder=" "
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="peer w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-transparent transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:bg-background peer-focus:px-1 peer-focus:text-primary peer-focus:-translate-y-full"
      >
        {label}
      </label>
      {(isFocused || value) && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          inches
        </span>
      )}
    </div>
  )
}

export default function CustomizePage() {
  const [selectedGarment, setSelectedGarment] = useState('agbada')
  const [selectedFabric, setSelectedFabric] = useState('cotton')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [measurements, setMeasurements] = useState({
    neck: '',
    chest: '',
    waist: '',
    hips: '',
    sleeve: '',
    trouser: '',
  })

  const handleMeasurementChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setMeasurements((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Calculate estimated price based on garment and fabric
  const estimatedPrice = 150 + (selectedGarment.length * 10)
  const estimatedTime = '5-7 business days'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Customize Your Order
            </h1>
            <p className="text-muted-foreground">
              Create your perfect bespoke outfit with our easy customization tool
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content - 3 columns */}
            <div className="lg:col-span-3 space-y-8">
              {/* Section 1: Style & Fabric Selection */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Select Your Style</CardTitle>
                  <CardDescription>
                    Choose the garment type that best suits your needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Garment Type Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Garment Type
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {garmentTypes.map((garment, index) => (
                  <button
                    key={garment.id}
                    onClick={() => setSelectedGarment(garment.id)}
                    className={`relative overflow-hidden rounded-lg transition-all ${
                      selectedGarment === garment.id
                        ? 'ring-2 ring-primary shadow-md'
                        : 'ring-1 ring-border hover:shadow-md'
                    }`}
                  >
                    <div className="relative w-full aspect-square bg-muted">
                      <Image
                        src={garment.image}
                        alt={garment.name}
                        fill
                        className="object-cover"
                        priority={index < 2}
                      />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                          </div>
                          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3">
                            <span className="text-white text-sm font-medium">
                              {garment.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fabric Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Fabric Type & Color
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {fabricOptions.map((fabric) => (
                        <button
                          key={fabric.id}
                          onClick={() => setSelectedFabric(fabric.id)}
                          className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                            selectedFabric === fabric.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-md border border-border/50 shadow-sm"
                            style={{ backgroundColor: fabric.color }}
                          />
                          <span className="text-sm font-medium text-foreground">
                            {fabric.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reference Photo Upload */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Reference Photo (Optional)
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="reference-photo"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {uploadedImage ? (
                        <div className="space-y-4">
                          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={uploadedImage}
                              alt="Uploaded reference"
                              fill
                              className="object-cover"
                            />
                            <button
                              onClick={() => setUploadedImage(null)}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <label htmlFor="reference-photo">
                            <Button
                              type="button"
                              variant="outline"
                              className="cursor-pointer"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Change Photo
                            </Button>
                          </label>
                        </div>
                      ) : (
                        <label
                          htmlFor="reference-photo"
                          className="cursor-pointer block"
                        >
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium text-foreground mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 10MB
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-4 mx-auto"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Reference Photo
                          </Button>
                        </label>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Digital Measurements */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Your Measurements</CardTitle>
                  <CardDescription>
                    Provide precise measurements in inches for perfect fit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {measurementFields.map((field) => (
                      <TooltipProvider key={field.id}>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor={field.id}
                              className="text-sm font-medium text-foreground"
                            >
                              {field.label}
                            </Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="inline-flex items-center justify-center">
                                  <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <p className="text-xs">
                                  {field.id === 'neck' &&
                                    'Measure around the base of your neck'}
                                  {field.id === 'chest' &&
                                    'Measure around the fullest part of your chest'}
                                  {field.id === 'waist' &&
                                    'Measure around your natural waistline'}
                                  {field.id === 'hips' &&
                                    'Measure around the fullest part of your hips'}
                                  {field.id === 'sleeve' &&
                                    'Measure from shoulder to wrist'}
                                  {field.id === 'trouser' &&
                                    'Measure from waist to ankle'}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FloatingLabelInput
                            id={field.id}
                            label={field.label}
                            placeholder={field.placeholder}
                            value={measurements[field.id as keyof typeof measurements]}
                            onChange={(e) => {
                              setMeasurements((prev) => ({
                                ...prev,
                                [field.id]: e.target.value,
                              }))
                            }}
                          />
                        </div>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sticky Order Summary - Right Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Details */}
                  <div className="space-y-3 pb-4 border-b">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                        Garment Type
                      </p>
                      <p className="font-medium text-foreground">
                        {garmentTypes.find((g) => g.id === selectedGarment)
                          ?.name || 'Select a garment'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                        Fabric
                      </p>
                      <p className="font-medium text-foreground">
                        {fabricOptions.find((f) => f.id === selectedFabric)
                          ?.name || 'Select fabric'}
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Base Price
                      </span>
                      <span className="font-semibold text-foreground">
                        ${estimatedPrice}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-lg font-bold text-primary">
                        ${estimatedPrice}
                      </span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
                      Estimated Time
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {estimatedTime}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base">
                    Proceed to Secure Payment
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    All prices in USD. Secure checkout powered by Stripe.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

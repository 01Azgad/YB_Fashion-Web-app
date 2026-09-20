"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Search,
  Menu,
  Upload,
  X,
  Ruler,
  ImageIcon,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BrandLogo } from "@/components/brand-logo"
import { useRouter, useSearchParams } from "next/navigation"

const navLinks = [
  { label: "Men", href: "#" },
  { label: "Women", href: "#" },
  { label: "Traditional", href: "#" },
  { label: "Weddings", href: "#" },
]

interface MeasurementField {
  id: string
  label: string
  placeholder: string
  unit: string
}

const measurementFields: MeasurementField[] = [
  { id: "neck", label: "Neck", placeholder: "14.5", unit: "inches" },
  { id: "chest", label: "Chest", placeholder: "38", unit: "inches" },
  { id: "waist", label: "Waist", placeholder: "32", unit: "inches" },
  { id: "sleeve_length", label: "Sleeve Length", placeholder: "24", unit: "inches" },
  { id: "trouser_length", label: "Trouser Length", placeholder: "40", unit: "inches" },
]

function FloatingLabelInput({
  id,
  label,
  placeholder,
  unit,
  value,
  onChange,
}: MeasurementField & {
  value: string
  onChange: (value: string) => void
}) {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = (value || "").length > 0
  const isFloating = isFocused || hasValue

  return (
    <div className="relative">
      <div className="relative">
        <Input
          id={id}
          type="number"
          step="0.5"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFloating ? placeholder : ""}
          className="h-14 pt-5 pb-2 px-4 text-base peer"
          aria-label={label}
        />
        <label
          htmlFor={id}
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${isFloating
              ? "top-2 text-xs text-primary font-medium"
              : "top-1/2 -translate-y-1/2 text-base text-muted-foreground"
            }
          `}
        >
          {label}
        </label>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {unit}
        </span>
      </div>
    </div>
  )
}

function Header() {
  const router = useRouter()
  // Add state to track the logged-in user
  const [user, setUser] = useState<{ name: string } | null>(null)

  // On component mount, check if the user is in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse user data", error)
      }
    }
  }, [])

  // Handle logging out
  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
    router.push("/login") // Or redirect to homepage
  }

  // Derive a safe display name and initial. localStorage `user` shape may vary
  const displayName = (user && (user as any).name) || (user && (user as any).username) || (user && (user as any).email) || null
  const displayInitial = displayName && typeof displayName === "string" && displayName.length > 0
    ? displayName.charAt(0).toUpperCase()
    : "?"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <BrandLogo textClassName="hidden font-semibold text-foreground sm:inline-block" />

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

        {/* Desktop Auth/Avatar Section */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
              {/* Dynamic Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
                {displayInitial}
              </div>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation Sheet */}
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

              {/* Mobile Auth/Avatar Section */}
              <div className="flex flex-col gap-4 pt-4 border-t">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                        {displayInitial}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">Logged in as</span>
                        <span className="text-sm text-muted-foreground">{displayName ?? "User"}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
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

interface UploadedImage {
  id: string
  file: File
  preview: string
}

function PhotoUploadSection({
  images,
  onUpload,
  onRemove,
}: {
  images: UploadedImage[]
  onUpload: (files: FileList) => void
  onRemove: (id: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      onUpload(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-foreground">
        <ImageIcon className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Reference Photos</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Upload photos of styles you like or existing garments for reference
      </p>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="relative cursor-pointer rounded-lg border-2 border-dashed border-input bg-secondary/30 p-8 text-center transition-colors hover:border-primary hover:bg-secondary/50"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && onUpload(e.target.files)}
          className="sr-only"
          aria-label="Upload reference photos"
        />
        <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-4 text-sm font-medium text-foreground">
          Drag and drop or click to upload
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG up to 10MB each
        </p>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
            >
              <Image
                src={image.preview}
                alt={`Reference photo: ${image.file.name}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(image.id)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground/80 text-background opacity-0 transition-opacity hover:bg-foreground group-hover:opacity-100"
                aria-label={`Remove ${image.file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/60 to-transparent p-2">
                <p className="truncate text-xs text-background">
                  {image.file.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <BrandLogo
              variant="dark"
              iconContainerClassName="h-8 w-8"
              textClassName="text-sm font-medium"
            />
          </div>
          <p className="text-sm text-background/60">
            {new Date().getFullYear()} YB Fashion Design. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Extract the main content into a separate component to use useSearchParams safely
function MeasurementsForm() {
  const searchParams = useSearchParams()
  const tailorId = searchParams.get("tailor_id")
  const tailorName = searchParams.get("tailor_name")

  const [measurements, setMeasurements] = useState<Record<string, string>>({
    neck: "",
    chest: "",
    waist: "",
    sleeve_length: "",
    trouser_length: "",
  })

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleMeasurementChange = (id: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [id]: value }))
  }

  const handleImageUpload = (files: FileList) => {
    const newImages: UploadedImage[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${file.name}`,
      file,
      preview: URL.createObjectURL(file),
    }))
    setUploadedImages((prev) => [...prev, ...newImages])
  }

  const handleImageRemove = (id: string) => {
    setUploadedImages((prev) => {
      const image = prev.find((img) => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.preview)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // 1. Create FormData to handle both text and files
      const formData = new FormData()
      
      formData.append("tailor_id", tailorId || "")
      formData.append("measurements", JSON.stringify(measurements)) // Send measurements as a JSON string
      
      // Append each uploaded image file
      uploadedImages.forEach((img) => {
        formData.append("reference_photos", img.file) 
      })

      // 2. Get the auth token if the user needs to be logged in to order
      const token = localStorage.getItem("access_token")

      // 3. Make the actual request to your Django API
      const response = await fetch("http://127.0.0.1:8000/api/orders/", { // <-- Update this URL to match your Django endpoint
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` 
          // Note: DO NOT set "Content-Type" manually when using FormData. 
          // The browser sets it automatically with the correct boundary.
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }

      const data = await response.json()
      alert(`Order submitted successfully to ${tailorName || 'the tailor'}!`)
      
      // Optional: Clear the form or redirect the user here
      
    } catch (error) {
      console.error("Submission error:", error)
      alert("Failed to submit the order. Please check your connection or try logging in again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = Object.values(measurements).every((v) => v.length > 0)

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Page Header */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Ruler className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Submit Your Measurements
            </h1>
            
            {/* Display Tailor's Name if passed in URL */}
            {tailorName && (
              <p className="mt-2 text-lg font-semibold text-primary">
                Booking Order for: {tailorName}
              </p>
            )}

            <p className="mt-3 text-muted-foreground">
              Provide accurate measurements for your custom garment. Need help?{" "}
              <Link href="#" className="text-primary hover:underline">
                View our measurement guide
              </Link>
            </p>
          </div>

          {/* Form Card */}
          <Card className="mx-auto mt-10 max-w-2xl">
            <CardHeader className="border-b pb-6">
              <CardTitle className="text-xl">Body Measurements</CardTitle>
              <CardDescription>
                Enter your measurements in inches for the best fit
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Measurement Fields */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {measurementFields.map((field) => (
                    <FloatingLabelInput
                      key={field.id}
                      {...field}
                      value={measurements[field.id] || ""}
                      onChange={(value) =>
                        handleMeasurementChange(field.id, value)
                      }
                    />
                  ))}
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Reference Photos
                    </span>
                  </div>
                </div>

                {/* Photo Upload */}
                <PhotoUploadSection
                  images={uploadedImages}
                  onUpload={handleImageUpload}
                  onRemove={handleImageRemove}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Order"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By submitting, you agree to our{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Wrap the component that uses `useSearchParams` in Suspense
export default function MeasurementsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <MeasurementsForm />
    </Suspense>
  )
}
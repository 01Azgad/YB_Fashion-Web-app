'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BrandLogo } from '@/components/brand-logo'

export default function SignUpPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // 1. ADDED: New fields for the Tailor profile
    businessName: '',
    specialty: '',
    location: '',
  })
  const [role, setRole] = useState<'customer' | 'tailor'>('customer')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    setIsLoading(true)

    try {
      // 2. ADDED: Dynamic URL routing based on the role
      const endpoint = role === 'tailor' 
        ? 'http://127.0.0.1:8000/api/tailors/register/' // Our new VIP tailor route
        : 'http://127.0.0.1:8000/api/users/'            // Standard customer route

      // 3. ADDED: Dynamic data payload based on the role
      const payload = role === 'tailor' 
        ? {
            username: formData.email,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            password: formData.password,
            business_name: formData.businessName,
            specialty: formData.specialty,
            location: formData.location
          }
        : {
            username: formData.email,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            password: formData.password
          }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert(`${role === 'tailor' ? 'Tailor' : 'Customer'} account created successfully! Please log in.`)
        router.push('/login') 
      } else {
        const errorData = await response.json()
        console.error("Backend error details:", errorData)
        alert('Registration failed. Please check the form and try again.')
      }
    } catch (error) {
      console.error('Signup failed:', error)
      alert('Something went wrong. Is your Django server running?')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <BrandLogo withText={false} imageClassName="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl text-foreground">Create Account</CardTitle>
          <CardDescription>Join YB Fashion Design marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Toggle */}
            <div className="flex gap-2 rounded-lg border border-border bg-muted p-1">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  role === 'customer'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('tailor')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  role === 'tailor'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Tailor
              </button>
            </div>

            {/* Standard Fields (Always visible) */}
            <div className="relative">
              <Input type="text" id="firstName" placeholder=" " value={formData.firstName} onChange={handleInputChange} className="peer" required />
              <label htmlFor="firstName" className="pointer-events-none absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground peer-focus:-top-2 peer-focus:text-xs peer-focus:text-foreground">First Name</label>
            </div>

            <div className="relative">
              <Input type="text" id="lastName" placeholder=" " value={formData.lastName} onChange={handleInputChange} className="peer" required />
              <label htmlFor="lastName" className="pointer-events-none absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground peer-focus:-top-2 peer-focus:text-xs peer-focus:text-foreground">Last Name</label>
            </div>

            <div className="relative">
              <Input type="email" id="email" placeholder=" " value={formData.email} onChange={handleInputChange} className="peer" required />
              <label htmlFor="email" className="pointer-events-none absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground peer-focus:-top-2 peer-focus:text-xs peer-focus:text-foreground">Email Address</label>
            </div>

            {/* 4. ADDED: Tailor-Specific Fields (Only visible if role === 'tailor') */}
            {role === 'tailor' && (
              <>
                <div className="relative">
                  <Input type="text" id="businessName" placeholder=" " value={formData.businessName} onChange={handleInputChange} className="peer" required />
                  <label htmlFor="businessName" className="pointer-events-none absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground peer-focus:-top-2 peer-focus:text-xs peer-focus:text-foreground">Business Name</label>
                </div>
                
                <div className="relative">
                  <Input type="text" id="specialty" placeholder=" " value={formData.specialty} onChange={handleInputChange} className="peer" required />
                  <label htmlFor="specialty" className="pointer-events-none absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground peer-focus:-top-2 peer-focus:text-xs peer-focus:text-foreground">Specialty (e.g. Senator, Agbada)</label>
                </div>

                <div className="relative">
                  <Input type="text" id="location" placeholder=" " value={formData.location} onChange={handleInputChange} className="peer" required />
                  <label htmlFor="location" className="pointer-events-none absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground peer-focus:-top-2 peer-focus:text-xs peer-focus:text-foreground">Location (City)</label>
                </div>
              </>
            )}

            {/* Standard Password Fields */}
            <div className="relative">
              <Input type="password" id="password" placeholder=" " value={formData.password} onChange={handleInputChange} className="peer" required />
              <label htmlFor="password" className="pointer-events-none absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground peer-focus:-top-2 peer-focus:text-xs peer-focus:text-foreground">Password</label>
            </div>

            <div className="relative">
              <Input type="password" id="confirmPassword" placeholder=" " value={formData.confirmPassword} onChange={handleInputChange} className="peer" required />
              <label htmlFor="confirmPassword" className="pointer-events-none absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground peer-focus:-top-2 peer-focus:text-xs peer-focus:text-foreground">Confirm Password</label>
            </div>

            {/* Register Button */}
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>
          </form>

          {/* Terms & Privacy */}
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By registering, you agree to our <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
          </p>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
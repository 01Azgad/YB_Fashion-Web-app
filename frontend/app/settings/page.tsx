'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, User, Lock, Save, Loader2 } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

export default function SettingsPage() {
  const router = useRouter()
  
  // State to hold user data
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch the user's current data when the page loads
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        // Adjust this URL to match your Django endpoint for fetching the logged-in user!
        // Often this is something like /api/users/me/ or /api/users/profile/
        const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setProfile({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
          })
        } else if (response.status === 401) {
          localStorage.removeItem('access_token')
          router.push('/login')
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  // Handle saving the updated information back to Django
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const token = localStorage.getItem('access_token')
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
        method: 'PATCH', // We use PATCH to partially update the user record
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: profile.first_name,
          last_name: profile.last_name,
          // Usually, you don't let users change their email easily without verification,
          // but we are including it here if your backend supports it!
          email: profile.email, 
        })
      })

      if (response.ok) {
        alert("Profile updated successfully!")
      } else {
        // CHANGE THIS PART: Read the response as text (HTML) instead of JSON so we can see the error
        const errorText = await response.text()
        console.error("Django returned this error:", errorText)
        alert("Failed to update profile. Check the console for the Django error.")
      }
    } catch (error) {
      console.error("API Error:", error)
      alert("Something went wrong.")
    } finally {
      setIsSaving(false)
    }
  }

  // Helper to handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 sm:px-6 max-w-5xl mx-auto">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex-1" />
          <BrandLogo variant="dark" text="Settings" textClassName="font-semibold hidden sm:inline" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-8 mt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">First Name</label>
                    <Input 
                      name="first_name" 
                      value={profile.first_name} 
                      onChange={handleChange}
                      placeholder="e.g. Benjamen"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Last Name</label>
                    <Input 
                      name="last_name" 
                      value={profile.last_name} 
                      onChange={handleChange}
                      placeholder="e.g. Abba"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Email Address</label>
                  <Input 
                    name="email" 
                    type="email" 
                    value={profile.email} 
                    onChange={handleChange}
                    placeholder="benjamenabba@gmail.com"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Security Card (Visual Placeholder for now) */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage your password and account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To keep your account secure, you can update your password at any time.
              </p>
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
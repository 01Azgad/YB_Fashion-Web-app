'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BrandLogo } from '@/components/brand-logo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: email, password: password })
      })
      
      if (response.ok) {
        const data = await response.json()

        // 1. Save the auth tokens
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)

        // 2. Load the canonical profile from Django so we have the real username/email
        const profileResponse = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        })

        const profile = profileResponse.ok ? await profileResponse.json() : null

        const tokenPayload = JSON.parse(atob(data.access.split('.')[1]))
        const storedUser = {
          id: profile?.id ?? tokenPayload.user_id,
          username: profile?.username ?? email.split('@')[0],
          email: profile?.email ?? email,
          first_name: profile?.first_name ?? '',
          last_name: profile?.last_name ?? '',
          is_tailor: profile?.is_tailor ?? tokenPayload.is_tailor,
        }

        localStorage.setItem('user', JSON.stringify(storedUser))

        // 3. Route the user based on the custom flag we added in Django
        if (storedUser.is_tailor === true) {
          router.push('/admin') // Takes tailors to the Tailor Dashboard
        } else {
          router.push('/dashboard') // Takes customers to the standard dashboard
        }
        
      } else {
        alert('Invalid credentials. Please try again.')
      }
    } catch (error) {
      console.error('Login failed:', error)
      alert('Something went wrong. Is your Django server running?')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <BrandLogo withText={false} imageClassName="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl text-foreground">Sign In</CardTitle>
          <CardDescription>Welcome back to YB Fashion Design</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <Input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer"
                required
              />
              <label
                htmlFor="email"
                className="pointer-events-none absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground peer-focus:-top-2 peer-focus:text-xs peer-focus:text-foreground"
              >
                Email Address
              </label>
            </div>

            {/* Password Field */}
            <div className="relative">
              <Input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer"
                required
              />
              <label
                htmlFor="password"
                className="pointer-events-none absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground peer-focus:-top-2 peer-focus:text-xs peer-focus:text-foreground"
              >
                Password
              </label>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Forgot Password Link */}
          <p className="mt-4 text-center text-sm">
            <Link
              href="#"
              className="text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </p>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
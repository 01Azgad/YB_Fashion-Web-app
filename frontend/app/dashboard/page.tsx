'use client'

import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { BrandLogo } from '@/components/brand-logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ChatWidget from '@/components/ChatWidget'
import {
  Package,
  Ruler,
  MessageSquare,
  Settings,
  Menu,
  X,
  Send,
  Paperclip,
  Home,
  LogOut,
  Search,
} from 'lucide-react'

const navLinks = [
  { icon: Search, label: 'Find Tailors', href: '/search' },
  { icon: Ruler, label: 'Measurement Profile', href: '/measurements' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

const socket = io("http://localhost:4000")

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const router = useRouter()
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/login')
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 bg-foreground text-white transform transition-transform duration-200 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <BrandLogo variant="dark" text="Dashboard" textClassName="font-semibold hidden sm:inline text-white" />
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 hover:bg-white/10 rounded"><X className="h-5 w-5" /></button>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.label} href={link.href} onClick={() => setIsOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left text-sm">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link href="/"><button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm"><Home className="h-5 w-5" /><span>Back to Home</span></button></Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-destructive/20 transition-colors text-sm text-destructive"><LogOut className="h-5 w-5" /><span>Logout</span></button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [measurements, setMeasurements] = useState<any>(null)
  const [activeOrder, setActiveOrder] = useState<any>(null) 
  const [currentUser, setCurrentUser] = useState<{ id: number | null; username?: string | null; email?: string | null } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const currentUserId = currentUser?.id ?? null

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')
    if (!token) { router.push('/login'); return }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setCurrentUser({
          id: parsedUser.id ?? null,
          username: parsedUser.username ?? parsedUser.name ?? null,
          email: parsedUser.email ?? null,
        })
      } catch (error) {
        console.error('Failed to parse stored user', error)
      }
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setCurrentUser((prev) => prev ?? { id: payload.user_id ?? null })
    } catch (error) {
      console.error('Failed to parse token payload', error)
    }

    const fetchDashboardData = async () => {
      try {
        const measRes = await fetch('http://127.0.0.1:8000/api/measurements/', { headers: { 'Authorization': `Bearer ${token}` } })
        if (measRes.ok) { const data = await measRes.json(); if (data.length > 0) setMeasurements(data[0]) }

        const orderRes = await fetch('http://127.0.0.1:8000/api/orders/', { headers: { 'Authorization': `Bearer ${token}` } })
        if (orderRes.ok) {
          const orderData = await orderRes.json()
          const ordersArray = orderData.results ? orderData.results : orderData
          if (ordersArray && ordersArray.length > 0) setActiveOrder(ordersArray[0])
        }
      } catch (error) { console.error("Fetch error", error) } finally { setIsLoading(false) }
    }
    fetchDashboardData()
  }, [router]) 

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between px-6 border-b">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu /></button>
          <div className="flex-1" />
          <Link href="/" className="text-sm font-medium text-primary hover:underline">Back to Home</Link>
        </header>

        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2 overflow-y-auto space-y-6">
            <Card>
              <CardHeader><CardTitle>Active Order</CardTitle></CardHeader>
              <CardContent>
                {activeOrder ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium capitalize">Status: {activeOrder.status}</p>
                    <p className="text-xs text-muted-foreground">{activeOrder.style_description}</p>
                  </div>
                ) : <p className="text-sm text-muted-foreground">No active orders found.</p>}
              </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Measurements</CardTitle></CardHeader>
                <CardContent>
                    {measurements ? (
                        <div className="flex gap-10">
                            <div><p className="text-xs text-muted-foreground">Chest</p><p className="font-bold">{measurements.chest}"</p></div>
                            <div><p className="text-xs text-muted-foreground">Waist</p><p className="font-bold">{measurements.waist}"</p></div>
                        </div>
                    ) : <p className="text-sm text-muted-foreground">No measurements profile.</p>}
                </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 overflow-hidden flex flex-col bg-card rounded-xl border shadow-sm">
            <ChatWidget 
              orderId={activeOrder?.id || null}
              currentUser={currentUser || { id: null }}
              tailorUserId={
                activeOrder && currentUserId !== null
                  ? (currentUserId === activeOrder.customer
                    ? activeOrder.tailor_user_id
                    : activeOrder.customer)
                  : null
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
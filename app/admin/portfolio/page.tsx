'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { BrandLogo } from '@/components/brand-logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Menu, X, DollarSign, Package, MessageSquare, Star, 
  Bell, Eye, Search, Home, LogOut, User as UserIcon, Image as ImageIcon,
  Send, Paperclip
} from 'lucide-react'

// --- CONNECT TO NODE SERVER ---
const socket = io("http://localhost:4000")

// --- STATIC DATA FOR NOW ---
const metricCards = [
  { label: 'Total Earnings', value: '₦0', icon: DollarSign, color: 'text-primary', bgColor: 'bg-primary/10' },
  { label: 'Active Orders', value: '0', icon: Package, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { label: 'Pending Messages', value: '0', icon: MessageSquare, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  { label: 'Average Rating', value: '0.0', icon: Star, color: 'text-amber-400', bgColor: 'bg-amber-400/10' },
]

const notifications = [
  { id: 1, type: 'payment', message: 'Payment received from Amara Okafor', amount: '₦150,000', time: '2 hours ago', icon: DollarSign },
  { id: 2, type: 'measurement', message: 'New measurement submitted by Chidi Nwosu', time: '4 hours ago', icon: Package },
  { id: 3, type: 'message', message: 'Zainab Hassan sent you a message', time: '1 hour ago', icon: MessageSquare },
  { id: 4, type: 'review', message: 'New 5-star review from Tunde Adeyemi', time: '6 hours ago', icon: Star },
  { id: 5, type: 'message', message: 'Ife Okonkwo sent progress photos', time: '3 hours ago', icon: MessageSquare },
]

// --- SIDEBAR COMPONENT ---
function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/login')
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`fixed left-0 top-16 z-30 h-screen w-64 bg-foreground text-white transform transition-transform duration-200 lg:relative lg:top-0 lg:h-screen lg:z-0 lg:translate-x-0 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <BrandLogo variant="dark" textClassName="font-bold text-white" />
          </div>

          <nav className="flex-1 space-y-2 p-4">
            <Link href="/admin" className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium bg-white/10 transition-colors">
              <Home size={18} /> Dashboard
            </Link>
            <Link href="/admin/portfolio" className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors">
              <ImageIcon size={18} /> My Portfolio
            </Link>
            <Link href="/admin/messages" className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors">
              <MessageSquare size={18} /> Messages
            </Link>
            <Link href="/admin/profile" className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors">
              <UserIcon size={18} /> Profile Settings
            </Link>
          </nav>

          <div className="border-t border-white/10 p-4">
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-white hover:bg-white/10">
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

// --- TAILOR CHAT WIDGET COMPONENT ---
function TailorChatWidget({ customerId, customerName }: { customerId: number | null, customerName: string }) { 
  const [messages, setMessages] = useState<{id: string, text: string, sender: string}[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 1. FETCH CHAT HISTORY ON LOAD (Only if we have a customerId)
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!customerId) return // Don't fetch if no customer is selected

      const token = localStorage.getItem('access_token')
      if (!token) return

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/messages/${customerId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          const formattedMessages = data.map((msg: any) => ({
            id: msg.id.toString(),
            text: msg.text,
            sender: msg.sender_name.toLowerCase().includes('tailor') ? 'Tailor' : 'Customer'
          }))
          setMessages(formattedMessages)
        }
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }

    fetchChatHistory()
  }, [customerId])

  // 2. LISTEN FOR LIVE SOCKET MESSAGES
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => {
        if (prev.some(m => m.id === data.id)) return prev;
        return [...prev, data];
      })
    })
    return () => {
      socket.off("receive_message")
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // NEW: Join the specific Socket.io room for this customer
  useEffect(() => {
    if (customerId) {
      socket.emit("join_room", customerId)
    }
  }, [customerId])

  // 3. SEND & SAVE MESSAGE
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentMessage.trim() === "" || !customerId) return

    const messageText = currentMessage
    const tempId = Date.now().toString()
    
    setCurrentMessage("")

    const messageData = {
      id: tempId,
      text: messageText,
      sender: "Tailor", 
      customerId: customerId,
    }

    setMessages((prev) => [...prev, messageData])
    socket.emit("send_message", messageData)

    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        await fetch(`http://127.0.0.1:8000/api/messages/${customerId}/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: messageText })
        })
      } catch (error) {
        console.error("Failed to save message to database:", error)
      }
    }
  }

  // EMPTY STATE: If no customer is selected
  if (!customerId) {
    return (
      <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-card rounded-xl border shadow-sm sticky top-24 opacity-60 p-6 text-center">
        <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Active Chat</h3>
        <p className="text-sm text-muted-foreground">
          Select "Chat" on any recent order from the dashboard to start messaging the customer.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full min-h-[600px] max-h-[800px] flex flex-col bg-card rounded-xl border shadow-sm sticky top-24">
      {/* Chat header */}
      <div className="p-4 border-b bg-card rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-muted flex items-center justify-center rounded-full">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{customerName}</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'Tailor' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-lg ${
                  msg.sender === 'Tailor'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted text-foreground rounded-bl-none'
                }`}
              >
                <p className="text-[10px] opacity-70 mb-1 font-semibold">{msg.sender}</p>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-60">
            <MessageSquare className="h-10 w-10 mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs text-muted-foreground">Say hello to {customerName}!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-card rounded-b-xl">
        <div className="flex gap-2">
          <button type="button" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </button>
          <Input
            placeholder="Type a reply..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="flex-1"
          />
          <button 
            type="submit" 
            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors disabled:opacity-50" 
            disabled={!currentMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

// --- MAIN DASHBOARD COMPONENT ---
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Dynamic Data State
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Chat Widget State
  const [activeChatUserId, setActiveChatUserId] = useState<number | null>(null)
  const [activeChatUserName, setActiveChatUserName] = useState<string>("Customer")

  const router = useRouter()

  // Fetch Data when component loads
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('access_token')
      
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/orders/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        } else if (response.status === 401) {
          router.push('/login')
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 py-4 lg:px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-muted rounded-lg">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-foreground">Tailor Dashboard</h1>
          <button className="p-2 hover:bg-muted rounded-lg relative">
            <Bell size={20} className="text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT COLUMN (Dashboard Content) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metricCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                        <div className={`p-2 rounded-lg ${card.bgColor}`}>
                          <Icon className={`${card.color}`} size={18} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-foreground">{card.value}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Orders Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Manage and track all customer orders</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Search size={18} className="text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Garment Details</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-4">Loading orders...</TableCell></TableRow>
                      ) : orders.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-4">No orders found.</TableCell></TableRow>
                      ) : (
                        orders.map((order: any) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium text-primary">#ORD-{order.id}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{order.style_description}</TableCell>
                            <TableCell>₦{order.total_price}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(order.status)}>
                                {order.status ? order.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                              </Badge>
                            </TableCell>
                            <TableCell className="flex gap-2">
                              {/* VIEW BUTTON */}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-primary hover:bg-primary/10"
                                onClick={() => {
                                  setSelectedOrder(order)
                                  setIsModalOpen(true)
                                }}
                              >
                                <Eye size={16} className="mr-1" /> View
                              </Button>

                              {/* CHAT BUTTON */}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-amber-500 hover:bg-amber-500/10"
                                onClick={() => {
                                  // Uses order.customer (or order.customer_id based on your Django serializer)
                                  setActiveChatUserId(order.customer || order.customer_id) 
                                  setActiveChatUserName(order.customer_name || `Customer #${order.customer || order.customer_id}`)
                                }}
                              >
                                <MessageSquare size={16} className="mr-1" /> Chat
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* System Activity & Stats Container */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Recent Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>System Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.slice(0, 4).map((notif) => {
                      const Icon = notif.icon
                      return (
                        <div key={notif.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                          <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                            <Icon size={16} className="text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{notif.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold text-foreground">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Satisfaction</span>
                      <span className="font-semibold text-foreground">92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">On-Time Delivery</span>
                      <span className="font-semibold text-foreground">78%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* RIGHT COLUMN (Chat Widget) */}
          <div className="lg:col-span-1 h-full">
            <TailorChatWidget 
              customerId={activeChatUserId} 
              customerName={activeChatUserName} 
            />
          </div>

          {/* --- ORDER DETAILS MODAL --- */}
          {isModalOpen && selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <Card className="w-full max-w-2xl shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                  <div>
                    <CardTitle className="text-xl">Order #ORD-{selectedOrder.id}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Customer: <span className="font-semibold text-foreground">{selectedOrder.customer_name || 'N/A'}</span>
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                    <X size={20} />
                  </Button>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-6">
                  {/* Measurements Section */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Package size={18} className="text-primary"/> 
                      Customer Measurements
                    </h3>
                    {selectedOrder.measurement_details ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/50 p-4 rounded-lg text-sm">
                        <div><span className="text-muted-foreground block mb-1">Profile Name</span> <span className="font-medium">{selectedOrder.measurement_details.profile_name}</span></div>
                        <div><span className="text-muted-foreground block mb-1">Neck</span> <span className="font-medium">{selectedOrder.measurement_details.neck} inches</span></div>
                        <div><span className="text-muted-foreground block mb-1">Chest</span> <span className="font-medium">{selectedOrder.measurement_details.chest} inches</span></div>
                        <div><span className="text-muted-foreground block mb-1">Waist</span> <span className="font-medium">{selectedOrder.measurement_details.waist} inches</span></div>
                        <div><span className="text-muted-foreground block mb-1">Sleeve Length</span> <span className="font-medium">{selectedOrder.measurement_details.sleeve_length} inches</span></div>
                        <div><span className="text-muted-foreground block mb-1">Trouser Length</span> <span className="font-medium">{selectedOrder.measurement_details.trouser_length} inches</span></div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">No digital measurements were attached to this order.</p>
                    )}
                  </div>

                  {/* Style Description Section */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Style & Fabric Details</h3>
                    <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg">
                      {selectedOrder.style_description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {/* --- END MODAL --- */}
        </main>
      </div>
    </div>
  )
}
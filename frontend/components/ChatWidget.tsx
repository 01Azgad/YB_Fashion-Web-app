"use client"

import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, Send } from 'lucide-react'

// Initialize socket here so the widget always has connection
const socket = io("http://localhost:4000")

type ChatMessage = {
  id: string
  text: string
  sender: number | string
  sender_name?: string
  sender_email?: string
  sender_display_name?: string
  receiver_name?: string
  receiver_email?: string
  receiver_display_name?: string
  is_mine?: boolean
  other_party_display_name?: string
  other_party_email?: string
}

type CurrentUser = {
  id: number | null
  username?: string | null
  email?: string | null
}

function normalizeMessage(message: any): ChatMessage {
  return {
    id: String(message.id),
    text: message.text,
    sender: message.sender,
    sender_name: message.sender_name,
    sender_email: message.sender_email,
    sender_display_name: message.sender_display_name,
    receiver_name: message.receiver_name,
    receiver_email: message.receiver_email,
    receiver_display_name: message.receiver_display_name,
    is_mine: typeof message.is_mine === 'boolean' ? message.is_mine : undefined,
    other_party_display_name: message.other_party_display_name,
    other_party_email: message.other_party_email,
  }
}

function isOwnMessage(message: ChatMessage, currentUser: CurrentUser) {
  if (typeof message.is_mine === 'boolean') {
    return message.is_mine
  }

  if (!currentUser.id && !currentUser.username && !currentUser.email) {
    return false
  }

  const senderIdMatches = currentUser.id !== null && String(message.sender) === String(currentUser.id)
  const senderNameMatches = currentUser.username
    ? [message.sender_name, message.sender_display_name].filter(Boolean).includes(currentUser.username)
    : false
  const senderEmailMatches = currentUser.email
    ? [message.sender_email, message.sender_display_name].filter(Boolean).includes(currentUser.email)
    : false

  return senderIdMatches || senderNameMatches || senderEmailMatches
}

function getMessageLabel(message: ChatMessage, currentUser: CurrentUser) {
  if (isOwnMessage(message, currentUser)) {
    return 'You'
  }

  return (
    message.other_party_display_name ||
    message.sender_display_name ||
    message.sender_name ||
    message.sender_email ||
    message.other_party_email ||
    message.receiver_display_name ||
    message.receiver_name ||
    message.receiver_email ||
    'User'
  )
}

export default function ChatWidget({ orderId, currentUser, tailorUserId }: { orderId: number | null; currentUser: CurrentUser; tailorUserId: number | null; }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!orderId || !tailorUserId) return

    const token = localStorage.getItem('access_token')

    // 1. Fetch History from Django (Permanence)
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/messages/${tailorUserId}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
            setMessages(data.map((message: any) => normalizeMessage(message)))
        }
      } catch (err) { console.error("Chat history failed", err) }
    }

    fetchHistory()

    // 2. Join the private order room for real-time updates
    socket.emit("join_order_chat", orderId)

    socket.on("receive_message", (data) => {
      if (data.orderId === orderId) {
        setMessages((prev) => {
          const incoming = normalizeMessage({
            ...data,
            is_mine: false,
          })
          if (prev.some((msg) => msg.id === incoming.id)) return prev
          return [...prev, incoming]
        })
      }
    })

    return () => { socket.off("receive_message") }
  }, [orderId, tailorUserId])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentMessage.trim() || !orderId || !tailorUserId) return

    const token = localStorage.getItem('access_token')

    try {
      // 3. Save to Django Database
      const res = await fetch(`http://127.0.0.1:8000/api/messages/${tailorUserId}/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ text: currentMessage })
      })

      if (res.ok) {
        const savedMsg = await res.json()
        const normalizedSavedMsg = normalizeMessage({
          ...savedMsg,
          is_mine: true,
        })
        
        // 4. Emit to Socket for real-time
        socket.emit("send_message", { ...normalizedSavedMsg, orderId: orderId })
        
        setMessages((prev) => [...prev, normalizedSavedMsg])
        setCurrentMessage("")
      }
    } catch (err) { console.error("Message send failed", err) }
  }

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10"><AvatarFallback><MessageSquare className="h-5 w-5" /></AvatarFallback></Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">Chat</p>
            <p className="text-xs text-muted-foreground">Order #{orderId || '...'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isOwn = isOwnMessage(msg, currentUser)
            const senderLabel = getMessageLabel(msg, currentUser)
            const senderInitial = senderLabel?.[0]?.toUpperCase() || '?'

            return (
              <div
                key={msg.id}
                className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {!isOwn && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-muted text-xs font-semibold">
                      {senderInitial}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                  {!isOwn && (
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">
                      {senderLabel}
                    </p>
                  )}
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2.5 ${
                      isOwn
                        ? 'rounded-br-none bg-blue-500 text-white'
                        : 'rounded-bl-none bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-60">
            <MessageSquare className="mb-2 h-10 w-10" />
            <p className="text-sm font-medium">No messages yet</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t bg-card flex gap-2">
        <Input 
          placeholder="Type a message..." 
          value={currentMessage || ""} // Added || "" to fix that React uncontrolled input error!
          onChange={(e) => setCurrentMessage(e.target.value)} 
          className="flex-1" 
        />
        <Button type="submit" disabled={!currentMessage.trim()} size="icon"><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  )
}
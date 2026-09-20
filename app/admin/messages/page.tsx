"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ChatWidget from "@/components/ChatWidget" // Adjust this path if needed

export default function AdminMessagesPage() {
  const [currentUser, setCurrentUser] = useState<{ id: number | null; username?: string | null; email?: string | null } | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  useEffect(() => {
    // 1. Get the logged-in Tailor from local storage
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("access_token") // Get token for API request

    if (token) {
      let parsedUser: { id: number | null; username?: string | null; email?: string | null } | null = null

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          parsedUser = {
            id: userData.id ?? null,
            username: userData.username ?? userData.name ?? null,
            email: userData.email ?? null,
          }
        } catch (error) {
          console.error("Failed to parse stored user", error)
        }
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        parsedUser = { ...(parsedUser || { id: null }), id: payload.user_id }
      } catch (error) {
        console.error("Failed to parse token payload", error)
      }

      if (parsedUser) {
        setCurrentUser(parsedUser)
      }
      
      // 2. Fetch the orders assigned to this tailor
      // (Assuming /api/orders/ returns orders linked to the logged-in user)
      fetch(`http://127.0.0.1:8000/api/orders/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        // Automatically select the first order if they have any
        const ordersArray = data.results ? data.results : data

        setOrders(ordersArray)

        if (ordersArray && ordersArray.length > 0) {
          setSelectedOrder(ordersArray[0])
        }
      })
      .catch(err => console.error("Failed to fetch orders:", err))
    }
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-6xl flex gap-6 h-[800px]">
      
      {/* LEFT SIDE: Order/Customer List Sidebar */}
      <Card className="w-1/3 flex flex-col h-full">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle>My Customers</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center mt-4 text-sm">
              No active orders yet.
            </p>
          ) : (
            orders.map(order => (
              <div 
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`p-4 rounded-lg cursor-pointer border transition-all ${
                  selectedOrder?.id === order.id 
                    ? "bg-primary/10 border-primary shadow-sm" 
                    : "hover:bg-muted"
                }`}
              >
                <p className="font-bold">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Customer ID: {order.customer}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* RIGHT SIDE: The Chat Widget */}
      <Card className="w-2/3 flex flex-col h-full shadow-md">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle>
            {selectedOrder 
              ? `Conversation for Order #${selectedOrder.id}` 
              : "Select a conversation"}
          </CardTitle>
        </CardHeader>
        
        {/* We make this relative so the ChatWidget fits perfectly inside */}
        <CardContent className="flex-1 p-0 overflow-hidden relative">
          {selectedOrder && currentUser ? (
            
            /* --- HERE IS THE MAGIC FLIP --- */
            <ChatWidget 
              orderId={selectedOrder.id}
              currentUser={currentUser || { id: null }}
              tailorUserId={selectedOrder.customer} // <-- Pass the Customer's ID here!
            />

          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a customer from the left to start chatting.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
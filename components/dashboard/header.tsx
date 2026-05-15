'use client'

import React, { useState, useEffect } from 'react'
import { Bell, User } from 'lucide-react'

export const DashboardHeader: React.FC = () => {
  const [hour, setHour] = useState<number | null>(null)

  useEffect(() => {
    setHour(new Date().getHours())
  }, [])

  const greeting =
    hour === null ? 'Welcome' : hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{greeting}!</h1>
        <p className="text-muted-foreground mt-1">Welcome to your financial dashboard</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-foreground" />
        </button>
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <User className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </div>
  )
}

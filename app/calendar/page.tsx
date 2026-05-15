'use client'

import React, { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { Calendar } from '@/components/ui/calendar-simple'
import { motion } from 'framer-motion'

export default function CalendarPage() {
  const finance = useFinance()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const getDateEventsCount = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const expenses = finance.expenses.filter((e) => e.date === dateStr).length
    const income = finance.income.filter((i) => i.date === dateStr).length
    const tasks = finance.tasks.filter((t) => t.dueDate === dateStr).length
    return expenses + income + tasks
  }

  const getDateEvents = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const events = []

    finance.expenses
      .filter((e) => e.date === dateStr)
      .forEach((e) => {
        events.push({
          type: 'expense',
          title: e.description,
          amount: e.amount,
          color: 'red',
        })
      })

    finance.income
      .filter((i) => i.date === dateStr)
      .forEach((i) => {
        events.push({
          type: 'income',
          title: i.source,
          amount: i.amount,
          color: 'green',
        })
      })

    finance.tasks
      .filter((t) => t.dueDate === dateStr)
      .forEach((t) => {
        events.push({
          type: 'task',
          title: t.title,
          priority: t.priority,
          color: t.priority === 'high' ? 'red' : t.priority === 'medium' ? 'yellow' : 'blue',
        })
      })

    return events
  }

  const selectedDateEvents = getDateEvents(selectedDate)
  const highlightedDates = []
  for (let i = 1; i <= 31; i++) {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i)
    if (getDateEventsCount(date) > 0) {
      highlightedDates.push(date)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:ml-64 p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-1">View your events and expenses by date</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                highlightedDates={highlightedDates}
              />
            </div>

            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>

                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-muted/50 border border-border flex items-start justify-between"
                      >
                        <div>
                          <p className="font-medium text-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground capitalize mt-1">
                            {event.type}
                            {event.priority && ` • ${event.priority} priority`}
                          </p>
                        </div>
                        {event.amount && (
                          <p
                            className={`font-semibold ${
                              event.color === 'green'
                                ? 'text-green-600'
                                : event.color === 'red'
                                  ? 'text-red-600'
                                  : 'text-foreground'
                            }`}
                          >
                            {event.color === 'green' ? '+' : '-'}${event.amount.toFixed(2)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No events on this date.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click on highlighted dates to view events
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${selectedDateEvents
                        .filter((e) => e.type === 'expense')
                        .reduce((sum, e) => sum + (e.amount || 0), 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${selectedDateEvents
                        .filter((e) => e.type === 'income')
                        .reduce((sum, e) => sum + (e.amount || 0), 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tasks</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedDateEvents.filter((e) => e.type === 'task').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { Calendar } from '@/components/ui/calendar-simple'
import { motion } from 'framer-motion'

export default function CalendarPage() {
  const finance = useFinance()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const toKey = (d: Date) => d.toISOString().split('T')[0]

  const getEvents = (date: Date) => {
    const key = toKey(date)

    const expenses = finance.expenses
      .filter((e) => e.date === key)
      .map((e) => ({
        type: 'expense',
        title: e.description,
        amount: e.amount,
        tone: 'red',
      }))

    const income = finance.income
      .filter((i) => i.date === key)
      .map((i) => ({
        type: 'income',
        title: i.source,
        amount: i.amount,
        tone: 'green',
      }))

    const tasks = finance.tasks
      .filter((t) => t.dueDate === key)
      .map((t) => ({
        type: 'task',
        title: t.title,
        priority: t.priority,
        tone:
          t.priority === 'high'
            ? 'red'
            : t.priority === 'medium'
              ? 'yellow'
              : 'blue',
      }))

    return [...expenses, ...income, ...tasks]
  }

  const selectedEvents = getEvents(selectedDate)

  const hasEvent = (date: Date) => getEvents(date).length > 0

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">

          {/* HEADER */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Calendar
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your money flow & daily activity
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-12 gap-6">

            {/* CALENDAR */}
            <div className="lg:col-span-4 rounded-3xl border border-border/40 bg-card/40 backdrop-blur p-4 sm:p-5 shadow-sm">
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                highlightedDates={[]}
                hasEvent={hasEvent}
              />
            </div>

            {/* DETAILS */}
            <div className="lg:col-span-8 space-y-5">

              {/* DATE HEADER */}
              <div className="rounded-3xl border border-border/40 bg-card/40 backdrop-blur p-5">
                <h2 className="text-lg font-semibold">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                  {selectedEvents.length} activities
                </p>
              </div>

              {/* EVENTS */}
              <div className="space-y-3">

                {selectedEvents.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border/50 bg-card/20 p-10 text-center">
                    <p className="text-muted-foreground">
                      No activity for this day
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try selecting another date
                    </p>
                  </div>
                ) : (
                  selectedEvents.map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="
                        group flex items-center justify-between
                        rounded-2xl border border-border/40
                        bg-card/30 hover:bg-card/60
                        p-4 transition
                      "
                    >
                      <div>
                        <p className="font-medium">
                          {event.title}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                          {event.type}
                          {event.priority && ` • ${event.priority}`}
                        </p>
                      </div>

                      {'amount' in event && (
                        <div
                          className={`font-semibold ${
                            event.type === 'income'
                              ? 'text-emerald-500'
                              : 'text-rose-500'
                          }`}
                        >
                          {event.type === 'income' ? '+' : '-'}
                          ${event.amount.toFixed(2)}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              {/* SUMMARY */}
              <div className="grid sm:grid-cols-3 gap-4">

                <div className="rounded-2xl border border-border/40 bg-card/40 p-4">
                  <p className="text-xs text-muted-foreground">
                    Expenses
                  </p>
                  <p className="text-xl font-bold text-rose-500 mt-1">
                    ${selectedEvents
                      .filter((e: any) => e.type === 'expense')
                      .reduce((s: number, e: any) => s + (e.amount || 0), 0)
                      .toFixed(2)}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/40 bg-card/40 p-4">
                  <p className="text-xs text-muted-foreground">
                    Income
                  </p>
                  <p className="text-xl font-bold text-emerald-500 mt-1">
                    ${selectedEvents
                      .filter((e: any) => e.type === 'income')
                      .reduce((s: number, e: any) => s + (e.amount || 0), 0)
                      .toFixed(2)}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/40 bg-card/40 p-4">
                  <p className="text-xs text-muted-foreground">
                    Tasks
                  </p>
                  <p className="text-xl font-bold text-blue-500 mt-1">
                    {selectedEvents.filter((e: any) => e.type === 'task').length}
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
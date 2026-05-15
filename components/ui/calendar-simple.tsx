'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarProps {
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
  className?: string
  highlightedDates?: Date[]
}

export const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  selectedDate,
  className,
  highlightedDates = [],
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const handlePrevious = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onDateSelect?.(date)
  }

  const isDateHighlighted = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return highlightedDates.some(
      (d) => d.getDate() === date.getDate() && d.getMonth() === date.getMonth()
    )
  }

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const days = Array.from({ length: daysInMonth(currentDate) }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDayOfMonth(currentDate) }, () => null)
  const weeks = []
  let week = [...blanks]

  for (const day of days) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null)
    }
    weeks.push(week)
  }

  return (
    <div className={cn('w-full rounded-lg border border-border bg-card p-4', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-card-foreground">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            className="rounded p-1 hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={handleNext} className="rounded p-1 hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
            {day}
          </div>
        ))}

        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day, dayIndex) => (
              <button
                key={dayIndex}
                onClick={() => day && handleDateClick(day)}
                disabled={!day}
                className={cn(
                  'p-2 rounded text-sm font-medium transition-colors',
                  !day && 'cursor-default',
                  day && 'hover:bg-muted',
                  isDateSelected(day!) && 'bg-primary text-primary-foreground',
                  isDateHighlighted(day!) && !isDateSelected(day!) && 'bg-accent/30'
                )}
              >
                {day}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

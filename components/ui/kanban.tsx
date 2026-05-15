'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  title: string
  count: number
  children: React.ReactNode
  className?: string
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  count,
  children,
  className,
}) => (
  <div className={cn('flex flex-col gap-4 min-w-[300px]', className)}>
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        {count}
      </span>
    </div>
    <div className="flex flex-col gap-3 bg-muted/30 rounded-lg p-3 min-h-[200px]">{children}</div>
  </div>
)

interface KanbanCardProps {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
  onDelete?: () => void
  onClick?: () => void
  className?: string
}

const priorityColors = {
  low: 'border-l-4 border-l-blue-500',
  medium: 'border-l-4 border-l-yellow-500',
  high: 'border-l-4 border-l-red-500',
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  title,
  description,
  priority,
  dueDate,
  onDelete,
  onClick,
  className,
}) => (
  <div
    className={cn(
      'bg-card rounded-lg p-3 cursor-pointer transition-all hover:shadow-md',
      priority && priorityColors[priority],
      className
    )}
    onClick={onClick}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1">
        <p className="font-medium text-card-foreground text-sm">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          ×
        </button>
      )}
    </div>
    {dueDate && <p className="text-xs text-muted-foreground mt-2">{dueDate}</p>}
  </div>
)

interface KanbanBoardProps {
  children: React.ReactNode
  className?: string
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ children, className }) => (
  <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>{children}</div>
)

'use client'

import React from 'react'
import { X, Pin } from 'lucide-react'
import { cn } from '@/lib/utils'

const noteColors = {
  yellow: 'bg-yellow-100 border-yellow-300',
  pink: 'bg-pink-100 border-pink-300',
  blue: 'bg-blue-100 border-blue-300',
  green: 'bg-green-100 border-green-300',
  purple: 'bg-purple-100 border-purple-300',
  orange: 'bg-orange-100 border-orange-300',
}

const textColors = {
  yellow: 'text-yellow-900',
  pink: 'text-pink-900',
  blue: 'text-blue-900',
  green: 'text-green-900',
  purple: 'text-purple-900',
  orange: 'text-orange-900',
}

interface StickyNoteProps {
  title: string
  content: string
  color: keyof typeof noteColors
  pinned?: boolean
  onDelete?: () => void
  onPin?: () => void
  onClick?: () => void
  className?: string
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  title,
  content,
  color,
  pinned,
  onDelete,
  onPin,
  onClick,
  className,
}) => (
  <div
    className={cn(
      'relative w-full max-w-xs p-4 rounded-sm shadow-md border-2 transform transition-transform hover:scale-105 cursor-pointer',
      noteColors[color],
      className
    )}
    onClick={onClick}
  >
    <div className={cn('flex items-start justify-between mb-2', textColors[color])}>
      <h3 className="font-semibold text-sm flex-1 break-words">{title}</h3>
      <div className="flex gap-1 ml-2">
        {onPin && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPin()
            }}
            className={cn(
              'p-1 rounded hover:opacity-75 transition-opacity',
              pinned && 'opacity-100'
            )}
            title={pinned ? 'Unpin' : 'Pin'}
          >
            <Pin className="h-4 w-4" fill={pinned ? 'currentColor' : 'none'} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 rounded hover:opacity-75 transition-opacity"
            title="Delete"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
    <p className={cn('text-sm break-words whitespace-pre-wrap', textColors[color])}>
      {content}
    </p>
  </div>
)

interface StickyNotesGridProps {
  children: React.ReactNode
  className?: string
}

export const StickyNotesGrid: React.FC<StickyNotesGridProps> = ({ children, className }) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max', className)}>
    {children}
  </div>
)

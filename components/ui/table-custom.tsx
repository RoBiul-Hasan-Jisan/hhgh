'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TableProps {
  children: React.ReactNode
  className?: string
}

export const Table: React.FC<TableProps> = ({ children, className }) => (
  <div className="w-full overflow-x-auto">
    <table className={cn('w-full text-sm', className)}>{children}</table>
  </div>
)

interface TableHeadProps {
  children: React.ReactNode
  className?: string
}

export const TableHead: React.FC<TableHeadProps> = ({ children, className }) => (
  <thead className={cn('border-b border-border bg-muted/50', className)}>{children}</thead>
)

interface TableBodyProps {
  children: React.ReactNode
  className?: string
}

export const TableBody: React.FC<TableBodyProps> = ({ children, className }) => (
  <tbody className={cn('[&>tr:last-child]:border-b-0', className)}>{children}</tbody>
)

interface TableRowProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const TableRow: React.FC<TableRowProps> = ({ children, className, onClick }) => (
  <tr
    className={cn(
      'border-b border-border transition-colors hover:bg-muted/50',
      onClick && 'cursor-pointer',
      className
    )}
    onClick={onClick}
  >
    {children}
  </tr>
)

interface TableHeaderCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  children,
  className,
  align = 'left',
}) => (
  <th
    className={cn(
      'h-10 px-4 py-2 font-semibold text-foreground text-left',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className
    )}
  >
    {children}
  </th>
)

interface TableCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className,
  align = 'left',
}) => (
  <td
    className={cn(
      'px-4 py-3 text-foreground',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className
    )}
  >
    {children}
  </td>
)

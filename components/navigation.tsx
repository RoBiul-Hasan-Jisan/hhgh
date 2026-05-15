'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  Target,
  PiggyBank,
  CheckSquare,
  Zap,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Menu,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    name: 'Expenses',
    href: '/expenses',
    icon: <TrendingDown className="h-4 w-4" />,
  },
  {
    name: 'Income',
    href: '/income',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    name: 'Budgets',
    href: '/budgets',
    icon: <Target className="h-4 w-4" />,
  },
  {
    name: 'Goals',
    href: '/goals',
    icon: <PiggyBank className="h-4 w-4" />,
  },
  {
    name: 'Habits',
    href: '/habits',
    icon: <Zap className="h-4 w-4" />,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: <CheckSquare className="h-4 w-4" />,
  },
  {
    name: 'Notes',
    href: '/notes',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="h-4 w-4" />,
  },
]

export const Navigation: React.FC = () => {
  const pathname = usePathname()

  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-16 border-b bg-background/95 backdrop-blur z-50">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-primary-foreground font-bold">
              E
            </div>

            <div>
              <h1 className="text-lg font-bold leading-none">
                Expense.fyi
              </h1>

              <p className="text-xs text-muted-foreground">
                Personal Finance Hub
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-muted"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed top-16 left-0 w-full bg-background border-b z-40 lg:hidden">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
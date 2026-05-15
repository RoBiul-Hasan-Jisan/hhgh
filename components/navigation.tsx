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
  section?: string
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: 'Finances',
    section: 'Finances',
    href: '#',
    icon: <TrendingDown className="h-5 w-5" />,
  },
  {
    name: 'Expenses',
    href: '/expenses',
    icon: <TrendingDown className="h-5 w-5" />,
  },
  {
    name: 'Income',
    href: '/income',
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    name: 'Budgets',
    href: '/budgets',
    icon: <Target className="h-5 w-5" />,
  },
  {
    name: 'Goals',
    href: '/goals',
    icon: <PiggyBank className="h-5 w-5" />,
  },
  {
    name: 'Life Management',
    section: 'Life Management',
    href: '#',
    icon: <CheckSquare className="h-5 w-5" />,
  },
  {
    name: 'Habits',
    href: '/habits',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: <CheckSquare className="h-5 w-5" />,
  },
  {
    name: 'Notes',
    href: '/notes',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
]

export const Navigation: React.FC = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-primary text-primary-foreground p-3 shadow-lg md:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 z-30 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-sidebar-primary">Expense.fyi</h1>
          <p className="text-xs text-sidebar-accent mt-1">Personal Finance Hub</p>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item, index) => {
            if (item.section) {
              return (
                <div key={index} className="mt-6 mb-3">
                  <p className="text-xs font-semibold text-sidebar-accent uppercase tracking-widest px-3 py-2">
                    {item.section}
                  </p>
                </div>
              )
            }

            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="md:ml-64">
        <div className="min-h-screen bg-background p-4 md:p-8" />
      </main>
    </>
  )
}

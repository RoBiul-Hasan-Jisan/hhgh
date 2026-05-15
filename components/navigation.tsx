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
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Expenses', href: '/expenses', icon: TrendingDown },
  { name: 'Income', href: '/income', icon: TrendingUp },
  { name: 'Budgets', href: '/budgets', icon: Target },
  { name: 'Goals', href: '/goals', icon: PiggyBank },
  { name: 'Habits', href: '/habits', icon: Zap },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Notes', href: '/notes', icon: FileText },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export const Navigation: React.FC = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* TOP HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-full w-full max-w-[1920px] items-center justify-between px-3 sm:px-4 md:px-6">
          {/* LOGO */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-lg">
              E
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold sm:text-base md:text-lg">
                Expense.fyi
              </h1>

              <p className="hidden text-xs text-muted-foreground sm:block">
                Personal Finance Hub
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
                    'hover:scale-[1.02] hover:bg-muted',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  <span className="hidden 2xl:block">
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background transition hover:bg-muted xl:hidden"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 xl:hidden',
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* MOBILE SIDEBAR */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[280px] max-w-[85vw] border-r border-border bg-background shadow-2xl transition-transform duration-300 xl:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* MOBILE HEADER */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
              E
            </div>

            <div>
              <h2 className="text-sm font-bold">
                Expense.fyi
              </h2>

              <p className="text-xs text-muted-foreground">
                Finance Hub
              </p>
            </div>
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        <nav className="flex h-[calc(100%-4rem)] flex-col overflow-y-auto p-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    'hover:bg-muted active:scale-[0.98]',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />

                  <span className="truncate">
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      </aside>

      {/* PAGE SPACING */}
      <div className="h-16" />
    </>
  )
}
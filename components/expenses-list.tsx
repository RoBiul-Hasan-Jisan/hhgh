'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Expense } from '@/lib/storage'
import { Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface ExpensesListProps {
  expenses: Expense[]
  currency: string
  onDelete: (id: string) => void
  maxItems?: number
}

const categoryIcons: Record<string, string> = {
  Food: '🍔',
  Transport: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Healthcare: '⚕️',
  Other: '📌',
}

export function ExpensesList({
  expenses,
  currency,
  onDelete,
  maxItems = 5,
}: ExpensesListProps) {
  const sortedExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxItems)

  if (expenses.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No expenses yet. Add your first expense to get started!</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="divide-y divide-border">
        {sortedExpenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">
                {categoryIcons[expense.category] || '💰'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{expense.description}</p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>{expense.category}</span>
                  <span>•</span>
                  <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-semibold text-lg text-red-600 dark:text-red-400">
                -{currency} {expense.amount.toFixed(2)}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(expense.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

'use client'

import React from 'react'
import { Expense, Income, Goal } from '@/lib/storage'
import { formatDistanceToNow } from 'date-fns'

interface DashboardSummaryProps {
  expenses: Expense[]
  income: Income[]
  goals: Goal[]
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  expenses,
  income,
  goals,
}) => {
  const recentExpenses = expenses.slice(-5).reverse()
  const recentIncome = income.slice(-3).reverse()
  const activeGoals = goals.filter((g) => g.currentAmount < g.targetAmount)

  return (
    <div className="bg-card rounded-lg p-6 border border-border h-fit">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Expenses</h3>
          <div className="space-y-2">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-foreground font-medium">{exp.description}</p>
                    <p className="text-xs text-muted-foreground">{exp.category}</p>
                  </div>
                  <p className="text-red-500 font-semibold">-${exp.amount.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No expenses yet</p>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Income</h3>
          <div className="space-y-2">
            {recentIncome.length > 0 ? (
              recentIncome.map((inc) => (
                <div key={inc.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-foreground font-medium">{inc.source}</p>
                    <p className="text-xs text-muted-foreground">{inc.category}</p>
                  </div>
                  <p className="text-green-500 font-semibold">+${inc.amount.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No income yet</p>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Savings Goals</h3>
          <div className="space-y-3">
            {activeGoals.length > 0 ? (
              activeGoals.slice(0, 3).map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <p className="text-foreground font-medium">{goal.name}</p>
                      <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-xs text-muted-foreground">No active goals</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

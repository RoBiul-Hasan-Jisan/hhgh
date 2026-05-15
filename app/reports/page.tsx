'use client'

import React, { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316']

export default function ReportsPage() {
  const finance = useFinance()
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month')

  // Calculate summary stats
  const totalExpenses = finance.expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalIncome = finance.income.reduce((sum, i) => sum + i.amount, 0)
  const netBalance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  // Monthly breakdown
  const monthlyData = {}
  finance.expenses.forEach((e) => {
    const month = new Date(e.date).toLocaleString('default', { month: 'short', year: 'numeric' })
    if (!monthlyData[month]) monthlyData[month] = { month, expenses: 0, income: 0 }
    monthlyData[month].expenses += e.amount
  })

  finance.income.forEach((i) => {
    const month = new Date(i.date).toLocaleString('default', { month: 'short', year: 'numeric' })
    if (!monthlyData[month]) monthlyData[month] = { month, expenses: 0, income: 0 }
    monthlyData[month].income += i.amount
  })

  const monthlyChartData = Object.values(monthlyData).slice(-6) as any[]

  // Expense categories breakdown
  const expenseByCategory = finance.expensesByCategory.map((e) => ({
    name: e.category,
    value: Math.round(e.amount * 100) / 100,
  }))

  // Income sources breakdown
  const incomeBySource = finance.incomeByCategory.map((i) => ({
    name: i.category,
    value: Math.round(i.amount * 100) / 100,
  }))

  // Spending habits
  const topExpenses = finance.expenses
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)

  const goalProgress = finance.goals.map((g) => ({
    name: g.name,
    current: g.currentAmount,
    target: g.targetAmount,
    percentage: (g.currentAmount / g.targetAmount) * 100,
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:ml-64 p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
            <p className="text-muted-foreground mt-1">Analyze your spending and income patterns</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-lg p-6 border border-border">
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-3xl font-bold text-green-600 mt-2">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600 mt-2">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <p className="text-sm text-muted-foreground">Net Balance</p>
              <p className={`text-3xl font-bold mt-2 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                ${netBalance.toFixed(2)}
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <p className="text-sm text-muted-foreground">Savings Rate</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{savingsRate.toFixed(1)}%</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Trend */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-lg p-6 border border-border"
            >
              <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
              {monthlyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" />
                    <Bar dataKey="expenses" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </motion.div>

            {/* Expense Breakdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-lg p-6 border border-border"
            >
              <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
              {expenseByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No expense data available
                </div>
              )}
            </motion.div>

            {/* Income Breakdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-lg p-6 border border-border"
            >
              <h3 className="text-lg font-semibold mb-4">Income Breakdown</h3>
              {incomeBySource.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={incomeBySource}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incomeBySource.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No income data available
                </div>
              )}
            </motion.div>

            {/* Goal Progress */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-lg p-6 border border-border"
            >
              <h3 className="text-lg font-semibold mb-4">Goals Progress</h3>
              {goalProgress.length > 0 ? (
                <div className="space-y-4">
                  {goalProgress.map((goal, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">{goal.name}</p>
                        <p className="text-xs text-muted-foreground">{Math.round(goal.percentage)}%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No goals yet</p>
              )}
            </motion.div>
          </div>

          {/* Top Expenses */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-lg p-6 border border-border"
          >
            <h3 className="text-lg font-semibold mb-4">Top Expenses</h3>
            {topExpenses.length > 0 ? (
              <div className="space-y-3">
                {topExpenses.map((expense, index) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">{expense.category}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-red-600">${expense.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No expenses yet</p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

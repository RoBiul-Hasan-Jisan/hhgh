'use client'

import React from 'react'
import { motion } from 'framer-motion'

import { useFinance } from '@/hooks/useFinance'

import { Navigation } from '@/components/navigation'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardStats } from '@/components/dashboard/stats'
import { DashboardCharts } from '@/components/dashboard/charts'
import { DashboardSummary } from '@/components/dashboard/summary'

export default function Home() {
  const finance = useFinance()

  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      {/* MAIN CONTENT */}
      <main className="md:ml-64 w-full overflow-x-hidden">
        <div className="px-4 py-6 md:px-8 space-y-6 max-w-[1600px] mx-auto">
          
          {/* HEADER */}
          <DashboardHeader />

          {/* CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* STATS */}
            <DashboardStats
              totalExpenses={finance.totalExpenses}
              totalIncome={finance.totalIncome}
              netBalance={finance.netBalance}
              investmentValue={finance.totalInvestmentValue}
            />

            {/* CHART + SUMMARY */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              <div className="xl:col-span-2 min-w-0">
                <DashboardCharts
                  expensesByCategory={finance.expensesByCategory}
                  incomeByCategory={finance.incomeByCategory}
                />
              </div>

              <div className="min-w-0">
                <DashboardSummary
                  expenses={finance.expenses}
                  income={finance.income}
                  goals={finance.goals}
                />
              </div>
            </div>

            {/* QUICK STATS */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-foreground">
                  Quick Stats
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                  Overview of your finance activity
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                
                <div className="rounded-xl bg-muted/50 border border-border p-5">
                  <p className="text-sm text-muted-foreground">
                    Monthly Subscriptions
                  </p>

                  <h3 className="text-2xl font-bold mt-3">
                    {finance.preferences.currency}
                    {finance.monthlySubscriptions.toFixed(2)}
                  </h3>
                </div>

                <div className="rounded-xl bg-muted/50 border border-border p-5">
                  <p className="text-sm text-muted-foreground">
                    Active Habits
                  </p>

                  <h3 className="text-2xl font-bold mt-3">
                    {finance.habits.length}
                  </h3>
                </div>

                <div className="rounded-xl bg-muted/50 border border-border p-5">
                  <p className="text-sm text-muted-foreground">
                    Active Goals
                  </p>

                  <h3 className="text-2xl font-bold mt-3">
                    {finance.goals.length}
                  </h3>
                </div>

                <div className="rounded-xl bg-muted/50 border border-border p-5">
                  <p className="text-sm text-muted-foreground">
                    Pending Tasks
                  </p>

                  <h3 className="text-2xl font-bold mt-3">
                    {
                      finance.tasks.filter(
                        (t) => t.status !== 'completed'
                      ).length
                    }
                  </h3>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
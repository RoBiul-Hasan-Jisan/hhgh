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
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="pt-24 pb-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">

          {/* HEADER */}
          <DashboardHeader />

          {/* MAIN CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-10"
          >

            {/* TOP STATS */}
            <section className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-5 sm:p-6 shadow-sm">
              <DashboardStats
                totalExpenses={finance.totalExpenses}
                totalIncome={finance.totalIncome}
                netBalance={finance.netBalance}
                investmentValue={finance.totalInvestmentValue}
              />
            </section>

            {/* CHART + SUMMARY */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">

              {/* CHARTS */}
              <div className="xl:col-span-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-5 sm:p-6 shadow-sm min-w-0">
                <DashboardCharts
                  expensesByCategory={finance.expensesByCategory}
                  incomeByCategory={finance.incomeByCategory}
                />
              </div>

              {/* SUMMARY */}
              <div className="xl:col-span-4 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-5 sm:p-6 shadow-sm min-w-0">
                <DashboardSummary
                  expenses={finance.expenses}
                  income={finance.income}
                  goals={finance.goals}
                />
              </div>

            </section>

            {/* QUICK INSIGHTS */}
            <section className="space-y-5">

              {/* TITLE */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  Insights
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Real-time overview of your financial activity
                </p>
              </div>

              {/* CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                {[
                  {
                    label: 'Subscriptions',
                    value: finance.monthlySubscriptions.toFixed(2),
                    prefix: finance.preferences.currency,
                  },
                  {
                    label: 'Active Habits',
                    value: finance.habits.length,
                  },
                  {
                    label: 'Active Goals',
                    value: finance.goals.length,
                  },
                  {
                    label: 'Pending Tasks',
                    value: finance.tasks.filter(
                      (t) => t.status !== 'completed'
                    ).length,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="
                      group relative overflow-hidden
                      rounded-2xl border border-border/40
                      bg-gradient-to-b from-card/60 to-card/20
                      p-5 shadow-sm hover:shadow-md
                      transition-all duration-300
                    "
                  >
                    {/* subtle glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-primary/5" />

                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>

                    <h3 className="text-2xl font-bold mt-3 tracking-tight">
                      {item.prefix ? `${item.prefix} ` : ''}
                      {item.value}
                    </h3>
                  </motion.div>
                ))}

              </div>
            </section>

          </motion.div>
        </div>
      </main>
    </div>
  )
}
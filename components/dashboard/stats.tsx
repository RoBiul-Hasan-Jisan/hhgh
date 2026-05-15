'use client'

import React from 'react'
import { TrendingDown, TrendingUp, DollarSign, TrendingUpIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardStatsProps {
  totalExpenses: number
  totalIncome: number
  netBalance: number
  investmentValue: number
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalExpenses,
  totalIncome,
  netBalance,
  investmentValue,
}) => {
  const stats = [
    {
      label: 'Total Income',
      value: `$${totalIncome.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      icon: TrendingDown,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
    {
      label: 'Net Balance',
      value: `$${netBalance.toFixed(2)}`,
      icon: DollarSign,
      color: netBalance >= 0 ? 'text-blue-500' : 'text-orange-500',
      bgColor: netBalance >= 0 ? 'bg-blue-50 dark:bg-blue-950' : 'bg-orange-50 dark:bg-orange-950',
    },
    {
      label: 'Investments',
      value: `$${investmentValue.toFixed(2)}`,
      icon: TrendingUpIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-lg p-6 border border-border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

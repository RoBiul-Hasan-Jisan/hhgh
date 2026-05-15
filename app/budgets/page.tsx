'use client'

import React, { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button-custom'
import { Modal, ModalActions } from '@/components/ui/modal'
import { FormField, Input, Select } from '@/components/ui/form-field'
import { ProgressBar } from '@/components/ui/button-custom'
import { Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

const BUDGET_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare']

export default function BudgetsPage() {
  const finance = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    category: 'Food',
    limit: '',
    period: 'monthly' as 'monthly' | 'yearly',
  })

  const currentMonth = new Date().toISOString().slice(0, 7)

  const handleAddBudget = () => {
    if (!formData.limit) return

    finance.addBudget({
      category: formData.category,
      limit: parseFloat(formData.limit),
      spent: 0,
      period: formData.period,
      month: currentMonth,
    })

    setFormData({
      category: 'Food',
      limit: '',
      period: 'monthly',
    })
    setIsModalOpen(false)
  }

  const currentBudgets = finance.budgets.filter((b) => b.month === currentMonth)

  const getBudgetSpent = (category: string) => {
    return finance.expenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 px-4 py-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Budget Planner</h1>
              <p className="text-muted-foreground mt-1">Set and track your spending limits</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Budget
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentBudgets.length > 0 ? (
              currentBudgets.map((budget) => {
                const spent = getBudgetSpent(budget.category)
                const percentage = (spent / budget.limit) * 100
                const remaining = budget.limit - spent

                return (
                  <motion.div
                    key={budget.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card rounded-lg p-6 border border-border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        {budget.category}
                      </h3>
                      <button
                        onClick={() => finance.deleteBudget(budget.id)}
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <ProgressBar
                        value={spent}
                        max={budget.limit}
                        showLabel
                        color={percentage > 100 ? 'destructive' : percentage > 80 ? 'accent' : 'primary'}
                      />

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Spent</p>
                          <p className="font-semibold text-foreground">${spent.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Limit</p>
                          <p className="font-semibold text-foreground">${budget.limit.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Remaining</p>
                          <p
                            className={`font-semibold ${
                              remaining > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            ${remaining.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {percentage > 100 && (
                        <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-200">
                            Over budget by ${(spent - budget.limit).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No budgets set for this month yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Create one to get started!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Budget"
        description="Set a spending limit for a category"
      >
        <div className="space-y-4">
          <FormField label="Category" required>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {BUDGET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Budget Limit" required>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
            />
          </FormField>

          <FormField label="Period" required>
            <Select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value as any })}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </Select>
          </FormField>

          <ModalActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBudget}>Add Budget</Button>
          </ModalActions>
        </div>
      </Modal>
    </div>
  )
}

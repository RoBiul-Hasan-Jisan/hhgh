'use client'

import React, { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button-custom'
import { Modal, ModalActions } from '@/components/ui/modal'
import { FormField, Input, Select } from '@/components/ui/form-field'
import { ProgressBar } from '@/components/ui/button-custom'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { motion } from 'framer-motion'

const GOAL_CATEGORIES = ['Emergency Fund', 'Vacation', 'Home', 'Car', 'Education', 'Investment', 'Other']

export default function GoalsPage() {
  const finance = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'Emergency Fund',
  })

  const handleOpenModal = (id?: string) => {
    if (id) {
      const goal = finance.goals.find((g) => g.id === id)
      if (goal) {
        setFormData({
          name: goal.name,
          targetAmount: goal.targetAmount.toString(),
          currentAmount: goal.currentAmount.toString(),
          targetDate: goal.targetDate,
          category: goal.category,
        })
        setEditingId(id)
      }
    } else {
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: '',
        category: 'Emergency Fund',
      })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const handleSaveGoal = () => {
    if (!formData.name || !formData.targetAmount) return

    if (editingId) {
      finance.updateGoal(editingId, {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        targetDate: formData.targetDate,
        category: formData.category,
      })
    } else {
      finance.addGoal({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        targetDate: formData.targetDate,
        category: formData.category,
      })
    }

    setIsModalOpen(false)
  }

  const completedGoals = finance.goals.filter((g) => g.currentAmount >= g.targetAmount)
  const activeGoals = finance.goals.filter((g) => g.currentAmount < g.targetAmount)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 px-4 py-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Savings Goals</h1>
              <p className="text-muted-foreground mt-1">Track your financial targets</p>
            </div>
            <Button onClick={() => handleOpenModal()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </div>

          {activeGoals.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Active Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeGoals.map((goal, index) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100
                  const remaining = goal.targetAmount - goal.currentAmount
                  const daysLeft = Math.ceil(
                    (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  )

                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-lg p-6 border border-border"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{goal.name}</h3>
                          <p className="text-sm text-muted-foreground">{goal.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(goal.id)}
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                          >
                            <Edit2 className="h-4 w-4 text-primary" />
                          </button>
                          <button
                            onClick={() => finance.deleteGoal(goal.id)}
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <ProgressBar
                          value={goal.currentAmount}
                          max={goal.targetAmount}
                          color="primary"
                        />

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Saved</p>
                            <p className="font-semibold text-foreground">
                              ${goal.currentAmount.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Target</p>
                            <p className="font-semibold text-foreground">
                              ${goal.targetAmount.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Remaining</p>
                            <p className="font-semibold text-orange-600">
                              ${remaining.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Progress</p>
                            <p className="font-semibold text-foreground">{Math.round(progress)}%</p>
                          </div>
                        </div>

                        {daysLeft > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {daysLeft} days remaining
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Completed Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-card rounded-lg p-6 border-2 border-green-500/30 bg-green-50/30 dark:bg-green-950/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{goal.name}</h3>
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                          Goal Completed!
                        </p>
                      </div>
                      <button
                        onClick={() => finance.deleteGoal(goal.id)}
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      ${goal.currentAmount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {finance.goals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No goals yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Create one to start tracking!</p>
            </div>
          )}
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Goal' : 'Add Goal'}
        description={editingId ? 'Update your goal' : 'Create a new savings goal'}
      >
        <div className="space-y-4">
          <FormField label="Goal Name" required>
            <Input
              placeholder="e.g., Emergency Fund"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>

          <FormField label="Target Amount" required>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
            />
          </FormField>

          <FormField label="Current Amount">
            <Input
              type="number"
              placeholder="0.00"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
            />
          </FormField>

          <FormField label="Category">
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {GOAL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Target Date">
            <Input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            />
          </FormField>

          <ModalActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGoal}>{editingId ? 'Update Goal' : 'Add Goal'}</Button>
          </ModalActions>
        </div>
      </Modal>
    </div>
  )
}

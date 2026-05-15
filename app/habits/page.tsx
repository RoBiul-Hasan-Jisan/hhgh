'use client'

import React, { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button-custom'
import { Modal, ModalActions } from '@/components/ui/modal'
import { FormField, Input, Select, Textarea } from '@/components/ui/form-field'
import { Plus, Trash2, Flame, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'

const HABIT_COLORS = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'] as const

export default function HabitsPage() {
  const finance = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    color: 'blue' as typeof HABIT_COLORS[number],
  })

  const handleAddHabit = () => {
    if (!formData.name) return

    finance.addHabit({
      name: formData.name,
      description: formData.description,
      frequency: formData.frequency,
      streak: 0,
      lastCompletedDate: '',
      color: formData.color,
    })

    setFormData({
      name: '',
      description: '',
      frequency: 'daily',
      color: 'blue',
    })
    setIsModalOpen(false)
  }

  const handleCompleteHabit = (habitId: string) => {
    const habit = finance.habits.find((h) => h.id === habitId)
    if (habit) {
      const today = new Date().toISOString().split('T')[0]
      const wasCompletedToday = habit.lastCompletedDate === today

      if (!wasCompletedToday) {
        finance.updateHabit(habitId, {
          streak: habit.streak + 1,
          lastCompletedDate: today,
        })
      }
    }
  }

  const handleResetStreak = (habitId: string) => {
    finance.updateHabit(habitId, {
      streak: 0,
      lastCompletedDate: '',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 px-4 py-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Habit Tracker</h1>
              <p className="text-muted-foreground mt-1">Build positive habits and track streaks</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Habit
            </Button>
          </div>

          {finance.habits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {finance.habits.map((habit, index) => {
                const colorClasses: Record<string, string> = {
                  yellow: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
                  pink: 'bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800',
                  blue: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
                  green: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
                  purple: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
                  orange: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
                }

                const streakColors: Record<string, string> = {
                  yellow: 'text-yellow-700 dark:text-yellow-300',
                  pink: 'text-pink-700 dark:text-pink-300',
                  blue: 'text-blue-700 dark:text-blue-300',
                  green: 'text-green-700 dark:text-green-300',
                  purple: 'text-purple-700 dark:text-purple-300',
                  orange: 'text-orange-700 dark:text-orange-300',
                }

                const today = new Date().toISOString().split('T')[0]
                const isCompletedToday = habit.lastCompletedDate === today

                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-lg p-6 border-2 ${colorClasses[habit.color]}`}
                  >
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{habit.name}</h3>
                          {habit.description && (
                            <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => finance.deleteHabit(habit.id)}
                          className="p-2 rounded-md hover:bg-muted transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {habit.frequency} habit
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Flame className={`h-5 w-5 ${streakColors[habit.color]}`} />
                        <span className={`text-2xl font-bold ${streakColors[habit.color]}`}>
                          {habit.streak}
                        </span>
                        <span className="text-sm text-muted-foreground">day streak</span>
                      </div>
                      {habit.streak > 0 && (
                        <button
                          onClick={() => handleResetStreak(habit.id)}
                          className="p-2 rounded-md hover:bg-muted/50 transition-colors"
                          title="Reset streak"
                        >
                          <RotateCcw className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>

                    <Button
                      onClick={() => handleCompleteHabit(habit.id)}
                      className="w-full"
                      variant={isCompletedToday ? 'primary' : 'outline'}
                    >
                      {isCompletedToday ? 'Completed Today' : 'Mark as Done'}
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No habits yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Create one to build better habits!</p>
            </div>
          )}
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Habit"
        description="Create a new habit to track"
      >
        <div className="space-y-4">
          <FormField label="Habit Name" required>
            <Input
              placeholder="e.g., Read for 30 minutes"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              placeholder="Optional description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormField>

          <FormField label="Frequency" required>
            <Select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </FormField>

          <FormField label="Color">
            <div className="flex gap-2">
              {HABIT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-foreground' : 'border-muted'
                  }`}
                  style={{
                    backgroundColor: {
                      yellow: '#fef08a',
                      pink: '#fbcfe8',
                      blue: '#bfdbfe',
                      green: '#bbf7d0',
                      purple: '#e9d5ff',
                      orange: '#fed7aa',
                    }[color],
                  }}
                />
              ))}
            </div>
          </FormField>

          <ModalActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHabit}>Add Habit</Button>
          </ModalActions>
        </div>
      </Modal>
    </div>
  )
}

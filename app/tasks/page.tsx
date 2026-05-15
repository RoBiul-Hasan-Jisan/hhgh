'use client'

import React, { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button-custom'
import { Modal, ModalActions } from '@/components/ui/modal'
import { FormField, Input, Select, Textarea } from '@/components/ui/form-field'
import { KanbanBoard, KanbanColumn, KanbanCard } from '@/components/ui/kanban'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TasksPage() {
  const finance = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    status: 'todo' as 'todo' | 'in-progress' | 'completed',
  })

  const handleAddTask = () => {
    if (!formData.title) return

    finance.addTask({
      title: formData.title,
      description: formData.description,
      status: 'todo',
      priority: formData.priority,
      dueDate: formData.dueDate,
    })

    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'todo',
    })
    setIsModalOpen(false)
  }

  const todoTasks = finance.tasks.filter((t) => t.status === 'todo')
  const inProgressTasks = finance.tasks.filter((t) => t.status === 'in-progress')
  const completedTasks = finance.tasks.filter((t) => t.status === 'completed')

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in-progress' | 'completed') => {
    finance.updateTask(taskId, { status: newStatus })
  }

  const formatDueDate = (date: string) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 px-4 py-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
              <p className="text-muted-foreground mt-1">Organize and track your daily tasks</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>

          {finance.tasks.length > 0 ? (
            <div className="overflow-x-auto pb-4">
              <KanbanBoard>
                <KanbanColumn title="To Do" count={todoTasks.length}>
                  {todoTasks.map((task) => (
                    <KanbanCard
                      key={task.id}
                      title={task.title}
                      description={task.description}
                      priority={task.priority}
                      dueDate={formatDueDate(task.dueDate)}
                      onClick={() => handleStatusChange(task.id, 'in-progress')}
                      onDelete={() => finance.deleteTask(task.id)}
                    />
                  ))}
                </KanbanColumn>

                <KanbanColumn title="In Progress" count={inProgressTasks.length}>
                  {inProgressTasks.map((task) => (
                    <KanbanCard
                      key={task.id}
                      title={task.title}
                      description={task.description}
                      priority={task.priority}
                      dueDate={formatDueDate(task.dueDate)}
                      onClick={() => handleStatusChange(task.id, 'completed')}
                      onDelete={() => finance.deleteTask(task.id)}
                    />
                  ))}
                </KanbanColumn>

                <KanbanColumn title="Completed" count={completedTasks.length}>
                  {completedTasks.map((task) => (
                    <KanbanCard
                      key={task.id}
                      title={task.title}
                      description={task.description}
                      priority={task.priority}
                      dueDate={formatDueDate(task.dueDate)}
                      onClick={() => handleStatusChange(task.id, 'todo')}
                      onDelete={() => finance.deleteTask(task.id)}
                    />
                  ))}
                </KanbanColumn>
              </KanbanBoard>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Create one to get started!</p>
            </div>
          )}
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Task"
        description="Create a new task"
      >
        <div className="space-y-4">
          <FormField label="Title" required>
            <Input
              placeholder="e.g., Complete project report"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              placeholder="Add details about this task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormField>

          <FormField label="Priority" required>
            <Select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </FormField>

          <FormField label="Due Date">
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </FormField>

          <ModalActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </ModalActions>
        </div>
      </Modal>
    </div>
  )
}

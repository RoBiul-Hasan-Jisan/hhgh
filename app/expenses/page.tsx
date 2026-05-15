'use client'

import React, { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button-custom'
import { Modal, ModalActions } from '@/components/ui/modal'
import { FormField, Input, Select, Textarea } from '@/components/ui/form-field'
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table-custom'
import { Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Other',
]

export default function ExpensesPage() {
  const finance = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  })

  const handleAddExpense = () => {
    if (!formData.description || !formData.amount) return

    finance.addExpense({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    })

    setFormData({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
    })
    setIsModalOpen(false)
  }

  const totalByCategory = EXPENSE_CATEGORIES.map((cat) => ({
    category: cat,
    total: finance.expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0),
  }))

  return (
    <div className="bg-background">
      <Navigation />

      <div className="pt-24 px-4 py-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
              <p className="text-muted-foreground mt-1">Track and manage your spending</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {totalByCategory.map((item) => (
              <div key={item.category} className="bg-card rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  ${item.total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Description</TableHeaderCell>
                  <TableHeaderCell>Category</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell align="right">Amount</TableHeaderCell>
                  <TableHeaderCell align="center">Action</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {finance.expenses.length > 0 ? (
                  finance.expenses
                    .slice()
                    .reverse()
                    .map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            {expense.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right" className="font-semibold">
                          ${expense.amount.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <button
                            onClick={() => finance.deleteExpense(expense.id)}
                            className="inline-flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No expenses yet. Add one to get started!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Expense"
        description="Record a new expense"
      >
        <div className="space-y-4">
          <FormField label="Description" required>
            <Input
              placeholder="e.g., Grocery shopping"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormField>

          <FormField label="Amount" required>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </FormField>

          <FormField label="Category" required>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Date" required>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </FormField>

          <ModalActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </ModalActions>
        </div>
      </Modal>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button-custom'
import { Modal, ModalActions } from '@/components/ui/modal'
import { FormField, Input, Select } from '@/components/ui/form-field'
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table-custom'
import { Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other']

export default function IncomePage() {
  const finance = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    category: 'Salary',
    date: new Date().toISOString().split('T')[0],
  })

  const handleAddIncome = () => {
    if (!formData.source || !formData.amount) return

    finance.addIncome({
      source: formData.source,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    })

    setFormData({
      source: '',
      amount: '',
      category: 'Salary',
      date: new Date().toISOString().split('T')[0],
    })
    setIsModalOpen(false)
  }

  const totalByCategory = INCOME_CATEGORIES.map((cat) => ({
    category: cat,
    total: finance.income
      .filter((i) => i.category === cat)
      .reduce((sum, i) => sum + i.amount, 0),
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:ml-64 p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Income</h1>
              <p className="text-muted-foreground mt-1">Track your income sources</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Income
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {totalByCategory.map((item) => (
              <div key={item.category} className="bg-card rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  ${item.total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Source</TableHeaderCell>
                  <TableHeaderCell>Category</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell align="right">Amount</TableHeaderCell>
                  <TableHeaderCell align="center">Action</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {finance.income.length > 0 ? (
                  finance.income
                    .slice()
                    .reverse()
                    .map((income) => (
                      <TableRow key={income.id}>
                        <TableCell className="font-medium">{income.source}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            {income.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(income.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right" className="font-semibold text-green-600">
                          +${income.amount.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <button
                            onClick={() => finance.deleteIncome(income.id)}
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
                      No income recorded yet.
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
        title="Add Income"
        description="Record a new income source"
      >
        <div className="space-y-4">
          <FormField label="Source" required>
            <Input
              placeholder="e.g., Monthly salary"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
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
              {INCOME_CATEGORIES.map((cat) => (
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
            <Button onClick={handleAddIncome}>Add Income</Button>
          </ModalActions>
        </div>
      </Modal>
    </div>
  )
}

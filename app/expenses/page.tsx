'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Trash2,
  Wallet,
  Receipt,
  TrendingDown,
} from 'lucide-react'

import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'

import { Button } from '@/components/ui/button-custom'
import { Modal, ModalActions } from '@/components/ui/modal'
import { FormField, Input, Select } from '@/components/ui/form-field'

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
      amount: Number(formData.amount),
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

  const totalExpense = finance.expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  )

  const totalByCategory = useMemo(() => {
    return EXPENSE_CATEGORIES.map((cat) => ({
      category: cat,
      total: finance.expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0),
    }))
  }, [finance.expenses])

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex">
      <Navigation />

      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Expense Tracker
              </h1>

              <p className="text-gray-400 mt-2">
                Manage your daily spending smartly
              </p>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white border-0 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </motion.div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    Total Expenses
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    ${totalExpense.toFixed(2)}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
                  <Wallet className="text-red-400" />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    Transactions
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {finance.expenses.length}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Receipt className="text-blue-400" />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    Average Expense
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    $
                    {finance.expenses.length
                      ? (
                          totalExpense / finance.expenses.length
                        ).toFixed(2)
                      : '0.00'}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingDown className="text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORY CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
            {totalByCategory.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 hover:bg-white/10 transition"
              >
                <p className="text-sm text-gray-400">
                  {item.category}
                </p>

                <h3 className="text-xl font-bold mt-2">
                  ${item.total.toFixed(2)}
                </h3>
              </motion.div>
            ))}
          </div>

          {/* TABLE */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="text-left p-5 text-sm font-medium text-gray-400">
                      Description
                    </th>

                    <th className="text-left p-5 text-sm font-medium text-gray-400">
                      Category
                    </th>

                    <th className="text-left p-5 text-sm font-medium text-gray-400">
                      Date
                    </th>

                    <th className="text-right p-5 text-sm font-medium text-gray-400">
                      Amount
                    </th>

                    <th className="text-center p-5 text-sm font-medium text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {finance.expenses.length > 0 ? (
                    finance.expenses
                      .slice()
                      .reverse()
                      .map((expense) => (
                        <tr
                          key={expense.id}
                          className="border-b border-white/5 hover:bg-white/5 transition"
                        >
                          <td className="p-5 font-medium">
                            {expense.description}
                          </td>

                          <td className="p-5">
                            <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/20">
                              {expense.category}
                            </span>
                          </td>

                          <td className="p-5 text-gray-400">
                            {new Date(
                              expense.date
                            ).toLocaleDateString()}
                          </td>

                          <td className="p-5 text-right font-bold">
                            ${expense.amount.toFixed(2)}
                          </td>

                          <td className="p-5">
                            <div className="flex justify-center">
                              <button
                                onClick={() =>
                                  finance.deleteExpense(expense.id)
                                }
                                className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-20"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Wallet className="w-10 h-10 text-gray-500" />
                          </div>

                          <h3 className="text-xl font-semibold">
                            No Expenses Yet
                          </h3>

                          <p className="text-gray-400 mt-2">
                            Start tracking your spending now
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Expense"
        description="Track your spending details"
      >
        <div className="space-y-5">
          <FormField label="Description" required>
            <Input
              placeholder="Netflix Subscription"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </FormField>

          <FormField label="Amount" required>
            <Input
              type="number"
              placeholder="100"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: e.target.value,
                })
              }
            />
          </FormField>

          <FormField label="Category" required>
            <Select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Date" required>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: e.target.value,
                })
              }
            />
          </FormField>

          <ModalActions>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleAddExpense}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0"
            >
              Add Expense
            </Button>
          </ModalActions>
        </div>
      </Modal>
    </div>
  )
}
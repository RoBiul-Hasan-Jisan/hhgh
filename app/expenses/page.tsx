'use client'

import React, { useState, useMemo } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button-custom'
import { Modal, ModalActions } from '@/components/ui/modal'
import { FormField, Input, Select, Textarea } from '@/components/ui/form-field'
import { 
  Plus, Trash2, TrendingUp, Calendar, Wallet, PieChart, 
  Search, Filter, Download, ChevronDown, AlertCircle,
  Coffee, Car, ShoppingBag, Home, Heart, Briefcase, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, BarChart3
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const EXPENSE_CATEGORIES = [
  { value: 'Food', label: 'Food & Dining', icon: Coffee, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { value: 'Transport', label: 'Transportation', icon: Car, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'Entertainment', label: 'Entertainment', icon: MoreHorizontal, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'Shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  { value: 'Bills', label: 'Bills & Utilities', icon: Home, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'Healthcare', label: 'Healthcare', icon: Heart, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'Other', label: 'Other', icon: Briefcase, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
]

// Extended Expense type with notes
interface ExtendedExpense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  notes?: string
  createdAt?: Date
}

export default function ExpensesPage() {
  const finance = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
  const [chartView, setChartView] = useState<'grid' | 'list'>('grid')
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null)
  
  // State for notes storage (client-side only)
  const [expenseNotes, setExpenseNotes] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  // Get expenses with notes
  const expensesWithNotes = useMemo(() => {
    return finance.expenses.map(expense => ({
      ...expense,
      notes: expenseNotes[expense.id] || ''
    }))
  }, [finance.expenses, expenseNotes])

  // Statistics
  const stats = useMemo(() => {
    const total = expensesWithNotes.reduce((sum, e) => sum + e.amount, 0)
    const average = total / (expensesWithNotes.length || 1)
    const highest = Math.max(...expensesWithNotes.map(e => e.amount), 0)
    const monthlyTotal = expensesWithNotes
      .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
      .reduce((sum, e) => sum + e.amount, 0)
    
    return { total, average, highest, monthlyTotal }
  }, [expensesWithNotes])

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let filtered = [...expensesWithNotes]
    
    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(e => e.category === selectedCategory)
    }
    
    if (dateRange.start) {
      filtered = filtered.filter(e => e.date >= dateRange.start)
    }
    if (dateRange.end) {
      filtered = filtered.filter(e => e.date <= dateRange.end)
    }
    
    filtered.sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount
      }
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return 0
    })
    
    return filtered
  }, [expensesWithNotes, searchTerm, selectedCategory, dateRange, sortConfig])

  const totalByCategory = EXPENSE_CATEGORIES.map((cat) => ({
    ...cat,
    total: expensesWithNotes
      .filter((e) => e.category === cat.value)
      .reduce((sum, e) => sum + e.amount, 0),
  }))

  const handleAddExpense = () => {
    if (!formData.description || !formData.amount) return

    const newExpense = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    }

    const addedExpense = finance.addExpense(newExpense)
    
    // Store notes separately if needed
    if (formData.notes && addedExpense?.id) {
      setExpenseNotes(prev => ({
        ...prev,
        [addedExpense.id]: formData.notes
      }))
    }

    setFormData({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    })
    setIsModalOpen(false)
  }

  const handleDeleteExpense = (id: string) => {
    finance.deleteExpense(id)
    // Also delete associated notes
    setExpenseNotes(prev => {
      const newNotes = { ...prev }
      delete newNotes[id]
      return newNotes
    })
  }

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  const getTotalForPeriod = (days: number) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return expensesWithNotes
      .filter(e => new Date(e.date) >= cutoff)
      .reduce((sum, e) => sum + e.amount, 0)
  }

  const activeFiltersCount = () => {
    let count = 0
    if (searchTerm) count++
    if (selectedCategory !== 'All') count++
    if (dateRange.start || dateRange.end) count++
    return count
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setDateRange({ start: '', end: '' })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navigation />

      {/* Main Content - Mobile First */}
      <div className="pt-20 sm:pt-24 px-3 sm:px-4 md:px-6 lg:px-8 pb-20 sm:pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Expenses
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                Track, analyze, and optimize your spending
              </p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              size="md"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              Add Expense
            </Button>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-5 sm:mb-8">
            {[
              { label: 'Total Spent', value: `$${stats.total.toFixed(2)}`, icon: Wallet, change: '+12%', trend: 'up' },
              { label: 'This Month', value: `$${stats.monthlyTotal.toFixed(2)}`, icon: Calendar, change: '-5%', trend: 'down' },
              { label: 'Average', value: `$${stats.average.toFixed(2)}`, icon: TrendingUp, change: '+3%', trend: 'up' },
              { label: 'Highest', value: `$${stats.highest.toFixed(2)}`, icon: PieChart, change: '$120', trend: 'up' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2 text-gray-900 dark:text-white wrap-break-word">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-1 sm:mt-2">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">vs last month</span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shrink-0">
                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Category Breakdown & Recent Activity - Stack on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-5 sm:mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Category Breakdown</h3>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={() => setChartView('grid')}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${chartView === 'grid' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700' : 'text-gray-500'}`}
                  >
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-sm bg-current"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-sm bg-current"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setChartView('list')}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${chartView === 'list' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700' : 'text-gray-500'}`}
                  >
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
              
              <div className={`grid ${chartView === 'grid' ? 'grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3' : 'gap-2'}`}>
                {totalByCategory.map((item) => (
                  <motion.div
                    key={item.value}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer ${chartView === 'list' ? 'flex items-center justify-between' : ''}`}
                  >
                    {chartView === 'grid' ? (
                      <>
                        <div className={`inline-flex p-1.5 sm:p-2 rounded-lg ${item.color}`}>
                          <item.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mt-2 sm:mt-3 wrap-break-word">
                          {item.label}
                        </p>
                        <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mt-1">
                          ${item.total.toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`p-1.5 sm:p-2 rounded-lg ${item.color}`}>
                            <item.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                            <p className="text-xs text-gray-500">{((item.total / stats.total) * 100 || 0).toFixed(1)}%</p>
                          </div>
                        </div>
                        <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">${item.total.toFixed(2)}</p>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity - Mobile Friendly */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Recent Activity</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last 7 days</span>
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">${getTotalForPeriod(7).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</span>
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">${getTotalForPeriod(30).toFixed(2)}</span>
                </div>
                <div className="pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Daily average</span>
                    <span className="text-sm sm:text-base font-semibold text-blue-600">${(stats.total / 30).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filter Bar - Mobile Optimized */}
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-lg">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-900"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="relative gap-1 sm:gap-2"
              >
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {activeFiltersCount()}
                  </span>
                )}
              </Button>
            </div>

            {/* Expandable Filter Panel */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-3">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-900"
                      >
                        <option value="All">All Categories</option>
                        {EXPENSE_CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                      
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <input
                          type="date"
                          placeholder="From"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                          className="px-3 sm:px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-900"
                        />
                        <input
                          type="date"
                          placeholder="To"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                          className="px-3 sm:px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-900"
                        />
                      </div>
                      
                      {activeFiltersCount() > 0 && (
                        <Button variant="outline" onClick={clearFilters} className="w-full text-sm">
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Card View - Better for small screens */}
          <div className="block lg:hidden space-y-3">
            <AnimatePresence>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, idx) => {
                  const category = EXPENSE_CATEGORIES.find(c => c.value === expense.category)
                  const isExpanded = selectedExpenseId === expense.id
                  
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${category?.color}`}>
                              {category && <category.icon className="h-3 w-3" />}
                              {category?.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            {expense.description}
                          </p>
                          {expense.notes && isExpanded && (
                            <p className="text-xs text-gray-500 mt-2">{expense.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                            ${expense.amount.toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="mt-2 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                      {expense.notes && (
                        <button
                          onClick={() => setSelectedExpenseId(isExpanded ? null : expense.id)}
                          className="mt-2 text-xs text-blue-600 dark:text-blue-400"
                        >
                          {isExpanded ? 'Show less' : 'Show notes'}
                        </button>
                      )}
                    </motion.div>
                  )
                })
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 mb-3">No expenses found</p>
                  <Button variant="outline" onClick={() => setIsModalOpen(true)} size="md">
                    Add your first expense
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {['Description', 'Category', 'Date', 'Amount', 'Actions'].map((header, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors"
                        onClick={() => header !== 'Actions' && handleSort(header.toLowerCase())}
                      >
                        <div className="flex items-center gap-2">
                          {header}
                          {sortConfig.key === header.toLowerCase() && (
                            <ChevronDown className={`h-3 w-3 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <AnimatePresence>
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((expense, idx) => {
                        const category = EXPENSE_CATEGORIES.find(c => c.value === expense.category)
                        return (
                          <motion.tr
                            key={expense.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: idx * 0.05 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
                                {expense.notes && (
                                  <p className="text-sm text-gray-500 mt-1">{expense.notes}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${category?.color}`}>
                                {category && <category.icon className="h-3 w-3" />}
                                {category?.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              {new Date(expense.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${expense.amount.toFixed(2)}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </button>
                            </td>
                          </motion.tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <AlertCircle className="h-12 w-12 text-gray-400" />
                            <p className="text-gray-500 dark:text-gray-400">No expenses found</p>
                            <Button variant="outline" onClick={() => setIsModalOpen(true)} size="md">
                              Add your first expense
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Optimized Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Expense"
        description="Record your spending with detailed information"
      >
        <div className="space-y-4">
          <FormField label="Description" required>
            <Input
              placeholder="e.g., Weekly grocery shopping"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-base"
            />
          </FormField>

          <FormField label="Amount" required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
              <Input
                type="number"
                placeholder="0.00"
                className="pl-8 text-base"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </FormField>

          <FormField label="Category" required>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
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

          <FormField label="Notes (Optional)">
            <Textarea
              placeholder="Add any additional details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </FormField>

          <ModalActions className="flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleAddExpense} className="w-full sm:w-auto">
              Add Expense
            </Button>
          </ModalActions>
        </div>
      </Modal>
    </div>
  )
}
export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  createdAt: number
}

export interface Income {
  id: string
  source: string
  amount: number
  category: string
  date: string
  createdAt: number
}

export interface Investment {
  id: string
  name: string
  type: string
  amount: number
  currentValue: number
  date: string
  createdAt: number
}

export interface Subscription {
  id: string
  name: string
  amount: number
  billingCycle: 'daily' | 'weekly' | 'monthly' | 'yearly'
  nextBillingDate: string
  createdAt: number
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: 'monthly' | 'yearly'
  month: string
  createdAt: number
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: string
  createdAt: number
}

export interface Habit {
  id: string
  name: string
  description: string
  frequency: 'daily' | 'weekly' | 'monthly'
  streak: number
  lastCompletedDate: string
  color: string
  createdAt: number
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: number
}

export interface Note {
  id: string
  title: string
  content: string
  color: string
  pinned: boolean
  createdAt: number
}

export interface UserPreferences {
  currency: string
  locale: string
  plan: 'basic' | 'premium'
  theme: 'light' | 'dark' | 'system'
}

const STORAGE_KEY = 'expense_fyi_data'

const defaultPreferences: UserPreferences = {
  currency: 'USD',
  locale: 'en-US',
  plan: 'basic',
}

export const storage = {
  // Expenses
  getExpenses: (): Expense[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data).expenses || [] : []
  },

  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.expenses = [...(data.expenses || []), newExpense]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return newExpense
  },

  updateExpense: (id: string, updates: Partial<Expense>): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const index = data.expenses?.findIndex((e: Expense) => e.id === id)
    if (index !== undefined && index > -1) {
      data.expenses[index] = { ...data.expenses[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  },

  deleteExpense: (id: string): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.expenses = data.expenses?.filter((e: Expense) => e.id !== id) || []
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  // Income
  getIncome: (): Income[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data).income || [] : []
  },

  addIncome: (income: Omit<Income, 'id' | 'createdAt'>): Income => {
    const newIncome: Income = {
      ...income,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.income = [...(data.income || []), newIncome]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return newIncome
  },

  updateIncome: (id: string, updates: Partial<Income>): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const index = data.income?.findIndex((i: Income) => i.id === id)
    if (index !== undefined && index > -1) {
      data.income[index] = { ...data.income[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  },

  deleteIncome: (id: string): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.income = data.income?.filter((i: Income) => i.id !== id) || []
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  // Investments
  getInvestments: (): Investment[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data).investments || [] : []
  },

  addInvestment: (investment: Omit<Investment, 'id' | 'createdAt'>): Investment => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.investments = [...(data.investments || []), newInvestment]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return newInvestment
  },

  updateInvestment: (id: string, updates: Partial<Investment>): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const index = data.investments?.findIndex((i: Investment) => i.id === id)
    if (index !== undefined && index > -1) {
      data.investments[index] = { ...data.investments[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  },

  deleteInvestment: (id: string): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.investments = data.investments?.filter((i: Investment) => i.id !== id) || []
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  // Subscriptions
  getSubscriptions: (): Subscription[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data).subscriptions || [] : []
  },

  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>): Subscription => {
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.subscriptions = [...(data.subscriptions || []), newSubscription]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return newSubscription
  },

  updateSubscription: (id: string, updates: Partial<Subscription>): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const index = data.subscriptions?.findIndex((s: Subscription) => s.id === id)
    if (index !== undefined && index > -1) {
      data.subscriptions[index] = { ...data.subscriptions[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  },

  deleteSubscription: (id: string): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.subscriptions = data.subscriptions?.filter((s: Subscription) => s.id !== id) || []
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  // Preferences
  getPreferences: (): UserPreferences => {
    if (typeof window === 'undefined') return defaultPreferences
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data).preferences || defaultPreferences : defaultPreferences
  },

  updatePreferences: (preferences: Partial<UserPreferences>): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.preferences = { ...storage.getPreferences(), ...preferences }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  // Budgets
  getBudgets: (): Budget[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data).budgets || [] : []
  },

  addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>): Budget => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.budgets = [...(data.budgets || []), newBudget]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return newBudget
  },

  updateBudget: (id: string, updates: Partial<Budget>): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const index = data.budgets?.findIndex((b: Budget) => b.id === id)
    if (index !== undefined && index > -1) {
      data.budgets[index] = { ...data.budgets[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  },

  deleteBudget: (id: string): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.budgets = data.budgets?.filter((b: Budget) => b.id !== id) || []
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  // Goals
  getGoals: (): Goal[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data).goals || [] : []
  },

  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>): Goal => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.goals = [...(data.goals || []), newGoal]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return newGoal
  },

  updateGoal: (id: string, updates: Partial<Goal>): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const index = data.goals?.findIndex((g: Goal) => g.id === id)
    if (index !== undefined && index > -1) {
      data.goals[index] = { ...data.goals[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  },

  deleteGoal: (id: string): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.goals = data.goals?.filter((g: Goal) => g.id !== id) || []
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  // Habits
  getHabits: (): Habit[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data).habits || [] : []
  },

  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>): Habit => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.habits = [...(data.habits || []), newHabit]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return newHabit
  },

  updateHabit: (id: string, updates: Partial<Habit>): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const index = data.habits?.findIndex((h: Habit) => h.id === id)
    if (index !== undefined && index > -1) {
      data.habits[index] = { ...data.habits[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  },

  deleteHabit: (id: string): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.habits = data.habits?.filter((h: Habit) => h.id !== id) || []
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  // Tasks
  getTasks: (): Task[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data).tasks || [] : []
  },

  addTask: (task: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.tasks = [...(data.tasks || []), newTask]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return newTask
  },

  updateTask: (id: string, updates: Partial<Task>): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const index = data.tasks?.findIndex((t: Task) => t.id === id)
    if (index !== undefined && index > -1) {
      data.tasks[index] = { ...data.tasks[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  },

  deleteTask: (id: string): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.tasks = data.tasks?.filter((t: Task) => t.id !== id) || []
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  // Notes
  getNotes: (): Note[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data).notes || [] : []
  },

  addNote: (note: Omit<Note, 'id' | 'createdAt'>): Note => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.notes = [...(data.notes || []), newNote]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return newNote
  },

  updateNote: (id: string, updates: Partial<Note>): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const index = data.notes?.findIndex((n: Note) => n.id === id)
    if (index !== undefined && index > -1) {
      data.notes[index] = { ...data.notes[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  },

  deleteNote: (id: string): void => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data.notes = data.notes?.filter((n: Note) => n.id !== id) || []
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  // Export/Import
  exportData: (): string => {
    if (typeof window === 'undefined') return ''
    const data = localStorage.getItem(STORAGE_KEY) || '{}'
    return data
  },

  importData: (jsonData: string): void => {
    try {
      const parsed = JSON.parse(jsonData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
    } catch (error) {
      console.error('Invalid JSON data', error)
    }
  },

  // Clear all data
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY)
  },
}

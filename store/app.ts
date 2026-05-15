import { create } from 'zustand'
import { storage, Expense, Income, Investment, Subscription, Budget, Goal, Habit, Task, Note, UserPreferences } from '@/lib/storage'

interface AppState {
  // Financial Data
  expenses: Expense[]
  income: Income[]
  investments: Investment[]
  subscriptions: Subscription[]
  budgets: Budget[]
  goals: Goal[]

  // Life Management
  habits: Habit[]
  tasks: Task[]
  notes: Note[]

  // User Preferences
  preferences: UserPreferences

  // Financial Actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void
  updateExpense: (id: string, updates: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  refreshExpenses: () => void

  addIncome: (income: Omit<Income, 'id' | 'createdAt'>) => void
  updateIncome: (id: string, updates: Partial<Income>) => void
  deleteIncome: (id: string) => void
  refreshIncome: () => void

  addInvestment: (investment: Omit<Investment, 'id' | 'createdAt'>) => void
  updateInvestment: (id: string, updates: Partial<Investment>) => void
  deleteInvestment: (id: string) => void
  refreshInvestments: () => void

  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => void
  updateSubscription: (id: string, updates: Partial<Subscription>) => void
  deleteSubscription: (id: string) => void
  refreshSubscriptions: () => void

  addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>) => void
  updateBudget: (id: string, updates: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  refreshBudgets: () => void

  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  refreshGoals: () => void

  // Life Management Actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  refreshHabits: () => void

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  refreshTasks: () => void

  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  refreshNotes: () => void

  // Preferences
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  refreshPreferences: () => void

  // Data Management
  refreshAll: () => void
  exportData: () => string
  importData: (jsonData: string) => void
  clearAllData: () => void
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  expenses: [],
  income: [],
  investments: [],
  subscriptions: [],
  budgets: [],
  goals: [],
  habits: [],
  tasks: [],
  notes: [],
  preferences: {
    currency: 'USD',
    locale: 'en-US',
    plan: 'basic',
    theme: 'system',
  },

  // Expense actions
  addExpense: (expense) => {
    const newExpense = storage.addExpense(expense)
    set((state) => ({ expenses: [...state.expenses, newExpense] }))
  },
  updateExpense: (id, updates) => {
    storage.updateExpense(id, updates)
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }))
  },
  deleteExpense: (id) => {
    storage.deleteExpense(id)
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }))
  },
  refreshExpenses: () => {
    set({ expenses: storage.getExpenses() })
  },

  // Income actions
  addIncome: (income) => {
    const newIncome = storage.addIncome(income)
    set((state) => ({ income: [...state.income, newIncome] }))
  },
  updateIncome: (id, updates) => {
    storage.updateIncome(id, updates)
    set((state) => ({
      income: state.income.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }))
  },
  deleteIncome: (id) => {
    storage.deleteIncome(id)
    set((state) => ({ income: state.income.filter((i) => i.id !== id) }))
  },
  refreshIncome: () => {
    set({ income: storage.getIncome() })
  },

  // Investment actions
  addInvestment: (investment) => {
    const newInvestment = storage.addInvestment(investment)
    set((state) => ({ investments: [...state.investments, newInvestment] }))
  },
  updateInvestment: (id, updates) => {
    storage.updateInvestment(id, updates)
    set((state) => ({
      investments: state.investments.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }))
  },
  deleteInvestment: (id) => {
    storage.deleteInvestment(id)
    set((state) => ({ investments: state.investments.filter((i) => i.id !== id) }))
  },
  refreshInvestments: () => {
    set({ investments: storage.getInvestments() })
  },

  // Subscription actions
  addSubscription: (subscription) => {
    const newSubscription = storage.addSubscription(subscription)
    set((state) => ({ subscriptions: [...state.subscriptions, newSubscription] }))
  },
  updateSubscription: (id, updates) => {
    storage.updateSubscription(id, updates)
    set((state) => ({
      subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  },
  deleteSubscription: (id) => {
    storage.deleteSubscription(id)
    set((state) => ({ subscriptions: state.subscriptions.filter((s) => s.id !== id) }))
  },
  refreshSubscriptions: () => {
    set({ subscriptions: storage.getSubscriptions() })
  },

  // Budget actions
  addBudget: (budget) => {
    const newBudget = storage.addBudget(budget)
    set((state) => ({ budgets: [...state.budgets, newBudget] }))
  },
  updateBudget: (id, updates) => {
    storage.updateBudget(id, updates)
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }))
  },
  deleteBudget: (id) => {
    storage.deleteBudget(id)
    set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) }))
  },
  refreshBudgets: () => {
    set({ budgets: storage.getBudgets() })
  },

  // Goal actions
  addGoal: (goal) => {
    const newGoal = storage.addGoal(goal)
    set((state) => ({ goals: [...state.goals, newGoal] }))
  },
  updateGoal: (id, updates) => {
    storage.updateGoal(id, updates)
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }))
  },
  deleteGoal: (id) => {
    storage.deleteGoal(id)
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }))
  },
  refreshGoals: () => {
    set({ goals: storage.getGoals() })
  },

  // Habit actions
  addHabit: (habit) => {
    const newHabit = storage.addHabit(habit)
    set((state) => ({ habits: [...state.habits, newHabit] }))
  },
  updateHabit: (id, updates) => {
    storage.updateHabit(id, updates)
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    }))
  },
  deleteHabit: (id) => {
    storage.deleteHabit(id)
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }))
  },
  refreshHabits: () => {
    set({ habits: storage.getHabits() })
  },

  // Task actions
  addTask: (task) => {
    const newTask = storage.addTask(task)
    set((state) => ({ tasks: [...state.tasks, newTask] }))
  },
  updateTask: (id, updates) => {
    storage.updateTask(id, updates)
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
  },
  deleteTask: (id) => {
    storage.deleteTask(id)
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
  },
  refreshTasks: () => {
    set({ tasks: storage.getTasks() })
  },

  // Note actions
  addNote: (note) => {
    const newNote = storage.addNote(note)
    set((state) => ({ notes: [...state.notes, newNote] }))
  },
  updateNote: (id, updates) => {
    storage.updateNote(id, updates)
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }))
  },
  deleteNote: (id) => {
    storage.deleteNote(id)
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }))
  },
  refreshNotes: () => {
    set({ notes: storage.getNotes() })
  },

  // Preference actions
  updatePreferences: (prefs) => {
    storage.updatePreferences(prefs)
    set((state) => ({
      preferences: { ...state.preferences, ...prefs },
    }))
  },
  refreshPreferences: () => {
    set({ preferences: storage.getPreferences() })
  },

  // Data management
  refreshAll: () => {
    set({
      expenses: storage.getExpenses(),
      income: storage.getIncome(),
      investments: storage.getInvestments(),
      subscriptions: storage.getSubscriptions(),
      budgets: storage.getBudgets(),
      goals: storage.getGoals(),
      habits: storage.getHabits(),
      tasks: storage.getTasks(),
      notes: storage.getNotes(),
      preferences: storage.getPreferences(),
    })
  },
  exportData: () => storage.exportData(),
  importData: (jsonData) => {
    storage.importData(jsonData)
    set({
      expenses: storage.getExpenses(),
      income: storage.getIncome(),
      investments: storage.getInvestments(),
      subscriptions: storage.getSubscriptions(),
      budgets: storage.getBudgets(),
      goals: storage.getGoals(),
      habits: storage.getHabits(),
      tasks: storage.getTasks(),
      notes: storage.getNotes(),
      preferences: storage.getPreferences(),
    })
  },
  clearAllData: () => {
    storage.clearAll()
    set({
      expenses: [],
      income: [],
      investments: [],
      subscriptions: [],
      budgets: [],
      goals: [],
      habits: [],
      tasks: [],
      notes: [],
      preferences: {
        currency: 'USD',
        locale: 'en-US',
        plan: 'basic',
        theme: 'system',
      },
    })
  },
}))

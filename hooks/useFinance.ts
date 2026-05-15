import { useAppStore } from '@/store/app'

export const useFinance = () => {
  const store = useAppStore()

  const totalExpenses = store.expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalIncome = store.income.reduce((sum, i) => sum + i.amount, 0)
  const totalInvestmentValue = store.investments.reduce((sum, i) => sum + i.currentValue, 0)
  const totalInvestmentCost = store.investments.reduce((sum, i) => sum + i.amount, 0)
  const monthlySubscriptions = store.subscriptions
    .filter((s) => s.billingCycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0)

  const netBalance = totalIncome - totalExpenses
  const investmentReturn = totalInvestmentValue - totalInvestmentCost

  const expensesByCategory = store.expenses.reduce(
    (acc, expense) => {
      const existing = acc.find((e) => e.category === expense.category)
      if (existing) {
        existing.amount += expense.amount
      } else {
        acc.push({ category: expense.category, amount: expense.amount })
      }
      return acc
    },
    [] as { category: string; amount: number }[]
  )

  const incomeByCategory = store.income.reduce(
    (acc, income) => {
      const existing = acc.find((i) => i.category === income.category)
      if (existing) {
        existing.amount += income.amount
      } else {
        acc.push({ category: income.category, amount: income.amount })
      }
      return acc
    },
    [] as { category: string; amount: number }[]
  )

  return {
    ...store,
    totalExpenses,
    totalIncome,
    totalInvestmentValue,
    totalInvestmentCost,
    monthlySubscriptions,
    netBalance,
    investmentReturn,
    expensesByCategory,
    incomeByCategory,
  }
}

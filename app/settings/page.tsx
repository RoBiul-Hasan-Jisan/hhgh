'use client'

import React, { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button-custom'
import { FormField, Input, Select } from '@/components/ui/form-field'
import { Modal, ModalActions } from '@/components/ui/modal'
import { Download, Upload, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY']
const LOCALES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'de-DE', label: 'Deutsch' },
  { value: 'es-ES', label: 'Español' },
]

export default function SettingsPage() {
  const finance = useFinance()
  const [preferences, setPreferences] = useState(finance.preferences)
  const [showClearModal, setShowClearModal] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  const handleSavePreferences = () => {
    finance.updatePreferences(preferences)
    alert('Preferences saved successfully!')
  }

  const handleExportData = () => {
    const data = finance.exportData()
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data))
    element.setAttribute('download', `expense-fyi-backup-${new Date().toISOString().split('T')[0]}.json`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          finance.importData(content)
          finance.refreshAll()
          alert('Data imported successfully!')
          setImportFile(null)
        } catch (error) {
          alert('Failed to import data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleClearData = () => {
    finance.clearAllData()
    setShowClearModal(false)
    alert('All data cleared successfully!')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:ml-64 p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Customize your experience</p>
          </div>

          <div className="max-w-2xl space-y-6">
            {/* Preferences Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-lg p-6 border border-border"
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">Preferences</h2>

              <div className="space-y-4">
                <FormField label="Currency" required>
                  <Select
                    value={preferences.currency}
                    onChange={(e) =>
                      setPreferences({ ...preferences, currency: e.target.value })
                    }
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Language" required>
                  <Select
                    value={preferences.locale}
                    onChange={(e) =>
                      setPreferences({ ...preferences, locale: e.target.value })
                    }
                  >
                    {LOCALES.map((locale) => (
                      <option key={locale.value} value={locale.value}>
                        {locale.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Plan" required>
                  <Select
                    value={preferences.plan}
                    disabled
                  >
                    <option value="basic">Basic (Free)</option>
                    <option value="premium">Premium</option>
                  </Select>
                </FormField>

                <FormField label="Theme" required>
                  <Select
                    value={preferences.theme}
                    onChange={(e) =>
                      setPreferences({ ...preferences, theme: e.target.value as any })
                    }
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </Select>
                </FormField>

                <Button onClick={handleSavePreferences} className="w-full mt-6">
                  Save Preferences
                </Button>
              </div>
            </motion.div>

            {/* Data Management Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-lg p-6 border border-border"
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">Data Management</h2>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    All your data is stored locally in your browser. Back up your data regularly to prevent loss.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleExportData}
                    variant="outline"
                    className="w-full gap-2 justify-start"
                  >
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>

                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                      id="import-file"
                    />
                    <label htmlFor="import-file" className="block">
                      <Button
                        as="span"
                        variant="outline"
                        className="w-full gap-2 justify-start cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        Import Data
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Statistics Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-lg p-6 border border-border"
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">Statistics</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {finance.expenses.length}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {finance.income.length}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Active Budgets</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {finance.budgets.length}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {finance.goals.length}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Habits Tracked</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {finance.habits.length}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Tasks Created</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {finance.tasks.length}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-lg p-6 border border-red-200 dark:border-red-800"
            >
              <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-6">Danger Zone</h2>

              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 mb-4">
                <p className="text-sm text-red-900 dark:text-red-200">
                  Clearing all data is permanent and cannot be undone. Make sure you have backed up your data before proceeding.
                </p>
              </div>

              <Button
                onClick={() => setShowClearModal(true)}
                variant="destructive"
                className="w-full gap-2 justify-start"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear All Data"
        description="This action cannot be undone"
      >
        <div className="space-y-4">
          <p className="text-foreground">
            Are you sure you want to delete all your data? This will permanently remove:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>All expenses and income records</li>
            <li>All budgets and savings goals</li>
            <li>All habits and tasks</li>
            <li>All notes</li>
          </ul>

          <ModalActions>
            <Button variant="outline" onClick={() => setShowClearModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearData}>
              Delete Everything
            </Button>
          </ModalActions>
        </div>
      </Modal>
    </div>
  )
}

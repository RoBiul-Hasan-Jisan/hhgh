'use client'

import React, { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button-custom'
import { FormField, Select } from '@/components/ui/form-field'
import { Modal, ModalActions } from '@/components/ui/modal'
import { Download, Upload, Trash2 } from 'lucide-react'

const CURRENCIES = ['BAN','USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY']

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

  const handleSavePreferences = () => {
    finance.updatePreferences(preferences)
  }

  const card =
    'rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-5 sm:p-6 shadow-sm hover:shadow-md transition'

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 pb-16 space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your preferences and data
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* PREFERENCES */}
          <section className={card}>
            <h2 className="text-lg font-semibold mb-5">Preferences</h2>

            <div className="space-y-4">
              <FormField label="Currency">
                <Select
                  value={preferences.currency}
                  onChange={(e) =>
                    setPreferences({ ...preferences, currency: e.target.value })
                  }
                >
                  {CURRENCIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Language">
                <Select
                  value={preferences.locale}
                  onChange={(e) =>
                    setPreferences({ ...preferences, locale: e.target.value })
                  }
                >
                  {LOCALES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Theme">
                <Select
                  value={preferences.theme}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      theme: e.target.value as any,
                    })
                  }
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </Select>
              </FormField>

              <Button onClick={handleSavePreferences} className="w-full mt-2">
                Save Changes
              </Button>
            </div>
          </section>

          {/* DATA MANAGEMENT */}
          <section className={card}>
            <h2 className="text-lg font-semibold mb-5">Data</h2>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="h-4 w-4" />
                Export Backup
              </Button>

              <label className="block">
                <input type="file" className="hidden" />
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
              </label>

              <p className="text-xs text-muted-foreground pt-2">
                Stored locally in your browser
              </p>
            </div>
          </section>

          {/* STATS */}
          <section className={`${card} lg:col-span-2`}>
            <h2 className="text-lg font-semibold mb-5">Overview</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                ['Expenses', finance.expenses.length],
                ['Income', finance.income.length],
                ['Budgets', finance.budgets.length],
                ['Goals', finance.goals.length],
                ['Habits', finance.habits.length],
                ['Tasks', finance.tasks.length],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl bg-muted/40 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold mt-1">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* DANGER ZONE */}
          <section className="lg:col-span-2 rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
            <h2 className="text-lg font-semibold text-red-500">
              Danger Zone
            </h2>

            <p className="text-sm text-muted-foreground mt-2 mb-4">
              This action is permanent and cannot be undone.
            </p>

            <Button
              variant="destructive"
              onClick={() => setShowClearModal(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </section>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Delete Everything?"
        description="This cannot be undone."
      >
        <ModalActions>
          <Button variant="outline" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive">
            Confirm Delete
          </Button>
        </ModalActions>
      </Modal>
    </div>
  )
}
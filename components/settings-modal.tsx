'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X } from 'lucide-react'
import { UserPreferences } from '@/lib/storage'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  preferences: UserPreferences
  onSave: (preferences: UserPreferences) => void
  onClearData: () => void
}

export function SettingsModal({
  isOpen,
  onClose,
  preferences,
  onSave,
  onClearData,
}: SettingsModalProps) {
  const [formData, setFormData] = useState(preferences)

  if (!isOpen) return null

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      onClearData()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Currency
            </label>
            <select
              className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="AUD">AUD ($)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>

          {/* Locale */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Language
            </label>
            <select
              className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.locale}
              onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="fr-FR">Français</option>
              <option value="de-DE">Deutsch</option>
              <option value="es-ES">Español</option>
              <option value="it-IT">Italiano</option>
            </select>
          </div>

          {/* Plan Info */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground mb-1">Current Plan</p>
            <p className="text-xs text-muted-foreground">
              {formData.plan === 'basic'
                ? 'Basic (Free) - Up to 100 entries'
                : 'Premium - Up to 10,000+ entries, CSV export & priority support'}
            </p>
          </div>

          {/* Danger Zone */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleClearData}
            >
              Clear All Data
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="button" className="flex-1" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

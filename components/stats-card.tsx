import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string
  subtext?: string
  variant?: 'default' | 'positive' | 'negative' | 'accent'
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  subtext,
  variant = 'default',
}: StatsCardProps) {
  const variantColors = {
    default: 'bg-card text-foreground',
    positive: 'bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100',
    negative: 'bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100',
    accent: 'bg-accent/10 text-accent',
  }

  return (
    <Card className={`p-6 ${variantColors[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtext && <p className="text-xs text-muted-foreground mt-2">{subtext}</p>}
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary ml-4">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsChartProps {
  data: any[]
  type: 'bar' | 'pie'
  title: string
  dataKey: string
  nameKey?: string
}

const COLORS = [
  'hsl(var(--color-chart-1))',
  'hsl(var(--color-chart-2))',
  'hsl(var(--color-chart-3))',
  'hsl(var(--color-chart-4))',
  'hsl(var(--color-chart-5))',
]

export function AnalyticsChart({
  data,
  type,
  title,
  dataKey,
  nameKey = 'name',
}: AnalyticsChartProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6 h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No data available yet</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
            <XAxis dataKey={nameKey} stroke="hsl(var(--color-muted-foreground))" />
            <YAxis stroke="hsl(var(--color-muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--color-card))',
                border: '1px solid hsl(var(--color-border))',
                borderRadius: '8px',
              }}
              cursor={{ fill: 'hsl(var(--color-muted))' }}
            />
            <Bar dataKey={dataKey} fill="hsl(var(--color-primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, value }) => `${name}: ${value.toFixed(2)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--color-card))',
                border: '1px solid hsl(var(--color-border))',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </Card>
  )
}

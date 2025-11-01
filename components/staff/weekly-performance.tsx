"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { day: 'Mon', tasks: 4 },
  { day: 'Tue', tasks: 6 },
  { day: 'Wed', tasks: 3 },
  { day: 'Thu', tasks: 8 },
  { day: 'Fri', tasks: 5 },
  { day: 'Sat', tasks: 2 },
  { day: 'Sun', tasks: 1 },
];

export function WeeklyPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Performance</CardTitle>
        <CardDescription>Tasks completed over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="day" 
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        width={20}
                    />
                    <Tooltip 
                        cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                        contentStyle={{ 
                            background: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Line type="monotone" dataKey="tasks" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

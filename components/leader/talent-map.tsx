tiê"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, Tooltip, Scatter, ReferenceArea, Label } from 'recharts';

const talentData = [
  // High Potentials
  { x: 'High', y: 'High', name: 'Alice Johnson', z: 1 },
  { x: 'Medium', y: 'High', name: 'Bob Williams', z: 1 },
  // Core Players
  { x: 'High', y: 'Medium', name: 'Charlie Brown', z: 1 },
  { x: 'High', y: 'Medium', name: 'Diana Miller', z: 1 },
  { x: 'Medium', y: 'Medium', name: 'Ethan Davis', z: 1 },
  // Need Development
  { x: 'Low', y: 'Medium', name: 'Fiona Clark', z: 1 },
  { x: 'Low', y: 'Low', name: 'George Wilson', z: 1 },
   // High Performers, Low Potential
  { x: 'High', y: 'Low', name: 'Helen Moore', z: 1 },
];

const domain = ['Low', 'Medium', 'High'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
        <p className="font-bold">{payload[0].payload.name}</p>
        <p className="text-sm text-muted-foreground">Performance: {payload[0].payload.x}</p>
        <p className="text-sm text-muted-foreground">Potential: {payload[0].payload.y}</p>
      </div>
    );
  }
  return null;
};

export function TalentMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Talent Map (9-Box Grid)</CardTitle>
        <CardDescription>Visualizing team-wide performance vs. potential.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              
              {/* Quadrant Backgrounds */}
              <ReferenceArea x1="Low" x2="Medium" y1="Low" y2="Medium" fill="#fecaca" strokeOpacity={0.3} />
              <ReferenceArea x1="Medium" x2="High" y1="Medium" y2="High" fill="#d9f99d" strokeOpacity={0.3} />
              <ReferenceArea x1="High" x2="High" y1="High" y2="High" fill="#a7f3d0" strokeOpacity={0.3} />

              <XAxis 
                dataKey="x" 
                type="category"
                name="Performance"
                domain={domain}
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              >
                <Label value="Performance" offset={-30} position="insideBottom" fill="hsl(var(--muted-foreground))" fontSize={14} />
              </XAxis>
              <YAxis 
                dataKey="y" 
                type="category"
                name="Potential"
                domain={domain}
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              >
                <Label value="Potential" angle={-90} offset={-25} position="insideLeft" fill="hsl(var(--muted-foreground))" fontSize={14} />
              </YAxis>
              
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              
              <Scatter name="Employees" data={talentData} fill="hsl(var(--primary))" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

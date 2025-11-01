"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone } from "lucide-react"

// TYPE DEFINITIONS
interface CampaignData {
    name: string;
    conversionRate: number;
    cpl: number;
    roi: string;
}

interface CampaignDashboardProps {
    campaigns?: CampaignData[];
}

export function CampaignDashboard({ campaigns = [] }: CampaignDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
        <CardDescription>An overview of current sales and marketing campaigns.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {campaigns.length > 0 ? (
          <>
            <div>
                <h4 className="text-sm font-semibold mb-4">Conversion Rate by Campaign</h4>
                 <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={campaigns}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }}
                        />
                        <Bar dataKey="conversionRate" fill="var(--color-conversionRate)" radius={[4, 4, 0, 0]} className="fill-primary" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div>
                <h4 className="text-sm font-semibold mb-3">Campaign KPIs</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {campaigns.map(campaign => (
                        <div key={campaign.name} className="p-3 border rounded-lg">
                            <p className="text-xs text-muted-foreground">{campaign.name}</p>
                            <p className="text-lg font-bold">{campaign.roi}</p>
                            <p className="text-xs text-muted-foreground">ROI</p>
                        </div>
                    ))}
                </div>
            </div>
          </>
        ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <Megaphone className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-semibold">No Campaign Data</h3>
                <p className="text-sm text-muted-foreground">There is no active campaign data to display.</p>
            </div>
        )}
      </CardContent>
    </Card>
  )
}

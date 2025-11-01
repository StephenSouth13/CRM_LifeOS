"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, Info } from "lucide-react"

// Define the type for a single trend
interface Trend {
    area: string;
    rationale: string;
    riskReward: string;
    aiConfidence: number;
    growthData: {v: number}[];
}

// Define the props for the component
interface AiInvestmentTrendsProps {
    trends: Trend[];
}

export function AiInvestmentTrends({ trends }: AiInvestmentTrendsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            <div>
                <CardTitle>AI-Predicted Internal Investment Trends</CardTitle>
                <CardDescription>Opportunities for capital allocation identified by our predictive AI models.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {trends && trends.length > 0 ? (
            trends.map((trend, index) => (
                <div key={index} className="border p-4 rounded-lg flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                        <h4 className="font-bold">{trend.area}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{trend.rationale}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="outline">{trend.riskReward}</Badge>
                            <Badge>AI Confidence: {trend.aiConfidence}%</Badge>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 lg:w-1/4 h-20 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trend.growthData}>
                                <defs>
                                    <linearGradient id={`trendGradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.9} />
                                    </linearGradient>
                                </defs>
                                <Line type="monotone" dataKey="v" stroke={`url(#trendGradient-${index})`} strokeWidth={3} dot={false}/>
                                <TrendingUp className="h-4 w-4 text-green-500 absolute top-0 right-0" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ))
        ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <Info className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-semibold">No AI Trends Available</h3>
                <p className="text-sm text-muted-foreground">The AI models are currently processing data. Please check back later.</p>
            </div>
        )}
      </CardContent>
    </Card>
  )
}

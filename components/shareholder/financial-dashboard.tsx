"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts"
import { TrendingUp, Scale, Landmark } from "lucide-react"

// TYPE DEFINITIONS

interface FinancialMetric {
    value: string;
    change: string;
}

interface Shareholding {
    shares: number;
    currentValue: number;
    ownership: number;
}

interface StockDataPoint {
    name: string;
    value: number;
}

interface FinancialDashboardProps {
    financials?: {
        revenue: FinancialMetric;
        netProfit: FinancialMetric;
        ebitda: FinancialMetric;
    };
    shareholding?: Shareholding;
    stock?: {
        currentPrice: number;
        changePercent: number;
        history: StockDataPoint[];
    }
}

// HELPER FUNCTIONS
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

export function FinancialDashboard({ financials, shareholding, stock }: FinancialDashboardProps) {
    const isPositiveChange = (stock?.changePercent ?? 0) >= 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Financial Metrics */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Company Financials (YTD)</CardTitle>
                    <CardDescription>Key performance indicators for the current year.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{financials?.revenue.value ?? "N/A"}</div>
                            <p className="text-xs text-muted-foreground">{financials?.revenue.change ?? "..."}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                            <Scale className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{financials?.netProfit.value ?? "N/A"}</div>
                            <p className="text-xs text-muted-foreground">{financials?.netProfit.change ?? "..."}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">EBITDA</CardTitle>
                            <Landmark className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{financials?.ebitda.value ?? "N/A"}</div>
                            <p className="text-xs text-muted-foreground">{financials?.ebitda.change ?? "..."}</p>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
            
            {/* Shareholding Info */}
            <Card>
                <CardHeader>
                    <CardTitle>My Shareholding</CardTitle>
                    <CardDescription>Your personal stake in the company.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-baseline p-3 bg-muted rounded-lg">
                        <span className="text-sm text-muted-foreground">Shares Owned</span>
                        <span className="text-xl font-bold">{shareholding ? formatNumber(shareholding.shares) : "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-baseline p-3 bg-muted rounded-lg">
                        <span className="text-sm text-muted-foreground">Current Value</span>
                        <span className={`text-xl font-bold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>{shareholding ? formatCurrency(shareholding.currentValue) : "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-baseline p-3 bg-muted rounded-lg">
                        <span className="text-sm text-muted-foreground">Ownership</span>
                        <span className="text-xl font-bold">{shareholding ? `${shareholding.ownership}%` : "N/A"}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Stock Price Chart */}
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Stock Price Trend</CardTitle>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold">{stock ? formatCurrency(stock.currentPrice) : "N/A"}</p>
                        {stock && (
                            <p className={`text-sm font-semibold flex items-center ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className="h-3 w-3 mr-1"/>
                                {isPositiveChange ? '+' : ''}{stock.changePercent}%
                            </p>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stock?.history ?? []} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" hide />
                            <Tooltip 
                                contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }}
                                labelStyle={{ fontWeight: 'bold' }}
                                formatter={(value: number) => [formatCurrency(value), 'Price']}
                            />
                            <Area type="monotone" dataKey="value" stroke="var(--color-value)" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

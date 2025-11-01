"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, CreditCard, TrendingUp, TrendingDown } from "lucide-react"

// TYPE DEFINITIONS
interface KpiMetric {
    value: string;
    change: number; // Positive or negative percentage
}

interface SalesKpiProps {
    totalRevenue?: KpiMetric;
    conversionRate?: KpiMetric;
    estimatedCommission?: KpiMetric;
}

const KpiCard: React.FC<{ title: string; metric?: KpiMetric; icon: React.ReactNode }> = ({ title, metric, icon }) => {
    const isPositive = metric ? metric.change >= 0 : false;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;
    const trendColor = isPositive ? 'text-green-600' : 'text-red-600';

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{metric?.value ?? "N/A"}</div>
                {metric && (
                    <p className={`text-xs text-muted-foreground flex items-center`}>
                        <TrendIcon className={`h-3 w-3 mr-1 ${trendColor}`} />
                        {metric.change}% from last month
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export function SalesKpi({ totalRevenue, conversionRate, estimatedCommission }: SalesKpiProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
        <KpiCard 
            title="Total Revenue" 
            metric={totalRevenue} 
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
        />
        <KpiCard 
            title="Conversion Rate" 
            metric={conversionRate} 
            icon={<Users className="h-4 w-4 text-muted-foreground" />} 
        />
        <KpiCard 
            title="Estimated Commission" 
            metric={estimatedCommission} 
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} 
        />
    </div>
  )
}

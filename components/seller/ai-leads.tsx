"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, PlusCircle, UserSearch } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// TYPE DEFINITIONS
interface Lead {
    id: string;
    name: string;
    reason: string;
    matchScore: number;
}

interface AiLeadsProps {
    leads?: Lead[];
}

export function AiLeads({ leads = [] }: AiLeadsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            <div>
                <CardTitle>AI-Powered Lead Suggestions</CardTitle>
                <CardDescription>Hot leads identified by the AI based on recent activity.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {leads.length > 0 ? (
            <ul className="space-y-3">
                {leads.map((lead) => (
                    <li key={lead.id} className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 p-3 rounded-lg border bg-background/70">
                        <div className="flex-1 mb-3 sm:mb-0">
                            <p className="font-semibold text-sm">{lead.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{lead.reason}</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-start">
                            <Badge variant="secondary" className="font-mono text-sm">
                                Match: {lead.matchScore}%
                            </Badge>
                            <Button variant="ghost" size="sm" className="ml-auto sm:ml-3">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add to CRM
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <UserSearch className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-semibold">No New AI Leads</h3>
                <p className="text-sm text-muted-foreground">The AI is analyzing data. Check back soon for new lead suggestions.</p>
            </div>
        )}
      </CardContent>
    </Card>
  )
}

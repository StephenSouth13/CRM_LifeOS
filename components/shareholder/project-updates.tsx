"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FolderGit2 } from "lucide-react"

// TYPE DEFINITIONS
type ProjectStatus = "On Track" | "Completed" | "At Risk";

interface Project {
    id: string;
    name: string;
    manager: string;
    status: ProjectStatus;
    progress: number;
    budget: number;
    actualSpend: number;
    projectedROI: string;
}

interface ProjectUpdatesProps {
    projects?: Project[];
}

const statusColors: { [key in ProjectStatus]: string } = {
    "On Track": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800",
    "Completed": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
    "At Risk": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800",
}

export function ProjectUpdates({ projects = [] }: ProjectUpdatesProps) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Strategic Project Updates</CardTitle>
            <CardDescription>Performance overview of key company initiatives.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {projects.length > 0 ? (
                projects.map(project => (
                    <div key={project.id} className="border p-4 rounded-lg">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                            <div>
                                <h4 className="font-bold">{project.name}</h4>
                                <p className="text-sm text-muted-foreground">Manager: {project.manager}</p>
                            </div>
                            <Badge variant="outline" className={`mt-2 sm:mt-0 ${statusColors[project.status]}`}>{project.status}</Badge>
                        </div>
                        <div className="mb-3">
                            <Progress value={project.progress} className="h-2" />
                            <p className="text-xs text-right mt-1 text-muted-foreground">{project.progress}% Complete</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-center md:text-left">
                            <div>
                                <p className="text-muted-foreground">Budget</p>
                                <p className="font-semibold">${(project.budget / 1000000).toFixed(1)}M</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Actual Spend</p>
                                <p className="font-semibold">${(project.actualSpend / 1000000).toFixed(1)}M</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Projected ROI</p>
                                <p className="font-semibold text-green-600">{project.projectedROI}</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                    <FolderGit2 className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="font-semibold">No Active Projects</h3>
                    <p className="text-sm text-muted-foreground">There are no strategic projects to display at this time.</p>
                </div>
            )}
        </CardContent>
    </Card>
  )
}

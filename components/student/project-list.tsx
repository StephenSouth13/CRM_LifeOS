"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockProjects = [
  {
    id: "MSC-01",
    name: "Micro-SaaS Website Builder",
    role: "Frontend Developer",
    status: "Completed",
    tags: ["MSC", "S17"],
  },
  {
    id: "VSM-03",
    name: "Virtual Sales Assistant",
    role: "UI/UX Designer",
    status: "In Progress",
    tags: ["VSM"],
  },
    {
    id: "S17-Dev",
    name: "S17 Internal Devtool",
    role: "Fullstack Developer",
    status: "In Progress",
    tags: ["S17"],
  },
]

export function ProjectList() {
  const getStatusColor = (status: string) => {
    if (status === "Completed") return "bg-blue-100 text-blue-800"
    if (status === "In Progress") return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>Projects you have participated in.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {mockProjects.map((project) => (
            <li key={project.id} className="p-3 rounded-lg border bg-muted/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{project.name}</p>
                  <p className="text-sm text-muted-foreground">Role: {project.role}</p>
                </div>
                <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
              </div>
              <div className="mt-2 space-x-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

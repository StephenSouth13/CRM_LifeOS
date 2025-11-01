"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud, File, FileCheck, Clock } from "lucide-react"

const recentSubmissions = [
    {
        id: "SUB-001",
        fileName: "social-media-assets-v1.zip",
        status: "Approved",
        date: "2 days ago",
    },
    {
        id: "SUB-002",
        fileName: "blog-post-draft-final.docx",
        status: "Pending Review",
        date: "3 hours ago",
    },
]

export function WorkSubmission() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload for Acceptance</CardTitle>
        <CardDescription>Submit your work files for review and nghiệm thu.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer">
            <UploadCloud className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold">Drag & drop files here</p>
            <p className="text-sm text-muted-foreground">or</p>
            <Button variant="outline" className="mt-2">Browse Files</Button>
        </div>
        <div>
            <h4 className="font-semibold mb-3">Recent Submissions</h4>
            <ul className="space-y-2">
                {recentSubmissions.map(sub => (
                    <li key={sub.id} className="flex items-center space-x-3 text-sm p-2 border rounded-md">
                        {sub.status === "Approved" ? 
                            <FileCheck className="h-5 w-5 text-green-500" /> : 
                            <Clock className="h-5 w-5 text-yellow-600" />
                        }
                        <div className="flex-1">
                            <p className="font-medium truncate">{sub.fileName}</p>
                            <p className="text-xs text-muted-foreground">{sub.status} - {sub.date}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Check, X, Minus, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// TYPE DEFINITIONS

interface Meeting {
    title: string;
    date: string;
    time: string;
}

interface Resolution {
    id: string;
    title: string;
    description: string;
    deadline: string;
    voted: 'yes' | 'no' | 'abstain' | null;
}

interface MeetingsVotingProps {
    nextMeeting?: Meeting | null;
    resolutions?: Resolution[];
}

export function MeetingsVoting({ nextMeeting, resolutions = [] }: MeetingsVotingProps) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Meetings & Voting</CardTitle>
            <CardDescription>Stay informed about corporate governance and decisions.</CardDescription>
        </CardHeader>
        <CardContent>
            {/* Next Meeting Section */}
            <div className="bg-muted/50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Next Shareholder Meeting</h4>
                {nextMeeting ? (
                    <>
                        <p className="font-bold text-primary">{nextMeeting.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-2 space-x-4">
                            <div className="flex items-center"><Calendar className="h-4 w-4 mr-1.5"/>{nextMeeting.date}</div>
                            <div className="flex items-center"><Clock className="h-4 w-4 mr-1.5"/>{nextMeeting.time}</div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button variant="outline">View Agenda & Docs</Button>
                            <Button>Join Virtual Meeting</Button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center py-4">
                         <Info className="h-5 w-5 text-muted-foreground mr-3" />
                        <p className="text-sm text-muted-foreground">No upcoming meetings scheduled.</p>
                    </div>
                )}
            </div>

            <Separator className="my-6"/>

            {/* Voting Section */}
            <div>
                 <h4 className="font-semibold mb-4">Active Resolutions for Voting</h4>
                 <div className="space-y-4">
                    {resolutions.length > 0 ? (
                        resolutions.map(res => (
                            <div key={res.id} className="border p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <h5 className="font-semibold">{res.title}</h5>
                                    <Badge variant="secondary">Deadline: {res.deadline}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground my-2">{res.description}</p>
                                <div className="flex items-center justify-end gap-2 mt-3">
                                    {res.voted ? (
                                        <p className="text-sm font-semibold text-muted-foreground">Your vote: <span className="uppercase text-primary">{res.voted}</span></p>
                                    ) : (
                                        <>
                                            <Button variant="outline" size="sm"><Check className="h-4 w-4 mr-2"/>Approve</Button>
                                            <Button variant="outline" size="sm"><X className="h-4 w-4 mr-2"/>Reject</Button>
                                            <Button variant="ghost" size="sm"><Minus className="h-4 w-4 mr-2"/>Abstain</Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="text-center text-muted-foreground py-6">
                            <p>No active resolutions for voting at the moment.</p>
                        </div>
                    )}
                 </div>
            </div>
        </CardContent>
    </Card>
  )
}

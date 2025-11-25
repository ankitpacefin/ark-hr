"use strict";

import { Application, ApplicationStatus } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MOCK_JOBS } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"

interface ApplicationsKanbanProps {
    applications: Application[]
    onSelectApplication: (app: Application) => void
}

const COLUMNS: ApplicationStatus[] = ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected']

export function ApplicationsKanban({ applications, onSelectApplication }: ApplicationsKanbanProps) {
    return (
        <div className="flex h-full gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(status => {
                const columnApps = applications.filter(app => app.status === status)
                return (
                    <div key={status} className="flex-shrink-0 w-80 flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-semibold">{status}</h3>
                            <Badge variant="secondary">{columnApps.length}</Badge>
                        </div>
                        <ScrollArea className="h-[calc(100vh-250px)]">
                            <div className="flex flex-col gap-3 pr-4">
                                {columnApps.map(app => {
                                    const job = MOCK_JOBS.find(j => j.id === app.jobId)
                                    return (
                                        <Card
                                            key={app.id}
                                            className="cursor-pointer hover:shadow-md transition-shadow"
                                            onClick={() => onSelectApplication(app)}
                                        >
                                            <CardHeader className="p-4 pb-2">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={app.applicant.avatarUrl} />
                                                        <AvatarFallback>{app.applicant.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="overflow-hidden">
                                                        <CardTitle className="text-sm font-medium truncate">{app.applicant.name}</CardTitle>
                                                        <p className="text-xs text-muted-foreground truncate">{job?.title}</p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2">
                                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                    <span>{formatDistanceToNow(new Date(app.appliedAt))} ago</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                )
            })}
        </div>
    )
}

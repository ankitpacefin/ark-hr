"use strict";

import { Application, ApplicationStatus } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MOCK_JOBS } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"
import { Clock, Briefcase } from "lucide-react"
import {
    KanbanBoard,
    KanbanBoardCard,
    KanbanBoardColumn,
    KanbanBoardColumnHeader,
    KanbanBoardColumnList,
    KanbanBoardColumnListItem,
    KanbanBoardColumnTitle,
    KanbanBoardProvider,
} from "@/components/kanban"

interface ApplicationsKanbanProps {
    applications: Application[]
    onSelectApplication: (app: Application) => void
}

const COLUMNS: { id: ApplicationStatus; label: string }[] = [
    { id: 'New', label: 'New' },
    { id: 'Screening', label: 'Screening' },
    { id: 'Interview', label: 'Interview' },
    { id: 'Offer', label: 'Offer' },
    { id: 'Hired', label: 'Hired' },
    { id: 'Rejected', label: 'Rejected' },
]

export function ApplicationsKanban({ applications, onSelectApplication }: ApplicationsKanbanProps) {
    return (
        <KanbanBoardProvider>
            <KanbanBoard className="h-full pt-4">
                {COLUMNS.map(column => {
                    const columnApps = applications.filter(app => app.status === column.id)
                    return (
                        <KanbanBoardColumn key={column.id} columnId={column.id} className="bg-muted/30 border-dashed">
                            <KanbanBoardColumnHeader>
                                <KanbanBoardColumnTitle columnId={column.id} className="uppercase tracking-wider text-xs font-semibold">
                                    {column.label}
                                </KanbanBoardColumnTitle>
                                <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-normal ml-2">
                                    {columnApps.length}
                                </Badge>
                            </KanbanBoardColumnHeader>
                            <KanbanBoardColumnList>
                                {columnApps.map(app => {
                                    const job = MOCK_JOBS.find(j => j.id === app.jobId)
                                    return (
                                        <KanbanBoardColumnListItem key={app.id} cardId={app.id}>
                                            <KanbanBoardCard
                                                data={app}
                                                onClick={() => onSelectApplication(app)}
                                                className="flex flex-col gap-3 p-4 border-l-4 hover:shadow-md transition-all"
                                                style={{ borderLeftColor: getStatusColor(app.status) }}
                                            >
                                                <div className="flex justify-between items-start w-full">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border">
                                                            <AvatarImage src={app.applicant.avatarUrl} />
                                                            <AvatarFallback>{app.applicant.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="text-left">
                                                            <div className="text-sm font-semibold">{app.applicant.name}</div>
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                                <Briefcase className="h-3 w-3" />
                                                                <span className="truncate max-w-[120px]">{job?.title}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-1 w-full">
                                                    {app.applicant.skills?.slice(0, 2).map(skill => (
                                                        <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {app.applicant.skills && app.applicant.skills.length > 2 && (
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                                                            +{app.applicant.skills.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-center text-xs text-muted-foreground w-full pt-2 border-t mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{formatDistanceToNow(new Date(app.appliedAt))} ago</span>
                                                    </div>
                                                    {app.score && (
                                                        <Badge variant="outline" className="text-[10px] h-5 border-green-500 text-green-600 bg-green-50">
                                                            {app.score}% Match
                                                        </Badge>
                                                    )}
                                                </div>
                                            </KanbanBoardCard>
                                        </KanbanBoardColumnListItem>
                                    )
                                })}
                                {columnApps.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-24 text-muted-foreground text-xs italic">
                                        No applications
                                    </div>
                                )}
                            </KanbanBoardColumnList>
                        </KanbanBoardColumn>
                    )
                })}
            </KanbanBoard>
        </KanbanBoardProvider>
    )
}

function getStatusColor(status: ApplicationStatus): string {
    switch (status) {
        case 'New': return '#3b82f6'; // blue-500
        case 'Screening': return '#a855f7'; // purple-500
        case 'Interview': return '#f97316'; // orange-500
        case 'Offer': return '#22c55e'; // green-500
        case 'Hired': return '#10b981'; // emerald-500
        case 'Rejected': return '#ef4444'; // red-500
        default: return '#94a3b8'; // slate-400
    }
}

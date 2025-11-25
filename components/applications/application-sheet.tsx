"use strict";

import { Application } from "@/types"
import { MOCK_HR_PROFILES, MOCK_JOBS } from "@/lib/mock-data"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, Phone, FileText, User, Calendar, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"


interface ApplicationSheetProps {
    application: Application | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ApplicationSheet({ application, open, onOpenChange }: ApplicationSheetProps) {
    const [comment, setComment] = useState("")

    if (!application) return null

    const job = MOCK_JOBS.find(j => j.id === application.jobId)
    const assignedHr = MOCK_HR_PROFILES.find(hr => hr.id === application.assignedTo)

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={application.applicant.avatarUrl} />
                                <AvatarFallback>{application.applicant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <SheetTitle className="text-2xl">{application.applicant.name}</SheetTitle>
                                <SheetDescription>
                                    Applied for <span className="font-semibold text-foreground">{job?.title}</span>
                                </SheetDescription>
                            </div>
                        </div>
                        <Badge variant={application.status === 'Rejected' ? 'destructive' : 'default'} className="text-sm">
                            {application.status}
                        </Badge>
                    </div>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{application.applicant.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{application.applicant.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Applied {formatDistanceToNow(new Date(application.appliedAt))} ago</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <a href={application.applicant.resumeUrl} className="text-primary hover:underline">View Resume</a>
                        </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select defaultValue={application.status}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Screening">Screening</SelectItem>
                                    <SelectItem value="Interview">Interview</SelectItem>
                                    <SelectItem value="Offer">Offer</SelectItem>
                                    <SelectItem value="Hired">Hired</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Assigned HR</label>
                            <Select defaultValue={application.assignedTo || "unassigned"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Assign HR" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    {MOCK_HR_PROFILES.map(hr => (
                                        <SelectItem key={hr.id} value={hr.id}>{hr.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />

                    {/* Comments */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-semibold">
                            <MessageSquare className="h-4 w-4" />
                            Comments & Notes
                        </div>

                        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                            {application.comments.length === 0 ? (
                                <div className="text-center text-sm text-muted-foreground py-8">
                                    No comments yet.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {application.comments.map(comment => (
                                        <div key={comment.id} className="flex gap-3 text-sm">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{comment.authorName}</span>
                                                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                                                </div>
                                                <p>{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        <div className="flex gap-2">
                            <Textarea
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[80px]"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button size="sm" disabled={!comment.trim()}>Post Comment</Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

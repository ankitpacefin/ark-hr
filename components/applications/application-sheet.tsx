"use strict";

import { Application } from "@/types"
import { MOCK_HR_PROFILES, MOCK_JOBS } from "@/lib/mock-data"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Mail,
    Phone,
    FileText,
    Calendar,
    MessageSquare,
    Linkedin,
    Github,
    Globe,
    ExternalLink,
    Copy,
    Check,
    Download,
    ChevronRight
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { toast } from "sonner"

interface ApplicationSheetProps {
    application: Application | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ApplicationSheet({ application, open, onOpenChange }: ApplicationSheetProps) {
    const [comment, setComment] = useState("")
    const [copied, setCopied] = useState(false)

    if (!application) return null

    const job = MOCK_JOBS.find(j => j.id === application.jobId)
    const assignedHr = MOCK_HR_PROFILES.find(hr => hr.id === application.assignedTo)

    const copyEmail = () => {
        navigator.clipboard.writeText(application.applicant.email)
        setCopied(true)
        toast.success("Email copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-2xl w-full p-0 flex flex-col h-full bg-background">
                <div className="p-6 pb-2 border-b">
                    <SheetHeader className="mb-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-border">
                                    <AvatarImage src={application.applicant.avatarUrl} />
                                    <AvatarFallback className="text-lg">{application.applicant.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <SheetTitle className="text-2xl font-bold">{application.applicant.name}</SheetTitle>
                                    <SheetDescription className="text-base">
                                        Applied for <span className="font-semibold text-foreground">{job?.title}</span>
                                    </SheetDescription>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>Applied {formatDistanceToNow(new Date(application.appliedAt))} ago</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge variant={application.status === 'Rejected' ? 'destructive' : 'secondary'} className="text-sm px-3 py-1">
                                    {application.status}
                                </Badge>
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={copyEmail} title="Copy Email">
                                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8" title="View Next">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Status</label>
                            <Select defaultValue={application.status}>
                                <SelectTrigger className="h-9">
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
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Assigned HR</label>
                            <Select defaultValue={application.assignedTo || "unassigned"}>
                                <SelectTrigger className="h-9">
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
                </div>

                <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 border-b">
                        <TabsList className="w-full justify-start h-12 bg-transparent p-0">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4">Overview</TabsTrigger>
                            <TabsTrigger value="resume" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4">Resume</TabsTrigger>
                            <TabsTrigger value="screener" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4">Screener</TabsTrigger>
                            <TabsTrigger value="comments" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4">Comments</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="flex-1 overflow-y-auto p-6 space-y-6 m-0">
                        {/* Contact & Socials */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Contact</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <span className="font-medium">{application.applicant.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <span className="font-medium">{application.applicant.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Socials & Links</h3>
                                <div className="flex flex-wrap gap-2">
                                    {application.applicant.socialLinks?.linkedin && (
                                        <Button variant="outline" size="sm" className="gap-2" asChild>
                                            <a href={application.applicant.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                                <Linkedin className="h-4 w-4 text-blue-600" />
                                                LinkedIn
                                            </a>
                                        </Button>
                                    )}
                                    {application.applicant.socialLinks?.github && (
                                        <Button variant="outline" size="sm" className="gap-2" asChild>
                                            <a href={application.applicant.socialLinks.github} target="_blank" rel="noopener noreferrer">
                                                <Github className="h-4 w-4" />
                                                GitHub
                                            </a>
                                        </Button>
                                    )}
                                    {application.applicant.socialLinks?.portfolio && (
                                        <Button variant="outline" size="sm" className="gap-2" asChild>
                                            <a href={application.applicant.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                                                <Globe className="h-4 w-4" />
                                                Portfolio
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Professional Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Professional Info</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg border bg-card">
                                    <div className="text-sm text-muted-foreground mb-1">Current Title</div>
                                    <div className="font-medium">{application.applicant.currentTitle || "N/A"}</div>
                                </div>
                                <div className="p-4 rounded-lg border bg-card">
                                    <div className="text-sm text-muted-foreground mb-1">Experience</div>
                                    <div className="font-medium">{application.applicant.experience} Years</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground mb-2">Skills</div>
                                <div className="flex flex-wrap gap-2">
                                    {application.applicant.skills?.map(skill => (
                                        <Badge key={skill} variant="secondary" className="px-3 py-1">{skill}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Projects */}
                        {application.applicant.projects && application.applicant.projects.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Projects</h3>
                                <div className="grid gap-4">
                                    {application.applicant.projects.map((project, i) => (
                                        <div key={i} className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold">{project.name}</h4>
                                                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{project.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="resume" className="flex-1 overflow-hidden m-0 flex flex-col">
                        <div className="flex items-center justify-between px-6 py-3 border-b bg-muted/30">
                            <div className="text-sm font-medium">Resume.pdf</div>
                            <Button size="sm" variant="outline" className="gap-2">
                                <Download className="h-4 w-4" />
                                Download
                            </Button>
                        </div>
                        <div className="flex-1 bg-muted/20 flex items-center justify-center p-8">
                            <div className="text-center space-y-4 max-w-md">
                                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                                    <FileText className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">PDF Viewer Placeholder</h3>
                                <p className="text-muted-foreground text-sm">
                                    In a real application, this would render the PDF using a library like `react-pdf` or an iframe.
                                </p>
                                <Button>Open in New Tab</Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="screener" className="flex-1 overflow-y-auto p-6 m-0">
                        <div className="space-y-6">
                            <h3 className="font-semibold text-lg">Screener Questions</h3>
                            <div className="space-y-6">
                                {application.applicant.screenerAnswers?.map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="font-medium text-sm text-muted-foreground">{item.question}</div>
                                        <div className="p-4 rounded-lg bg-muted/50 text-sm leading-relaxed">
                                            {item.answer}
                                        </div>
                                    </div>
                                ))}
                                {(!application.applicant.screenerAnswers || application.applicant.screenerAnswers.length === 0) && (
                                    <div className="text-center text-muted-foreground py-8">
                                        No screener questions answered.
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="comments" className="flex-1 overflow-hidden m-0 flex flex-col">
                        <ScrollArea className="flex-1 p-6">
                            {application.comments.length === 0 ? (
                                <div className="text-center text-sm text-muted-foreground py-12 flex flex-col items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                        <MessageSquare className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p>No comments yet. Start the discussion!</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {application.comments.map(comment => (
                                        <div key={comment.id} className="flex gap-4">
                                            <Avatar className="h-8 w-8 mt-1">
                                                <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm">{comment.authorName}</span>
                                                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                                                </div>
                                                <div className="text-sm bg-muted/50 p-3 rounded-lg rounded-tl-none">
                                                    {comment.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                        <div className="p-4 border-t bg-background">
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Add a comment or note..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="min-h-[80px] resize-none"
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button size="sm" disabled={!comment.trim()}>Post Comment</Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}

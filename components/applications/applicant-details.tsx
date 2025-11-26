"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { updateApplicant } from "@/backend/actions/applicants";
import { getComments, createComment } from "@/backend/actions/comments";
import { Loader2, Send, FileText, User } from "lucide-react";

interface ApplicantDetailsProps {
    applicant: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate?: (updatedApplicant: any) => void;
}

export function ApplicantDetails({
    applicant,
    open,
    onOpenChange,
    onUpdate,
}: ApplicantDetailsProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [status, setStatus] = useState(applicant?.status || "new");
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSendingComment, setIsSendingComment] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        if (applicant) {
            setStatus(applicant.status);
            if (open) {
                fetchComments();
            }
        }
    }, [applicant, open]);

    const fetchComments = async () => {
        if (!applicant) return;
        setIsLoadingComments(true);
        try {
            const data = await getComments(applicant.id);
            setComments(data || []);
        } catch (error) {
            toast.error("Failed to load comments");
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdatingStatus(true);
        try {
            const updated = await updateApplicant(applicant.id, { status: newStatus });
            setStatus(newStatus);
            toast.success("Status updated");
            if (onUpdate) onUpdate(updated);
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim() || !applicant) return;
        setIsSendingComment(true);
        try {
            // Ensure workspace_id is passed correctly
            const workspace_id = applicant.workspace_id || "f135f0f0-6fdb-4d6e-acd2-01404c138ce0";

            await createComment({
                applicant_id: applicant.id,
                content: newComment,
                workspace_id: workspace_id,
            });
            setNewComment("");
            fetchComments();
            toast.success("Comment added");
        } catch (error: any) {
            console.error("Comment error:", error);
            toast.error(error.message || "Failed to add comment");
        } finally {
            setIsSendingComment(false);
        }
    };

    if (!applicant) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-2xl w-full overflow-y-auto p-0">
                <SheetHeader className="px-6 pt-6 pb-4 border-b bg-muted/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <SheetTitle className="text-2xl">{applicant.name}</SheetTitle>
                            <SheetDescription className="mt-1">
                                Applied for <span className="font-medium text-foreground">{applicant.jobs?.title || applicant.job_id}</span> • {format(new Date(applicant.applied_at), "PPP")}
                            </SheetDescription>
                        </div>
                        <Badge variant={status === "new" ? "default" : "secondary"} className="text-sm px-3 py-1 capitalize">
                            {status}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <Select value={status} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Change Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="screening">Screening</SelectItem>
                                <SelectItem value="interview">Interview</SelectItem>
                                <SelectItem value="offer">Offer</SelectItem>
                                <SelectItem value="hired">Hired</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        {/* Placeholder for Assign User */}
                        <Button variant="outline" size="sm" disabled>
                            <User className="mr-2 h-4 w-4" /> Assign (Coming Soon)
                        </Button>
                    </div>
                </SheetHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="px-6 border-b">
                        <TabsList className="w-full justify-start h-12 bg-transparent p-0">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-4">Overview</TabsTrigger>
                            <TabsTrigger value="resume" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-4">Resume</TabsTrigger>
                            <TabsTrigger value="comments" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-4">Comments</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6">
                        <TabsContent value="overview" className="space-y-6 mt-0">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                                    <p className="text-sm font-medium">{applicant.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                                    <p className="text-sm font-medium">{applicant.mobile_number || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Current Role</h4>
                                    <p className="text-sm font-medium">{applicant.current_job_title || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Experience</h4>
                                    <p className="text-sm font-medium">{applicant.total_experience_years ? `${applicant.total_experience_years} Years` : "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Current CTC</h4>
                                    <p className="text-sm font-medium">{applicant.current_ctc || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Expected CTC</h4>
                                    <p className="text-sm font-medium">{applicant.expected_ctc || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Notice Period</h4>
                                    <p className="text-sm font-medium">{applicant.notice_period || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">ATS Score</h4>
                                    <Badge variant={applicant.ats_score > 70 ? "default" : applicant.ats_score > 40 ? "secondary" : "destructive"}>
                                        {applicant.ats_score || 0}%
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {applicant.skills && applicant.skills.length > 0 ? (
                                        applicant.skills.map((skill: string, i: number) => (
                                            <Badge key={i} variant="outline">{skill}</Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No skills listed</p>
                                    )}
                                </div>
                            </div>

                            {/* Social Profiles */}
                            {applicant.social_links && Object.keys(applicant.social_links).length > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">Social Profiles</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {Object.entries(applicant.social_links).map(([platform, url]: any) => {
                                                const lowerPlatform = platform.toLowerCase();
                                                let icon = null;
                                                let displayName = platform;

                                                if (lowerPlatform.includes('linkedin')) {
                                                    displayName = 'LinkedIn';
                                                    icon = (
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                        </svg>
                                                    );
                                                } else if (lowerPlatform.includes('github')) {
                                                    displayName = 'GitHub';
                                                    icon = (
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                        </svg>
                                                    );
                                                } else if (lowerPlatform.includes('twitter') || lowerPlatform.includes('x.com')) {
                                                    displayName = 'Twitter/X';
                                                    icon = (
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                        </svg>
                                                    );
                                                } else if (lowerPlatform.includes('portfolio') || lowerPlatform.includes('website')) {
                                                    displayName = 'Portfolio';
                                                    icon = (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                        </svg>
                                                    );
                                                }

                                                return (
                                                    <a
                                                        key={platform}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 text-sm text-primary hover:underline px-2 py-1 rounded-md hover:bg-muted transition-colors"
                                                    >
                                                        {icon}
                                                        <span>{displayName}</span>
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Achievements */}
                            {applicant.achievements && applicant.achievements.length > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">Achievements</h4>
                                        <ul className="list-disc list-inside text-sm space-y-1">
                                            {applicant.achievements.map((achievement: string, i: number) => (
                                                <li key={i}>{achievement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}

                            {/* Projects */}
                            {applicant.projects && applicant.projects.length > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">Projects</h4>
                                        <div className="space-y-3">
                                            {applicant.projects.map((project: any, i: number) => (
                                                <div key={i} className="text-sm">
                                                    <p className="font-medium">{project.name}</p>
                                                    <p className="text-muted-foreground">{project.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </TabsContent>

                        <TabsContent value="resume" className="mt-0 h-[600px]">
                            {applicant.resume_link ? (
                                <iframe
                                    src={applicant.resume_link}
                                    className="w-full h-full rounded-md border"
                                    title="Resume"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full border rounded-md bg-muted/10">
                                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No resume available</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="comments" className="mt-0 space-y-4">
                            <ScrollArea className="h-[400px] pr-4">
                                {isLoadingComments ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : comments.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No comments yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                    {/* Initials or User Icon */}
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">User</span>
                                                        <span className="text-xs text-muted-foreground">{format(new Date(comment.created_at), "MMM d, p")}</span>
                                                    </div>
                                                    <p className="text-sm text-foreground/90">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Add a comment... (Press Enter to send)"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendComment();
                                        }
                                    }}
                                    className="min-h-[80px]"
                                />
                                <Button
                                    size="icon"
                                    className="h-auto"
                                    onClick={handleSendComment}
                                    disabled={isSendingComment || !newComment.trim()}
                                >
                                    {isSendingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}

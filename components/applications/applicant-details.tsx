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
                            {(() => {
                                // Helper function to detect platform from URL
                                const detectPlatform = (url: string) => {
                                    const lowerUrl = url.toLowerCase();
                                    if (lowerUrl.includes('linkedin.com')) return 'linkedin';
                                    if (lowerUrl.includes('github.com')) return 'github';
                                    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'twitter';
                                    if (lowerUrl.includes('facebook.com')) return 'facebook';
                                    if (lowerUrl.includes('instagram.com')) return 'instagram';
                                    if (lowerUrl.includes('behance.net')) return 'behance';
                                    if (lowerUrl.includes('dribbble.com')) return 'dribbble';
                                    if (lowerUrl.includes('stackoverflow.com')) return 'stackoverflow';
                                    if (lowerUrl.includes('medium.com')) return 'medium';
                                    return 'website';
                                };

                                // Collect all social links
                                const allLinks: { url: string; platform: string }[] = [];

                                // Add LinkedIn if exists
                                if (applicant.linkedin) {
                                    allLinks.push({ url: applicant.linkedin, platform: 'linkedin' });
                                }

                                // Add Portfolio if exists
                                if (applicant.portfolio) {
                                    allLinks.push({ url: applicant.portfolio, platform: 'website' });
                                }

                                // Add social_links array if exists
                                if (applicant.social_links && Array.isArray(applicant.social_links)) {
                                    applicant.social_links.forEach((link: string) => {
                                        if (link && link.trim()) {
                                            const platform = detectPlatform(link);
                                            // Avoid duplicates
                                            if (!allLinks.some(l => l.url === link)) {
                                                allLinks.push({ url: link, platform });
                                            }
                                        }
                                    });
                                }

                                // Render icon based on platform
                                const renderIcon = (platform: string) => {
                                    switch (platform) {
                                        case 'linkedin':
                                            return (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                            );
                                        case 'github':
                                            return (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            );
                                        case 'twitter':
                                            return (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            );
                                        case 'facebook':
                                            return (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            );
                                        case 'instagram':
                                            return (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                                                </svg>
                                            );
                                        case 'behance':
                                            return (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M0 7.5v9c0 .828.672 1.5 1.5 1.5H7c2.485 0 4.5-2.015 4.5-4.5 0-1.313-.563-2.485-1.453-3.328C10.922 9.391 11.5 8.203 11.5 6.75 11.5 4.265 9.485 2.25 7 2.25H1.5C.672 2.25 0 2.922 0 3.75v3.75zm3-3.75h4c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5H3v-3zm0 6h4.5c1.243 0 2.25 1.008 2.25 2.25S8.743 14.25 7.5 14.25H3v-4.5zm12-3.75h6v1.5h-6zm0 0M21 18h-6v-3a3 3 0 1 1 6 0zM16.5 12a3 3 0 0 1 6 0H18a.75.75 0 0 0-.75.75.75.75 0 0 0 .75.75h4.5a3 3 0 0 1-6 0z" />
                                                </svg>
                                            );
                                        case 'dribbble':
                                            return (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.779 6.043 2.072zm-10.516-.993c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.686 8.872l.005-.498c3.426-.005 6.667-.419 9.374-1.205.2.398.389.797.567 1.196-2.762.797-5.098 2.317-6.991 4.561-1.756-1.888-2.954-4.338-2.955-7.054zm5.033 8.809c1.587-2.024 3.62-3.342 6.095-3.973.793 2.057 1.446 4.205 1.963 6.442-2.675.932-5.711.686-8.058-2.469zm10.465 2.1c-.478-2.052-1.086-4.003-1.823-5.85 1.93-.326 4.045-.292 6.341.144-.417 2.528-1.888 4.685-4.518 5.706z" />
                                                </svg>
                                            );
                                        case 'stackoverflow':
                                            return (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.093-10.473-2.201zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z" />
                                                </svg>
                                            );
                                        case 'medium':
                                            return (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                                                </svg>
                                            );
                                        default:
                                            return (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                            );
                                    }
                                };

                                const getPlatformName = (platform: string) => {
                                    const names: Record<string, string> = {
                                        linkedin: 'LinkedIn',
                                        github: 'GitHub',
                                        twitter: 'Twitter/X',
                                        facebook: 'Facebook',
                                        instagram: 'Instagram',
                                        behance: 'Behance',
                                        dribbble: 'Dribbble',
                                        stackoverflow: 'Stack Overflow',
                                        medium: 'Medium',
                                        website: 'Website/Portfolio'
                                    };
                                    return names[platform] || 'Link';
                                };

                                return allLinks.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">Social Profiles</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {allLinks.map((link, index) => (
                                                    <a
                                                        key={index}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                                                    >
                                                        {renderIcon(link.platform)}
                                                        <span>{getPlatformName(link.platform)}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}

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
                                        {comments.map((comment) => {
                                            const userName = comment.users?.name || comment.users?.email?.split('@')[0] || "User";
                                            const userInitials = userName.slice(0, 2).toUpperCase();

                                            return (
                                                <div key={comment.id} className="flex gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                                        {userInitials}
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium">{userName}</span>
                                                            <span className="text-xs text-muted-foreground">{format(new Date(comment.created_at), "MMM d, p")}</span>
                                                        </div>
                                                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
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
                    </div >
                </Tabs >
            </SheetContent >
        </Sheet >
    );
}

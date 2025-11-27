"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { ApplicantDetails } from "@/components/applications/applicant-details";
import { getApplicantById } from "@/backend/actions/applicants";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CommentItemProps {
    comment: any;
}

export function CommentItem({ comment }: CommentItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [applicant, setApplicant] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleOpenApplicant = async () => {
        if (applicant) {
            setIsOpen(true);
            return;
        }

        setLoading(true);
        try {
            const data = await getApplicantById(comment.applicant_id);
            setApplicant(data);
            setIsOpen(true);
        } catch (error) {
            toast.error("Failed to load applicant details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3 bg-muted/20">
                    <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {comment.users?.name?.charAt(0) || "?"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">{comment.users?.name || "Unknown User"}</span>
                                <span className="text-xs text-muted-foreground">
                                    commented on applicant
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="mb-4 text-sm leading-relaxed text-foreground/90">
                        {comment.content}
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{comment.applicants?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{comment.applicants?.name}</span>
                                <span className="text-xs text-muted-foreground">{comment.applicants?.jobs?.title}</span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-xs h-8"
                            onClick={handleOpenApplicant}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "View Profile"}
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <ApplicantDetails
                applicant={applicant}
                open={isOpen}
                onOpenChange={setIsOpen}
                onUpdate={() => { }} // Read-only or handle updates if needed
            />
        </>
    );
}

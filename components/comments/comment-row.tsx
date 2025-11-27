"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { ApplicantDetails } from "@/components/applications/applicant-details";
import { getApplicantById } from "@/backend/actions/applicants";
import { toast } from "sonner";

interface CommentRowProps {
    comment: any;
}

export function CommentRow({ comment }: CommentRowProps) {
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
            <TableRow className="hover:bg-muted/50">
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{comment.users?.name?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{comment.users?.name || "Unknown User"}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <p className="text-sm line-clamp-2" title={comment.content}>
                        {comment.content}
                    </p>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{comment.applicants?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{comment.applicants?.name}</span>
                            <span className="text-xs text-muted-foreground">{comment.applicants?.jobs?.title}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleOpenApplicant}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "View Profile"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </TableCell>
            </TableRow>

            <ApplicantDetails
                applicant={applicant}
                open={isOpen}
                onOpenChange={setIsOpen}
                onUpdate={() => { }}
            />
        </>
    );
}

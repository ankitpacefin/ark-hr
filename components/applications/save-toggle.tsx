"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { saveApplicant, unsaveApplicant, isApplicantSaved } from "@/backend/actions/saved-applicants";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export function SaveToggle({ applicantId, className, showLabel }: { applicantId: string, className?: string, showLabel?: boolean }) {
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        isApplicantSaved(applicantId).then(saved => {
            setIsSaved(saved);
            setLoading(false);
        });
    }, [applicantId]);

    const toggleSave = async () => {
        try {
            if (isSaved) {
                await unsaveApplicant(applicantId);
                setIsSaved(false);
                toast.success("Applicant removed from saved list");
            } else {
                await saveApplicant(applicantId);
                setIsSaved(true);
                toast.success("Applicant saved");
            }
        } catch (error) {
            toast.error("Failed to update saved status");
        }
    };

    if (loading) return <Button variant="ghost" size="sm" disabled className={className}><Bookmark className="h-4 w-4" /></Button>;

    return (
        <Button
            variant="ghost"
            size={showLabel ? "sm" : "icon"}
            onClick={toggleSave}
            title={isSaved ? "Unsave" : "Save for later"}
            className={`gap-2 ${className}`}
        >
            {isSaved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
            {showLabel && (isSaved ? "Saved" : "Save")}
        </Button>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import { BookmarkMinus } from "lucide-react";
import { unsaveApplicant } from "@/backend/actions/saved-applicants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function UnsaveButton({ applicantId }: { applicantId: string }) {
    const router = useRouter();

    const handleUnsave = async () => {
        try {
            await unsaveApplicant(applicantId);
            toast.success("Applicant removed from saved list");
            router.refresh();
        } catch (error) {
            toast.error("Failed to remove applicant");
        }
    };

    return (
        <Button variant="ghost" size="icon" onClick={handleUnsave} title="Remove from Saved">
            <BookmarkMinus className="h-4 w-4" />
        </Button>
    );
}

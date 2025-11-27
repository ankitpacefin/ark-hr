"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UnsaveButton } from "@/components/applications/unsave-button";
import { useState } from "react";
import { ApplicantDetails } from "@/components/applications/applicant-details";
import { getApplicantById } from "@/backend/actions/applicants";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

interface SavedApplicantRowProps {
    applicant: any;
}

export function SavedApplicantRow({ applicant }: SavedApplicantRowProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [fullApplicant, setFullApplicant] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleOpenApplicant = async () => {
        if (fullApplicant) {
            setIsOpen(true);
            return;
        }

        setLoading(true);
        try {
            const data = await getApplicantById(applicant.id);
            setFullApplicant(data);
            setIsOpen(true);
        } catch (error) {
            toast.error("Failed to load applicant details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback>{applicant.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base font-medium">
                                {applicant.name}
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                                {applicant.jobs?.title}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenApplicant}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "View Profile"}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                        <UnsaveButton applicantId={applicant.id} />
                    </div>
                </CardContent>
            </Card>

            <ApplicantDetails
                applicant={fullApplicant}
                open={isOpen}
                onOpenChange={setIsOpen}
                onUpdate={() => { }}
            />
        </>
    );
}

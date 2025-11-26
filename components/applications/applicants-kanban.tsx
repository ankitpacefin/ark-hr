"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApplicantDetails } from "./applicant-details";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateApplicant } from "@/backend/actions/applicants";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUsers } from "@/backend/actions/filters";

interface ApplicantsKanbanProps {
    applicants: any[];
    onUpdate: () => void;
}

const COLUMNS = [
    "New",
    "Screening",
    "Interview",
    "Offer",
    "Hired",
    "Rejected",
];

// Mock workspace ID for now
const WORKSPACE_ID = "f135f0f0-6fdb-4d6e-acd2-01404c138ce0";

export function ApplicantsKanban({ applicants, onUpdate }: ApplicantsKanbanProps) {
    const [optimisticApplicants, setOptimisticApplicants] = useState(applicants);
    const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [draggedApplicantId, setDraggedApplicantId] = useState<number | null>(null);
    const [users, setUsers] = useState<any[]>([]);

    // Sync optimistic state with props
    useEffect(() => {
        setOptimisticApplicants(applicants);
    }, [applicants]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getUsers(WORKSPACE_ID);
        setUsers(data || []);
    };

    const handleCardClick = (applicant: any) => {
        setSelectedApplicant(applicant);
        setIsDetailsOpen(true);
    };

    const handleDragStart = (e: React.DragEvent, applicantId: number) => {
        setDraggedApplicantId(applicantId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        if (!draggedApplicantId) return;

        const applicantId = draggedApplicantId;
        setDraggedApplicantId(null);

        // Find the applicant
        const applicant = optimisticApplicants.find(a => a.id === applicantId);
        if (!applicant || applicant.status === newStatus) return;

        // Optimistic Update
        const previousApplicants = [...optimisticApplicants];
        setOptimisticApplicants(prev =>
            prev.map(app =>
                app.id === applicantId ? { ...app, status: newStatus } : app
            )
        );

        try {
            await updateApplicant(applicantId, { status: newStatus });
            toast.success("Status updated");
            onUpdate(); // Trigger parent refresh to ensure consistency
        } catch (error) {
            toast.error("Failed to update status");
            setOptimisticApplicants(previousApplicants); // Revert on error
        }
    };

    const handleStatusChange = async (applicantId: number, newStatus: string) => {
        // Optimistic Update for Dropdown
        const previousApplicants = [...optimisticApplicants];
        setOptimisticApplicants(prev =>
            prev.map(app =>
                app.id === applicantId ? { ...app, status: newStatus } : app
            )
        );

        try {
            await updateApplicant(applicantId, { status: newStatus });
            toast.success("Status updated");
            onUpdate();
        } catch (error) {
            toast.error("Failed to update status");
            setOptimisticApplicants(previousApplicants);
        }
    };

    const getAssignedUser = (userId: string) => {
        return users.find(u => u.id === userId);
    };

    const getUserInitials = (name: string) => {
        return name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <div className="flex h-[calc(100vh-200px)] overflow-x-auto gap-4 pb-4">
                {COLUMNS.map((column) => {
                    const columnApplicants = optimisticApplicants.filter(
                        (app) => app.status === column
                    );

                    return (
                        <div
                            key={column}
                            className="min-w-[300px] w-[300px] flex flex-col bg-muted/30 rounded-lg border"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column)}
                        >
                            <div className="p-3 border-b bg-muted/50 font-medium flex justify-between items-center sticky top-0 z-10">
                                <span className="capitalize">{column}</span>
                                <Badge variant="secondary" className="text-xs">
                                    {columnApplicants.length}
                                </Badge>
                            </div>
                            <ScrollArea className="flex-1 p-3">
                                <div className="space-y-3">
                                    {columnApplicants.map((applicant) => {
                                        const assignedUser = applicant.assigned_to ? getAssignedUser(applicant.assigned_to) : null;

                                        return (
                                            <Card
                                                key={applicant.id}
                                                className={`cursor-grab active:cursor-grabbing hover:border-primary transition-colors ${draggedApplicantId === applicant.id ? "opacity-50" : ""
                                                    }`}
                                                onClick={() => handleCardClick(applicant)}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, applicant.id)}
                                            >
                                                <CardHeader className="p-3 pb-2">
                                                    <div className="flex justify-between items-start">
                                                        <CardTitle className="text-sm font-medium leading-none">
                                                            {applicant.name}
                                                        </CardTitle>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="h-6 w-6 p-0"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <MoreHorizontal className="h-3 w-3" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {COLUMNS.filter((c) => c !== column).map((status) => (
                                                                    <DropdownMenuItem
                                                                        key={status}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleStatusChange(applicant.id, status);
                                                                        }}
                                                                    >
                                                                        Move to {status}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <CardDescription className="text-xs truncate">
                                                        {applicant.jobs?.title || applicant.job_id}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-3 pt-0">
                                                    <div className="flex justify-between items-center mt-2">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs text-muted-foreground">
                                                                {format(new Date(applicant.applied_at), "MMM d")}
                                                            </span>
                                                            {assignedUser && (
                                                                <Avatar className="h-5 w-5">
                                                                    <AvatarImage src={assignedUser.avatar_url} />
                                                                    <AvatarFallback className="text-[10px]">
                                                                        {getUserInitials(assignedUser.name || assignedUser.email)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            )}
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                applicant.ats_score > 70
                                                                    ? "default"
                                                                    : applicant.ats_score > 40
                                                                        ? "secondary"
                                                                        : "destructive"
                                                            }
                                                            className="text-[10px] px-1.5 py-0"
                                                        >
                                                            {applicant.ats_score || 0}%
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>
                    );
                })}
            </div>

            <ApplicantDetails
                applicant={selectedApplicant}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                onUpdate={(updated) => {
                    // Update local state when details change
                    setOptimisticApplicants(prev =>
                        prev.map(app => app.id === updated.id ? { ...app, ...updated } : app)
                    );
                    onUpdate();
                }}
            />
        </>
    );
}

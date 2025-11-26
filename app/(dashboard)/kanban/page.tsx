"use client";

import { useState, useEffect, useMemo } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getApplicantsByStatus, updateApplicant } from "@/backend/actions/applicants";
import { ApplicantDetails } from "@/components/applications/applicant-details";
import { toast } from "sonner";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Kanban,
    KanbanBoard,
    KanbanColumn,
    KanbanColumnContent,
    KanbanItem,
    KanbanItemHandle,
    KanbanMoveEvent,
} from "@/components/ui/kanban";
import { format } from "date-fns";

// Status configuration
const STATUSES = [
    { key: "new", label: "New", color: "bg-blue-500" },
    { key: "screening", label: "Screening", color: "bg-purple-500" },
    { key: "interview", label: "Interview", color: "bg-yellow-500" },
    { key: "offer", label: "Offer", color: "bg-green-500" },
    { key: "hired", label: "Hired", color: "bg-emerald-500" },
    { key: "rejected", label: "Rejected", color: "bg-red-500" },
];

export default function KanbanPage() {
    const [user, setUser] = useState<any>(null);
    const [workspaceId, setWorkspaceId] = useState<string>("");
    const [columns, setColumns] = useState<Record<string, any[]>>({});
    const [columnCounts, setColumnCounts] = useState<Record<string, number>>({});
    const [columnPages, setColumnPages] = useState<Record<string, number>>({
        new: 1,
        screening: 1,
        interview: 1,
        offer: 1,
        hired: 1,
        rejected: 1,
    });
    const [limit] = useState(20); // 20 per column
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Initialize auth and workspace
    useEffect(() => {
        async function initAuth() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                window.location.href = "/";
                return;
            }

            setUser(user);

            // Fetch workspace
            const { data: workspaces } = await supabase.from("workspaces").select("id").limit(1);
            if (workspaces && workspaces.length > 0) {
                setWorkspaceId(workspaces[0].id);
            }
        }
        initAuth();
    }, []);

    // Fetch all columns
    useEffect(() => {
        if (workspaceId) {
            fetchAllColumns();
        }
    }, [workspaceId, columnPages]);

    const fetchAllColumns = async () => {
        setIsLoading(true);
        try {
            // Make 6 parallel API calls - one for each status
            const promises = STATUSES.map(status =>
                getApplicantsByStatus(workspaceId, status.key, columnPages[status.key], limit)
            );

            const results = await Promise.all(promises);

            // Update columns and counts
            const newColumns: Record<string, any[]> = {};
            const newCounts: Record<string, number> = {};

            STATUSES.forEach((status, index) => {
                newColumns[status.key] = results[index].data || [];
                newCounts[status.key] = results[index].count || 0;
            });

            setColumns(newColumns);
            setColumnCounts(newCounts);
        } catch (error) {
            console.error("Failed to fetch applicants:", error);
            toast.error("Failed to load applicants");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter applicants based on search query
    const filteredColumns = useMemo(() => {
        if (!searchQuery.trim()) return columns;

        const query = searchQuery.toLowerCase();
        const filtered: Record<string, any[]> = {};

        Object.keys(columns).forEach(status => {
            filtered[status] = columns[status].filter(app =>
                app.name?.toLowerCase().includes(query) ||
                app.email?.toLowerCase().includes(query) ||
                app.jobs?.title?.toLowerCase().includes(query)
            );
        });

        return filtered;
    }, [columns, searchQuery]);

    const handleMove = async (event: KanbanMoveEvent) => {
        const { activeContainer, overContainer } = event;

        if (activeContainer === overContainer) return;

        // Find the applicant being moved
        const movedApplicant = filteredColumns[activeContainer].find(app =>
            app.id.toString() === event.event.active.id
        );

        if (!movedApplicant) return;

        // Optimistic update - move card between columns
        const newColumns = { ...columns };
        newColumns[activeContainer] = newColumns[activeContainer].filter(app => app.id !== movedApplicant.id);
        newColumns[overContainer] = [{ ...movedApplicant, status: overContainer }, ...newColumns[overContainer]];
        setColumns(newColumns);

        // Update counts
        const newCounts = { ...columnCounts };
        newCounts[activeContainer] = Math.max(0, (newCounts[activeContainer] || 0) - 1);
        newCounts[overContainer] = (newCounts[overContainer] || 0) + 1;
        setColumnCounts(newCounts);

        try {
            // Update in database
            await updateApplicant(movedApplicant.id, { status: overContainer });
            toast.success(`Moved to ${overContainer}`, { duration: 1500 });
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status");

            // Revert on error
            const revertColumns = { ...columns };
            revertColumns[overContainer] = revertColumns[overContainer].filter(app => app.id !== movedApplicant.id);
            revertColumns[activeContainer] = [movedApplicant, ...revertColumns[activeContainer]];
            setColumns(revertColumns);

            const revertCounts = { ...columnCounts };
            revertCounts[activeContainer] = (revertCounts[activeContainer] || 0) + 1;
            revertCounts[overContainer] = Math.max(0, (revertCounts[overContainer] || 0) - 1);
            setColumnCounts(revertCounts);
        }
    };

    const handleCardClick = (applicant: any) => {
        setSelectedApplicant(applicant);
        setIsDetailsOpen(true);
    };

    const handleApplicantUpdate = (updatedApplicant: any) => {
        // Update in columns
        const newColumns = { ...columns };
        Object.keys(newColumns).forEach(status => {
            newColumns[status] = newColumns[status].map(app =>
                app.id === updatedApplicant.id ? { ...app, ...updatedApplicant } : app
            );
        });
        setColumns(newColumns);
    };

    const handlePageChange = (status: string, delta: number) => {
        setColumnPages(prev => ({
            ...prev,
            [status]: Math.max(1, prev[status] + delta)
        }));
    };

    const getTotalCount = () => {
        return Object.values(columnCounts).reduce((sum, count) => sum + count, 0);
    };

    const getFilteredCount = () => {
        return Object.values(filteredColumns).reduce((sum, apps) => sum + apps.length, 0);
    };

    if (!user || !workspaceId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
                    <p className="text-muted-foreground">
                        Drag and drop applicants to update their status
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                        {getFilteredCount()} of {getTotalCount()} applicants
                    </Badge>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, email, or job title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Kanban Board */}
            {isLoading ? (
                <div className="flex items-center justify-center h-[600px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <Kanban
                    value={filteredColumns}
                    onValueChange={() => { }} // Controlled by filteredColumns
                    getItemValue={(item) => item.id.toString()}
                    onMove={handleMove}
                    className="flex-1"
                >
                    <KanbanBoard className="grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {STATUSES.map((status) => {
                            const currentPage = columnPages[status.key];
                            const totalPages = Math.ceil((columnCounts[status.key] || 0) / limit);

                            return (
                                <KanbanColumn key={status.key} value={status.key} className="border rounded-lg bg-muted/30">
                                    <div className="p-4 border-b bg-background/50 sticky top-0 z-10 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${status.color}`} />
                                            <h3 className="font-semibold">{status.label}</h3>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="secondary" className="text-xs">
                                                {filteredColumns[status.key]?.length || 0} / {columnCounts[status.key] || 0}
                                            </Badge>
                                        </div>
                                        {/* Per-column pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-between pt-2 border-t">
                                                <span className="text-xs text-muted-foreground">
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => handlePageChange(status.key, -1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        <ChevronLeft className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => handlePageChange(status.key, 1)}
                                                        disabled={currentPage >= totalPages}
                                                    >
                                                        <ChevronRight className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <KanbanColumnContent value={status.key} className="p-4 min-h-[500px]">
                                        {filteredColumns[status.key]?.map((applicant) => (
                                            <KanbanItem
                                                key={applicant.id}
                                                value={applicant.id.toString()}
                                                asChild
                                            >
                                                <Card
                                                    className="cursor-pointer hover:border-primary transition-colors"
                                                    onClick={() => handleCardClick(applicant)}
                                                >
                                                    <KanbanItemHandle asChild>
                                                        <CardHeader className="p-4 pb-2">
                                                            <CardTitle className="text-sm font-medium">
                                                                {applicant.name}
                                                            </CardTitle>
                                                            <CardDescription className="text-xs truncate">
                                                                {applicant.email}
                                                            </CardDescription>
                                                        </CardHeader>
                                                    </KanbanItemHandle>
                                                    <CardContent className="p-4 pt-0">
                                                        {applicant.jobs && (
                                                            <div className="text-xs bg-muted px-2 py-1 rounded mb-2 inline-block">
                                                                {applicant.jobs.title}
                                                            </div>
                                                        )}
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-xs text-muted-foreground">
                                                                {format(new Date(applicant.applied_at), "MMM d, yyyy")}
                                                            </span>
                                                            <Badge
                                                                variant={
                                                                    applicant.ats_score > 70
                                                                        ? "default"
                                                                        : applicant.ats_score > 40
                                                                            ? "secondary"
                                                                            : "destructive"
                                                                }
                                                                className="text-xs"
                                                            >
                                                                {applicant.ats_score || 0}%
                                                            </Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </KanbanItem>
                                        ))}
                                    </KanbanColumnContent>
                                </KanbanColumn>
                            );
                        })}
                    </KanbanBoard>
                </Kanban>
            )}

            {/* Applicant Details Sheet */}
            <ApplicantDetails
                applicant={selectedApplicant}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                onUpdate={handleApplicantUpdate}
            />
        </div>
    );
}

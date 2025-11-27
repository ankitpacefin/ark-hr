"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MoreHorizontal, ChevronLeft, ChevronRight, Settings2, Download } from "lucide-react";
import { ApplicantDetails } from "./applicant-details";
import { SaveToggle } from "./save-toggle";
import { updateApplicant } from "@/backend/actions/applicants";
import { getUsers } from "@/backend/actions/filters";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ApplicantsListProps {
    applicants: any[];
    totalCount: number;
    page: number;
    setPage: (page: number) => void;
    limit: number;
    onUpdate: (updatedApplicant: any) => void;
    onExport: () => void;
}

const WORKSPACE_ID = "f135f0f0-6fdb-4d6e-acd2-01404c138ce0";

export function ApplicantsList({
    applicants,
    totalCount,
    page,
    setPage,
    limit,
    onUpdate,
    onExport,
}: ApplicantsListProps) {
    const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [users, setUsers] = useState<any[]>([]);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        email: true,
        phone: true,
        job: true,
        appliedDate: true,
        score: true,
        status: true,
        assignedTo: true,
        actions: true,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getUsers(WORKSPACE_ID);
        setUsers(data || []);
    };

    const totalPages = Math.ceil(totalCount / limit);

    const handleRowClick = (applicant: any) => {
        setSelectedApplicant(applicant);
        setIsDetailsOpen(true);
    };

    const handleStatusChange = async (applicantId: number, newStatus: string) => {
        try {
            const updated = await updateApplicant(applicantId, { status: newStatus });
            toast.success("Status updated");
            onUpdate(updated);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleAssignmentChange = async (applicantId: number, userId: string) => {
        try {
            const updated = await updateApplicant(applicantId, { assigned_to: userId === "unassigned" ? null : userId });
            toast.success("Assignment updated");
            onUpdate(updated);
        } catch (error) {
            toast.error("Failed to update assignment");
        }
    };

    const toggleColumn = (column: keyof typeof visibleColumns) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={onExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-auto">
                            <Settings2 className="mr-2 h-4 w-4" />
                            View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.name}
                            onCheckedChange={() => toggleColumn("name")}
                        >
                            Name
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.email}
                            onCheckedChange={() => toggleColumn("email")}
                        >
                            Email
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.phone}
                            onCheckedChange={() => toggleColumn("phone")}
                        >
                            Phone
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.job}
                            onCheckedChange={() => toggleColumn("job")}
                        >
                            Job
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.assignedTo}
                            onCheckedChange={() => toggleColumn("assignedTo")}
                        >
                            Assigned To
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.status}
                            onCheckedChange={() => toggleColumn("status")}
                        >
                            Status
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {visibleColumns.name && <TableHead>Name</TableHead>}
                            {visibleColumns.email && <TableHead>Email</TableHead>}
                            {visibleColumns.phone && <TableHead>Phone</TableHead>}
                            {visibleColumns.job && <TableHead>Job</TableHead>}
                            {visibleColumns.appliedDate && <TableHead>Applied Date</TableHead>}
                            {visibleColumns.score && <TableHead>Score</TableHead>}
                            {visibleColumns.status && <TableHead>Status</TableHead>}
                            {visibleColumns.assignedTo && <TableHead>Assigned To</TableHead>}
                            <TableHead className="w-[50px]"></TableHead>
                            {visibleColumns.actions && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applicants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="h-24 text-center">
                                    No applicants found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            applicants.map((applicant) => (
                                <TableRow
                                    key={applicant.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleRowClick(applicant)}
                                >
                                    {visibleColumns.name && (
                                        <TableCell className="font-medium">{applicant.name}</TableCell>
                                    )}
                                    {visibleColumns.email && <TableCell>{applicant.email}</TableCell>}
                                    {visibleColumns.phone && <TableCell>{applicant.mobile_number}</TableCell>}
                                    {visibleColumns.job && <TableCell>{applicant.jobs?.title || applicant.job_id}</TableCell>}
                                    {visibleColumns.appliedDate && (
                                        <TableCell>
                                            {format(new Date(applicant.applied_at), "MMM d, yyyy")}
                                        </TableCell>
                                    )}
                                    {visibleColumns.score && (
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    applicant.ats_score > 70
                                                        ? "default"
                                                        : applicant.ats_score > 40
                                                            ? "secondary"
                                                            : "destructive"
                                                }
                                            >
                                                {applicant.ats_score || 0}%
                                            </Badge>
                                        </TableCell>
                                    )}
                                    {visibleColumns.status && (
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Select
                                                value={applicant.status}
                                                onValueChange={(val) => handleStatusChange(applicant.id, val)}
                                            >
                                                <SelectTrigger className="h-8 w-[110px]">
                                                    <SelectValue />
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
                                        </TableCell>
                                    )}
                                    {visibleColumns.assignedTo && (
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Select
                                                value={applicant.assigned_to || "unassigned"}
                                                onValueChange={(val) => handleAssignmentChange(applicant.id, val)}
                                            >
                                                <SelectTrigger className="h-8 w-[130px]">
                                                    <SelectValue placeholder="Unassigned" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                                    {users.map((user) => (
                                                        <SelectItem key={user.id} value={user.id}>
                                                            {user.name || user.email}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    )}
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <SaveToggle applicantId={applicant.id} />
                                    </TableCell>
                                    {visibleColumns.actions && (
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigator.clipboard.writeText(applicant.email);
                                                            toast.success("Email copied");
                                                        }}
                                                    >
                                                        Copy Email
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <div onClick={(e) => e.stopPropagation()} className="w-full cursor-pointer">
                                                            <SaveToggle applicantId={applicant.id} showLabel className="w-full justify-start px-2" />
                                                        </div>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleRowClick(applicant)}>
                                                        View Details
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, totalCount)} of {totalCount} entries
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <ApplicantDetails
                applicant={selectedApplicant}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                onUpdate={onUpdate}
            />
        </div>
    );
}

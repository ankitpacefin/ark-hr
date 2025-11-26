"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Pencil, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
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
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { JobForm } from "./job-form";
import { getJobs } from "@/backend/actions/jobs";

interface JobsListProps {
    workspaceId: string;
}

export function JobsList({ workspaceId }: JobsListProps) {
    const [jobs, setJobs] = useState<any[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<any | null>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("all");
    const [department, setDepartment] = useState("all");
    const [workMode, setWorkMode] = useState("all");

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const data = await getJobs(workspaceId);
            setJobs(data || []);
            setFilteredJobs(data || []);
        } catch (error) {
            toast.error("Failed to fetch jobs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [workspaceId]);

    useEffect(() => {
        let result = jobs;

        if (search) {
            result = result.filter(
                (job) =>
                    job.title.toLowerCase().includes(search.toLowerCase()) ||
                    job.job_id.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (location !== "all") {
            result = result.filter((job) => job.location === location);
        }

        if (department !== "all") {
            result = result.filter((job) => job.department === department);
        }

        if (workMode !== "all") {
            result = result.filter((job) => job.work_mode === workMode);
        }

        setFilteredJobs(result);
    }, [jobs, search, location, department, workMode]);

    const handleSuccess = () => {
        setIsSheetOpen(false);
        setEditingJob(null);
        fetchJobs();
    };

    const handleEdit = (job: any) => {
        setEditingJob(job);
        setIsSheetOpen(true);
    };

    const handleCreate = () => {
        setEditingJob(null);
        setIsSheetOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Jobs</h2>
                    <p className="text-muted-foreground">
                        Manage your job postings and applications.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Create Job
                </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search jobs..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                        <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                        <SelectItem value="Gurugram">Gurugram</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Tech">Tech</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={workMode} onValueChange={setWorkMode}>
                    <SelectTrigger>
                        <SelectValue placeholder="Work Mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Modes</SelectItem>
                        <SelectItem value="Onsite">Onsite</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Jobs List (Table) */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Job ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    Loading jobs...
                                </TableCell>
                            </TableRow>
                        ) : filteredJobs.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center py-10 text-muted-foreground"
                                >
                                    No jobs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredJobs.map((job) => (
                                <TableRow
                                    key={job.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleEdit(job)}
                                >
                                    <TableCell className="font-medium">{job.job_id}</TableCell>
                                    <TableCell>{job.title}</TableCell>
                                    <TableCell>{job.department}</TableCell>
                                    <TableCell>
                                        {job.location} ({job.work_mode})
                                    </TableCell>
                                    <TableCell>{job.type}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={job.status === "Live" ? "default" : "secondary"}
                                        >
                                            {job.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                    onClick={(e) => e.stopPropagation()} // Prevent row click
                                                >
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click
                                                        handleEdit(job);
                                                    }}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create/Edit Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-3xl w-full overflow-y-auto p-0">
                    <SheetHeader className="px-6 pt-6 pb-4 border-b">
                        <SheetTitle>
                            {editingJob ? "Edit Job" : "Create New Job"}
                        </SheetTitle>
                        <SheetDescription>
                            {editingJob
                                ? "Update the details of the job posting."
                                : "Fill in the details to create a new job posting."}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="p-6">
                        <JobForm
                            initialData={editingJob}
                            workspaceId={workspaceId}
                            onSuccess={handleSuccess}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

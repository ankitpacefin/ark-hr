"use client"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { MOCK_JOBS } from "@/lib/mock-data"
import { ApplicationStatus } from "@/types"

interface ApplicationsFilterProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    jobFilter: string
    setJobFilter: (jobId: string) => void
    statusFilter: string
    setStatusFilter: (status: string) => void
    resetFilters: () => void
}

const STATUSES: ApplicationStatus[] = ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected']

export function ApplicationsFilter({
    searchQuery,
    setSearchQuery,
    jobFilter,
    setJobFilter,
    statusFilter,
    setStatusFilter,
    resetFilters
}: ApplicationsFilterProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search applicants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>
            <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by Job" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {MOCK_JOBS.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                            {job.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {(searchQuery || jobFilter !== "all" || statusFilter !== "all") && (
                <Button variant="ghost" onClick={resetFilters} className="px-3">
                    <X className="h-4 w-4 mr-2" />
                    Reset
                </Button>
            )}
        </div>
    )
}

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getApplicants } from "@/backend/actions/applicants";
import { getJobs } from "@/backend/actions/jobs";
import { ApplicantsList } from "@/components/applications/applicants-list";
import { ApplicantsTableSkeleton } from "@/components/applications/applicants-table-skeleton";
import { Filters } from "@/components/applications/filters";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

// Mock workspace ID for now - in real app this comes from context/auth
const WORKSPACE_ID = "f135f0f0-6fdb-4d6e-acd2-01404c138ce0"; // Correct ID from DB

export default function ApplicationsPage() {
    const [applicants, setApplicants] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [jobId, setJobId] = useState("all");
    const [status, setStatus] = useState("all");
    const [skills, setSkills] = useState<string[]>([]);
    const [experience, setExperience] = useState("");
    const [company, setCompany] = useState<string[]>([]);
    const [domain, setDomain] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [assignedTo, setAssignedTo] = useState("all");

    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        fetchApplicants();
    }, [search, jobId, status, skills, experience, company, domain, dateRange, assignedTo, page]);

    const fetchJobs = async () => {
        try {
            const data = await getJobs(WORKSPACE_ID);
            setJobs(data || []);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        }
    };

    const fetchApplicants = async () => {
        setIsLoading(true);
        try {
            const { data, count } = await getApplicants(WORKSPACE_ID, {
                search,
                job_id: jobId,
                status,
                skills,
                experience,
                company,
                domain,
                dateFrom: dateRange?.from,
                dateTo: dateRange?.to,
                assigned_to: assignedTo,
                page,
                limit,
            });
            setApplicants(data || []);
            setTotalCount(count || 0);
        } catch (error) {
            toast.error("Failed to fetch applicants");
        } finally {
            setIsLoading(false);
        }
    };

    const resetFilters = () => {
        setSearch("");
        setJobId("all");
        setStatus("all");
        setSkills([]);
        setExperience("");
        setCompany([]);
        setDomain([]);
        setDateRange(undefined);
        setAssignedTo("all");
        setPage(1);
    };

    const handleExport = async () => {
        try {
            const { data } = await getApplicants(WORKSPACE_ID, {
                search,
                job_id: jobId,
                status,
                skills,
                experience,
                company,
                domain,
                dateFrom: dateRange?.from,
                dateTo: dateRange?.to,
                assigned_to: assignedTo,
                page: 1,
                limit: 10000, // Fetch all for export
            });

            if (!data || data.length === 0) {
                toast.error("No data to export");
                return;
            }

            const headers = ["Name", "Email", "Phone", "Job Title", "Applied Date", "Status", "Score", "Assigned To"];
            const csvContent = [
                headers.join(","),
                ...data.map((app: any) => [
                    `"${app.name}"`,
                    `"${app.email}"`,
                    `"${app.mobile_number || ""}"`,
                    `"${app.jobs?.title || app.job_id}"`,
                    `"${new Date(app.applied_at).toLocaleDateString()}"`,
                    `"${app.status}"`,
                    `"${app.ats_score || 0}"`,
                    `"${app.assigned_to || "Unassigned"}"`
                ].join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "applicants_export.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            toast.error("Failed to export data");
        }
    };

    const handleApplicantUpdate = (updatedApplicant: any) => {
        setApplicants((prev) =>
            prev.map((app) => (app.id === updatedApplicant.id ? { ...app, ...updatedApplicant } : app))
        );
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
            </div>
            <div className="space-y-4">
                <Filters
                    search={search}
                    setSearch={setSearch}
                    jobId={jobId}
                    setJobId={setJobId}
                    status={status}
                    setStatus={setStatus}
                    jobs={jobs}
                    resetFilters={resetFilters}
                    skills={skills}
                    setSkills={setSkills}
                    experience={experience}
                    setExperience={setExperience}
                    company={company}
                    setCompany={setCompany}
                    domain={domain}
                    setDomain={setDomain}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    assignedTo={assignedTo}
                    setAssignedTo={setAssignedTo}
                />

                {isLoading ? (
                    <ApplicantsTableSkeleton />
                ) : (
                    <ApplicantsList
                        applicants={applicants}
                        totalCount={totalCount}
                        page={page}
                        setPage={setPage}
                        limit={limit}
                        onUpdate={handleApplicantUpdate}
                        onExport={handleExport}
                    />
                )}
            </div>
        </div>
    );
}

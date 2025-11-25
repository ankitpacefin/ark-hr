import { MOCK_JOBS } from "@/lib/mock-data"
import { JobCard } from "@/components/jobs/job-card"
import { JobFilters } from "@/components/jobs/job-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function JobsPage() {
    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
                    <p className="text-muted-foreground">Manage your job postings and view applicants.</p>
                </div>
                <Button asChild>
                    <Link href="/jobs/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Job
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                <div className="lg:col-span-1">
                    <JobFilters />
                </div>
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {MOCK_JOBS.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

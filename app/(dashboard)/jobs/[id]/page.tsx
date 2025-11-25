"use client"

import { JobForm } from "@/components/jobs/job-form"
import { MOCK_JOBS } from "@/lib/mock-data"
import { useParams } from "next/navigation"

export default function EditJobPage() {
    const params = useParams()
    const job = MOCK_JOBS.find(j => j.id === params.id)

    if (!job) {
        return <div>Job not found</div>
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Job Post</h1>
                <p className="text-muted-foreground">Update the details of your job posting.</p>
            </div>
            <div className="border rounded-lg p-6 bg-card">
                <JobForm initialData={job} />
            </div>
        </div>
    )
}

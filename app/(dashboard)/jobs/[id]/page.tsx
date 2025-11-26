"use client"

import { JobForm } from "@/components/jobs/job-form"
import { MOCK_JOBS } from "@/lib/mock-data"
import { useParams, useRouter } from "next/navigation"

export default function EditJobPage() {
    const params = useParams()
    const router = useRouter()
    const job = MOCK_JOBS.find(j => j.id === params.id)
    const WORKSPACE_ID = "f135f0f0-6fdb-4d6e-acd2-01404c138ce0" // TODO: Get from context/auth

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
                <JobForm
                    initialData={job}
                    workspaceId={WORKSPACE_ID}
                    onSuccess={() => router.push('/jobs')}
                />
            </div>
        </div>
    )
}

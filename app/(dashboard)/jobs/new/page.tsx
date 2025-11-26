"use client"

import { JobForm } from "@/components/jobs/job-form"
import { useRouter } from "next/navigation"

export default function NewJobPage() {
    const router = useRouter()
    const WORKSPACE_ID = "f135f0f0-6fdb-4d6e-acd2-01404c138ce0" // TODO: Get from context/auth

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Job Post</h1>
                <p className="text-muted-foreground">Fill in the details to post a new job opening.</p>
            </div>
            <div className="border rounded-lg p-6 bg-card">
                <JobForm
                    workspaceId={WORKSPACE_ID}
                    onSuccess={() => router.push('/jobs')}
                />
            </div>
        </div>
    )
}

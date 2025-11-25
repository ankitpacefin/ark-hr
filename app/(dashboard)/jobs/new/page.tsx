"use client"

import { JobForm } from "@/components/jobs/job-form"

export default function NewJobPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Job Post</h1>
                <p className="text-muted-foreground">Fill in the details to post a new job opening.</p>
            </div>
            <div className="border rounded-lg p-6 bg-card">
                <JobForm />
            </div>
        </div>
    )
}

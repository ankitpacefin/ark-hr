import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, UserCheck, Clock } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { Overview } from "@/components/dashboard/overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: jobs } = await supabase.from('jobs').select('*')
    const { data: applicants } = await supabase.from('applicants').select('*')

    const safeJobs = jobs || []
    const safeApplicants = applicants || []

    // Metrics
    const totalJobs = safeJobs.length
    const activeJobs = safeJobs.filter(j => j.status === 'Live').length
    const totalApplications = safeApplicants.length
    const newApplications = safeApplicants.filter(a => a.status === 'new').length

    // Prepare data for RecentActivity
    const recentApplications = safeApplicants
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map(app => {
            // Try to match by id or job_id (assuming job_id in applicants refers to id in jobs, or job_id in jobs)
            // Based on schema: applicants.job_id -> jobs.job_id. 
            // Wait, foreign key says: applicants_job_id_fkey source applicants.job_id target jobs.job_id
            // So we should match app.job_id === job.job_id
            const job = safeJobs.find(j => j.job_id === app.job_id)
            return {
                ...app,
                job_title: job?.title || 'Unknown Job'
            }
        })

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your recruitment activities.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Jobs
                        </CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalJobs}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeJobs} active
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Applications
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalApplications}</div>
                        <p className="text-xs text-muted-foreground">
                            All time
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            New Applicants
                        </CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{newApplications}</div>
                        <p className="text-xs text-muted-foreground">
                            Needs review
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Hired
                        </CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{safeApplicants.filter(a => a.status === 'hired').length}</div>
                        <p className="text-xs text-muted-foreground">
                            Applicants hired
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Overview jobs={safeJobs} applications={safeApplicants} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RecentActivity applications={recentApplications} />

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Upcoming Interviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Placeholder for interviews */}
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">No upcoming interviews</p>
                                    <p className="text-sm text-muted-foreground">
                                        Schedule interviews to see them here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

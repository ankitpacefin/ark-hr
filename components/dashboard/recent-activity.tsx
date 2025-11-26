import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Application {
    id: string
    name: string
    job_title: string
    created_at: string
    email: string
}

export function RecentActivity({ applications }: { applications: Application[] }) {
    return (
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {applications.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No recent applications.</p>
                    ) : (
                        applications.slice(0, 5).map((app) => (
                            <div className="flex items-center" key={app.id}>
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={`https://avatar.vercel.sh/${app.email}`} alt="Avatar" />
                                    <AvatarFallback>{app.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{app.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Applied for {app.job_title}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium text-xs text-muted-foreground">
                                    {new Date(app.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

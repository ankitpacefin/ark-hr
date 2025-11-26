import { Job } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Clock, Briefcase } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface JobCardProps {
    job: Job
}

export function JobCard({ job }: JobCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-bold line-clamp-1">{job.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                            <MapPin className="h-3 w-3" />
                            <span>{job.location}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                {job.locationType}
                            </span>
                        </div>
                    </div>
                    <Badge variant={job.status === 'Published' ? 'default' : 'secondary'}>
                        {job.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="flex gap-1 items-center">
                        <Briefcase className="h-3 w-3" />
                        {job.type}
                    </Badge>
                </div>
                <div
                    className="text-sm text-muted-foreground line-clamp-3 prose prose-sm dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                />
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{job.applicantsCount} Applicants</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(job.createdAt))} ago</span>
                    </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/jobs/${job.id}`}>Edit</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

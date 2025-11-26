"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Area, AreaChart, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Job {
    id: string
    job_id: string
    title: string
    department: string | null
    status: string
    created_at: string
}

interface Application {
    id: string
    status: string | null
    created_at: string
    job_id: string | null
}

interface OverviewProps {
    jobs: Job[]
    applications: Application[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function Overview({ jobs, applications }: OverviewProps) {
    // 1. Applications per Job (Top 5)
    const appsPerJob = jobs.map(job => {
        const count = applications.filter(app => app.job_id === job.job_id).length
        return { name: job.title, count }
    }).sort((a, b) => b.count - a.count).slice(0, 5)

    // 2. Applications by Status
    const statusCounts = applications.reduce((acc, app) => {
        const status = app.status || 'Unknown'
        acc[status] = (acc[status] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

    // 3. Applications over time (Last 30 days)
    const last30Days = [...Array(30)].map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (29 - i))
        return d.toISOString().split('T')[0]
    })

    const appsOverTime = last30Days.map(date => {
        const count = applications.filter(app => app.created_at.startsWith(date)).length
        return { date, count }
    })

    // 4. Jobs by Department
    const jobsByDept = jobs.reduce((acc, job) => {
        const dept = job.department || 'Unassigned'
        acc[dept] = (acc[dept] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const deptData = Object.entries(jobsByDept).map(([name, value]) => ({ name, value }))

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Applications Over Time</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={appsOverTime}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(str) => {
                                const date = new Date(str)
                                return `${date.getDate()}/${date.getMonth() + 1}`
                            }} />
                            <YAxis tickLine={false} axisLine={false} tickFormatter={(number) => `${number}`} />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Top Jobs by Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={appsPerJob} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Jobs by Department</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={deptData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {deptData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

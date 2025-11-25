"use strict";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { JobEditor } from "@/components/jobs/job-editor"
import { Job } from "@/types"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    location: z.string().min(2, {
        message: "Location must be at least 2 characters.",
    }),
    locationType: z.enum(["Office", "Remote", "Hybrid", "Outdoor"]),
    type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
    salaryRange: z.string().optional(),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
})

interface JobFormProps {
    initialData?: Job
}

export function JobForm({ initialData }: JobFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            location: initialData?.location || "",
            locationType: initialData?.locationType || "Office",
            type: initialData?.type || "Full-time",
            salaryRange: initialData?.salaryRange || "",
            description: initialData?.description || "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            console.log(values)
            setLoading(false)
            toast.success(initialData ? "Job updated successfully" : "Job created successfully")
            router.push("/jobs")
        }, 1000)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Senior Frontend Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. New York, NY" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="locationType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a location type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Office">Office</SelectItem>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                        <SelectItem value="Outdoor">Outdoor</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a job type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="salaryRange"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Salary Range (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. $100k - $120k" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <JobEditor content={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : initialData ? "Update Job" : "Create Job"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

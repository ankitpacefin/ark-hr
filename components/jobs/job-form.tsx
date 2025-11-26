"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Editor } from "@/components/ui/editor";
import { createJob, updateJob } from "@/backend/actions/jobs";

const jobSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    slug: z.string().min(1, "Slug is required"),
    department: z.string().min(1, "Department is required"),
    location: z.string().min(1, "Location is required"),
    type: z.string().min(1, "Type is required"),
    work_mode: z.string().min(1, "Work Mode is required"),
    status: z.enum(["Draft", "Live", "Ended"]),
    content: z.string().optional(),
    skills: z.string().optional(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobFormProps {
    initialData?: any;
    workspaceId: string;
    onSuccess: () => void;
}

export function JobForm({ initialData, workspaceId, onSuccess }: JobFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const defaultValues: Partial<JobFormValues> = initialData
        ? {
            ...initialData,
            skills: initialData.skills ? initialData.skills.join(", ") : "",
            seo_title: initialData.seo_title || initialData.title,
            seo_description: initialData.seo_description || initialData.title,
        }
        : {
            title: "",
            slug: "",
            department: "",
            location: "",
            type: "",
            work_mode: "",
            status: "Draft",
            content: "",
            skills: "",
            seo_title: "",
            seo_description: "",
        };

    const form = useForm<JobFormValues>({
        resolver: zodResolver(jobSchema),
        defaultValues,
    });

    // Watch title to auto-generate slug and SEO fields
    const title = form.watch("title");

    useEffect(() => {
        if (!initialData && title) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");

            // Only update if the field hasn't been manually edited (simple check: if it matches the previous auto-gen or is empty)
            const currentSlug = form.getValues("slug");
            if (!currentSlug || currentSlug === slug.slice(0, -1)) { // Basic heuristic
                form.setValue("slug", slug);
            } else if (!currentSlug) {
                form.setValue("slug", slug);
            }

            form.setValue("seo_title", title);
            form.setValue("seo_description", title);
        }
    }, [title, initialData, form]);

    async function onSubmit(data: JobFormValues) {
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                workspace_id: workspaceId,
                skills: data.skills ? data.skills.split(",").map((s) => s.trim()) : [],
                job_id: initialData
                    ? initialData.job_id
                    : `JOB-${uuidv4().slice(0, 8).toUpperCase()}`,
                // Ensure SEO fields are set if empty
                seo_title: data.seo_title || data.title,
                seo_description: data.seo_description || data.title,
            };

            if (initialData) {
                await updateJob(initialData.job_id, formattedData);
                toast.success("Job updated successfully");
            } else {
                await createJob(formattedData);
                toast.success("Job created successfully");
            }
            onSuccess();
        } catch (error: any) {
            toast.error("Something went wrong", {
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Software Engineer" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="software-engineer" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Operations">Operations</SelectItem>
                                        <SelectItem value="HR">HR</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                        <SelectItem value="Product">Product</SelectItem>
                                        <SelectItem value="Tech">Tech</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Delhi">Delhi</SelectItem>
                                        <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                                        <SelectItem value="Gurugram">Gurugram</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Full Time">Full Time</SelectItem>
                                        <SelectItem value="Intern">Intern</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="work_mode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Work Mode</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select work mode" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Onsite">Onsite</SelectItem>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Live">Live</SelectItem>
                                        <SelectItem value="Ended">Ended</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skills (comma separated)</FormLabel>
                                <FormControl>
                                    <Input placeholder="React, Node.js, TypeScript" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* SEO Fields (Hidden or Visible? User said "auto created", implies they might be hidden or just auto-filled. Let's keep them hidden for now or just part of the data submission, but user might want to see them. I'll add them as visible fields for transparency but auto-filled) */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="seo_title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SEO Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="SEO Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="seo_description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SEO Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="SEO Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <div className="min-h-[300px] border rounded-md">
                                    <Editor value={field.value || ""} onChange={field.onChange} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Update Job" : "Create Job"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

"use server";

import { createClient } from "@/utils/supabase/server";

export async function getJobs(workspaceId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("workspace_id", workspaceId);
    if (error) throw error;
    return data;
}

export async function getJob(jobId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("job_id", jobId)
        .single();
    if (error) throw error;
    return data;
}

export async function createJob(data: any) {
    const supabase = await createClient();
    const { data: newJob, error } = await supabase
        .from("jobs")
        .insert(data)
        .select()
        .single();
    if (error) throw error;
    return newJob;
}

export async function updateJob(jobId: string, data: any) {
    const supabase = await createClient();
    const { data: updatedJob, error } = await supabase
        .from("jobs")
        .update(data)
        .eq("job_id", jobId)
        .select()
        .single();
    if (error) throw error;
    return updatedJob;
}

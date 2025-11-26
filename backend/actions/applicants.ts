"use server";

import { createClient } from "@/utils/supabase/server";
import { QueryData } from "@supabase/supabase-js";

export async function getApplicants(
    workspaceId: string,
    filters?: {
        job_id?: string;
        status?: string;
        search?: string;
        skills?: string[];
        experience?: string;
        company?: string[];
        domain?: string[];
        dateFrom?: Date;
        dateTo?: Date;
        assigned_to?: string;
        page?: number;
        limit?: number;
    }
) {
    const supabase = await createClient();
    let query = supabase
        .from("applicants")
        .select("*, jobs(title)", { count: "exact" })
        .eq("workspace_id", workspaceId)
        .order("applied_at", { ascending: false });

    if (filters) {
        if (filters.job_id && filters.job_id !== "all") {
            query = query.eq("job_id", filters.job_id);
        }
        if (filters.status && filters.status !== "all") {
            query = query.eq("status", filters.status.toLowerCase());
        }
        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }
        if (filters.skills && filters.skills.length > 0) {
            query = query.overlaps("skills", filters.skills);
        }
        if (filters.experience) {
            query = query.gte("total_experience_years", parseInt(filters.experience));
        }
        if (filters.company && filters.company.length > 0) {
            query = query.overlaps("previous_companies_names", filters.company);
        }
        if (filters.domain && filters.domain.length > 0) {
            query = query.overlaps("domains_worked", filters.domain);
        }
        if (filters.dateFrom) {
            query = query.gte("applied_at", filters.dateFrom.toISOString());
        }
        if (filters.dateTo) {
            query = query.lte("applied_at", filters.dateTo.toISOString());
        }
        if (filters.assigned_to && filters.assigned_to !== "all") {
            if (filters.assigned_to === "unassigned") {
                query = query.is("assigned_to", null);
            } else {
                query = query.eq("assigned_to", filters.assigned_to);
            }
        }
    }

    if (filters?.limit && filters?.page) {
        const start = (filters.page - 1) * filters.limit;
        const end = start + filters.limit - 1;
        query = query.range(start, end);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, count };
}

// Get applicants by status for kanban columns
export async function getApplicantsByStatus(
    workspaceId: string,
    status: string,
    page: number = 1,
    limit: number = 20
) {
    const supabase = await createClient();
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
        .from("applicants")
        .select("*, jobs(title)", { count: "exact" })
        .eq("workspace_id", workspaceId)
        .eq("status", status)
        .order("applied_at", { ascending: false })
        .range(start, end);

    if (error) throw error;
    return { data, count };
}


export async function getApplicantById(applicantId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("applicants")
        .select("*, jobs(title)")
        .eq("id", applicantId)
        .single();
    if (error) throw error;
    return data;
}

export async function createApplicant(data: any) {
    const supabase = await createClient();
    const { data: newApplicant, error } = await supabase
        .from("applicants")
        .insert(data)
        .select()
        .single();
    if (error) throw error;
    return newApplicant;
}

export async function updateApplicant(applicantId: number, data: any) {
    const supabase = await createClient();
    const { data: updatedApplicant, error } = await supabase
        .from("applicants")
        .update(data)
        .eq("id", applicantId)
        .select()
        .single();
    if (error) throw error;
    return updatedApplicant;
}

export async function deleteApplicant(applicantId: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("applicants")
        .delete()
        .eq("id", applicantId);
    if (error) throw error;
    return true;
}

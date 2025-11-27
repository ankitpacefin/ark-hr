"use server";

import { createClient } from "@/utils/supabase/server";

export async function saveApplicant(applicantId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
        .from("saved_applicants")
        .insert({
            user_id: user.id,
            applicant_id: applicantId
        });

    if (error) {
        if (error.code === '23505') { // Unique violation
            return true; // Already saved
        }
        throw error;
    }
    return true;
}

export async function unsaveApplicant(applicantId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
        .from("saved_applicants")
        .delete()
        .eq("user_id", user.id)
        .eq("applicant_id", applicantId);

    if (error) throw error;
    return true;
}

export async function getSavedApplicants(page: number = 1, limit: number = 20) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
        .from("saved_applicants")
        .select(`
            *,
            applicants (
                *,
                jobs (title)
            )
        `, { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(start, end);

    if (error) throw error;

    // Flatten the structure to return applicants directly
    const applicants = data.map((item: any) => ({
        ...item.applicants,
        saved_at: item.created_at
    }));

    return { data: applicants, count };
}

export async function isApplicantSaved(applicantId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data, error } = await supabase
        .from("saved_applicants")
        .select("id")
        .eq("user_id", user.id)
        .eq("applicant_id", applicantId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned
    return !!data;
}

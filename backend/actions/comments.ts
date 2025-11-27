"use server";

import { createClient } from "@/utils/supabase/server";

export async function getComments(applicantId: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("comments")
        .select("*, users(name, email)") // Fetch user details
        .eq("applicant_id", applicantId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
}

export async function createComment(data: any) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    const commentData = {
        ...data,
        user_id: user?.id,
    };

    const { data: newComment, error } = await supabase
        .from("comments")
        .insert(commentData)
        .select("*, users(name, email)")
        .single();
    if (error) throw error;
    return newComment;
}


export async function deleteComment(commentId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);
    if (error) throw error;
    return true;
}

export async function getAllComments(page: number = 1, limit: number = 20) {
    const supabase = await createClient();
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
        .from("comments")
        .select(`
            *,
            users (name, email),
            applicants (
                id,
                name,
                jobs (title)
            )
        `, { count: "exact" })
        .order("created_at", { ascending: false })
        .range(start, end);

    if (error) throw error;
    return { data, count };
}

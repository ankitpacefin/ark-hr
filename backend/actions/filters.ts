"use server";

import { createClient } from "@/utils/supabase/server";

export async function getFilterSuggestions(
    workspaceId: string,
    field: "skills" | "previous_companies_names" | "domains_worked",
    search: string
) {
    const supabase = await createClient();

    // For array columns, we need to unnest and then filter
    // This is complex with simple PostgREST.
    // We'll use a RPC or a raw query if possible, but for now let's try to fetch distinct values
    // Since we can't easily do "distinct unnest" via JS client without RPC,
    // we might have to fetch a subset and process in JS, or use a text search approach.

    // Alternative: Use a materialized view or a separate table for tags.
    // For now, let's just fetch the top 100 rows and extract unique values matching the search.
    // This is not scalable but works for MVP.

    const { data, error } = await supabase
        .from("applicants")
        .select(field)
        .eq("workspace_id", workspaceId)
        .limit(500);

    if (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }

    const allValues = data.flatMap((row: any) => row[field] || []);
    const uniqueValues = Array.from(new Set(allValues));

    return uniqueValues
        .filter((value: any) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 10);
}

export async function getUsers(workspaceId: string) {
    const supabase = await createClient();
    // Assuming we have a users table or we fetch from auth.users (not possible directly)
    // We created a public.users table in previous steps.
    const { data, error } = await supabase
        .from("users")
        .select("id, name, email")
        // .eq("workspace_id", workspaceId) // Users might not have workspace_id yet, or it's in a join.
        // For now, fetch all users as we are in a single workspace context effectively.
        // Or check if users table has workspace_id.
        // Based on previous tasks, users table has role/access but maybe not workspace_id directly if it's many-to-many.
        // Let's assume all users in the table are relevant for now.
        .order("name");

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }
    return data;
}

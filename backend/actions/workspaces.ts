"use server";

import { createClient } from "@/utils/supabase/server";

export async function getWorkspaces() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("workspaces").select("*");
    if (error) throw error;
    return data;
}

export async function getWorkspace(workspaceId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("id", workspaceId)
        .single();
    if (error) throw error;
    return data;
}

export async function createWorkspace(data: any) {
    const supabase = await createClient();
    const { data: newWorkspace, error } = await supabase
        .from("workspaces")
        .insert(data)
        .select()
        .single();
    if (error) throw error;
    return newWorkspace;
}

export async function switchWorkspace(workspaceId: string) {
    const supabase = await createClient();
    // Verify user has access to this workspace
    const { data: workspace, error } = await supabase
        .from("workspaces")
        .select("id")
        .eq("id", workspaceId)
        .single();

    if (error || !workspace) {
        throw new Error("Workspace not found or access denied");
    }

    // In a real app, you might set a cookie or update a user profile setting
    // For now, we'll just return success, and the client can handle the UI update
    // or we can set a cookie here if we want to persist it server-side

    // Example of setting a cookie (if we were using next/headers)
    // import { cookies } from "next/headers";
    // cookies().set("workspace_id", workspaceId);

    return true;
}

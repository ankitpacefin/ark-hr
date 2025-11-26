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

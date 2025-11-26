"use server";

import { createClient } from "@/utils/supabase/server";

export async function getUsers() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data;
}

export async function getUser(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
    if (error) throw error;
    return data;
}

export async function updateUser(userId: string, data: any) {
    const supabase = await createClient();
    const { data: updatedUser, error } = await supabase
        .from("users")
        .update(data)
        .eq("id", userId)
        .select()
        .single();
    if (error) throw error;
    return updatedUser;
}

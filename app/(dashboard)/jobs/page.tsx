import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { JobsList } from "@/components/jobs/jobs-list";

export default async function JobsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    // Fetch the first workspace for now. 
    // In a real app, this would come from the user's selected workspace or context.
    const { data: workspaces } = await supabase.from("workspaces").select("id").limit(1);

    if (!workspaces || workspaces.length === 0) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold">No Workspace Found</h1>
                <p>Please create a workspace to manage jobs.</p>
            </div>
        );
    }

    const workspaceId = workspaces[0].id;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <JobsList workspaceId={workspaceId} />
        </div>
    );
}

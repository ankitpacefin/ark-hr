import { createClient } from "@/utils/supabase/server";
import Login07 from "@/components/login-07";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    console.log("User found:", user.id);
    const { data: userData, error } = await supabase
      .from("users")
      .select("access, role")
      .eq("id", user.id)
      .single();

    console.log("User Data:", userData);
    console.log("Error fetching user data:", error);

    if (userData?.access) {
      console.log("Access granted, redirecting to dashboard");
      redirect("/dashboard");
    } else {
      console.log("Access denied or pending");
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Access Pending</h1>
          <p className="text-lg text-muted-foreground">
            Your account is waiting for administrator approval.
          </p>
          <div className="text-sm text-left bg-muted p-4 rounded-md overflow-auto max-w-lg">
            <p className="font-bold">Debug Info:</p>
            <p>User ID: {user.id}</p>
            <p>Role: {userData?.role || 'None'}</p>
            <p>Access: {userData?.access ? 'True' : 'False'}</p>
            {error && (
              <div className="mt-2 text-red-500">
                <p>Error: {error.message}</p>
                <p>Details: {error.details}</p>
                <p>Hint: {error.hint}</p>
              </div>
            )}
          </div>
          <form action={async () => {
            "use server";
            const supabase = await createClient();
            await supabase.auth.signOut();
            redirect("/");
          }}>
            <Button variant="outline">Sign Out</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Login07 />
    </div>
  );
}

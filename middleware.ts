import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If user is not signed in and trying to access a protected route (not /)
    // Actually, we want to protect everything EXCEPT / (which will be the login page if not auth)
    // But wait, the plan says:
    // "If not authenticated, show Login/Signup forms" on /.
    // "If authenticated, check users table for access."

    // So middleware should just refresh session.
    // We can handle redirection logic here or in the page.
    // Let's handle basic protection here.

    // If user is NOT authenticated, and trying to access /dashboard, redirect to /
    if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If user IS authenticated, and trying to access /, we might want to redirect to /dashboard if they have access.
    // But we need to check the 'users' table for 'access'.
    // Doing a DB call in middleware is okay with Supabase.

    if (user && request.nextUrl.pathname === "/") {
        const { data: userData } = await supabase
            .from("users")
            .select("access")
            .eq("id", user.id)
            .single();

        if (userData?.access) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // If no access, stay on / (which will show "Pending Approval")
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};

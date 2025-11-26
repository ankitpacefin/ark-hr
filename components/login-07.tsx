"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { JSX, SVGProps, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



export default function Login07() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signup successful! Please check your email or wait for approval.");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Logged in successfully");
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-4">
      <div className="mx-auto w-full max-w-xs space-y-4">
        <div className="space-y-1 text-center">
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-bold text-xl tracking-tight">Ark_hr</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">by Pocketful</span>
          </div>
          <h1 className="text-2xl font-semibold pt-2">{isSignup ? "Create an account" : "Welcome back"}</h1>
          <p className="text-sm text-muted-foreground">
            {isSignup ? "Enter your details to create an account." : "Sign in to access your dashboard."}
          </p>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative mt-1.5">
                <Input
                  id="email"
                  className="peer ps-9"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <Mail size={16} aria-hidden="true" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  className="ps-9 pe-9"
                  placeholder="Enter your password"
                  type={isVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <Lock size={16} aria-hidden="true" />
                </div>
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  aria-controls="password"
                >
                  {isVisible ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (isSignup ? "Signing up..." : "Signing in...") : (isSignup ? "Sign up" : "Sign in")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <div className="text-center text-sm">
            {isSignup ? "Already have an account? " : "No account? "}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary font-medium hover:underline"
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

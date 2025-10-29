"use client";

import React from "react";
import { Button } from "@/Components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const nextParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("next")
      : null;

  async function signInWithGoogle() {
    setLoading(true);
    const supabase = createClient();
    const callbackUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback${
            nextParam ? `?next=${encodeURIComponent(nextParam)}` : ""
          }`
        : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });
    if (error) {
      console.error("Google sign-in error:", error.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Use your Google account to continue.
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          {loading ? "Redirecting…" : "Continue with Google"}
        </Button>
      </div>
    </div>
  );
}

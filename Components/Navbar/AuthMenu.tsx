"use client";

import React from "react";
import { Button } from "@/Components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { UserDropdown } from "./UserDropdown";

export function AuthMenu() {
  const [email, setEmail] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });
  }, []);

  async function signInWithGoogle() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    });
    if (error) console.error("Google sign-in error:", error.message);
  }

  if (loading) {
    return <div className="hidden md:block w-full" />;
  }

  if (!email) {
    return (
      <Button
        variant="outline"
        className="px-3 py-2 text-sm"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </Button>
    );
  }

  return <UserDropdown email={email} />;
}

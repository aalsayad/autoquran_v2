"use client";

import { Separator } from "@/Components/ui/separator";
import { UploadRecitationDialog } from "@/Components/Recitations/UploadRecitationDialog";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function RecitationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login?next=/recitations");
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <main className="max-w-[1150px] mx-auto px-4 py-10">
        <div className="text-center text-muted-foreground">Loading...</div>
      </main>
    );
  }
  return (
    <main className="max-w-[1150px] mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Recitations
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload your MP3 recitations, tag them by Surah and Recitor, and
          segment ayat on a waveform.
        </p>
      </header>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-lg font-medium">Get started</h2>
          <p className="text-sm text-muted-foreground">
            You don't have any recitations yet. Add your first one to begin
            organizing and segmenting ayat.
          </p>
        </div>
        <div className="p-6 pt-0">
          <UploadRecitationDialog
            onUpload={(payload) => {
              console.log("Upload payload:", payload);
              // TODO: Refresh recitations list or show success message
            }}
          />
        </div>
      </div>

      <Separator className="my-10" />

      <section>
        <h3 className="text-base font-medium mb-3">Your recitations</h3>
        <div className="text-sm text-muted-foreground">
          No recitations yet. Once you upload, they'll appear here.
        </div>
      </section>
    </main>
  );
}

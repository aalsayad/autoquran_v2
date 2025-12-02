"use client";

import { Separator } from "@/Components/ui/separator";
import { UploadRecitationDialog } from "@/Components/Recitations/UploadRecitationDialog";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  getRecitations,
  deleteRecitation,
  type Recitation,
} from "@/lib/storage/recitations";
import { Button } from "@/Components/ui/button";
import { FiBook, FiTrash2 } from "react-icons/fi";

export default function RecitationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recitations, setRecitations] = useState<Recitation[]>([]);

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
        setRecitations(getRecitations());
      }
    }
    checkAuth();
  }, [router]);

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this recitation?")) {
      deleteRecitation(id);
      setRecitations(getRecitations());
    }
  }

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

      {recitations.length === 0 ? (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-lg font-medium">Get started</h2>
            <p className="text-sm text-muted-foreground">
              You don't have any recitations yet. Add your first one to begin
              organizing and segmenting ayat.
            </p>
          </div>
          <div className="p-6 pt-0">
            <UploadRecitationDialog />
          </div>
        </div>
      ) : (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your recitations</h2>
            <UploadRecitationDialog />
          </div>
          <div className="grid gap-4">
            {recitations.map((rec) => (
              <div
                key={rec.id}
                className="border rounded-lg bg-card p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/recitations/${rec.id}`)}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FiBook className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">
                    {rec.title || `${rec.surahName} - ${rec.recitorName}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {rec.surahName} • {rec.recitorName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(rec.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(rec.id);
                  }}
                >
                  <FiTrash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

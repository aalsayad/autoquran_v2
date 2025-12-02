"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getRecitation,
  updateRecitationSegments,
  type Recitation,
  type Segment,
} from "@/lib/storage/recitations";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { FiArrowLeft, FiBook, FiSave, FiCheck } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";
import { WaveformPlayer } from "@/Components/Recitations/WaveformPlayer";
import { chapters } from "@/lib/quran-index/chapters";

export default function RecitationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [recitation, setRecitation] = useState<Recitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    async function checkAuthAndLoad() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login?next=/recitations");
        return;
      }

      const id = params.id as string;
      const rec = getRecitation(id);

      if (!rec) {
        router.replace("/recitations");
        return;
      }

      setRecitation(rec);
      setSegments(rec.segments || []);
      setLoading(false);
    }
    checkAuthAndLoad();
  }, [params.id, router]);

  function handleSegmentsChange(newSegments: Segment[]) {
    setSegments(newSegments);
    setSaved(false);
  }

  function handleSave() {
    if (!recitation) return;
    updateRecitationSegments(recitation.id, segments);
    setSaved(true);

    // Show saved feedback
    setTimeout(() => setSaved(true), 2000);
  }

  if (loading) {
    return (
      <main className="max-w-[1150px] mx-auto px-4 py-10">
        <div className="text-center text-muted-foreground">Loading...</div>
      </main>
    );
  }

  if (!recitation) {
    return null;
  }

  const surahChapter = chapters.find((c) => c.id === recitation.surahId);
  const totalAyahs = surahChapter?.verses_count || 286;

  return (
    <main className="max-w-[1150px] mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push("/recitations")}>
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to recitations
        </Button>

        <Button onClick={handleSave} disabled={saved} className="gap-2">
          {saved ? (
            <>
              <FiCheck className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <FiSave className="h-4 w-4" />
              Save Progress
            </>
          )}
        </Button>
      </div>

      <div className="border rounded-lg bg-card p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FiBook className="h-12 w-12 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {recitation.title ||
                `${recitation.surahName} - ${recitation.recitorName}`}
            </h1>
            <div className="space-y-1 text-muted-foreground">
              <p>
                <span className="font-medium">Surah:</span>{" "}
                {recitation.surahName} ({totalAyahs} ayahs)
              </p>
              <p>
                <span className="font-medium">Recitor:</span>{" "}
                {recitation.recitorName}
              </p>
              <p>
                <span className="font-medium">Uploaded:</span>{" "}
                {new Date(recitation.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <WaveformPlayer
        audioUrl={recitation.audioUrl}
        segments={segments}
        surahId={recitation.surahId}
        totalAyahs={totalAyahs}
        onSegmentsChange={handleSegmentsChange}
      />
    </main>
  );
}

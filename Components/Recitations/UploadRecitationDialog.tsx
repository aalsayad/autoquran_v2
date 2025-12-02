"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { FiChevronDown } from "react-icons/fi";
import { chapters } from "@/lib/quran-index/chapters";
import { AddRecitorDialog } from "./AddRecitorDialog";
import { Separator } from "@/Components/ui/separator";
import {
  getRecitors,
  saveRecitor,
  saveRecitation,
  type Recitor,
} from "@/lib/storage/recitations";

type UploadRecitationDialogProps = {
  trigger?: React.ReactNode;
};

export function UploadRecitationDialog({
  trigger,
}: UploadRecitationDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [surah, setSurah] = useState<number>(1);
  const [surahOpen, setSurahOpen] = useState(false);
  const [surahSearch, setSurahSearch] = useState("");
  const [recitor, setRecitor] = useState<string>("");
  const [recitorOpen, setRecitorOpen] = useState(false);
  const [recitors, setRecitors] = useState<Recitor[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load recitors from localStorage on mount
  useEffect(() => {
    setRecitors(getRecitors());
  }, []);

  function handleAddRecitor(name: string, id: string) {
    const newRecitor = { id, name };
    saveRecitor(newRecitor);
    setRecitors((prev) => [...prev, newRecitor]);
    setRecitor(id);
  }

  async function handleUpload() {
    setError(null);
    if (!file) {
      setError("Please choose an audio file.");
      return;
    }
    if (!recitor) {
      setError("Please select a recitor.");
      return;
    }
    setLoading(true);
    try {
      // Step 1: Get presigned URL from our API
      const urlResponse = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!urlResponse.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { signedUrl, publicUrl } = await urlResponse.json();

      // Step 2: Upload file directly to S3
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3");
      }

      const selectedRecitor = recitors.find((r) => r.id === recitor);
      const selectedSurah = chapters.find((c) => c.id === surah);

      // Step 3: Save recitation to localStorage
      const recitationId = `recitation-${Date.now()}`;
      const recitation = {
        id: recitationId,
        title: title || undefined,
        surahId: surah,
        surahName: selectedSurah?.name_simple || "",
        recitorId: recitor,
        recitorName: selectedRecitor?.name || "",
        audioUrl: publicUrl,
        uploadedAt: new Date().toISOString(),
      };

      saveRecitation(recitation);

      // Reset form
      setFile(null);
      setSurah(1);
      setRecitor("");
      setTitle("");
      setOpen(false);

      // Navigate to the recitation detail page
      router.push(`/recitations/${recitationId}`);
    } catch (e: any) {
      setError(e?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  const selectedRecitor = recitors.find((r) => r.id === recitor);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button className="px-4">Add recitation</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Recitation</DialogTitle>
        </DialogHeader>

        <form className="grid gap-4 mt-4 " onSubmit={(e) => e.preventDefault()}>
          {/* File Upload */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Audio file (MP3)</label>
            <input
              type="file"
              accept="audio/mpeg,audio/mp3 "
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm file:mr-3 file:rounded-md file:border file:px-3 file:py-1.5 file:bg-background file:text-foreground file:border-input transition-colors file:cursor-pointer"
            />
          </div>

          <Separator className="my-4 bg-foreground/10 h-px" />

          {/* Surah Selection with Search */}
          <div className="grid gap-2 text-sm">
            <label className="text-sm font-medium">Surah</label>
            <div className="relative ">
              <button
                type="button"
                className="w-full border rounded-lg pl-3 pr-2 py-2 bg-background shadow-xs text-left flex items-center cursor-pointer"
                onClick={() => setSurahOpen((o) => !o)}
              >
                <span className="truncate">
                  {surah}. {chapters[surah - 1]?.name_simple || ""}
                </span>
                <FiChevronDown
                  className={`ml-auto mr-1 h-4 w-4 text-muted-foreground transition-transform ${
                    surahOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {surahOpen && (
                <div className="absolute left-0 right-0 z-10001 mt-2 max-h-[280px] overflow-auto rounded-lg border bg-background shadow-lg">
                  <div className="p-2 border-b bg-background sticky top-0 z-10">
                    <input
                      autoFocus
                      value={surahSearch}
                      onChange={(e) => setSurahSearch(e.target.value)}
                      placeholder="Search by English or Arabic name"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <ul className="p-1 bg-background">
                    {chapters
                      .filter((c) => {
                        if (!surahSearch.trim()) return true;
                        const q = surahSearch.toLowerCase();
                        return (
                          c.name_simple.toLowerCase().includes(q) ||
                          c.name_arabic.includes(surahSearch)
                        );
                      })
                      .map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            className={`w-full text-left px-3 py-2 rounded-md hover:bg-accent cursor-pointer ${
                              surah === c.id ? "bg-accent" : ""
                            }`}
                            onClick={() => {
                              setSurah(c.id);
                              setSurahOpen(false);
                              setSurahSearch("");
                            }}
                          >
                            {c.id}. {c.name_simple}
                            <span className="ml-2 opacity-60">
                              {c.name_arabic}
                            </span>
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Recitor Selection with Add New */}
          <div className="grid gap-2 text-sm">
            <label className="text-sm font-medium">Recitor</label>
            <div className="relative">
              <button
                type="button"
                className="w-full border rounded-lg pl-3 pr-2 py-2 bg-background shadow-xs text-left flex items-center cursor-pointer"
                onClick={() => setRecitorOpen((o) => !o)}
              >
                <span className="truncate">
                  {selectedRecitor?.name || "Select a recitor"}
                </span>
                <FiChevronDown
                  className={`ml-auto mr-1 h-4 w-4 text-muted-foreground transition-transform ${
                    recitorOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {recitorOpen && (
                <div className="absolute left-0 right-0 z-10001 mt-2 max-h-[240px] overflow-auto rounded-lg border bg-background shadow-lg">
                  <ul className="p-1">
                    {/* Add New Recitor */}
                    <li>
                      <AddRecitorDialog
                        trigger={
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-accent cursor-pointer text-primary font-medium"
                          >
                            + Add new recitor
                          </button>
                        }
                        onAdd={(name, id) => {
                          handleAddRecitor(name, id);
                          setRecitorOpen(false);
                        }}
                      />
                    </li>
                    <div className="h-px bg-border my-1" />
                    {recitors.map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-accent cursor-pointer ${
                            recitor === r.id ? "bg-accent" : ""
                          }`}
                          onClick={() => {
                            setRecitor(r.id);
                            setRecitorOpen(false);
                          }}
                        >
                          {r.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Optional Title */}
          <div className="grid gap-2 text-sm">
            <label className="text-sm font-medium">
              Title{" "}
              <span className="text-muted-foreground opacity-70">
                (Optional)
              </span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning recitation"
              className="w-full border rounded-lg px-3 py-2 bg-background"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </form>

        <DialogFooter className="mt-2">
          <DialogClose asChild disabled={loading}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading…" : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

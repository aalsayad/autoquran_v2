"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { chapterMeta } from "@/lib/quran-index";
import { chapters } from "@/lib/quran-index/chapters";
import { FiChevronDown } from "react-icons/fi";

type Mode = "surah" | "juz" | "page";

export function NavigateDialog({ trigger }: { trigger: React.ReactElement }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("surah");
  const [chapter, setChapter] = useState<number>(1);
  const [surahOpen, setSurahOpen] = useState(false);
  const [surahSearch, setSurahSearch] = useState("");
  const [ayah, setAyah] = useState<string>("");
  const [juz, setJuz] = useState<number>(1);
  const [juzOpen, setJuzOpen] = useState(false);
  const [page, setPage] = useState<number>(1);

  const maxAyah = useMemo(
    () => chapterMeta[chapter]?.ayahCount ?? 1,
    [chapter]
  );

  function onNavigate(close: () => void) {
    if (mode === "surah") {
      const ay = Number(ayah);
      if (Number.isFinite(ay) && ay > 0) {
        router.push(`/mushaf?chapter=${chapter}&ayah=${Math.min(ay, maxAyah)}`);
      } else {
        router.push(`/mushaf?chapter=${chapter}&ayah=1`);
      }
    } else if (mode === "juz") {
      router.push(`/mushaf?juz=${juz}`);
    } else {
      router.push(`/mushaf?page=${page}`);
    }
    close();
  }

  // Simple segmented control button
  const tabBtn = (m: Mode, label: string) => (
    <button
      onClick={() => setMode(m)}
      className={`px-2 py-1.5 rounded-[6px] w-full text-sm cursor-pointer ${
        mode === m ? "bg-background" : "bg-transparent"
      }`}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Navigate Quran
          </DialogTitle>
          {/* Subtext for mode selection */}
          <DialogDescription className="text-sm -mt-1 text-muted-foreground">
            Choose how you want to navigate
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 bg-muted/90 p-1 rounded-md">
          {tabBtn("surah", "Surah")}
          {tabBtn("juz", "Juz")}
          {tabBtn("page", "Page")}
        </div>

        {mode === "surah" && (
          <div className="space-y-4 mt-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-2">
                Select Surah
              </label>
              <button
                type="button"
                className="w-full border rounded-lg pl-3 pr-2 py-2 bg-background shadow-xs text-left flex items-center cursor-pointer"
                onClick={() => setSurahOpen((o) => !o)}
              >
                <span className="truncate">
                  {chapter}. {chapters[chapter - 1]?.name_simple || ""}
                </span>
                <FiChevronDown
                  className={`ml-auto mr-1 h-4 w-4 text-muted-foreground transition-transform ${
                    surahOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {surahOpen && (
                <div className="absolute left-0 right-0 z-1000 mt-2 max-h-[320px] overflow-auto rounded-lg border bg-background shadow-lg">
                  {/* Sticky search header so filter stays visible while scrolling */}
                  <div className="p-2 border-b bg-background sticky top-0 z-10">
                    <input
                      autoFocus
                      value={surahSearch}
                      onChange={(e) => setSurahSearch(e.target.value)}
                      placeholder="Search by English or Arabic name"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
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
                              chapter === c.id ? "bg-accent" : ""
                            }`}
                            onClick={() => {
                              setChapter(c.id);
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
            <div>
              <label className="block text-sm font-medium mb-2">
                Ayah (Optional)
              </label>
              <input
                type="number"
                min={1}
                max={maxAyah}
                placeholder={`1-${maxAyah}`}
                className="w-full border rounded-lg px-3 py-2 bg-background shadow-xs"
                value={ayah}
                onChange={(e) => setAyah(e.target.value)}
              />
            </div>
          </div>
        )}

        {mode === "juz" && (
          <div className="space-y-4 mt-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-2">
                Select Juz
              </label>
              <button
                type="button"
                className="w-full border rounded-lg pl-3 pr-2 py-2 bg-background shadow-xs text-left flex items-center cursor-pointer"
                onClick={() => setJuzOpen((o) => !o)}
              >
                <span className="truncate">{`Juz ${juz}`}</span>
                <FiChevronDown
                  className={`ml-auto mr-1 h-4 w-4 text-muted-foreground transition-transform ${
                    juzOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {juzOpen && (
                <div className="absolute left-0 right-0 z-1000 mt-2 max-h-[320px] overflow-auto rounded-lg border bg-background shadow-lg">
                  <ul className="p-1">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
                      <li key={n}>
                        <button
                          type="button"
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-accent cursor-pointer ${
                            juz === n ? "bg-accent" : ""
                          }`}
                          onClick={() => {
                            setJuz(n);
                            setJuzOpen(false);
                          }}
                        >
                          {`Juz ${n}`}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {mode === "page" && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Page Number
              </label>
              <input
                type="number"
                min={1}
                max={604}
                className="w-full border rounded-lg px-3 py-2 bg-background shadow-xs"
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="px-5">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className="px-5" onClick={(e) => onNavigate(() => {})}>
              Navigate
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

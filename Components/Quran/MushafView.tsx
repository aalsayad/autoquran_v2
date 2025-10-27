// Components/Quran/MushafView.tsx
"use client";
import type { ChapterVerses } from "@/lib/types";
import React, { useState, useEffect } from "react";
import { getChapterVerses } from "@/lib/quran-helper-functions/quranApi";
import QpcPage from "./QpcPage";

const MushafView = ({ chapterNumber }: { chapterNumber: number }) => {
  const [chapterVerses, setChapterVerses] = useState<ChapterVerses | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapterData = async () => {
      setLoading(true); // Reset loading when chapter changes
      try {
        const data = await getChapterVerses(chapterNumber);
        setChapterVerses(data);
      } catch (error) {
        console.error("Error fetching chapter:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChapterData();
  }, [chapterNumber]);

  console.log("Chapter Verses:", chapterVerses);
  if (loading)
    return <div className="text-center p-8 text-gray-400">Loading...</div>;

  return (
    <div
      className="min-h-screen bg-background text-foreground p-8"
      lang="ar"
      dir="rtl"
    >
      <div className="max-w-[1150px] mx-auto text-3xl">
        {/* Header */}
        <div className="space-y-4">
          {/* Surah Name */}
          <div className="text-center text-4xl">
            <h1 className="font-quran">
              سُورَةُ {chapterVerses?.chapterData.chapter.name_arabic}
            </h1>
          </div>

          <p className="text-center text-base opacity-50">
            {chapterVerses?.chapterData.chapter.translated_name.name} •{" "}
            {chapterVerses?.chapterData.chapter.verses_count} verses
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-foreground/10 w-full mt-8 mb-16"></div>

        {/* Pages */}
        {chapterVerses?.pages
          .filter((p) => p.verses.length > 0) // Filter out empty pages
          .map((p) => {
            // Use the fetched page number for the key and rendering
            const pageNum = p.fetchedPageNumber || p.verses[0]?.page_number;
            if (!pageNum) return null;
            return (
              <QpcPage key={pageNum} pageNumber={pageNum} verses={p.verses} />
            );
          })}
      </div>
    </div>
  );
};

export default MushafView;

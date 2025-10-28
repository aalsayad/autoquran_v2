// Components/Quran/MushafView.tsx
"use client";
import type { ChapterVerses } from "@/lib/types";
import React, { useState, useEffect } from "react";
import { getChapterVerses } from "@/lib/quran-helper-functions/quranApi";
import QpcPage from "./QpcPage";
import ListView from "./ListView";
import { LoadingSkeleton } from "../ui/LoadingSkeleton";
import { AyahNavigationBar } from "../Navbar/AyahNavigationBar";
import type { ViewMode } from "../Navbar/MushafNavigationBar";

const MushafView = ({
  chapterNumber,
  viewMode = "page",
  showTranslation = false,
}: {
  chapterNumber: number;
  viewMode?: ViewMode;
  showTranslation?: boolean;
}) => {
  const [chapterVerses, setChapterVerses] = useState<ChapterVerses | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const fetchChapterData = async () => {
      setLoading(true); // Reset loading when chapter changes
      setCurrentAyah(1); // Reset to first ayah when chapter changes
      setIsNavigating(false); // Reset navigation state when chapter changes
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

  // Scroll to ayah when currentAyah changes (only when navigating)
  useEffect(() => {
    if (currentAyah && isNavigating) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        const ayahElement = document.querySelector(
          `[data-ayah="${currentAyah}"]`
        );
        if (ayahElement) {
          const rect = ayahElement.getBoundingClientRect();
          const targetPosition =
            window.scrollY + rect.top - window.innerHeight * 0.2;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [currentAyah, isNavigating]);

  const handleAyahClick = (ayahNumber: number) => {
    setIsNavigating(true); // Enable highlighting
    setCurrentAyah(ayahNumber);
  };

  const handleNextAyah = () => {
    if (
      chapterVerses &&
      currentAyah < chapterVerses.chapterData.chapter.verses_count
    ) {
      setIsNavigating(true); // Enable highlighting on first navigation
      setCurrentAyah((prev) => prev + 1);
    }
  };

  const handlePreviousAyah = () => {
    if (currentAyah > 1) {
      setIsNavigating(true); // Enable highlighting on first navigation
      setCurrentAyah((prev) => prev - 1);
    }
  };

  console.log("Chapter Verses:", chapterVerses);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
        <div className="max-w-[1150px] mx-auto">
          <div className="space-y-4">
            <LoadingSkeleton className="h-12 w-64 mx-auto" />
            <LoadingSkeleton className="h-6 w-48 mx-auto" />
            <div className="mt-8 space-y-6">
              <LoadingSkeleton className="h-32 w-full" />
              <LoadingSkeleton className="h-32 w-full" />
              <LoadingSkeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8 pb-24"
        lang="ar"
        dir="rtl"
      >
        <div className="max-w-[900px] mx-auto">
          {/* Header */}
          <div className="space-y-2">
            {/* Surah Name */}
            <div className="text-center">
              <h1 className="font-quran text-[28px] md:text-[32px] lg:text-[44px]">
                سُورَةُ {chapterVerses?.chapterData.chapter.name_arabic}
              </h1>
            </div>

            <p className="text-center text-[12px] md:text-[14px] lg:text-[16px] opacity-50">
              {chapterVerses?.chapterData.chapter.translated_name.name} •{" "}
              {chapterVerses?.chapterData.chapter.verses_count} verses
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-foreground/10 w-full mt-8 mb-16"></div>

          {/* Render based on view mode */}
          {viewMode === "page" ? (
            /* Page View */
            chapterVerses?.pages
              .filter((p) => p.verses.length > 0)
              .map((p) => {
                const pageNum = p.fetchedPageNumber || p.verses[0]?.page_number;
                if (!pageNum) return null;
                return (
                  <QpcPage
                    key={pageNum}
                    pageNumber={pageNum}
                    verses={p.verses}
                    currentAyah={isNavigating ? currentAyah : undefined}
                    onAyahClick={handleAyahClick}
                  />
                );
              })
          ) : (
            /* List View */
            <ListView
              verses={chapterVerses?.pages.flatMap((p) => p.verses) || []}
              currentAyah={isNavigating ? currentAyah : undefined}
              onAyahClick={handleAyahClick}
              showTranslation={showTranslation}
            />
          )}
        </div>
      </div>

      {/* Bottom Ayah Navigation */}
      {chapterVerses && (
        <AyahNavigationBar
          currentAyah={currentAyah}
          totalAyahs={chapterVerses.chapterData.chapter.verses_count}
          onNext={handleNextAyah}
          onPrevious={handlePreviousAyah}
        />
      )}
    </>
  );
};

export default MushafView;

"use client";

import MushafView from "@/Components/Quran/MushafView";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MushafNavigationBar,
  ViewMode,
} from "@/Components/Navbar/MushafNavigationBar";
import { getChapterData } from "@/lib/quran-helper-functions/quranApi";
import Navbar from "@/Components/Navbar/Navbar";
import {
  toCanonicalFromParams,
  isCanonicalUrl,
} from "@/lib/quran-index/resolver";

const MushafPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapter = searchParams.get("chapter");
  const ayah = searchParams.get("ayah");
  const [chapterNameArabic, setChapterNameArabic] = useState<string>("");
  const [chapterNameEnglish, setChapterNameEnglish] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("page");
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  const currentChapter = parseInt(chapter || "1");

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem("quran-view-mode") as ViewMode;
    const savedShowTranslation = localStorage.getItem("quran-show-translation");

    if (savedViewMode === "page" || savedViewMode === "list") {
      setViewMode(savedViewMode);
    }

    if (savedShowTranslation !== null) {
      setShowTranslation(savedShowTranslation === "true");
    }
  }, []);

  // Save viewMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("quran-view-mode", viewMode);
  }, [viewMode]);

  // Save showTranslation to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("quran-show-translation", showTranslation.toString());
  }, [showTranslation]);

  // Normalize URL: support ?juz= / ?page= and ensure canonical ?chapter=&ayah=
  useEffect(() => {
    const canonical = toCanonicalFromParams(searchParams as any);
    if (!isCanonicalUrl(searchParams as any, canonical)) {
      const sp = new URLSearchParams();
      sp.set("chapter", String(canonical.chapter));
      sp.set("ayah", String(canonical.ayah));
      router.replace(`/mushaf?${sp.toString()}`);
    }
  }, [searchParams, router]);

  // Fetch chapter names
  useEffect(() => {
    const fetchChapterNames = async () => {
      try {
        const data = await getChapterData(currentChapter);
        setChapterNameArabic(data.chapter.name_arabic);
        setChapterNameEnglish(data.chapter.name_simple);
      } catch (error) {
        console.error("Error fetching chapter names:", error);
      }
    };
    fetchChapterNames();
  }, [currentChapter]);

  const handleNext = () => {
    if (currentChapter < 114) {
      router.push(`/mushaf?chapter=${currentChapter + 1}`);
    }
  };

  const handlePrevious = () => {
    if (currentChapter > 1) {
      router.push(`/mushaf?chapter=${currentChapter - 1}`);
    }
  };

  return (
    <>
      {/* Override navbar with bottom navigation */}
      <Navbar
        bottomNavbar={
          <MushafNavigationBar
            currentChapter={currentChapter}
            chapterNameArabic={chapterNameArabic}
            chapterNameEnglish={chapterNameEnglish}
            viewMode={viewMode}
            showTranslation={showTranslation}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onViewChange={setViewMode}
            onToggleTranslation={() => setShowTranslation(!showTranslation)}
          />
        }
      />

      <MushafView
        chapterNumber={currentChapter}
        viewMode={viewMode}
        showTranslation={showTranslation}
        initialAyah={ayah ? parseInt(ayah) : undefined}
      />
    </>
  );
};

export default MushafPage;

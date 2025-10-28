"use client";

import MushafView from "@/Components/Quran/MushafView";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MushafNavigationBar } from "@/Components/Navbar/MushafNavigationBar";
import { getChapterData } from "@/lib/quran-helper-functions/quranApi";
import Navbar from "@/Components/Navbar/Navbar";

const MushafPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapter = searchParams.get("chapter");
  const [chapterNameArabic, setChapterNameArabic] = useState<string>("");
  const [chapterNameEnglish, setChapterNameEnglish] = useState<string>("");

  const currentChapter = parseInt(chapter || "1");

  // Redirect to default if no chapter param
  useEffect(() => {
    if (!chapter) {
      router.replace("/mushaf?chapter=1");
    }
  }, [chapter, router]);

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
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        }
      />

      <MushafView chapterNumber={currentChapter} />
    </>
  );
};

export default MushafPage;

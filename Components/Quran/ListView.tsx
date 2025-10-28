"use client";

import React, { useState, useEffect } from "react";
import type { Verse } from "@/lib/types";
import { ensureQpcFont } from "@/lib/qpc/runtime";

type Props = {
  verses: Verse[];
  currentAyah?: number;
  onAyahClick?: (ayahNumber: number) => void;
  showTranslation?: boolean;
};

export default function ListView({
  verses,
  currentAyah,
  onAyahClick,
  showTranslation = false,
}: Props) {
  const [hoveredAyah, setHoveredAyah] = useState<number | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState<Set<number>>(new Set());

  // Load all unique page fonts
  useEffect(() => {
    const loadFonts = async () => {
      const uniquePages = new Set<number>();
      verses.forEach((verse) => {
        verse.words.forEach((word) => {
          uniquePages.add(word.page_number);
        });
      });

      const loadedPages = new Set<number>();
      await Promise.all(
        Array.from(uniquePages).map(async (pageNum) => {
          const loaded = await ensureQpcFont(pageNum);
          if (loaded) {
            loadedPages.add(pageNum);
          }
        })
      );

      setFontsLoaded(loadedPages);
    };

    loadFonts();
  }, [verses]);

  return (
    <div className="space-y-0" lang="ar" dir="rtl">
      {verses.map((verse, verseIdx) => {
        const isCurrentAyah =
          currentAyah !== undefined && verse.verse_number === currentAyah;
        const isHovered = hoveredAyah === verse.verse_number;
        const opacity =
          currentAyah === undefined
            ? "opacity-100"
            : isCurrentAyah || isHovered
            ? "opacity-100"
            : "opacity-30";

        return (
          <div key={verse.id}>
            <div
              className={`transition-opacity duration-300 ${opacity} cursor-pointer md:p-4 md:py-8 p-2 py-3 hover:bg-accent/5 relative flex my-2 justify-between`}
              onMouseEnter={() => setHoveredAyah(verse.verse_number)}
              onMouseLeave={() => setHoveredAyah(null)}
              onClick={() => onAyahClick?.(verse.verse_number)}
              data-ayah={verse.verse_number}
            >
              {/* Ayah Text with QPC Fonts - Centered with max-width */}
              <div className="w-[95%]">
                <p className="text-[26px] md:text-[34px] lg:text-[36px] leading-[1.65] text-right">
                  {verse.words.map((word, idx) => {
                    const glyph = word.code_v1 || word.text_uthmani;
                    const fontFamily = fontsLoaded.has(word.page_number)
                      ? `QPC-Page-${word.page_number}`
                      : "serif";

                    return (
                      <span key={word.id} style={{ fontFamily }}>
                        {glyph}
                        {idx < verse.words.length - 1 ? " " : ""}
                      </span>
                    );
                  })}
                </p>

                {/* English Translation */}
                {showTranslation && (
                  <div
                    className="text-xs md:text-sm text-muted-foreground/85 mt-4 md:mt-8 text-left"
                    dir="ltr"
                  >
                    <p className="w-full">
                      {" "}
                      {verse.words
                        .map((word) => word.translation.text)
                        .join(" ")
                        .replace(/\s*\(\d+\)/g, "")}
                    </p>
                  </div>
                )}
              </div>

              {/* Small Ayah Number - Top Left */}
              <div className="text-[9px] md:text-[12px] text-muted-foreground/60 font-medium">
                {verse.verse_key}
              </div>
            </div>

            {/* Divider between ayahs */}
            {verseIdx < verses.length - 1 && (
              <div className="h-px bg-foreground/10 w-full" />
            )}
          </div>
        );
      })}
    </div>
  );
}

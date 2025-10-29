"use client";

import React, { useEffect, memo } from "react";
import type { Verse, Word } from "@/lib/types";
import {
  groupWordsIntoPageLines,
  sortedLineEntries,
} from "@/lib/quran-helper-functions/quranDisplay";
import { ensureQpcFont } from "@/lib/qpc/runtime";

type Props = {
  verses: Verse[];
  pageNumber: number;
  currentAyah?: number;
  onAyahClick?: (ayahNumber: number) => void;
  onAyahRef?: (ayahNumber: number) => React.RefCallback<HTMLElement>;
};

export default function QpcPage({
  verses,
  pageNumber,
  currentAyah,
  onAyahClick,
  onAyahRef,
}: Props) {
  // Runtime page-specific font family (QPC font per page)
  const [fontLoaded, setFontLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [hoveredAyah, setHoveredAyah] = React.useState<number | null>(null);
  const family = `QPC-Page-${pageNumber}`;

  // Words are pre-grouped into visual lines for this page
  const grouped = groupWordsIntoPageLines(verses);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Ensure the page font is available before rendering to avoid layout shift
      const loaded = await ensureQpcFont(pageNumber);

      if (!loaded) {
        console.warn(`Font not found for page ${pageNumber}`);
      }

      if (!cancelled) {
        setFontLoaded(loaded);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageNumber]);

  if (loading) {
    return (
      <div className="space-y-6 mb-16">
        <div className="h-12 w-full bg-muted rounded-md animate-pulse" />
        <div className="h-12 w-full bg-muted rounded-md animate-pulse" />
        <div className="h-12 w-full bg-muted rounded-md animate-pulse" />
        <div className="h-12 w-full bg-muted rounded-md animate-pulse" />
        <div className="h-8 w-16 mx-auto mt-20 bg-muted rounded-md animate-pulse" />
      </div>
    );
  }

  // Map each word id → verse number to drive per-ayah opacity/hover highlighting
  const wordToVerseMap = new Map<number, number>();
  verses.forEach((verse) => {
    verse.words.forEach((word) => {
      wordToVerseMap.set(word.id, verse.verse_number);
    });
  });

  return (
    <div lang="ar" dir="rtl">
      <div className="">
        {sortedLineEntries(grouped).map(([lineNum, words]) => {
          // Track the first word per ayah on this line so we attach only one ref
          // Rationale: multiple words share the same ayah; we want a stable scroll anchor
          const seenVerses = new Set<number>();
          return (
            <div
              key={lineNum}
              className="text-center text-[26px] md:text-[34px] lg:text-[44px] leading-[1.65]"
              style={{ fontFamily: fontLoaded ? family : "serif" }}
            >
              {(words as Word[]).map((word) => {
                // Render the QPC glyph; fallback to Uthmani text where unavailable
                const glyph = word.code_v1 || word.text_uthmani;
                const verseNumber = wordToVerseMap.get(word.id);
                const isCurrentAyah =
                  currentAyah !== undefined && verseNumber === currentAyah;
                const isHovered = hoveredAyah === verseNumber;
                const opacity =
                  currentAyah === undefined
                    ? "opacity-100"
                    : isCurrentAyah || isHovered
                    ? "opacity-100"
                    : "opacity-30";

                // Attach a ref only to the first word for this ayah on this line
                const needRef = verseNumber && !seenVerses.has(verseNumber);
                if (needRef && verseNumber) seenVerses.add(verseNumber);
                return (
                  <span
                    key={word.id}
                    className={`transition-opacity duration-300 ${opacity} cursor-pointer`}
                    data-ayah={verseNumber}
                    onMouseEnter={() => setHoveredAyah(verseNumber || null)}
                    onMouseLeave={() => setHoveredAyah(null)}
                    onClick={() => verseNumber && onAyahClick?.(verseNumber)}
                    // Callback-ref registers anchors upstream for scrolling
                    ref={
                      needRef && onAyahRef
                        ? (onAyahRef(verseNumber!) as any)
                        : undefined
                    }
                  >
                    {" "}
                    {glyph}{" "}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8 md:mt-12 lg:mt-18 text-foreground/60 text-[10px] md:text-[11px] lg:text-[12px]">
        {pageNumber}
      </div>
      <div className="h-px bg-foreground/10 w-full mt-4 mb-16" />
    </div>
  );
}

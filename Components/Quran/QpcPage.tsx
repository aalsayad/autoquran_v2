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
};

export default function QpcPage({ verses, pageNumber }: Props) {
  const [fontLoaded, setFontLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const family = `QPC-Page-${pageNumber}`;

  console.log(`[QpcPage ${pageNumber}] Verses:`, verses);
  console.log(
    `[QpcPage ${pageNumber}] Total words:`,
    verses.reduce((acc, v) => acc + v.words.length, 0)
  );

  const grouped = groupWordsIntoPageLines(verses);
  console.log(
    `[QpcPage ${pageNumber}] Grouped lines:`,
    Object.keys(grouped).length
  );
  console.log(
    `[QpcPage ${pageNumber}] Words after grouping:`,
    Object.values(grouped).flat().length
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      console.log(`[QpcPage] Loading page ${pageNumber}...`);
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
      <div className="text-center text-foreground/60">
        Loading page {pageNumber}…
      </div>
    );
  }

  // console.log(
  //   `[QpcPage] Page ${pageNumber}: ${verses.length} verses, verse numbers:`,
  //   verses.map((v) => v.verse_number)
  // );

  return (
    <div lang="ar" dir="rtl">
      <div className="space-y-6">
        {sortedLineEntries(grouped).map(([lineNum, words]) => (
          <div
            key={lineNum}
            className="text-center text-[44px]"
            style={{ fontFamily: fontLoaded ? family : "serif" }}
          >
            {(words as Word[]).map((word) => {
              // Use code_v1 glyph from API, fallback to text_uthmani
              const glyph = word.code_v1 || word.text_uthmani;
              return <span key={word.id}>{glyph} </span>;
            })}
          </div>
        ))}
      </div>

      <div className="text-center mt-20 text-foreground/60 text-sm">
        {pageNumber}
      </div>
      <div className="h-px bg-foreground/10 w-full mt-4 mb-16" />
    </div>
  );
}

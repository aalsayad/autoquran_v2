"use client";
import React from "react";
import type { Verse, Word } from "@/lib/types";
import {
  groupWordsIntoPageLines,
  sortedLineEntries,
} from "@/lib/quran-helper-functions/quranDisplay";

type QuranPageProps = {
  verses: Verse[];
};

const QuranPage: React.FC<QuranPageProps> = ({ verses }) => {
  return (
    <div className="leading-normal space-y-8" lang="ar" dir="rtl">
      {sortedLineEntries(groupWordsIntoPageLines(verses)).map(
        ([lineNum, words]) => (
          <div
            key={lineNum}
            className="font-quran text-4xl leading-[2.8] w-full bg-red-500"
          >
            {(words as Word[]).map((word) =>
              word.char_type_name === "end" ? (
                <span key={word.id} className="font-numbers mx-1 text-4xl">
                  {word.text_uthmani}{" "}
                </span>
              ) : (
                <span
                  key={word.id}
                  style={{
                    textAlign: "justify",
                    textAlignLast: "justify",
                    textJustify: "inter-word",
                  }}
                >
                  {word.text_uthmani}{" "}
                </span>
              )
            )}
          </div>
        )
      )}

      {/* Page number */}
      <div className="text-center mt-16 text-foreground/60 text-sm">
        {verses[0]?.page_number ?? ""}
      </div>

      {/* Divider */}
      <div className="h-px bg-foreground/10 w-full mt-4 mb-16"></div>
    </div>
  );
};

export default QuranPage;

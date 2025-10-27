import type { Verse, Word } from "../types";

// Group ALL words from ALL verses by their page line number
export const groupWordsIntoPageLines = (verses: Verse[]) => {
  const pageLines: { [lineNum: number]: Word[] } = {};

  for (const verse of verses) {
    for (const word of verse.words) {
      // No filtering - verses are already correctly selected
      // Words may span pages, so include all words from selected verses
      const lineNum = word.line_number;
      if (!pageLines[lineNum]) {
        pageLines[lineNum] = [];
      }
      pageLines[lineNum].push(word);
    }
  }

  return pageLines;
};

// Function: Sort lines by line number (so they display in order)
export const sortedLineEntries = (lineGroups: {
  [lineNum: number]: Word[];
}) => {
  // Step 1: Convert object to array of [key, value] pairs
  const entries = Object.entries(lineGroups);

  // Step 2: Sort these pairs by line number
  const sorted = entries.sort(([lineA], [lineB]) => {
    return Number(lineA) - Number(lineB);
  });

  // Step 3: Return the sorted array
  return sorted;
};

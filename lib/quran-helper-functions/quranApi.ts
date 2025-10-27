// import type { MushafData, ChapterInfo, MushafPage } from "./types";

// // Get basic chapter information
// export async function getChapterInfo(
//   chapterNumber: number
// ): Promise<ChapterInfo> {
//   const response = await fetch(
//     `https://api.quran.com/api/v4/chapters/${chapterNumber}`
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to fetch chapter info: ${response.status}`);
//   }

//   const data = await response.json();

//   return data.chapter;
// }

// // Get a single Mushaf page (already perfectly organized!)
// export async function getMushafPage(pageNumber: number): Promise<MushafPage> {
//   const params = new URLSearchParams({
//     words: "true",
//     word_fields: "text_uthmani",
//   });

//   const response = await fetch(
//     `https://api.quran.com/api/v4/verses/by_page/${pageNumber}?${params}`
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to fetch page ${pageNumber}: ${response.status}`);
//   }

//   return await response.json();
// }

// // Get complete chapter data using page-based approach
// export async function getMushafData(
//   chapterNumber: number
// ): Promise<MushafData> {
//   console.log(`🔄 Fetching chapter ${chapterNumber} info...`);

//   // Step 1: Get which pages this chapter spans
//   const chapterInfo = await getChapterInfo(chapterNumber);
//   const pageNumbers = chapterInfo.pages;

//   console.log(
//     `📖 Chapter ${chapterInfo.name} spans pages ${pageNumbers[0]}-${
//       pageNumbers[pageNumbers.length - 1]
//     }`
//   );
//   console.log(`📄 Need to fetch ${pageNumbers.length} pages`);

//   // Step 2: Fetch all pages (already organized by API!)
//   console.log(`📚 Fetching ${pageNumbers.length} Mushaf pages...`);

//   const pagePromises = pageNumbers.map(async (pageNum) => {
//     console.log(`📄 Fetching page ${pageNum}...`);
//     return await getMushafPage(pageNum);
//   });

//   const pages = await Promise.all(pagePromises);

//   console.log(`✅ Got all ${pages.length} pages with perfect organization!`);

//   // Step 3: Calculate metadata
//   const metadata = {
//     chapterNumber,
//     chapterName: chapterInfo.name,
//     totalPages: pages.length,
//     pageRange: {
//       start: pageNumbers[0],
//       end: pageNumbers[pageNumbers.length - 1],
//     },
//     totalVerses: pages.reduce((total, page) => total + page.verses.length, 0),
//   };

//   return {
//     pages,
//     metadata,
//   };
// }

// // For backward compatibility - get all verses as simple array
// export async function getAllSurahVerses(chapterNumber: number) {
//   const mushafData = await getMushafData(chapterNumber);

//   // Flatten all verses from all pages
//   const allVerses = mushafData.pages.flatMap((page) => page.verses);

//   return {
//     allVerses,
//     byPage: mushafData.pages, // Already organized!
//     metadata: mushafData.metadata,
//   };
// }

import type {
  ChapterResponse,
  ChapterVerses,
  QuranPageResponse,
  Verse,
} from "../types";

//Get a Quran Chapter Basic Information
export const getChapterData = async (
  chapterNumer: number
): Promise<ChapterResponse> => {
  //Fetch the chapter data from endpoint
  const response = await fetch(
    `https://api.quran.com/api/v4/chapters/${chapterNumer}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch chapter data: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

//Get a Quran Page
export const getQuranPage = async (
  pageNumber: number
): Promise<QuranPageResponse> => {
  const response = await fetch(
    `https://api.quran.com/api/v4/verses/by_page/${pageNumber}?words=true&word_fields=text_uthmani,code_v1,line_number`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch page data: ${response.status}`);
  }
  return await response.json();
};

//Get All Verses for a Quran Chapter
export const getChapterVerses = async (
  chapterNumber: number
): Promise<ChapterVerses> => {
  const chapterData: ChapterResponse = await getChapterData(chapterNumber);

  // Just use the API's page list directly
  const pageNumbers: number[] = chapterData.chapter.pages;
  console.log("Page Numbers:", pageNumbers);

  //Find all pages between the first and last page
  const startPage = pageNumbers[0];
  const endPage = pageNumbers[pageNumbers.length - 1];
  const allPages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
  console.log("All Pages:", allPages);

  // Fetch each page and track the fetched page number
  const pagePromises = allPages.map(async (pageNumber: number) => {
    const page = await getQuranPage(pageNumber);
    return { ...page, fetchedPageNumber: pageNumber };
  });
  const pages = await Promise.all(pagePromises);

  // Filter each page to only show this chapter's verses
  const filteredPages = pages.map((page) => ({
    ...page,
    verses: page.verses.filter((verse) => {
      const verseChapter = parseInt(verse.verse_key.split(":")[0]);
      return verseChapter === chapterNumber;
    }),
  }));

  console.log("Filtered Pages:", filteredPages);

  return {
    chapterData,
    pages: filteredPages,
  };
};

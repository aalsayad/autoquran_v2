//-----------------------
// Quran API Types
//-----------------------

export interface TranslatedName {
  language_name: string;
  name: string;
}

export interface ChapterInfo {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: TranslatedName;
}

export interface ChapterResponse {
  chapter: ChapterInfo;
}

export interface Translation {
  text: string;
  language_name: string;
}

export interface Transliteration {
  text: string | null;
  language_name: string;
}

export interface Word {
  id: number;
  position: number;
  audio_url: string | null;
  char_type_name: string; // "word" or "end"
  text_uthmani: string;
  page_number: number;
  line_number: number;
  text: string;
  code_v1?: string; // Add this - optional since API needs to request it
  translation: Translation;
  transliteration: Transliteration;
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  page_number: number;
  juz_number: number;
  words: Word[];
}

export interface Pagination {
  per_page: number;
  current_page: number;
  next_page: number | null;
  total_pages: number;
  total_records: number;
}

export interface QuranPageResponse {
  verses: Verse[];
  pagination: Pagination;
  fetchedPageNumber?: number; // Track the actual page number that was fetched
}

//-----------------------
// Custom Types
//-----------------------

export interface ChapterVerses {
  chapterData: ChapterResponse;
  pages: QuranPageResponse[];
}

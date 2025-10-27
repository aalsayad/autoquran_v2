// lib/qpc/runtime.ts

// Your JSON shape: { "1:1:1": { text: "ﱁ", ... }, "1:1:2": { text: "ﱂ", ... } }
type QpcWordData = {
  id: number;
  surah: string;
  ayah: string;
  word: string;
  location: string;
  text: string;
};

type QpcJsonData = Record<string, QpcWordData>;

const loadedFonts = new Set<number>();
let qpcJsonCache: QpcJsonData | null = null;

const QPC_FONT_BASE = "/font/quran-com";
const QPC_JSON_URL = "/font/qpc/qpc-v2.json";

/**
 * Returns font URL for a page.
 * Font files are named like: p2.woff2 (Quran.com format)
 */
function pageFontUrl(page: number): string {
  return `${QPC_FONT_BASE}/p${page}.woff2`;
}

/**
 * Injects @font-face for a specific page (lazy).
 * Returns false if font file doesn't exist.
 */
export async function ensureQpcFont(page: number): Promise<boolean> {
  if (loadedFonts.has(page)) return true;

  const family = `QPC-Page-${page}`;
  const srcUrl = pageFontUrl(page);

  // Quick check if font exists
  try {
    const checkRes = await fetch(srcUrl, { method: "HEAD" });
    if (!checkRes.ok) {
      console.warn(`QPC font not found for page ${page}, will use fallback`);
      return false;
    }
  } catch {
    return false;
  }

  const style = document.createElement("style");
  style.setAttribute("data-qpc-font", String(page));
  style.textContent = `
@font-face {
  font-family: '${family}';
  src: url('${srcUrl}') format('woff2'); 
  font-display: swap;
}
`.trim();

  document.head.appendChild(style);
  loadedFonts.add(page);
  return true;
}

/**
 * Loads the big qpc-v2.json once (7.5MB, cached).
 */
async function loadQpcJson(): Promise<QpcJsonData> {
  if (qpcJsonCache) return qpcJsonCache;
  const res = await fetch(QPC_JSON_URL, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`Failed to load ${QPC_JSON_URL}: ${res.status}`);
  }
  const data: QpcJsonData = await res.json();
  qpcJsonCache = data;
  return data;
}

/**
 * Returns the QPC glyph text for a word location like "2:1:3" (surah:ayah:word).
 * Returns null if not found (fallback to original text).
 */
export async function getQpcWordGlyph(
  surah: number,
  ayah: number,
  wordPos: number
): Promise<string | null> {
  const json = await loadQpcJson();
  const key = `${surah}:${ayah}:${wordPos}`;
  return json[key]?.text ?? null;
}

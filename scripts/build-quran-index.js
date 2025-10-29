// Build Quran index (chapters, juz, pages) into lib/quran-index/index.ts
// Usage: node scripts/build-quran-index.js

import fs from "node:fs/promises";

const API = "https://api.quran.com/api/v4";
// Mushaf ID for Uthmani Hafs layout; commonly 1 or 2. We'll default to 1.
const MUSHAF_ID = 1;

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function getChapters() {
  const data = await fetchJSON(`${API}/chapters?language=en`);
  const chapters = Array(115).fill(null);
  for (const c of data.chapters) {
    chapters[c.id] = { ayahCount: c.verses_count };
  }
  return chapters;
}

async function getJuzStarts() {
  const data = await fetchJSON(`${API}/juzs`);
  const out = Array(31).fill(null);
  for (const j of data.juzs) {
    const entries = Object.entries(j.verse_mapping).map(
      ([chapterStr, range]) => {
        const chapter = Number(chapterStr);
        const startAyah = Number(String(range).split("-")[0]);
        return { chapter, ayah: startAyah };
      }
    );
    entries.sort((a, b) => a.chapter - b.chapter);
    const first = entries[0];
    out[j.juz_number] = first;
  }
  return out;
}

async function getPageStarts() {
  const out = Array(605).fill(null);
  for (let p = 1; p <= 604; p++) {
    const url = `${API}/verses/by_page/${p}?mushaf=${MUSHAF_ID}&per_page=1`;
    const data = await fetchJSON(url);
    const first = data.verses?.[0]?.verse_key;
    if (!first) throw new Error(`No verse on page ${p}`);
    const [chapter, ayah] = first.split(":").map(Number);
    out[p] = { chapter, ayah };
  }
  return out;
}

async function main() {
  console.log("Fetching chapter, juz, and page indices...");
  const [chapterMeta, juzIndex, pageIndex] = await Promise.all([
    getChapters(),
    getJuzStarts(),
    getPageStarts(),
  ]);

  const ts =
    `// GENERATED FILE – do not edit\n` +
    `export const chapterMeta = ${JSON.stringify(chapterMeta)};\n` +
    `export const juzIndex = ${JSON.stringify(juzIndex)};\n` +
    `export const pageIndex = ${JSON.stringify(pageIndex)};\n`;

  await fs.mkdir("lib/quran-index", { recursive: true });
  await fs.writeFile("lib/quran-index/index.ts", ts, "utf8");
  console.log("Wrote lib/quran-index/index.ts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

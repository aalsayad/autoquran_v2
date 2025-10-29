// Build list of chapters with Arabic and English names
// Usage: node scripts/build-chapters.js

import fs from "node:fs/promises";

const API = "https://api.quran.com/api/v4";

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function main() {
  console.log("Fetching chapters...");
  const data = await fetchJSON(`${API}/chapters?language=en`);
  const chapters = data.chapters.map((c) => ({
    id: c.id,
    revelation_order: c.revelation_order,
    revelation_place: c.revelation_place,
    name_arabic: c.name_arabic,
    name_simple: c.name_simple,
    name_complex: c.name_complex,
    verses_count: c.verses_count,
    translated_name: c.translated_name?.name ?? null,
  }));

  // Ensure index by id (1..114)
  chapters.sort((a, b) => a.id - b.id);

  const ts =
    `// GENERATED FILE – Surah names\n` +
    `export type ChapterInfo = { id: number; revelation_order: number; revelation_place: string; name_arabic: string; name_simple: string; name_complex: string; verses_count: number; translated_name: string | null };\n` +
    `export const chapters: ChapterInfo[] = ${JSON.stringify(chapters)};\n`;

  await fs.mkdir("lib/quran-index", { recursive: true });
  await fs.writeFile("lib/quran-index/chapters.ts", ts, "utf8");
  console.log("Wrote lib/quran-index/chapters.ts");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

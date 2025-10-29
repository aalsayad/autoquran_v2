// Resolver turns query params into a canonical { chapter, ayah }
// Priority: chapter+ayah > page > juz > chapter. No network; uses generated indices.
import { chapterMeta, juzIndex, pageIndex } from "./index";

export type Canonical = { chapter: number; ayah: number };

function toNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function clampAyah(chapter: number, ayah: number): number {
  const max = chapterMeta[chapter]?.ayahCount ?? 1;
  if (!Number.isFinite(max)) return 1;
  return Math.max(1, Math.min(ayah, max));
}

export function toCanonicalFromParams(params: URLSearchParams): Canonical {
  const c = toNumber(params.get("chapter"));
  const a = toNumber(params.get("ayah"));
  const p = toNumber(params.get("page"));
  const j = toNumber(params.get("juz"));

  if (c && a) return { chapter: c, ayah: clampAyah(c, a) };
  if (p && pageIndex[p]) return pageIndex[p] as Canonical;
  if (j && juzIndex[j]) return juzIndex[j] as Canonical;
  if (c) return { chapter: c, ayah: 1 };
  return { chapter: 1, ayah: 1 };
}

export function isCanonicalUrl(params: URLSearchParams, c: Canonical): boolean {
  return (
    params.get("chapter") === String(c.chapter) &&
    params.get("ayah") === String(c.ayah) &&
    !params.get("page") &&
    !params.get("juz")
  );
}

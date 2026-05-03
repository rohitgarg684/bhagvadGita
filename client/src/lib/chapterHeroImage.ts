import type { Verse } from "@/types/gita";

function meaningImageUrl(verse: Verse): string | null {
  return verse.images?.meaning?.url || verse.images?.detailed_meaning?.url || null;
}

/** Hero / chapter-level image: chapter 12 uses śloka 12.2 meaning art (issue #65). */
export function getChapterHeroImageUrl(chapterNum: number, verses: Verse[]): string | null {
  if (chapterNum === 12) {
    const v2 = verses.find((v) => v.verse === 2);
    if (v2) {
      const u = meaningImageUrl(v2);
      if (u) return u;
    }
  }
  for (const v of verses) {
    const u = meaningImageUrl(v);
    if (u) return u;
  }
  return null;
}

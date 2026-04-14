export interface ChapterMeta {
  chapter: number;
  name: string;
  name_hindi: string;
  subtitle: string;
  verses_count: number;
  summary: string;
  theme: string;
  color: string;
  icon: string;
  key_verses: Verse[];
}

export interface Verse {
  verse: number;
  chapter: number;
  title?: string;
  sanskrit: string;
  transliteration: string;
  one_line_meaning: string;
  concise_journey: string;
  full_journey_text?: string;
  story?: string;
  real_life_example?: string;
  final_takeaway?: string;
  grammar_notes?: string;
}

export interface GitaData {
  chapters: ChapterMeta[];
  chapter6_full: Verse[];
}

import { useState, useRef, useCallback, useMemo } from "react";
import { Link, useParams, Redirect } from "wouter";
import Layout from "@/components/Layout";
import gitaData from "@/data/gitaData.json";
import type { GitaData, Verse } from "@/types/gita";
import { useChapterVisibility } from "@/contexts/ChapterVisibilityContext";
import { useImageUrl } from "@/hooks/useImages";
import { ChevronLeft, ChevronRight, BookOpen, Star, Sparkles, Gamepad2, Play, Pause } from "lucide-react";

const data = gitaData as unknown as GitaData;

const chapterIAST: Record<number, string> = {
  1: "arjunaviṣādayogaḥ",
  2: "sāṅkhyayogaḥ",
  3: "karmayogaḥ",
  4: "jñānakarmasaṃnyāsayogaḥ",
  5: "karmasaṃnyāsayogaḥ",
  6: "dhyānayogaḥ",
  7: "jñānavijñānayogaḥ",
  8: "akṣarabrahmayogaḥ",
  9: "rājavidyārājaguhyayogaḥ",
  10: "vibhūtiyogaḥ",
  11: "viśvarūpadarśanayogaḥ",
  12: "bhaktiyogaḥ",
  13: "kṣetrakṣetrajñavibhāgayogaḥ",
  14: "guṇatrayavibhāgayogaḥ",
  15: "puruṣottamayogaḥ",
  16: "daivāsurasaṃpadvibhāgayogaḥ",
  17: "śraddhātrayavibhāgayogaḥ",
  18: "mokṣasaṃnyāsayogaḥ",
};

const chapterDevanagari: Record<number, string> = {
  1: "अर्जुनविषादयोगः",
  2: "साङ्ख्ययोगः",
  3: "कर्मयोगः",
  4: "ज्ञानकर्मसंन्यासयोगः",
  5: "कर्मसंन्यासयोगः",
  6: "ध्यानयोगः",
  7: "ज्ञानविज्ञानयोगः",
  8: "अक्षरब्रह्मयोगः",
  9: "राजविद्याराजगुह्ययोगः",
  10: "विभूतियोगः",
  11: "विश्वरूपदर्शनयोगः",
  12: "भक्तियोगः",
  13: "क्षेत्रक्षेत्रज्ञविभागयोगः",
  14: "गुणत्रयविभागयोगः",
  15: "पुरुषोत्तमयोगः",
  16: "दैवासुरसम्पद्विभागयोगः",
  17: "श्रद्धात्रयविभागयोगः",
  18: "मोक्षसंन्यासयोगः",
};

function MeaningThumbnail({ chapterNum, verseNum, verse }: { chapterNum: number; verseNum: number; verse: Verse }) {
  const fallback = verse.images?.meaning?.url || "";
  const url = useImageUrl(`ch${chapterNum}_v${verseNum}_meaning`, fallback);
  if (!url) return null;
  return (
    <img
      src={url}
      alt=""
      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-orange-200"
      loading="lazy"
    />
  );
}

function VerseAudioButton({ audioUrl }: { audioUrl: string }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.crossOrigin = "anonymous";
      a.src = audioUrl;
      a.addEventListener("ended", () => setPlaying(false));
      a.addEventListener("error", () => setPlaying(false));
      audioRef.current = a;
    }
    const a = audioRef.current;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  }, [audioUrl, playing]);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
        playing
          ? "bg-orange-500 text-white shadow-md"
          : "bg-orange-100 text-orange-600 hover:bg-orange-200"
      }`}
      title={playing ? "Pause" : "Play shloka"}
    >
      {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
    </button>
  );
}

function buildSynopsis(verses: Verse[]): string {
  if (verses.length === 0) return "";
  const meanings = verses.map((v) => v.one_line_meaning).filter(Boolean);
  if (meanings.length <= 4) return meanings.join(" ");
  const step = Math.floor(meanings.length / 4);
  return [meanings[0], meanings[step], meanings[step * 2], meanings[meanings.length - 1]].join(" ");
}

export default function ChapterPage() {
  const params = useParams<{ chapterNum: string }>();
  const chapterNum = parseInt(params.chapterNum || "1");
  const [kidsMode, setKidsMode] = useState(false);

  const { isChapterVisible } = useChapterVisibility();
  const chapter = data.chapters.find((c) => c.chapter === chapterNum);

  const verses: Verse[] = chapter
    ? (chapterNum === 6 ? data.chapter6_full : chapter.key_verses)
    : [];

  const synopsis = useMemo(() => buildSynopsis(verses), [verses]);

  if (!chapter) return <div className="p-8 text-center">Chapter not found</div>;
  if (!isChapterVisible(chapterNum)) return <Redirect to="/" />;

  const prevChapter = chapterNum > 1 ? chapterNum - 1 : null;
  const nextChapter = chapterNum < 18 ? chapterNum + 1 : null;

  const devanagariName = chapterDevanagari[chapterNum] || chapter.name_hindi;
  const iastName = chapterIAST[chapterNum] || "";

  return (
    <Layout kidsMode={kidsMode} onToggleKids={() => setKidsMode(!kidsMode)}>
      {/* Chapter Header */}
      <div className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/60 to-red-900/90 z-[1]" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: verses[0]?.images?.meaning?.url
              ? `url(${verses[0].images.meaning.url})`
              : undefined,
          }}
        />
        <div className="relative z-10 px-6 py-10 lg:py-14">
          <div className="flex items-center gap-2 text-red-300 text-sm mb-6">
            <Link href="/" className="hover:text-orange-300 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-orange-300">Chapter {chapterNum}</span>
          </div>

          <div className="w-full">
            <div className="flex items-center gap-3 mb-3">
              <div>
                <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest">
                  Chapter {chapterNum} of 18
                </p>
                {chapterNum === 6 && (
                  <span className="inline-flex items-center gap-1 bg-orange-400 text-red-950 text-xs font-bold px-2 py-0.5 rounded-full mt-1">
                    <Sparkles size={10} />
                    Full Journey Content
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-white font-display text-3xl lg:text-5xl font-bold leading-tight mb-1">
              {chapter.name}
            </h1>
            <p className="text-orange-300 font-devanagari text-xl lg:text-2xl mb-1">{devanagariName}</p>
            <p className="text-orange-200 text-base italic mb-4">{iastName}</p>

            {synopsis && (
              <p className="text-red-100 text-sm lg:text-base leading-relaxed w-full">{synopsis}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <BookOpen size={14} className="text-orange-400" />
                <span className="text-white text-sm">{chapter.verses_count} verses</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Star size={14} className="text-orange-400" />
                <span className="text-white text-sm">{chapter.theme}</span>
              </div>
              {chapterNum === 6 && (
                <>
                  <div className="flex items-center gap-2 bg-orange-400/20 border border-orange-400/40 rounded-full px-4 py-2">
                    <Sparkles size={14} className="text-orange-400" />
                    <span className="text-orange-300 text-sm font-semibold">{verses.length} verses with full explanations</span>
                  </div>
                  <Link href={`/chapter/${chapterNum}/games`}>
                    <div className="flex items-center gap-2 bg-pink-400/20 border border-pink-400/40 hover:bg-pink-400/30 rounded-full px-4 py-2 transition-all cursor-pointer">
                      <Gamepad2 size={14} className="text-pink-300" />
                      <span className="text-pink-200 text-sm font-semibold">5 Interactive Games</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verse Grid */}
      <div className="px-4 py-8 w-full">
        {chapterNum !== 6 && verses.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-display">Key verses coming soon</p>
            <p className="text-sm mt-1">Chapter {chapterNum} content is being prepared</p>
          </div>
        )}

        {chapterNum === 6 && (
          <div className="mb-6">
            <Link href={`/chapter/${chapterNum}/games`}>
              <div className="bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl p-5 flex items-center justify-between shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer max-w-2xl mx-auto">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🎮</span>
                    <span className="text-white font-kids font-bold text-lg">Play Learning Games!</span>
                  </div>
                  <p className="text-pink-100 font-kids text-sm">5 fun games: Match, Quiz, Fill-in-Blank, Scramble & Speed Round</p>
                </div>
                <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                  <Gamepad2 size={24} className="text-white" />
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {verses.map((verse) => (
            <Link
              key={verse.verse}
              href={`/chapter/${chapterNum}/verse/${verse.verse}`}
            >
              <div className="group bg-card border border-border hover:border-orange-300 rounded-xl p-5 transition-all hover:shadow-md cursor-pointer h-full flex flex-col">
                {/* Header: verse number + image + audio */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-950 text-orange-300 flex items-center justify-center font-bold text-sm group-hover:bg-orange-400 group-hover:text-red-950 transition-all">
                      {chapterNum}.{verse.verse}
                    </div>
                    <MeaningThumbnail chapterNum={chapterNum} verseNum={verse.verse} verse={verse} />
                    {verse.title && (
                      <span className="text-sm font-semibold text-orange-800 line-clamp-1">{verse.title}</span>
                    )}
                  </div>
                  {verse.audio_url && <VerseAudioButton audioUrl={verse.audio_url} />}
                </div>

                {/* Sanskrit (Devanagari) — multi-line */}
                <div className="font-devanagari text-red-900 text-base leading-relaxed mb-1.5">
                  {verse.sanskrit.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                {/* IAST transliteration — multi-line */}
                {verse.transliteration && (
                  <div className="text-orange-700 text-sm italic leading-relaxed mb-2">
                    {verse.transliteration.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}

                {/* One-line meaning */}
                <p className="text-foreground/80 text-base leading-relaxed mb-3 flex-1">
                  {verse.one_line_meaning}
                </p>

                {/* Reflection questions */}
                {verse.reflection && (
                  <div className="border-t border-border pt-3 mt-auto">
                    <p className="text-sm font-semibold text-violet-600 mb-1.5">Reflection</p>
                    <div className="space-y-1">
                      {verse.reflection.split('\n').filter(l => l.trim()).slice(0, 2).map((q, i) => (
                        <p key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-1.5">
                          <span className="text-violet-400 flex-shrink-0">◈</span>
                          <span className="line-clamp-2">{q}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Chapter Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border max-w-4xl mx-auto">
          {prevChapter ? (
            <Link href={`/chapter/${prevChapter}`}>
              <button className="flex items-center gap-2 text-sm text-red-800 hover:text-orange-600 transition-colors font-semibold">
                <ChevronLeft size={16} />
                Chapter {prevChapter}
              </button>
            </Link>
          ) : <div />}

          <Link href="/">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              All Chapters
            </button>
          </Link>

          {nextChapter ? (
            <Link href={`/chapter/${nextChapter}`}>
              <button className="flex items-center gap-2 text-sm text-red-800 hover:text-orange-600 transition-colors font-semibold">
                Chapter {nextChapter}
                <ChevronRight size={16} />
              </button>
            </Link>
          ) : <div />}
        </div>
      </div>
    </Layout>
  );
}

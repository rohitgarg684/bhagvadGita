import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { Link, useParams, Redirect } from "wouter";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import gitaData from "@/data/gitaData.json";
import type { GitaData, Verse } from "@/types/gita";
import { useChapterVisibility } from "@/contexts/ChapterVisibilityContext";
import { useImageUrl } from "@/hooks/useImages";
import { ChevronLeft, ChevronRight, BookOpen, Sparkles, Gamepad2, Play, Pause } from "lucide-react";
import { chapterIAST, chapterDevanagari } from "@/lib/chapterMeta";

const data = gitaData as unknown as GitaData;

function MeaningThumbnail({ chapterNum, verseNum, verse }: { chapterNum: number; verseNum: number; verse: Verse }) {
  const fallback = verse.images?.meaning?.url || "";
  const url = useImageUrl(`ch${chapterNum}_v${verseNum}_meaning`, fallback);
  if (!url) return null;
  return (
    <img
      src={url}
      alt=""
      className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-orange-200"
      loading="lazy"
    />
  );
}

const activeAudioRef: { current: HTMLAudioElement | null; verseNum: number | null; onEnd: (() => void) | null } = {
  current: null, verseNum: null, onEnd: null,
};

function VerseAudioButton({ audioUrl, verseNum, onEnded }: { audioUrl: string; verseNum: number; onEnded?: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (activeAudioRef.current === audioRef.current) {
        activeAudioRef.current = null;
        activeAudioRef.verseNum = null;
        activeAudioRef.onEnd = null;
      }
    };
  }, []);

  useEffect(() => {
    if (activeAudioRef.verseNum !== verseNum && playing) {
      setPlaying(false);
      setProgress(0);
      cancelAnimationFrame(rafRef.current);
    }
  });

  const updateProgress = useCallback(() => {
    const a = audioRef.current;
    if (a && !a.paused) {
      if (a.duration && !isNaN(a.duration)) {
        setProgress(a.currentTime / a.duration);
      }
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.crossOrigin = "anonymous";
      a.src = audioUrl;
      a.addEventListener("ended", () => {
        setPlaying(false);
        setProgress(0);
        cancelAnimationFrame(rafRef.current);
        activeAudioRef.onEnd?.();
      });
      a.addEventListener("error", () => {
        setPlaying(false);
        setProgress(0);
        cancelAnimationFrame(rafRef.current);
      });
      audioRef.current = a;
    }
    const a = audioRef.current;
    if (playing) {
      a.pause();
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
      if (activeAudioRef.current === a) {
        activeAudioRef.current = null;
        activeAudioRef.verseNum = null;
      }
    } else {
      if (activeAudioRef.current && activeAudioRef.current !== a) {
        activeAudioRef.current.pause();
      }
      activeAudioRef.current = a;
      activeAudioRef.verseNum = verseNum;
      activeAudioRef.onEnd = onEnded || null;
      a.currentTime = 0;
      a.play().catch(() => setPlaying(false));
      setPlaying(true);
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  }, [audioUrl, playing, verseNum, onEnded, updateProgress]);

  const SIZE = 44;
  const STROKE = 4;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      className="flex-shrink-0 relative"
      style={{ width: SIZE, height: SIZE }}
      title={playing ? "Pause" : "Play shloka"}
    >
      <svg width={SIZE} height={SIZE} className="absolute inset-0 -rotate-90">
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          fill="none" stroke="currentColor" strokeWidth={STROKE}
          className="text-red-200"
        />
        {playing && (
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none" stroke="currentColor" strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-orange-500 transition-[stroke-dashoffset] duration-200"
          />
        )}
      </svg>
      <span className={`absolute inset-[4px] rounded-full flex items-center justify-center transition-all ${
        playing ? "bg-red-900 text-white" : "bg-red-950 text-orange-300 [@media(hover:hover)]:hover:bg-red-800"
      }`}>
        {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </span>
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
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  useEffect(() => {
    return () => {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
        activeAudioRef.verseNum = null;
        activeAudioRef.onEnd = null;
      }
    };
  }, []);

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
  const headerImage = verses[0]?.images?.meaning?.url || null;

  const chapterTitle = `Chapter ${chapterNum} — ${iastName || chapter.name} (${devanagariName})`;
  const chapterDescription = chapter.summary ||
    `${chapter.subtitle} — Explore ${chapter.verses_count} verses of Chapter ${chapterNum} (${chapter.name}) of the Bhagavad Gita with Sanskrit, transliteration, meanings, stories, and kid-friendly explanations.`;

  return (
    <Layout kidsMode={kidsMode} onToggleKids={() => setKidsMode(!kidsMode)}>
      <SEO
        title={chapterTitle}
        description={chapterDescription}
        path={`/chapter/${chapterNum}`}
        image={headerImage || undefined}
        type="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          name: chapterTitle,
          headline: `Bhagavad Gita Chapter ${chapterNum} — ${chapter.name}`,
          description: chapterDescription,
          url: `https://gita.gurukula.com/chapter/${chapterNum}`,
          isPartOf: {
            "@type": "WebSite",
            name: "Bhagavad Gita - Gurukula.com",
            url: "https://gita.gurukula.com",
          },
        }}
      />
      {/* Chapter Header (#24, #44) */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/60 to-red-900/90 z-[1]" />
        {headerImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${headerImage})` }}
          />
        )}
        {/* Translucent chapter number — top right (#44) */}
        <div className="absolute top-0 right-0 z-[2] pointer-events-none select-none">
          <span className="font-display font-bold text-white/10 text-[8rem] sm:text-[10rem] lg:text-[12rem] leading-none block -mt-4 -mr-2">
            {chapterNum}
          </span>
        </div>
        <div className="relative z-10 px-4 lg:px-6 py-8 lg:py-12">
          <div className="flex items-center gap-2 text-red-300 text-sm mb-5">
            <Link href="/" className="hover:text-orange-300 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-orange-300">Chapter {chapterNum}</span>
          </div>

          <div className="flex gap-5 items-start w-full">
            {/* Chapter image icon on left (#24) */}
            {headerImage && (
              <img
                src={headerImage}
                alt=""
                className="w-20 h-20 lg:w-28 lg:h-28 rounded-xl object-cover flex-shrink-0 border-2 border-white/20 shadow-lg hidden sm:block"
              />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Chapter {chapterNum} of 18
                {chapterNum === 6 && (
                  <span className="inline-flex items-center gap-1 bg-orange-400 text-red-950 text-xs font-bold px-2 py-0.5 rounded-full ml-3">
                    <Sparkles size={10} />
                    Full Journey Content
                  </span>
                )}
              </p>

              {/* IAST as main title (#24) */}
              <h1 className="text-white font-display text-3xl lg:text-5xl font-bold leading-tight mb-1">
                {iastName || chapter.name}
              </h1>
              <p className="text-orange-300 font-devanagari text-xl lg:text-2xl mb-3">{devanagariName}</p>

              {/* Synopsis — truncated on mobile (#25) */}
              {synopsis && (
                <div>
                  <p className={`text-red-100 text-sm lg:text-base leading-relaxed w-full ${!synopsisExpanded ? 'line-clamp-3 md:line-clamp-none' : ''}`}>
                    {synopsis}
                  </p>
                  <button
                    onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                    className="text-orange-300 text-xs font-semibold mt-1 hover:underline md:hidden"
                  >
                    {synopsisExpanded ? 'less' : 'more'}
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-5">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                  <BookOpen size={13} className="text-orange-400" />
                  <span className="text-white text-sm">{chapter.verses_count} verses</span>
                </div>
                {chapterNum === 6 && (
                  <>
                    <div className="flex items-center gap-2 bg-orange-400/20 border border-orange-400/40 rounded-full px-3 py-1.5">
                      <Sparkles size={13} className="text-orange-400" />
                      <span className="text-orange-300 text-sm font-semibold">{verses.length} full explanations</span>
                    </div>
                    <Link href={`/chapter/${chapterNum}/games`}>
                      <div className="flex items-center gap-2 bg-pink-400/20 border border-pink-400/40 hover:bg-pink-400/30 rounded-full px-3 py-1.5 transition-all cursor-pointer">
                        <Gamepad2 size={13} className="text-pink-300" />
                        <span className="text-pink-200 text-sm font-semibold">5 Interactive Games</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verse Grid — full width (#27) */}
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
              <div className="bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl p-5 flex items-center justify-between shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer">
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
          {verses.map((verse, idx) => (
            <Link
              key={verse.verse}
              href={`/chapter/${chapterNum}/verse/${verse.verse}`}
              id={`verse-card-${verse.verse}`}
            >
              <div className="group bg-card border border-border [@media(hover:hover)]:hover:border-orange-300 rounded-xl p-3 sm:p-4 transition-all [@media(hover:hover)]:hover:shadow-lg cursor-pointer h-full flex flex-col relative">
                {/* Header: icon top-left + verse number + title + audio (#39) */}
                <div className="flex items-start gap-3 mb-2">
                  <MeaningThumbnail chapterNum={chapterNum} verseNum={verse.verse} verse={verse} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-red-950">
                        {chapterNum}.{verse.verse}
                      </span>
                      {verse.audio_url && (
                        <VerseAudioButton
                          audioUrl={verse.audio_url}
                          verseNum={verse.verse}
                          onEnded={idx < verses.length - 1 && verses[idx + 1].audio_url ? () => {
                            const nextCard = document.getElementById(`verse-card-${verses[idx + 1].verse}`);
                            if (nextCard) {
                              nextCard.scrollIntoView({ behavior: "smooth", block: "center" });
                            }
                            setTimeout(() => {
                              const nextBtn = nextCard?.querySelector<HTMLButtonElement>("button[title='Play shloka']");
                              nextBtn?.click();
                            }, 500);
                          } : undefined}
                        />
                      )}
                    </div>
                    {verse.title && (
                      <p className="text-sm font-semibold text-orange-800 line-clamp-1 mt-0.5">{verse.title}</p>
                    )}
                  </div>
                </div>

                {/* Sanskrit (Devanagari) */}
                <div className="font-devanagari text-red-900 text-lg leading-relaxed mb-1.5">
                  {verse.sanskrit.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                {/* IAST transliteration */}
                {verse.transliteration && (
                  <div className="text-orange-700 text-base italic leading-relaxed mb-2">
                    {verse.transliteration.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}

                {/* One-line meaning */}
                <p className="text-foreground/80 text-base leading-relaxed mb-2 flex-1">
                  {verse.one_line_meaning}
                </p>

                {/* Word-by-word meaning inline (#39.5, #54) */}
                {verse.rich_grammar?.pratipadarthah && (
                  <div className="border-t border-border pt-2 mb-2">
                    <p className="text-base leading-relaxed">
                      {verse.rich_grammar.pratipadarthah.split('|').map((item, i, arr) => {
                        const [word, meaning] = item.split('=').map(s => s.trim());
                        if (!word || !meaning) return null;
                        return (
                          <span key={i}>
                            <span className="font-devanagari text-red-800 font-semibold">{word}</span>
                            <span className="text-foreground/70"> = {meaning}</span>
                            {i < arr.length - 1 && <span className="text-muted-foreground">, </span>}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                )}

                {/* Reflection questions */}
                {verse.reflection && (
                  <div className="border-t border-border pt-2 mt-auto">
                    <p className="text-sm font-semibold text-violet-600 mb-1">Reflection</p>
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

                {/* View details button — always visible, not overlapping (#52) */}
                <div className="mt-3 pt-2 border-t border-orange-200">
                  <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 text-sm font-semibold px-3 py-1.5 rounded-lg border border-orange-200 [@media(hover:hover)]:group-hover:bg-orange-100 [@media(hover:hover)]:group-hover:border-orange-300 transition-all">
                    View details
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Chapter Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
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

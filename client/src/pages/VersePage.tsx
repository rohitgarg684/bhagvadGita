// Bhagavad Gita — VersePage
// Tabs: Meaning | Story | Impact | Reflection | Detailed Meaning | Kids Corner | Grammar | More Stories
// Header: Devanagari shloka + IAST transliteration + one-line meaning always shown at top
// Design: Light Vedic Learning Platform — warm saffron header, cream content, amber accents
import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import Layout from "@/components/Layout";
import EditableImage from "@/components/EditableImage";
import gitaData from "@/data/gitaData.json";
import type { GitaData, Verse } from "@/types/gita";
import {
  ChevronLeft, ChevronRight, BookOpen, Star, Sparkles,
  BookMarked, Lightbulb, Baby, GraduationCap, Heart,
  MessageCircle, Library, FlameKindling, Leaf,
  Volume2, Pause, Play
} from "lucide-react";

const data = gitaData as unknown as GitaData;

type Tab =
  | "meaning"
  | "story"
  | "impact"
  | "reflection"
  | "detailed"
  | "kids"
  | "grammar"
  | "more_stories";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "meaning",     label: "Meaning",          icon: <Star size={18} /> },
  { id: "story",       label: "Story",            icon: <BookMarked size={18} /> },
  { id: "impact",      label: "Impact on Life",   icon: <Lightbulb size={18} /> },
  { id: "reflection",  label: "Reflection",       icon: <MessageCircle size={18} /> },
  { id: "detailed",    label: "Detailed Meaning", icon: <Sparkles size={18} /> },
  { id: "kids",        label: "Kids Corner",      icon: <Baby size={18} /> },
  { id: "grammar",     label: "Grammar",          icon: <GraduationCap size={18} /> },
  { id: "more_stories",label: "More Stories",     icon: <Library size={18} /> },
];

function formatText(text: string) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    if (/^Step \d+/.test(line)) {
      return (
        <h5 key={i} className="font-semibold text-indigo-800 mt-4 mb-2 text-base border-l-2 border-amber-400 pl-3">
          {line}
        </h5>
      );
    }
    if (/^\d+\.\s/.test(line) && line.length < 80) {
      return (
        <h5 key={i} className="font-semibold text-indigo-800 mt-4 mb-2 text-base">
          {line}
        </h5>
      );
    }
    return <p key={i} className="my-2 text-base leading-relaxed">{line}</p>;
  });
}

function VerseImage({ imageKey, url, caption }: { imageKey: string; url: string; caption?: string }) {
  return (
    <EditableImage
      imageKey={imageKey}
      fallbackUrl={url}
      alt={caption || "Verse illustration"}
      caption={caption}
      className="my-4 rounded-2xl overflow-hidden border border-border shadow-md"
      imgClassName="w-full object-cover max-h-72"
    />
  );
}

// Parse more_stories text into structured array: { title, body }[]
function parseMoreStories(text: string): { title: string; body: string }[] {
  const stories: { title: string; body: string }[] = [];
  const lines = text.split('\n');
  let current: { title: string; body: string } | null = null;
  for (const line of lines) {
    if (/^\d+\.\s/.test(line) && line.length < 120) {
      if (current) stories.push(current);
      current = { title: line.replace(/^\d+\.\s*/, '').trim(), body: '' };
    } else if (current) {
      current.body += (current.body ? '\n' : '') + line;
    }
  }
  if (current) stories.push(current);
  return stories;
}

export default function VersePage() {
  const params = useParams<{ chapterNum: string; verseNum: string }>();
  const chapterNum = parseInt(params.chapterNum || "1");
  const verseNum = parseInt(params.verseNum || "1");
  const [activeTab, setActiveTab] = useState<Tab>("meaning");
  const [kidsMode, setKidsMode] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setActiveTab("meaning");
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Stop audio when navigating to a new verse
    if (audioEl) { audioEl.pause(); setAudioPlaying(false); }
  }, [chapterNum, verseNum]);

  function toggleAudio(url: string) {
    if (!audioEl) {
      const a = new Audio(url);
      a.onended = () => setAudioPlaying(false);
      a.play();
      setAudioEl(a);
      setAudioPlaying(true);
    } else if (audioPlaying) {
      audioEl.pause();
      setAudioPlaying(false);
    } else {
      audioEl.play();
      setAudioPlaying(true);
    }
  }

  const chapter = data.chapters.find((c) => c.chapter === chapterNum);
  const verses: Verse[] = chapterNum === 6
    ? data.chapter6_full
    : chapter?.key_verses || [];

  const verse = verses.find((v) => v.verse === verseNum);
  const verseIndex = verses.findIndex((v) => v.verse === verseNum);

  if (!chapter || !verse) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Verse not found.</p>
          <Link href={`/chapter/${chapterNum}`} className="text-amber-600 hover:underline mt-2 inline-block">
            ← Back to Chapter {chapterNum}
          </Link>
        </div>
      </Layout>
    );
  }

  const prevVerse = verseIndex > 0 ? verses[verseIndex - 1] : null;
  const nextVerse = verseIndex < verses.length - 1 ? verses[verseIndex + 1] : null;

  // Filter available tabs based on content (shloka tab removed — shown in header)
  const availableTabs = TABS.filter((tab) => {
    if (tab.id === "story")       return !!(verse.story);
    if (tab.id === "impact")      return !!(verse.real_life_example);
    if (tab.id === "reflection")  return !!(verse.reflection);
    if (tab.id === "detailed")    return !!(verse.detailed_meaning || verse.full_journey_text);
    if (tab.id === "grammar")     return !!(verse.grammar_notes || verse.rich_grammar);
    if (tab.id === "more_stories") return !!verse.more_stories;
    return true;
  });

  const progressPct = verses.length > 0 ? ((verseIndex + 1) / verses.length) * 100 : 0;
  const moreStoriesParsed = verse.more_stories ? parseMoreStories(verse.more_stories) : [];

  return (
    <Layout kidsMode={kidsMode} onToggleKids={() => setKidsMode(!kidsMode)}>
      {/* Verse Header — warm cream/saffron */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 border-b border-amber-200 px-4 py-6 lg:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-amber-700 text-sm mb-4 flex-wrap">
          <Link href="/" className="hover:text-amber-900 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/chapter/${chapterNum}`} className="hover:text-amber-900 transition-colors">
            Chapter {chapterNum}
          </Link>
          <ChevronRight size={12} />
          <span className="text-amber-900 font-semibold">Verse {verseNum}</span>
        </div>

        <div className="max-w-5xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-600 text-xl">{chapter.icon}</span>
            <div>
              <p className="text-amber-700 text-sm font-semibold uppercase tracking-widest">
                {chapter.name} · Verse {verseNum}
              </p>
              {verse.title && (
                <p className="text-amber-900 text-lg font-display font-bold mt-0.5">{verse.title}</p>
              )}
            </div>
          </div>

          {/* Shloka + IAST side-by-side on md+, stacked on mobile */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 items-stretch">
            {/* Devanagari Shloka */}
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-5 lg:p-6 shadow-md flex-1 flex flex-col">
              <div className="font-devanagari text-amber-100 text-2xl lg:text-3xl flex-1">
                {verse.sanskrit.split('\n').map((line, i) => (
                  <p key={i} className={i === 0 ? 'leading-snug mb-1 text-amber-300 text-xl lg:text-2xl font-semibold' : 'leading-loose'}>
                    {line}
                  </p>
                ))}
              </div>
              {verse.audio_url && (
                <div className="mt-4 pt-3 border-t border-white/20">
                  <button
                    onClick={() => toggleAudio(verse.audio_url!)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      audioPlaying
                        ? "bg-amber-400 text-indigo-900 shadow-lg scale-105"
                        : "bg-white/20 text-amber-100 hover:bg-white/30"
                    }`}
                  >
                    {audioPlaying ? <Pause size={16} /> : <Play size={16} />}
                    {audioPlaying ? "Pause Shloka" : "▶ Listen to Shloka"}
                    {!audioPlaying && <Volume2 size={14} className="opacity-70" />}
                  </button>
                </div>
              )}
            </div>

            {/* IAST Transliteration */}
            {verse.transliteration && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-5 flex-1 flex flex-col justify-center">
                <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-2">IAST Transliteration</p>
                <div className="transliteration-text text-amber-900 text-base lg:text-lg italic">
                  {verse.transliteration.split('\n').map((line, i) => (
                    <p key={i} className={i === 0 ? 'leading-snug mb-1 text-amber-700 font-semibold not-italic text-sm lg:text-base' : 'leading-relaxed'}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* One-line meaning — always shown in header */}
          <p className="text-amber-900 text-base lg:text-lg leading-relaxed font-medium">
            "{verse.one_line_meaning}"
          </p>
        </div>

        {/* Progress bar */}
        {verses.length > 1 && (
          <div className="mt-4 max-w-5xl">
              <div className="flex justify-between text-sm text-amber-700 mb-1">
              <span>Verse {verseIndex + 1} of {verses.length}</span>
              <span>{Math.round(progressPct)}% complete</span>
            </div>
            <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation — two-line grid, evenly spaced */}
      <div className="sticky top-14 z-30 bg-white border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-2 py-1">
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${Math.ceil(availableTabs.length / 2)}, 1fr)` }}>
            {/* First row */}
            {availableTabs.slice(0, Math.ceil(availableTabs.length / 2)).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col items-center gap-1 px-1 py-3 text-sm font-semibold rounded-lg transition-all
                  ${activeTab === tab.id
                    ? "bg-amber-50 text-amber-700 border border-amber-300"
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                  }
                `}
              >
                <span className={activeTab === tab.id ? "text-amber-600" : "text-gray-400"}>{tab.icon}</span>
                <span className="leading-tight text-center">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="grid gap-0.5 mt-0.5" style={{ gridTemplateColumns: `repeat(${availableTabs.length - Math.ceil(availableTabs.length / 2)}, 1fr)` }}>
            {/* Second row */}
            {availableTabs.slice(Math.ceil(availableTabs.length / 2)).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col items-center gap-1 px-1 py-3 text-sm font-semibold rounded-lg transition-all
                  ${activeTab === tab.id
                    ? "bg-amber-50 text-amber-700 border border-amber-300"
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                  }
                `}
              >
                <span className={activeTab === tab.id ? "text-amber-600" : "text-gray-400"}>{tab.icon}</span>
                <span className="leading-tight text-center">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 lg:py-8">


        {/* ── MEANING TAB ── */}
        {activeTab === "meaning" && (
          <div className="verse-section space-y-5">
            {verse.images?.meaning && (
              <VerseImage imageKey={`ch${chapterNum}_v${verseNum}_meaning`} url={verse.images.meaning.url} caption={verse.images.meaning.caption} />
            )}

            <div className="bg-card border border-border rounded-2xl p-5 lg:p-6">
              <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Star size={14} />
                Core Meaning
              </p>
              <p className="font-display text-2xl lg:text-3xl font-semibold text-foreground leading-relaxed mb-4">
                {verse.one_line_meaning}
              </p>
              {verse.concise_journey && (
                <>
                  <div className="lotus-divider my-4">
                    <span className="text-amber-400 text-sm">✿</span>
                  </div>
                  <p className="text-foreground/80 text-lg leading-relaxed">
                    {verse.concise_journey}
                  </p>
                </>
              )}
            </div>

            {verse.meaning_detail && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 lg:p-6">
                <p className="text-indigo-700 text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles size={14} />
                  Detailed Explanation
                </p>
                <div className="text-indigo-900 text-base leading-relaxed">
                  {formatText(verse.meaning_detail)}
                </div>
              </div>
            )}

            {verse.final_takeaway && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 lg:p-6">
                <p className="text-amber-700 text-sm font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Heart size={14} />
                  Final Takeaway
                </p>
                <div className="text-amber-900 text-base leading-relaxed">
                  {formatText(verse.final_takeaway)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STORY TAB ── */}
        {activeTab === "story" && verse.story && (
          <div className="verse-section space-y-5">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 lg:p-6">
              <p className="text-orange-700 text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookMarked size={14} />
                Story from the Mahabharata
              </p>
              <div className="text-orange-900 text-base leading-relaxed">
                {formatText(verse.story)}
              </div>
            </div>
            {/* Story images after text */}
            {verse.images?.story && verse.images.story.map((img, i) => (
              <VerseImage key={i} imageKey={`ch${chapterNum}_v${verseNum}_story_${i}`} url={img.url} caption={img.caption} />
            ))}
          </div>
        )}

        {/* ── IMPACT ON LIFE TAB ── */}
        {activeTab === "impact" && verse.real_life_example && (
          <div className="verse-section space-y-5">
            {verse.images?.modern_life && (
              <VerseImage imageKey={`ch${chapterNum}_v${verseNum}_modern_life`} url={verse.images.modern_life.url} caption={verse.images.modern_life.caption} />
            )}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-2xl p-5 lg:p-6">
              <p className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Lightbulb size={14} />
                Impact on Current Life
              </p>
              <div className="text-green-900 text-base leading-relaxed">
                {formatText(verse.real_life_example)}
              </div>
            </div>
          </div>
        )}

        {/* ── REFLECTION TAB ── */}
        {activeTab === "reflection" && verse.reflection && (
          <div className="verse-section space-y-5">
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-6 lg:p-8">
              <p className="text-violet-700 text-sm font-semibold uppercase tracking-widest mb-5 flex items-center gap-2">
                <MessageCircle size={14} />
                Reflection — Questions for Contemplation
              </p>
              <div className="space-y-4">
                {verse.reflection.split('\n').filter(l => l.trim()).map((line, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/60 rounded-xl p-4 border border-violet-100">
                    <span className="text-violet-400 mt-0.5 flex-shrink-0 text-lg">◈</span>
                    <p className="text-violet-900 text-lg leading-relaxed font-display font-medium">{line}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── DETAILED MEANING TAB ── */}
        {activeTab === "detailed" && (
          <div className="verse-section space-y-5">
            {verse.images?.detailed_meaning && (
              <VerseImage imageKey={`ch${chapterNum}_v${verseNum}_detailed_meaning`} url={verse.images.detailed_meaning.url} caption={verse.images.detailed_meaning.caption} />
            )}
            {verse.detailed_meaning ? (
              <div className="bg-card border border-border rounded-2xl p-5 lg:p-6">
                <p className="text-teal-600 text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles size={14} />
                  Detailed Gita Journey — Step by Step
                </p>
                <div className="text-foreground/80 text-base leading-relaxed">
                  {formatText(verse.detailed_meaning)}
                </div>
              </div>
            ) : verse.full_journey_text ? (
              <div className="bg-card border border-border rounded-2xl p-5 lg:p-6">
                <p className="text-teal-600 text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles size={14} />
                  Full Gita Journey — Word by Word
                </p>
                <div className="text-foreground/80 text-base leading-relaxed space-y-1">
                  {formatText(verse.full_journey_text)}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ── KIDS CORNER TAB ── */}
        {activeTab === "kids" && (
          <div className="verse-section kids-mode space-y-5">
            {/* Sacred Words */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-5">
              <p className="text-yellow-700 font-kids font-bold text-base mb-3 flex items-center gap-2">
                <Baby size={18} />
                🌟 The Sacred Words
              </p>
              <p className="font-devanagari text-indigo-900 text-lg leading-loose mb-3">
                {verse.sanskrit.split('\n')[0]}
              </p>
              <p className="text-amber-800 font-kids text-lg font-semibold">
                "{verse.one_line_meaning}"
              </p>
            </div>

            {/* Explanation script */}
            {verse.kids_content?.explanation_script ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5">
                <p className="text-blue-700 font-kids font-bold text-base mb-3 flex items-center gap-2">
                  <MessageCircle size={16} />
                  💡 How to Understand This
                </p>
                <div className="text-blue-900 font-kids text-lg leading-relaxed">
                  {verse.kids_content.explanation_script.split('\n').filter(l => l.trim()).map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
                {verse.images?.kids_explain && (
                  <VerseImage imageKey={`ch${chapterNum}_v${verseNum}_kids_explain`} url={verse.images.kids_explain.url} caption={verse.images.kids_explain.caption} />
                )}
              </div>
            ) : verse.concise_journey ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5">
                <p className="text-blue-700 font-kids font-bold text-base mb-3">💡 What does this mean?</p>
                <p className="text-blue-900 font-kids text-lg leading-relaxed">{verse.concise_journey}</p>
              </div>
            ) : null}

            {/* Kids story */}
            {verse.kids_content?.story ? (
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-5">
                <p className="text-orange-700 font-kids font-bold text-base mb-3">📖 A Story to Remember</p>
                <div className="text-orange-900 font-kids text-base leading-relaxed">
                  {verse.kids_content.story.split('\n').filter(l => l.trim()).map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
                {verse.images?.kids_story && (
                  <VerseImage imageKey={`ch${chapterNum}_v${verseNum}_kids_story`} url={verse.images.kids_story.url} caption={verse.images.kids_story.caption} />
                )}
              </div>
            ) : verse.story ? (
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-5">
                <p className="text-orange-700 font-kids font-bold text-base mb-3">📖 A Story to Remember</p>
                <div className="text-orange-900 font-kids text-base leading-relaxed">
                  {verse.story.split('\n').slice(0, 8).map((line, i) => (
                    line.trim() ? <p key={i} className="mb-2">{line}</p> : null
                  ))}
                </div>
              </div>
            ) : null}

            {/* Kids reflection */}
            {(verse.kids_content?.reflection || verse.reflection) && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 rounded-2xl p-5">
                <p className="text-purple-700 font-kids font-bold text-base mb-3">🤔 Think About It!</p>
                <div className="text-purple-900 font-kids text-base leading-relaxed space-y-2">
                  {(verse.kids_content?.reflection || verse.reflection || '').split('\n').filter(l => l.trim()).map((line, i) => (
                    <p key={i} className="flex items-start gap-2">
                      <span className="text-purple-400 flex-shrink-0">◈</span>
                      <span>{line}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Takeaway for kids */}
            {verse.final_takeaway && (
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-5">
                <p className="text-pink-700 font-kids font-bold text-base mb-3">⭐ Remember This!</p>
                <div className="text-pink-900 font-kids text-lg font-semibold leading-relaxed">
                  {verse.final_takeaway.split('\n').slice(0, 4).map((line, i) => (
                    line.trim() ? <p key={i} className="mb-1">{line}</p> : null
                  ))}
                </div>
              </div>
            )}

            {/* Challenge */}
            <div className="bg-indigo-900 rounded-2xl p-5 text-center">
              <p className="text-amber-300 font-kids font-bold text-base mb-2">🎯 Challenge!</p>
              <p className="text-indigo-100 font-kids text-base">
                Can you explain this verse to a friend in your own words?
                Try telling the story to someone in your family!
              </p>
            </div>
          </div>
        )}

        {/* ── GRAMMAR TAB ── */}
        {activeTab === "grammar" && (
          <div className="verse-section space-y-5">
            {verse.rich_grammar ? (
              <>
                {verse.rich_grammar.padacchedah && (
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h5 className="font-devanagari font-bold text-violet-800 text-base mb-3 flex items-center gap-2">
                      <GraduationCap size={14} className="text-violet-600" />
                      पदच्छेदः (Padacchedaḥ — Word Separation)
                    </h5>
                    <p className="font-devanagari text-base leading-relaxed text-gray-700">{verse.rich_grammar.padacchedah}</p>
                  </div>
                )}

                {verse.rich_grammar.pratipadarthah && (
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h5 className="font-devanagari font-bold text-violet-800 text-lg mb-4">पदार्थः (Pratipadārthaḥ — Word Meanings)</h5>
                    <div className="text-base leading-relaxed text-gray-700">
                      {verse.rich_grammar.pratipadarthah.split('|').map((item, i) => {
                        const [word, meaning] = item.split('=').map(s => s.trim());
                        if (!word || !meaning) return null;
                        return (
                          <div key={i} className="flex items-baseline gap-2 py-1.5 border-b border-border last:border-0">
                            <span className="font-devanagari font-semibold text-indigo-800 min-w-[130px]">{word}</span>
                            <span className="text-gray-600">= {meaning}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Padaparicayah table */}
                {verse.rich_grammar.padaparicayah && verse.rich_grammar.padaparicayah.length > 0 && (
                  <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 overflow-x-auto">
                    <h5 className="font-devanagari font-bold text-violet-800 text-base mb-4">पदपरिचयः (Padaparicayaḥ — Word Analysis Table)</h5>
                    <table className="w-full text-sm border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-violet-100">
                          <th className="font-devanagari text-left p-2 border border-violet-200 text-violet-800">Word</th>
                          <th className="text-left p-2 border border-violet-200 text-violet-800">Anta</th>
                          <th className="text-left p-2 border border-violet-200 text-violet-800">Liṅga</th>
                          <th className="text-left p-2 border border-violet-200 text-violet-800">Vibhakti</th>
                          <th className="text-left p-2 border border-violet-200 text-violet-800">Vacanam</th>
                          <th className="text-left p-2 border border-violet-200 text-violet-800">Type</th>
                          <th className="text-left p-2 border border-violet-200 text-violet-800">Dhātu</th>
                          <th className="text-left p-2 border border-violet-200 text-violet-800">Lakāra</th>
                        </tr>
                      </thead>
                      <tbody>
                        {verse.rich_grammar.padaparicayah.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-violet-50/50"}>
                            <td className="font-devanagari font-semibold text-indigo-800 p-2 border border-violet-200">{row.word}</td>
                            <td className="p-2 border border-violet-200 text-gray-600">{row.anta || "—"}</td>
                            <td className="font-devanagari p-2 border border-violet-200 text-gray-600">{row.linga || "—"}</td>
                            <td className="font-devanagari p-2 border border-violet-200 text-gray-600">{row.vibhakti || "—"}</td>
                            <td className="font-devanagari p-2 border border-violet-200 text-gray-600">{row.vacanam || "—"}</td>
                            <td className="p-2 border border-violet-200 text-gray-600">{row.type || "—"}</td>
                            <td className="font-devanagari p-2 border border-violet-200 text-gray-600">{row.dhatu || "—"}</td>
                            <td className="p-2 border border-violet-200 text-gray-600">{row.lakara || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {verse.rich_grammar.anvayah && (
                  <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5">
                    <h5 className="font-devanagari font-bold text-violet-800 text-base mb-3">अन्वयः (Anvayaḥ — Prose Order)</h5>
                    <p className="font-devanagari text-base leading-relaxed text-violet-900">{verse.rich_grammar.anvayah}</p>
                  </div>
                )}

                {verse.rich_grammar.sandhi && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <h5 className="font-devanagari font-bold text-amber-800 text-base mb-3">सन्धि (Sandhi — Phonetic Combinations)</h5>
                    <div className="text-base leading-relaxed text-amber-900">
                      {verse.rich_grammar.sandhi.split('|').map((item, i) => (
                        <p key={i} className="font-devanagari py-1.5">{item.trim()}</p>
                      ))}
                    </div>
                  </div>
                )}

                {verse.rich_grammar.samasa && (
                  <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
                    <h5 className="font-devanagari font-bold text-teal-800 text-base mb-3">समासः (Samāsa — Compound Words)</h5>
                    <div className="text-base leading-relaxed text-teal-900">
                      {verse.rich_grammar.samasa.split('|').map((item, i) => (
                        <p key={i} className="font-devanagari py-1.5">{item.trim()}</p>
                      ))}
                    </div>
                  </div>
                )}

                {verse.rich_grammar.other && (
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h5 className="font-devanagari font-bold text-violet-800 text-base mb-3">अन्य व्याकरण (Other Grammatical Aspects)</h5>
                    <div className="text-base leading-relaxed text-gray-700">
                      {verse.rich_grammar.other.split('|').map((item, i) => (
                        <p key={i} className="font-devanagari py-1.5">{item.trim()}</p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : verse.grammar_notes ? (
              <div className="bg-card border border-border rounded-2xl p-5 lg:p-6">
                <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <GraduationCap size={14} />
                  Sanskrit Grammar (Samskritam)
                </p>
                <div className="text-foreground/80 text-base leading-relaxed">
                  {verse.grammar_notes.split('\n').map((line, i) => {
                    if (!line.trim()) return <br key={i} />;
                    if (line.includes('पदच्छेदः') || line.includes('अन्वयः') || line.includes('पदार्थः') || line.includes('समासः') || line.includes('सन्धि')) {
                      return <h5 key={i} className="font-devanagari font-bold text-violet-800 text-base mt-4 mb-2">{line}</h5>;
                    }
                    return <p key={i} className="my-1.5 font-devanagari text-base leading-relaxed text-gray-700">{line}</p>;
                  })}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ── MORE STORIES TAB ── Title → Image → Story body */}
        {activeTab === "more_stories" && verse.more_stories && (
          <div className="verse-section space-y-6">
            <p className="text-rose-700 text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
              <Library size={14} />
              More Stories &amp; Insights
            </p>

            {moreStoriesParsed.map((story, i) => (
              <div key={i} className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-2xl overflow-hidden">
                {/* Story Title */}
                <div className="px-5 pt-5 pb-3">
                  <h4 className="font-display font-bold text-rose-800 text-xl flex items-center gap-2">
                    <FlameKindling size={15} className="text-rose-500 flex-shrink-0" />
                    {story.title}
                  </h4>
                </div>

                {/* Story Image (if available) */}
                {verse.images?.more_stories?.[i] && (
                  <div className="px-5">
                    <VerseImage
                      imageKey={`ch${chapterNum}_v${verseNum}_more_stories_${i}`}
                      url={verse.images.more_stories[i].url}
                      caption={verse.images.more_stories[i].caption}
                    />
                  </div>
                )}

                {/* Story Body */}
                <div className="px-5 pb-5">
                  <div className="text-rose-900 text-base leading-relaxed">
                    {formatText(story.body)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Verse Navigation ── */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          {prevVerse ? (
            <Link href={`/chapter/${chapterNum}/verse/${prevVerse.verse}`}>
              <button className="flex items-center gap-2 bg-card border border-border hover:border-amber-300 rounded-xl px-4 py-3 text-base font-semibold text-foreground transition-all group">
                <ChevronLeft size={18} className="group-hover:text-amber-500" />
                <div className="text-left hidden sm:block">
                  <div className="text-sm text-muted-foreground">Previous</div>
                  <div>Verse {prevVerse.verse}</div>
                </div>
                <span className="sm:hidden">Prev</span>
              </button>
            </Link>
          ) : (
            <Link href={`/chapter/${chapterNum}`}>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft size={16} />
                Chapter
              </button>
            </Link>
          )}

          <Link href={`/chapter/${chapterNum}`}>
            <button className="text-xs text-muted-foreground hover:text-amber-600 transition-colors px-3 py-2">
              {chapter.name}
            </button>
          </Link>

          {nextVerse ? (
            <Link href={`/chapter/${chapterNum}/verse/${nextVerse.verse}`}>
              <button className="flex items-center gap-2 bg-card border border-border hover:border-amber-300 rounded-xl px-4 py-3 text-base font-semibold text-foreground transition-all group">
                <div className="text-right hidden sm:block">
                  <div className="text-sm text-muted-foreground">Next</div>
                  <div>Verse {nextVerse.verse}</div>
                </div>
                <span className="sm:hidden">Next</span>
                <ChevronRight size={16} className="group-hover:text-amber-500" />
              </button>
            </Link>
          ) : (
            <Link href={`/chapter/${chapterNum}`}>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Chapter
                <ChevronRight size={16} />
              </button>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}

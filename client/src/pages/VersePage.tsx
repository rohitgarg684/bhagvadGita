// Verse Page — The core learning experience
// Tabs: Shloka | Meaning | Full Journey | Story | Kids Corner | Grammar
// Design: Modern Vedic Learning Platform
import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import Layout from "@/components/Layout";
import gitaData from "@/data/gitaData.json";
import type { GitaData, Verse } from "@/types/gita";
import {
  ChevronLeft, ChevronRight, BookOpen, Star, Sparkles,
  BookMarked, Lightbulb, Baby, GraduationCap, Heart
} from "lucide-react";

const data = gitaData as unknown as GitaData;

type Tab = "shloka" | "meaning" | "journey" | "story" | "kids" | "grammar";

const TABS: { id: Tab; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "shloka", label: "Shloka", icon: <BookOpen size={14} />, color: "text-indigo-600" },
  { id: "meaning", label: "Meaning", icon: <Star size={14} />, color: "text-amber-600" },
  { id: "journey", label: "Full Journey", icon: <Sparkles size={14} />, color: "text-teal-600" },
  { id: "story", label: "Story", icon: <BookMarked size={14} />, color: "text-orange-600" },
  { id: "kids", label: "Kids Corner", icon: <Baby size={14} />, color: "text-pink-600" },
  { id: "grammar", label: "Grammar", icon: <GraduationCap size={14} />, color: "text-violet-600" },
];

function formatText(text: string) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    // Handle emoji-prefixed lines as highlights
    if (line.startsWith('👉') || line.startsWith('✅') || line.startsWith('❌')) {
      return (
        <p key={i} className="flex items-start gap-2 my-1 text-indigo-800">
          <span className="mt-0.5 flex-shrink-0">{line.slice(0, 2)}</span>
          <span>{line.slice(2).trim()}</span>
        </p>
      );
    }
    if (line.startsWith('🌿') || line.startsWith('🌼') || line.startsWith('🟣')) {
      return (
        <h4 key={i} className="font-display font-semibold text-indigo-900 text-base mt-4 mb-2 flex items-center gap-2">
          <span>{line.slice(0, 2)}</span>
          <span>{line.slice(2).trim()}</span>
        </h4>
      );
    }
    // Numbered section headers (e.g. "1. word — transliteration")
    if (/^\d+\.\s/.test(line) && line.length < 80) {
      return (
        <h5 key={i} className="font-semibold text-indigo-800 mt-3 mb-1 text-sm">
          {line}
        </h5>
      );
    }
    return <p key={i} className="my-1 leading-relaxed">{line}</p>;
  });
}

export default function VersePage() {
  const params = useParams<{ chapterNum: string; verseNum: string }>();
  const chapterNum = parseInt(params.chapterNum || "1");
  const verseNum = parseInt(params.verseNum || "1");
  const [activeTab, setActiveTab] = useState<Tab>("shloka");
  const [kidsMode, setKidsMode] = useState(false);

  useEffect(() => {
    setActiveTab("shloka");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [chapterNum, verseNum]);

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

  // Filter available tabs based on content
  const availableTabs = TABS.filter((tab) => {
    if (tab.id === "journey") return !!verse.full_journey_text;
    if (tab.id === "story") return !!verse.story;
    if (tab.id === "grammar") return !!verse.grammar_notes;
    return true;
  });

  const progressPct = verses.length > 0 ? ((verseIndex + 1) / verses.length) * 100 : 0;

  return (
    <Layout kidsMode={kidsMode} onToggleKids={() => setKidsMode(!kidsMode)}>
      {/* Verse Header */}
      <div className="bg-gradient-to-b from-indigo-950 to-indigo-900 px-4 py-6 lg:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-indigo-300 text-xs mb-4 flex-wrap">
          <Link href="/" className="hover:text-amber-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/chapter/${chapterNum}`} className="hover:text-amber-300 transition-colors">
            Chapter {chapterNum}
          </Link>
          <ChevronRight size={12} />
          <span className="text-amber-300">Verse {verseNum}</span>
        </div>

        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-xl">{chapter.icon}</span>
            <div>
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                {chapter.name} · Verse {verseNum}
              </p>
            </div>
          </div>

          {/* Sanskrit Shloka Preview */}
          <div className="bg-white/8 rounded-xl p-4 mb-4 border border-white/10">
            <p className="font-devanagari text-amber-100 text-lg lg:text-xl leading-loose">
              {verse.sanskrit}
            </p>
          </div>

          {/* One-line meaning */}
          <p className="text-indigo-100 text-sm lg:text-base leading-relaxed italic">
            "{verse.one_line_meaning}"
          </p>
        </div>

        {/* Progress bar */}
        {verses.length > 1 && (
          <div className="mt-4 max-w-3xl">
            <div className="flex justify-between text-xs text-indigo-400 mb-1">
              <span>Verse {verseIndex + 1} of {verses.length}</span>
              <span>{Math.round(progressPct)}% complete</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-14 z-30 bg-white border-b border-border shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide px-4 max-w-4xl mx-auto">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-1.5 px-3 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all
                ${activeTab === tab.id
                  ? `border-amber-500 ${tab.color}`
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 lg:py-8">

        {/* ── SHLOKA TAB ── */}
        {activeTab === "shloka" && (
          <div className="verse-section space-y-6">
            {/* Sanskrit */}
            <div className="bg-gradient-to-br from-indigo-950 to-indigo-900 rounded-2xl p-6 lg:p-8">
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen size={12} />
                Sanskrit Shloka
              </p>
              <p className="font-devanagari text-amber-100 text-xl lg:text-2xl leading-loose">
                {verse.sanskrit}
              </p>
            </div>

            {/* Transliteration */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 lg:p-6">
              <p className="text-amber-700 text-xs font-semibold uppercase tracking-widest mb-3">
                Transliteration (Roman Script)
              </p>
              <p className="transliteration-text text-amber-900 text-base lg:text-lg leading-loose">
                {verse.transliteration}
              </p>
            </div>

            {/* One-line meaning */}
            <div className="bg-card border border-border rounded-2xl p-5 lg:p-6">
              <p className="text-indigo-600 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
                <Star size={12} />
                Meaning in Brief
              </p>
              <p className="text-foreground text-base lg:text-lg leading-relaxed font-display font-medium">
                {verse.one_line_meaning}
              </p>
            </div>
          </div>
        )}

        {/* ── MEANING TAB ── */}
        {activeTab === "meaning" && (
          <div className="verse-section space-y-5">
            <div className="bg-card border border-border rounded-2xl p-5 lg:p-6">
              <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Star size={12} />
                Core Meaning
              </p>
              <p className="font-display text-xl lg:text-2xl font-semibold text-foreground leading-relaxed mb-4">
                {verse.one_line_meaning}
              </p>
              {verse.concise_journey && (
                <>
                  <div className="lotus-divider my-4">
                    <span className="text-amber-400 text-sm">✿</span>
                  </div>
                  <p className="text-foreground/80 text-base leading-relaxed">
                    {verse.concise_journey}
                  </p>
                </>
              )}
            </div>

            {verse.final_takeaway && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 lg:p-6">
                <p className="text-amber-700 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Heart size={12} />
                  Final Takeaway
                </p>
                <div className="text-amber-900 text-sm leading-relaxed">
                  {formatText(verse.final_takeaway)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── FULL JOURNEY TAB ── */}
        {activeTab === "journey" && verse.full_journey_text && (
          <div className="verse-section">
            <div className="bg-card border border-border rounded-2xl p-5 lg:p-6">
              <p className="text-teal-600 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles size={12} />
                Full Gita Journey — Word by Word Exploration
              </p>
              <div className="text-foreground/80 text-sm leading-relaxed space-y-1">
                {formatText(verse.full_journey_text)}
              </div>
            </div>
          </div>
        )}

        {/* ── STORY TAB ── */}
        {activeTab === "story" && (
          <div className="verse-section space-y-5">
            {verse.story && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 lg:p-6">
                <p className="text-orange-700 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BookMarked size={12} />
                  Story from the Mahabharata
                </p>
                <div className="text-orange-900 text-sm leading-relaxed">
                  {formatText(verse.story)}
                </div>
              </div>
            )}
            {verse.real_life_example && (
              <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-2xl p-5 lg:p-6">
                <p className="text-green-700 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Lightbulb size={12} />
                  Real-Life Example
                </p>
                <div className="text-green-900 text-sm leading-relaxed">
                  {formatText(verse.real_life_example)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── KIDS CORNER TAB ── */}
        {activeTab === "kids" && (
          <div className="verse-section kids-mode space-y-5">
            {/* Simple Sanskrit */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-5">
              <p className="text-yellow-700 font-kids font-bold text-sm mb-3 flex items-center gap-2">
                <Baby size={16} />
                🌟 The Sacred Words
              </p>
              <p className="font-devanagari text-indigo-900 text-lg leading-loose mb-3">
                {verse.sanskrit.split('\n')[0]}
              </p>
              <p className="text-amber-800 font-kids text-base font-semibold">
                "{verse.one_line_meaning}"
              </p>
            </div>

            {/* Simple explanation */}
            {verse.concise_journey && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5">
                <p className="text-blue-700 font-kids font-bold text-sm mb-3">
                  💡 What does this mean?
                </p>
                <p className="text-blue-900 font-kids text-base leading-relaxed">
                  {verse.concise_journey}
                </p>
              </div>
            )}

            {/* Story for kids */}
            {verse.story && (
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-5">
                <p className="text-orange-700 font-kids font-bold text-sm mb-3">
                  📖 A Story to Remember
                </p>
                <div className="text-orange-900 font-kids text-sm leading-relaxed">
                  {verse.story.split('\n').slice(0, 8).map((line, i) => (
                    line.trim() ? <p key={i} className="mb-2">{line}</p> : null
                  ))}
                </div>
              </div>
            )}

            {/* Real life example for kids */}
            {verse.real_life_example && (
              <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-2xl p-5">
                <p className="text-green-700 font-kids font-bold text-sm mb-3">
                  🌱 In Your Life
                </p>
                <div className="text-green-900 font-kids text-sm leading-relaxed">
                  {verse.real_life_example.split('\n').slice(0, 6).map((line, i) => (
                    line.trim() ? <p key={i} className="mb-2">{line}</p> : null
                  ))}
                </div>
              </div>
            )}

            {/* Takeaway for kids */}
            {verse.final_takeaway && (
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-5">
                <p className="text-pink-700 font-kids font-bold text-sm mb-3">
                  ⭐ Remember This!
                </p>
                <div className="text-pink-900 font-kids text-base font-semibold leading-relaxed">
                  {verse.final_takeaway.split('\n').slice(0, 4).map((line, i) => (
                    line.trim() ? <p key={i} className="mb-1">{line}</p> : null
                  ))}
                </div>
              </div>
            )}

            {/* Quiz prompt */}
            <div className="bg-indigo-900 rounded-2xl p-5 text-center">
              <p className="text-amber-300 font-kids font-bold text-base mb-2">
                🎯 Think About It!
              </p>
              <p className="text-indigo-100 font-kids text-sm">
                Can you explain this verse to a friend in your own words?
                Try telling the story to someone in your family!
              </p>
            </div>
          </div>
        )}

        {/* ── GRAMMAR TAB ── */}
        {activeTab === "grammar" && verse.grammar_notes && (
          <div className="verse-section">
            <div className="bg-card border border-border rounded-2xl p-5 lg:p-6">
              <p className="text-violet-600 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                <GraduationCap size={12} />
                Sanskrit Grammar (Samskritam)
              </p>
              <div className="text-foreground/80 text-sm leading-relaxed font-mono-like">
                {verse.grammar_notes.split('\n').map((line, i) => {
                  if (!line.trim()) return <br key={i} />;
                  if (line.includes('पदच्छेदः') || line.includes('अन्वयः') || line.includes('पदार्थः') || line.includes('समासः') || line.includes('सन्धि')) {
                    return (
                      <h5 key={i} className="font-devanagari font-bold text-violet-800 text-base mt-4 mb-2">
                        {line}
                      </h5>
                    );
                  }
                  return (
                    <p key={i} className="my-1 font-devanagari text-sm leading-relaxed text-gray-700">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Verse Navigation ── */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          {prevVerse ? (
            <Link href={`/chapter/${chapterNum}/verse/${prevVerse.verse}`}>
              <button className="flex items-center gap-2 bg-card border border-border hover:border-amber-300 rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-all group">
                <ChevronLeft size={16} className="group-hover:text-amber-500" />
                <div className="text-left hidden sm:block">
                  <div className="text-xs text-muted-foreground">Previous</div>
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
              <button className="flex items-center gap-2 bg-card border border-border hover:border-amber-300 rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-all group">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-muted-foreground">Next</div>
                  <div>Verse {nextVerse.verse}</div>
                </div>
                <span className="sm:hidden">Next</span>
                <ChevronRight size={16} className="group-hover:text-amber-500" />
              </button>
            </Link>
          ) : (
            chapterNum < 18 ? (
              <Link href={`/chapter/${chapterNum + 1}`}>
                <button className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-500 transition-colors font-semibold">
                  Chapter {chapterNum + 1}
                  <ChevronRight size={16} />
                </button>
              </Link>
            ) : <div />
          )}
        </div>
      </div>
    </Layout>
  );
}

// Home Page — Modern Vedic Learning Platform
// Hero with Kurukshetra image, chapter grid, stats section
import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import EditableImage from "@/components/EditableImage";
import gitaData from "@/data/gitaData.json";
import type { GitaData } from "@/types/gita";
import { BookOpen, Star, Users, Sparkles, ChevronRight, Play } from "lucide-react";

const data = gitaData as unknown as GitaData;

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663320491203/hKSS9UgtAfoHXBDRJP86JE/gita-hero-eQeFLTXL77RRABmFWGtL56.webp";
const KIDS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663320491203/hKSS9UgtAfoHXBDRJP86JE/gita-kids-banner-hJwbSzskp4bcULSbrhyiDy.webp";
const MEDITATION_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663320491203/hKSS9UgtAfoHXBDRJP86JE/gita-meditation-gjMnHVFXnpyH4ezqJkd8j7.webp";

const chapterColorMap: Record<number, string> = {
  1: "from-blue-800 to-indigo-700",
  2: "from-indigo-800 to-violet-700",
  3: "from-orange-800 to-amber-700",
  4: "from-yellow-800 to-orange-700",
  5: "from-green-800 to-teal-700",
  6: "from-teal-800 to-cyan-700",
  7: "from-violet-800 to-purple-700",
  8: "from-slate-800 to-blue-800",
  9: "from-amber-800 to-yellow-700",
  10: "from-rose-800 to-pink-700",
  11: "from-purple-900 to-indigo-800",
  12: "from-pink-800 to-rose-700",
  13: "from-emerald-800 to-green-700",
  14: "from-cyan-800 to-teal-700",
  15: "from-lime-800 to-green-700",
  16: "from-red-900 to-orange-800",
  17: "from-orange-900 to-red-800",
  18: "from-yellow-900 to-amber-800",
};

export default function Home() {
  const [kidsMode, setKidsMode] = useState(false);
  const totalVerses = data.chapters.reduce((sum, ch) => sum + ch.verses_count, 0);

  return (
    <Layout kidsMode={kidsMode} onToggleKids={() => setKidsMode(!kidsMode)}>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden min-h-[420px] lg:min-h-[520px] group">
        <EditableImage
          imageKey="home_hero"
          fallbackUrl={HERO_IMG}
          alt="Krishna and Arjuna on the battlefield of Kurukshetra"
          asBg
          imgClassName="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-900/70 to-transparent" />
        <div className="relative z-10 px-6 py-16 lg:py-24 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-400 text-2xl">🕉</span>
            <span className="text-amber-300 text-sm font-semibold uppercase tracking-widest">
              Sacred Scripture
            </span>
          </div>
          <h1 className="text-white font-display text-4xl lg:text-6xl font-bold leading-tight mb-4">
            Bhagavad Gita
            <span className="block text-amber-300 text-2xl lg:text-3xl font-normal mt-1 font-devanagari">
              श्रीमद्भगवद्गीता
            </span>
          </h1>
          <p className="text-indigo-100 text-base lg:text-lg leading-relaxed mb-8 max-w-lg">
            Explore all 18 chapters of the eternal dialogue between Krishna and Arjuna.
            Learn Sanskrit shlokas, their meanings, stories, and timeless wisdom — for yourself and your children.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/chapter/1"
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-indigo-950 font-bold px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-amber-500/30 text-sm"
            >
              <Play size={16} fill="currentColor" />
              Begin Journey
            </Link>
            <Link
              href="/chapter/6"
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 px-6 py-3 rounded-full transition-all text-sm"
            >
              <Sparkles size={16} />
              Chapter 6 — Full Content
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-indigo-950 text-white py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8">
          {[
            { icon: <BookOpen size={18} />, value: "18", label: "Chapters" },
            { icon: <Star size={18} />, value: totalVerses.toString(), label: "Total Verses" },
            { icon: <Sparkles size={18} />, value: "32", label: "Ch.6 Full Journey Verses" },
            { icon: <Users size={18} />, value: "2", label: "Learning Modes" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2.5">
              <span className="text-amber-400">{stat.icon}</span>
              <div>
                <div className="text-xl font-bold text-amber-300 leading-none">{stat.value}</div>
                <div className="text-xs text-indigo-300 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Chapter 6 Feature Banner ── */}
      <section className="px-4 py-8 lg:py-10 max-w-5xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden shadow-xl group">
          <EditableImage
            imageKey={kidsMode ? "home_kids" : "home_meditation"}
            fallbackUrl={kidsMode ? KIDS_IMG : MEDITATION_IMG}
            alt={kidsMode ? "Kids mode banner" : "Meditation"}
            asBg
            imgClassName="absolute inset-0 w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${kidsMode ? "bg-amber-900/70" : "bg-indigo-950/75"}`} />
          <div className="relative z-10 p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-400 text-indigo-950 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {kidsMode ? "🌟 Kids Mode Active" : "✨ Featured Content"}
                </span>
              </div>
              <h2 className="text-white font-display text-2xl lg:text-3xl font-bold mb-2">
                {kidsMode ? "Learn with Stories & Fun!" : "Chapter 6 — Dhyana Yoga"}
              </h2>
              <p className="text-indigo-100 text-sm lg:text-base max-w-lg">
                {kidsMode
                  ? "Every verse comes with a story, a real-life example, and a simple lesson just for kids!"
                  : "All 32 verses with complete word-by-word explanations, Mahabharata stories, real-life examples, and Sanskrit grammar — the most detailed chapter in our collection."}
              </p>
            </div>
            <Link
              href="/chapter/6"
              className="flex-shrink-0 flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold px-5 py-3 rounded-full transition-all shadow-lg text-sm whitespace-nowrap"
            >
              Explore Chapter 6
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Chapter Grid ── */}
      <section className="px-4 pb-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            All 18 Chapters
          </h2>
          <div className="lotus-divider flex-1">
            <span className="text-amber-500 text-lg">✿</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.chapters.map((ch) => (
            <Link key={ch.chapter} href={`/chapter/${ch.chapter}`}>
              <div className="chapter-card bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:border-amber-300 transition-all group cursor-pointer">
                {/* Color header */}
                <div className={`bg-gradient-to-r ${chapterColorMap[ch.chapter]} p-4 relative overflow-hidden`}>
                  <div className="absolute top-2 right-3 text-white/20 text-5xl font-bold font-display leading-none select-none">
                    {ch.chapter}
                  </div>
                  <div className="relative z-10">
                    <span className="text-2xl">{ch.icon}</span>
                    <div className="mt-1">
                      <span className="text-white/70 text-xs">Chapter {ch.chapter}</span>
                      <h3 className="text-white font-display font-semibold text-base leading-tight">
                        {ch.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-muted-foreground text-xs font-devanagari mb-1">{ch.name_hindi}</p>
                  <p className="text-foreground/80 text-xs font-semibold mb-2 text-amber-700">{ch.subtitle}</p>
                  <p className="text-foreground/70 text-xs leading-relaxed line-clamp-2">{ch.summary}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">{ch.verses_count} verses</span>
                    <span className="text-xs text-amber-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      {ch.chapter === 6 ? "Full Journey" : "Explore"}
                      <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-indigo-950 text-indigo-300 py-8 px-6 text-center">
        <div className="text-amber-400 text-2xl mb-2">🕉</div>
        <p className="font-devanagari text-lg text-amber-300 mb-1">
          सर्वे भवन्तु सुखिनः
        </p>
        <p className="text-sm italic mb-3">May all beings be happy</p>
        <p className="text-xs text-indigo-400">
          Bhagavad Gita Interactive Learning Journey • All 18 Chapters
        </p>
      </footer>
    </Layout>
  );
}

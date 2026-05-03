import { useEffect } from "react";
import { useParams, Redirect, Link } from "wouter";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import gitaData from "@/data/gitaData.json";
import type { GitaData } from "@/types/gita";
import { useChapterVisibility } from "@/contexts/ChapterVisibilityContext";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { chapterIAST, chapterDevanagari } from "@/lib/chapterMeta";

const data = gitaData as unknown as GitaData;

const sectionColors = [
  "bg-amber-50 border-amber-200",
  "bg-red-50 border-red-200",
  "bg-orange-50 border-orange-200",
  "bg-emerald-50 border-emerald-200",
  "bg-violet-50 border-violet-200",
  "bg-sky-50 border-sky-200",
  "bg-rose-50 border-rose-200",
  "bg-teal-50 border-teal-200",
  "bg-indigo-50 border-indigo-200",
  "bg-lime-50 border-lime-200",
  "bg-pink-50 border-pink-200",
  "bg-cyan-50 border-cyan-200",
  "bg-yellow-50 border-yellow-200",
  "bg-fuchsia-50 border-fuchsia-200",
  "bg-amber-50 border-amber-200",
  "bg-slate-50 border-slate-200",
];

export default function ChapterSummary() {
  const params = useParams<{ chapterNum: string }>();
  const chapterNum = parseInt(params.chapterNum || "1");
  const { isChapterVisible } = useChapterVisibility();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [chapterNum]);

  const chapter = data.chapters.find((c) => c.chapter === chapterNum);
  if (!chapter) return <div className="p-8 text-center">Chapter not found</div>;
  if (!isChapterVisible(chapterNum)) return <Redirect to="/" />;

  const synopsis = chapter.synopsis_content;
  if (!synopsis) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-display">Chapter summary coming soon</p>
        </div>
      </Layout>
    );
  }

  const devanagariName = chapterDevanagari[chapterNum] || chapter.name_hindi;
  const iastName = chapterIAST[chapterNum] || "";
  const pageTitle = `Chapter ${chapterNum} Summary — ${iastName || chapter.name}`;

  return (
    <Layout>
      <SEO
        title={pageTitle}
        description={`Summary of Bhagavad Gita Chapter ${chapterNum} (${chapter.name}) — ${chapter.subtitle}`}
        path={`/chapter/${chapterNum}/summary`}
        type="article"
      />

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-red-950/70 to-red-900/90">
        <div className="absolute top-0 right-0 pointer-events-none select-none pr-4 pt-2 sm:pr-6 sm:pt-3">
          <span className="font-display font-bold text-white/15 text-[8rem] sm:text-[10rem] leading-none block">
            {chapterNum}
          </span>
        </div>
        <div className="relative z-10 px-4 lg:px-6 py-8 lg:py-10">
          <div className="flex items-center gap-2 text-red-300 text-sm mb-4">
            <Link href="/" className="hover:text-orange-300 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href={`/chapter/${chapterNum}`} className="hover:text-orange-300 transition-colors">
              Chapter {chapterNum}
            </Link>
            <ChevronRight size={14} />
            <span className="text-orange-300">Summary</span>
          </div>
          <h1 className="text-white font-display text-2xl lg:text-4xl font-bold leading-tight mb-1">
            Chapter {chapterNum} Summary
          </h1>
          <p className="text-orange-300 font-devanagari text-lg lg:text-xl mb-1">{devanagariName}</p>
          <p className="text-red-200 text-sm lg:text-base">{iastName || chapter.name} — {chapter.subtitle}</p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-4 lg:px-6 py-8 max-w-4xl mx-auto space-y-6">
        {synopsis.sections.map((section, idx) => (
          <section
            key={idx}
            className={`rounded-2xl border p-5 lg:p-7 ${sectionColors[idx % sectionColors.length]}`}
          >
            <h2 className="font-display text-lg lg:text-xl font-bold text-red-900 mb-4 flex items-start gap-2">
              <span className="bg-red-900 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              {section.heading}
            </h2>
            <div className="space-y-3">
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-foreground/85 text-sm lg:text-base leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Back to chapter */}
      <div className="px-4 lg:px-6 pb-8 max-w-4xl mx-auto">
        <Link href={`/chapter/${chapterNum}`}>
          <button className="flex items-center gap-2 text-sm text-red-800 hover:text-orange-600 transition-colors font-semibold">
            <ChevronLeft size={16} />
            Back to Chapter {chapterNum}
          </button>
        </Link>
      </div>
    </Layout>
  );
}

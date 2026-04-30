import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import gitaData from "@/data/gitaData.json";
import type { GitaData, Verse } from "@/types/gita";
import { useChapterVisibility } from "@/contexts/ChapterVisibilityContext";
import { ChevronRight } from "lucide-react";

const data = gitaData as unknown as GitaData;

const HERO_IMG = "/gita-banner.png";

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

const chapterColorMap: Record<number, string> = {
  1: "from-red-800 to-red-700",
  2: "from-red-900 to-rose-700",
  3: "from-orange-800 to-orange-700",
  4: "from-yellow-800 to-orange-700",
  5: "from-green-800 to-teal-700",
  6: "from-teal-800 to-cyan-700",
  7: "from-violet-800 to-purple-700",
  8: "from-slate-800 to-red-800",
  9: "from-orange-800 to-yellow-700",
  10: "from-rose-800 to-pink-700",
  11: "from-purple-900 to-red-800",
  12: "from-pink-800 to-rose-700",
  13: "from-emerald-800 to-green-700",
  14: "from-cyan-800 to-teal-700",
  15: "from-lime-800 to-green-700",
  16: "from-red-900 to-orange-800",
  17: "from-orange-900 to-red-800",
  18: "from-yellow-900 to-orange-800",
};

function getChapterImage(ch: { chapter: number; key_verses: Verse[] }): string | null {
  const verses: Verse[] = ch.chapter === 6 ? data.chapter6_full : ch.key_verses;
  for (const v of verses) {
    if (v.images?.meaning?.url) return v.images.meaning.url;
  }
  return null;
}

export default function Home() {
  const [kidsMode, setKidsMode] = useState(false);
  const { isChapterVisible } = useChapterVisibility();
  const visibleChapters = data.chapters.filter((ch) => isChapterVisible(ch.chapter));

  return (
    <Layout kidsMode={kidsMode} onToggleKids={() => setKidsMode(!kidsMode)}>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Bhagavad Gita — Krishna and Arjuna"
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-6 lg:pb-10 text-center">
          <h1 className="text-white font-display text-3xl lg:text-5xl font-bold leading-tight mb-2 drop-shadow-lg">
            श्रीमद्भगवद्गीता
          </h1>
          <p className="text-orange-100 text-sm lg:text-base leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            Bhagavad Gita with authentic pronunciation, detailed meaning, stories and practical application tips for kids and adults.
          </p>
        </div>
      </section>

      {/* Chapter Cards */}
      <section className="px-4 py-8 lg:py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleChapters.map((ch) => {
            const img = getChapterImage(ch as any);
            return (
              <Link key={ch.chapter} href={`/chapter/${ch.chapter}`}>
                <div className="chapter-card bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:border-orange-300 hover:shadow-md transition-all group cursor-pointer h-full flex flex-col">
                  <div className={`bg-gradient-to-r ${chapterColorMap[ch.chapter]} p-4 relative overflow-hidden`}>
                    <div className="absolute top-2 right-3 text-white/20 text-5xl font-bold font-display leading-none select-none">
                      {ch.chapter}
                    </div>
                    {img && (
                      <img
                        src={img}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                        loading="lazy"
                      />
                    )}
                    <div className="relative z-10">
                      <span className="text-white/70 text-xs">Chapter {ch.chapter}</span>
                      <p className="font-devanagari text-white text-lg leading-tight mt-1">
                        {chapterDevanagari[ch.chapter] || ch.name_hindi}
                      </p>
                      <p className="text-orange-200 text-xs italic">
                        {chapterIAST[ch.chapter] || ""}
                      </p>
                      <h3 className="text-white/90 font-display font-semibold text-sm leading-tight mt-1">
                        {ch.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-foreground/70 text-xs leading-relaxed line-clamp-2 flex-1">{ch.summary}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">{ch.verses_count} verses</span>
                      <span className="text-xs text-orange-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Explore
                        <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-950 text-red-300 py-8 px-6 text-center">
        <p className="font-devanagari text-lg text-orange-300 mb-1">
          सर्वे भवन्तु सुखिनः
        </p>
        <p className="text-sm italic mb-3">May all beings be happy</p>
        <p className="text-xs text-red-400">
          Bhagavad Gita Gurukula.com
        </p>
      </footer>
    </Layout>
  );
}

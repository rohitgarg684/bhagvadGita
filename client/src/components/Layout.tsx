// Layout: Modern Vedic Learning Platform
// Deep indigo sidebar, warm cream content area, amber accents
import { useState } from "react";
import { Link, useLocation } from "wouter";
import gitaData from "@/data/gitaData.json";
import type { GitaData } from "@/types/gita";
import { BookOpen, Home, Menu, X, Star, ChevronRight } from "lucide-react";

const data = gitaData as unknown as GitaData;

interface LayoutProps {
  children: React.ReactNode;
  kidsMode?: boolean;
  onToggleKids?: () => void;
}

export default function Layout({ children, kidsMode = false, onToggleKids }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  const chapterGroups = [
    { label: "Karma Kanda", range: [1, 6], color: "text-amber-400" },
    { label: "Upasana Kanda", range: [7, 12], color: "text-teal-400" },
    { label: "Jnana Kanda", range: [13, 18], color: "text-rose-400" },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${kidsMode ? "kids-mode" : ""}`}>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-vedic-hero border-b border-white/10 shadow-lg">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-amber-300 hover:text-amber-100 transition-colors p-1"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-amber-400 text-xl">🕉</span>
              <span className="font-display text-white font-semibold text-base lg:text-lg tracking-wide group-hover:text-amber-200 transition-colors">
                Bhagavad Gita
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {onToggleKids && (
              <button
                onClick={onToggleKids}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  kidsMode
                    ? "bg-amber-400 text-indigo-900"
                    : "bg-white/10 text-amber-200 hover:bg-white/20"
                }`}
              >
                <Star size={12} />
                {kidsMode ? "Kids Mode ON" : "Kids Mode"}
              </button>
            )}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-amber-200 hover:text-white hover:bg-white/10 transition-all"
            >
              <Home size={13} />
              Home
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)]
            w-72 bg-sidebar overflow-y-auto
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            flex-shrink-0 border-r border-sidebar-border
          `}
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-5 px-2">
              <BookOpen size={15} className="text-amber-400" />
              <span className="text-amber-300 text-xs font-semibold uppercase tracking-widest">
                18 Chapters
              </span>
            </div>

            {chapterGroups.map((group) => (
              <div key={group.label} className="mb-5">
                <p className={`text-xs font-semibold uppercase tracking-widest px-2 mb-2 ${group.color}`}>
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {data.chapters
                    .filter((ch) => ch.chapter >= group.range[0] && ch.chapter <= group.range[1])
                    .map((ch) => {
                      const isActive = location === `/chapter/${ch.chapter}` || location.startsWith(`/chapter/${ch.chapter}/`);
                      return (
                        <Link
                          key={ch.chapter}
                          href={`/chapter/${ch.chapter}`}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all group
                            ${isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            }
                          `}
                        >
                          <span className="text-base leading-none w-5 text-center">{ch.icon}</span>
                          <span className="flex-1 min-w-0">
                            <span className="text-xs opacity-60 mr-1">Ch.{ch.chapter}</span>
                            <span className="truncate">{ch.name}</span>
                          </span>
                          {isActive && <ChevronRight size={12} className="opacity-60" />}
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

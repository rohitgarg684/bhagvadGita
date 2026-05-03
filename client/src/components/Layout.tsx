// Layout: Modern Vedic Learning Platform
// Deep maroon sidebar, warm cream content area, saffron orange accents
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import gitaData from "@/data/gitaData.json";
import type { GitaData } from "@/types/gita";
import { BookOpen, Home, Menu, X, Star, ChevronRight, ChevronLeft, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useChapterVisibility } from "@/contexts/ChapterVisibilityContext";

const data = gitaData as unknown as GitaData;

const SIDEBAR_COLLAPSED_KEY = "gita-sidebar-collapsed";

interface LayoutProps {
  children: React.ReactNode;
  kidsMode?: boolean;
  onToggleKids?: () => void;
  stickyHeader?: boolean;
}

export default function Layout({ children, kidsMode = false, onToggleKids, stickyHeader = true }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    try {
      if (localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1") {
        setNavCollapsed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, navCollapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [navCollapsed]);
  const { user, isAdmin, signOut } = useAuth();
  const { isChapterVisible } = useChapterVisibility();

  const chapterGroups = [
    { label: "Karma Kanda", range: [1, 6], color: "text-orange-700" },
    { label: "Upasana Kanda", range: [7, 12], color: "text-teal-700" },
    { label: "Jnana Kanda", range: [13, 18], color: "text-rose-700" },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${kidsMode ? "kids-mode" : ""}`}>
      {/* Top Navigation Bar */}
      <header className={`${stickyHeader ? 'sticky top-0' : ''} z-50 bg-vedic-hero border-b border-white/10 shadow-lg`}>
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white hover:text-orange-100 transition-colors p-1"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/gurukula-g-logo.png" alt="Gurukula" className="w-8 h-8 rounded-full shadow-md" />
              <span className="font-display text-white font-semibold text-lg lg:text-xl tracking-wide group-hover:text-orange-100 transition-colors">
                Bhagavad Gita Gurukula.com
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {onToggleKids && (
              <button
                onClick={onToggleKids}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                  kidsMode
                    ? "bg-white text-orange-700 font-bold"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Star size={14} />
                {kidsMode ? "Kids Mode ON" : "Kids Mode"}
              </button>
            )}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-white hover:text-orange-100 hover:bg-white/20 transition-all"
            >
              <Home size={15} />
              Home
            </Link>
            {isAdmin && user && (
              <>
                <Link
                  href="/settings"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
                  title="Settings"
                >
                  <Settings size={12} />
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-orange-400/20 border border-orange-400/40 text-orange-200 hover:bg-orange-400/30 transition-all"
                  title="Sign out admin"
                >
                  <img
                    src={user.photoURL || ""}
                    alt=""
                    className="w-5 h-5 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <LogOut size={12} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 lg:overflow-hidden">
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
            fixed top-16 h-[calc(100vh-4rem)] lg:sticky ${stickyHeader ? 'lg:top-16 lg:h-[calc(100vh-4rem)]' : 'lg:top-0 lg:h-screen'} left-0 z-40
            w-[min(15rem,85vw)] lg:transition-[width] lg:duration-300 lg:ease-in-out
            ${navCollapsed ? "lg:w-14" : "lg:w-56"}
            bg-sidebar overflow-y-auto overflow-x-hidden
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            flex-shrink-0 border-r border-sidebar-border
          `}
        >
          <div className={`${navCollapsed ? "lg:p-2 p-4" : "p-4"}`}>
            <div
              className={`flex items-center gap-2 mb-5 px-2 ${navCollapsed ? "lg:justify-center lg:mb-3 lg:px-0" : ""}`}
            >
              <div className={`flex items-center gap-2 flex-1 min-w-0 ${navCollapsed ? "lg:hidden" : ""}`}>
                <BookOpen size={17} className="text-orange-600 flex-shrink-0" />
                <span className="text-orange-700 text-sm font-semibold uppercase tracking-widest truncate min-w-0">
                  18 Chapters
                </span>
              </div>
              <button
                type="button"
                className={`
                  hidden lg:inline-flex flex-shrink-0 rounded-lg border border-sidebar-border bg-orange-50/80 p-1.5 text-orange-800
                  hover:bg-orange-100 transition-colors
                  ${navCollapsed ? "" : "ml-auto"}
                `}
                onClick={() => setNavCollapsed((c) => !c)}
                aria-expanded={!navCollapsed}
                aria-label={navCollapsed ? "Expand chapter navigation" : "Collapse chapter navigation"}
                title={navCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {navCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            </div>

            {chapterGroups.map((group) => (
              <div key={group.label} className={`mb-5 ${navCollapsed ? "lg:mb-3" : ""}`}>
                <p
                  className={`text-sm font-semibold uppercase tracking-widest px-2 mb-2 ${group.color} ${
                    navCollapsed ? "lg:hidden" : ""
                  }`}
                >
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {data.chapters
                    .filter((ch) => ch.chapter >= group.range[0] && ch.chapter <= group.range[1] && isChapterVisible(ch.chapter))
                    .map((ch) => {
                      const isActive = location === `/chapter/${ch.chapter}` || location.startsWith(`/chapter/${ch.chapter}/`);
                      return (
                        <Link
                          key={ch.chapter}
                          href={`/chapter/${ch.chapter}`}
                          onClick={() => setSidebarOpen(false)}
                          title={`Chapter ${ch.chapter}: ${ch.name}`}
                          className={`
                            relative flex items-center gap-2.5 rounded-lg text-base transition-all group
                            ${navCollapsed ? "lg:justify-center lg:px-1.5 lg:py-2" : "px-3 py-2.5"}
                            ${isActive
                              ? `bg-orange-100 text-orange-900 font-semibold border-l-2 border-orange-500 ${
                                  navCollapsed ? "lg:border-l-0 lg:ring-1 lg:ring-orange-400/70" : ""
                                }`
                              : "text-gray-700 hover:bg-orange-50 hover:text-gray-900"
                            }
                          `}
                        >
                          <span className="text-base leading-none w-5 text-center flex-shrink-0">{ch.icon}</span>
                          <span className={`flex-1 min-w-0 ${navCollapsed ? "lg:hidden" : ""}`}>
                            <span className="text-sm opacity-60 mr-1">Ch.{ch.chapter}</span>
                            <span className="truncate">{ch.name}</span>
                          </span>
                          {isActive && (
                            <ChevronRight size={12} className={`opacity-60 flex-shrink-0 ${navCollapsed ? "lg:hidden" : ""}`} />
                          )}
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content — no overflow on mobile so sticky works with document scroll (#56) */}
        <main className="flex-1 min-w-0 lg:overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

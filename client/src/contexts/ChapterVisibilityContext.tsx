import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

interface ChapterVisibilityValue {
  visibleChapters: Set<number>;
  loading: boolean;
  isChapterVisible: (chapter: number) => boolean;
  toggleChapter: (chapter: number) => Promise<void>;
}

const FIRESTORE_DOC = "chapter_visibility";
const FIRESTORE_COLLECTION = "gita_config";
const ALL_CHAPTERS = Array.from({ length: 18 }, (_, i) => i + 1);
const DEFAULT_VISIBLE = new Set([12]);

const ChapterVisibilityContext = createContext<ChapterVisibilityValue>({
  visibleChapters: DEFAULT_VISIBLE,
  loading: true,
  isChapterVisible: (ch) => DEFAULT_VISIBLE.has(ch),
  toggleChapter: async () => {},
});

export function useChapterVisibility() {
  return useContext(ChapterVisibilityContext);
}

export function ChapterVisibilityProvider({ children }: { children: ReactNode }) {
  const [visibleChapters, setVisibleChapters] = useState<Set<number>>(DEFAULT_VISIBLE);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const snap = await getDoc(doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC));
        if (snap.exists()) {
          const data = snap.data();
          const chapters: number[] = data.visible ?? [];
          setVisibleChapters(new Set(chapters));
        }
      } catch {
        // Firestore unavailable — keep defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isChapterVisible = useCallback(
    (chapter: number) => {
      if (isAdmin) return true;
      return visibleChapters.has(chapter);
    },
    [visibleChapters, isAdmin],
  );

  const toggleChapter = useCallback(
    async (chapter: number) => {
      if (!db || !isAdmin) return;

      const next = new Set(visibleChapters);
      if (next.has(chapter)) {
        next.delete(chapter);
      } else {
        next.add(chapter);
      }
      setVisibleChapters(next);

      try {
        await setDoc(doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC), {
          visible: ALL_CHAPTERS.filter((c) => next.has(c)),
        });
        toast.success(`Chapter ${chapter} ${next.has(chapter) ? "visible" : "hidden"}`);
      } catch (err) {
        console.error("Failed to save visibility:", err);
        toast.error("Failed to save — check Firestore permissions");
        setVisibleChapters(visibleChapters);
      }
    },
    [visibleChapters, isAdmin],
  );

  return (
    <ChapterVisibilityContext.Provider
      value={{ visibleChapters, loading, isChapterVisible, toggleChapter }}
    >
      {children}
    </ChapterVisibilityContext.Provider>
  );
}

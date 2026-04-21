// Games Hub Page — Chapter 6 Interactive Learning Games
// Design: Playful Vedic — Baloo 2 font, bright cards, animated elements (Gurukula palette)
import { useState } from "react";
import { Link, useParams } from "wouter";
import Layout from "@/components/Layout";
import { ChevronLeft, Trophy, Zap, Puzzle, Shuffle, Target, Star } from "lucide-react";
import VerseMatchGame from "@/components/games/VerseMatchGame";
import FillBlankGame from "@/components/games/FillBlankGame";
import VerseQuizGame from "@/components/games/VerseQuizGame";
import WordScrambleGame from "@/components/games/WordScrambleGame";
import SpeedRoundGame from "@/components/games/SpeedRoundGame";

type GameId = "match" | "fill" | "quiz" | "scramble" | "speed" | null;

const GAMES = [
  {
    id: "match" as GameId,
    title: "Verse Match",
    emoji: "🎯",
    description: "Match each Sanskrit shloka to its correct meaning. Flip the cards and find the pairs!",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    badge: "Memory",
    badgeColor: "bg-violet-100 text-violet-700",
    icon: <Target size={28} />,
    difficulty: "Easy",
    diffColor: "text-green-600",
  },
  {
    id: "fill" as GameId,
    title: "Fill in the Blank",
    emoji: "🧩",
    description: "Complete the verse! Choose the right word to fill in the missing part of each shloka.",
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "Vocabulary",
    badgeColor: "bg-orange-100 text-orange-700",
    icon: <Puzzle size={28} />,
    difficulty: "Medium",
    diffColor: "text-orange-600",
  },
  {
    id: "quiz" as GameId,
    title: "Verse Quiz",
    emoji: "🏆",
    description: "Answer questions about the meanings, stories, and teachings from Chapter 6 verses!",
    color: "from-teal-500 to-cyan-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    badge: "Knowledge",
    badgeColor: "bg-teal-100 text-teal-700",
    icon: <Trophy size={28} />,
    difficulty: "Medium",
    diffColor: "text-orange-600",
  },
  {
    id: "scramble" as GameId,
    title: "Word Scramble",
    emoji: "🔤",
    description: "Unscramble the Sanskrit transliteration words! Can you put the letters in the right order?",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    badge: "Sanskrit",
    badgeColor: "bg-rose-100 text-rose-700",
    icon: <Shuffle size={28} />,
    difficulty: "Hard",
    diffColor: "text-red-600",
  },
  {
    id: "speed" as GameId,
    title: "Speed Round",
    emoji: "⚡",
    description: "True or False — super fast! 10 questions, 10 seconds each. How many can you get right?",
    color: "from-red-700 to-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "Speed",
    badgeColor: "bg-red-100 text-red-700",
    icon: <Zap size={28} />,
    difficulty: "Easy",
    diffColor: "text-green-600",
  },
];

export default function GamesPage() {
  const params = useParams<{ chapterNum: string }>();
  const chapterNum = parseInt(params.chapterNum || "6");
  const [activeGame, setActiveGame] = useState<GameId>(null);
  const [kidsMode, setKidsMode] = useState(true);

  const activeGameData = GAMES.find((g) => g.id === activeGame);

  return (
    <Layout kidsMode={kidsMode} onToggleKids={() => setKidsMode(!kidsMode)}>
      {/* Header */}
      <div className="bg-gradient-to-b from-red-950 to-red-900 px-4 py-8 lg:py-10">
        <div className="flex items-center gap-2 text-red-300 text-xs mb-4">
          <Link href="/" className="hover:text-orange-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/chapter/${chapterNum}`} className="hover:text-orange-300 transition-colors">
            Chapter {chapterNum}
          </Link>
          <span>/</span>
          <span className="text-orange-300">Games</span>
        </div>

        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🎮</span>
            <div>
              <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest">
                Chapter 6 · Dhyana Yoga
              </p>
              <span className="inline-flex items-center gap-1 bg-orange-400 text-red-950 text-xs font-bold px-2 py-0.5 rounded-full mt-1 font-kids">
                <Star size={10} fill="currentColor" />
                5 Fun Games
              </span>
            </div>
          </div>
          <h1 className="text-white font-kids text-3xl lg:text-5xl font-bold leading-tight mb-2">
            Learning Games! 🌟
          </h1>
          <p className="text-red-200 text-sm lg:text-base leading-relaxed">
            Play games to learn the Bhagavad Gita! Each game helps you remember the verses, their meanings, and the wonderful stories from Chapter 6.
          </p>
        </div>
      </div>

      {/* Active Game */}
      {activeGame && (
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={() => setActiveGame(null)}
            className="flex items-center gap-2 text-sm text-red-800 hover:text-orange-600 transition-colors font-semibold mb-6 font-kids"
          >
            <ChevronLeft size={16} />
            Back to Games
          </button>

          <div className={`rounded-2xl border-2 ${activeGameData?.border} ${activeGameData?.bg} p-1`}>
            <div className={`bg-gradient-to-r ${activeGameData?.color} rounded-xl p-4 mb-4 flex items-center gap-3`}>
              <span className="text-3xl">{activeGameData?.emoji}</span>
              <div>
                <h2 className="text-white font-kids font-bold text-xl">{activeGameData?.title}</h2>
                <p className="text-white/80 text-xs">{activeGameData?.description}</p>
              </div>
            </div>

            <div className="p-2">
              {activeGame === "match" && <VerseMatchGame chapterNum={chapterNum} />}
              {activeGame === "fill" && <FillBlankGame chapterNum={chapterNum} />}
              {activeGame === "quiz" && <VerseQuizGame chapterNum={chapterNum} />}
              {activeGame === "scramble" && <WordScrambleGame chapterNum={chapterNum} />}
              {activeGame === "speed" && <SpeedRoundGame chapterNum={chapterNum} />}
            </div>
          </div>
        </div>
      )}

      {/* Game Selection Grid */}
      {!activeGame && (
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-kids text-2xl font-bold text-foreground">Choose a Game</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-300 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className={`
                  text-left rounded-2xl border-2 ${game.border} ${game.bg}
                  p-5 transition-all hover:shadow-lg hover:-translate-y-1 group
                  active:scale-95
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{game.emoji}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${game.badgeColor}`}>
                      {game.badge}
                    </span>
                    <span className={`text-xs font-semibold ${game.diffColor}`}>
                      {game.difficulty}
                    </span>
                  </div>
                </div>
                <h3 className="font-kids font-bold text-lg text-gray-800 mb-1">{game.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed font-kids">{game.description}</p>
                <div className={`mt-3 inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r ${game.color} text-white px-3 py-1.5 rounded-full group-hover:shadow-md transition-shadow`}>
                  Play Now →
                </div>
              </button>
            ))}
          </div>

          {/* Back to chapter */}
          <div className="mt-8 text-center">
            <Link href={`/chapter/${chapterNum}`}>
              <button className="flex items-center gap-2 mx-auto text-sm text-red-800 hover:text-orange-600 transition-colors font-semibold font-kids">
                <ChevronLeft size={16} />
                Back to Chapter {chapterNum} Verses
              </button>
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
}

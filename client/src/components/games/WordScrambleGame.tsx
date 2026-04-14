// Word Scramble Game — Unscramble Sanskrit transliteration words
import { useState, useCallback, useEffect } from "react";
import { generateScrambleWords, getScoreEmoji, getScoreMessage } from "./gameData";
import type { ScrambleWord } from "./gameData";
import { RotateCcw, ChevronRight, Lightbulb } from "lucide-react";

interface Props {
  chapterNum: number;
}

export default function WordScrambleGame({ chapterNum: _ }: Props) {
  const [words] = useState<ScrambleWord[]>(() => generateScrambleWords().slice(0, 8));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const total = words.length;
  const current = words[currentIdx];

  useEffect(() => {
    setUserInput("");
    setFeedback(null);
    setShowHint(false);
    setAttempts(0);
  }, [currentIdx]);

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    const normalized = userInput.trim().toUpperCase().replace(/[^A-Z]/g, "");
    const correct = current.correct.toUpperCase().replace(/[^A-Z]/g, "");
    setAttempts((a) => a + 1);

    if (normalized === correct) {
      setFeedback("correct");
      if (attempts === 0) setScore((s) => s + 2); // Bonus for first try
      else setScore((s) => s + 1);
    } else {
      setFeedback("wrong");
      setUserInput("");
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= total) {
      setShowResult(true);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const resetGame = useCallback(() => {
    setCurrentIdx(0);
    setUserInput("");
    setScore(0);
    setShowResult(false);
    setFeedback(null);
    setShowHint(false);
    setAttempts(0);
  }, []);

  if (showResult) {
    const maxScore = total * 2;
    const emoji = getScoreEmoji(score, maxScore);
    const msg = getScoreMessage(score, maxScore);
    return (
      <div className="text-center py-6 px-4">
        <div className="text-6xl mb-3">{emoji}</div>
        <h3 className="font-kids font-bold text-2xl text-indigo-900 mb-1">{msg}</h3>
        <p className="text-gray-600 font-kids text-lg mb-2">
          Score: <strong className="text-rose-600">{score}</strong> / {maxScore}
        </p>
        <p className="text-gray-500 font-kids text-sm mb-6">
          (2 points for first try, 1 point otherwise)
        </p>
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-rose-800 font-kids font-bold text-sm mb-1">🔤 Sanskrit Vocabulary!</p>
          <p className="text-rose-700 font-kids text-sm">You just practiced {total} Sanskrit words from the Bhagavad Gita. These words appear in the actual shlokas!</p>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-2 mx-auto bg-rose-500 hover:bg-rose-400 text-white font-kids font-bold px-6 py-3 rounded-full transition-all shadow-md"
        >
          <RotateCcw size={16} />
          Play Again
        </button>
      </div>
    );
  }

  // Display scrambled letters as individual tiles
  const letters = current.scrambled.split("");

  return (
    <div className="p-2">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentIdx / total) * 100}%` }}
          />
        </div>
        <span className="text-xs font-kids font-bold text-gray-500">{currentIdx + 1} / {total}</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="bg-rose-100 text-rose-700 font-kids font-bold px-3 py-1 rounded-full text-sm">
          Score: {score}
        </div>
        <div className="text-indigo-600 font-kids text-sm font-semibold">Verse {current.verseRef}</div>
      </div>

      {/* Scrambled word display */}
      <div className="bg-indigo-950 rounded-xl p-5 mb-4 text-center">
        <p className="text-amber-300 text-xs font-kids font-bold uppercase tracking-wide mb-3">
          🔤 Unscramble this Sanskrit word!
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {letters.map((letter, i) => (
            <span
              key={i}
              className="w-9 h-9 bg-amber-400 text-indigo-950 font-kids font-bold text-base rounded-lg flex items-center justify-center shadow-md"
            >
              {letter}
            </span>
          ))}
        </div>
        <p className="text-indigo-300 text-xs font-kids italic">"{current.meaning}"</p>
      </div>

      {/* Hint */}
      {showHint && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-3 flex items-start gap-2">
          <Lightbulb size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-yellow-800 font-kids text-sm">{current.hint}</p>
        </div>
      )}

      {/* Input */}
      {feedback !== "correct" && (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Type your answer..."
              className={`flex-1 border-2 rounded-xl px-4 py-3 font-kids font-bold text-base outline-none transition-all ${
                feedback === "wrong"
                  ? "border-red-400 bg-red-50 text-red-800"
                  : "border-gray-200 focus:border-rose-400 bg-white"
              }`}
              autoComplete="off"
              autoCapitalize="characters"
            />
            <button
              onClick={handleSubmit}
              className="bg-rose-500 hover:bg-rose-400 text-white font-kids font-bold px-4 py-3 rounded-xl transition-all shadow-md"
            >
              Check
            </button>
          </div>
          {feedback === "wrong" && (
            <p className="text-red-600 font-kids text-sm mt-2 font-semibold">
              ❌ Not quite! Try again... ({attempts} {attempts === 1 ? "attempt" : "attempts"})
            </p>
          )}
        </div>
      )}

      {/* Correct feedback */}
      {feedback === "correct" && (
        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 mb-4">
          <p className="text-green-700 font-kids font-bold text-base mb-1">
            ✅ Correct! The word is: <strong className="text-green-900">{current.correct}</strong>
          </p>
          <p className="text-green-600 font-kids text-sm">
            Meaning: {current.meaning} (Verse {current.verseRef})
          </p>
          {attempts === 1 && (
            <p className="text-amber-600 font-kids text-xs mt-1 font-bold">⭐ +2 bonus for first try!</p>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        {!showHint && feedback !== "correct" && (
          <button
            onClick={() => setShowHint(true)}
            className="flex items-center gap-1.5 border-2 border-yellow-300 text-yellow-700 bg-yellow-50 font-kids font-semibold px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-yellow-100"
          >
            <Lightbulb size={14} />
            Hint
          </button>
        )}
        {feedback === "correct" && (
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-400 text-white font-kids font-bold py-3 rounded-xl transition-all shadow-md"
          >
            {currentIdx + 1 >= total ? "See Results 🏆" : "Next Word"}
            <ChevronRight size={16} />
          </button>
        )}
        {feedback !== "correct" && attempts >= 3 && (
          <button
            onClick={() => { setFeedback("correct"); setScore((s) => s + 0); }}
            className="flex-1 border-2 border-gray-200 text-gray-500 font-kids text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-all"
          >
            Skip (show answer)
          </button>
        )}
      </div>
    </div>
  );
}

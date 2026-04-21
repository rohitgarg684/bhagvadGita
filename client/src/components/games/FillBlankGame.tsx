// Fill in the Blank Game — Complete the verse transliteration
import { useState, useCallback } from "react";
import { generateFillBlankQuestions, getScoreEmoji, getScoreMessage, shuffle } from "./gameData";
import type { FillBlankQuestion } from "./gameData";
import { RotateCcw, ChevronRight } from "lucide-react";

interface Props {
  chapterNum: number;
}

export default function FillBlankGame({ chapterNum: _ }: Props) {
  const [questions] = useState<FillBlankQuestion[]>(() => generateFillBlankQuestions());
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = questions[currentQ];
  const total = questions.length;

  // Shuffle options once per question
  const [shuffledOptions] = useState(() =>
    questions.map((q) => {
      const opts = q.options.map((o, i) => ({ text: o, origIdx: i }));
      return shuffle(opts);
    })
  );

  const handleAnswer = (origIdx: number, displayIdx: number) => {
    if (answered) return;
    setSelected(displayIdx);
    setAnswered(true);
    if (origIdx === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ + 1 >= total) {
      setShowResult(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const resetGame = useCallback(() => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  }, []);

  if (showResult) {
    const emoji = getScoreEmoji(score, total);
    const msg = getScoreMessage(score, total);
    return (
      <div className="text-center py-6 px-4">
        <div className="text-6xl mb-3">{emoji}</div>
        <h3 className="font-kids font-bold text-2xl text-red-900 mb-1">{msg}</h3>
        <p className="text-gray-600 font-kids text-lg mb-6">
          You got <strong className="text-orange-600">{score}</strong> out of <strong>{total}</strong> correct!
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-orange-800 font-kids font-bold text-sm mb-1">📝 Sanskrit Tip!</p>
          <p className="text-orange-700 font-kids text-sm">Reading Sanskrit transliteration helps you pronounce the shlokas correctly. Keep practicing!</p>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-2 mx-auto bg-orange-500 hover:bg-orange-400 text-white font-kids font-bold px-6 py-3 rounded-full transition-all shadow-md"
        >
          <RotateCcw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  const opts = shuffledOptions[currentQ];
  const correctDisplayIdx = opts.findIndex((o) => o.origIdx === q.correctIndex);

  return (
    <div className="p-2">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentQ / total) * 100}%` }}
          />
        </div>
        <span className="text-xs font-kids font-bold text-gray-500">{currentQ + 1} / {total}</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="bg-orange-100 text-orange-700 font-kids font-bold px-3 py-1 rounded-full text-sm">
          Score: {score}
        </div>
        <div className="text-red-800 font-kids text-sm font-semibold">Verse {q.verseRef}</div>
      </div>

      {/* Verse with blank */}
      <div className="bg-red-950 rounded-xl p-4 mb-4">
        <p className="text-orange-300 text-xs font-kids font-bold uppercase tracking-wide mb-3">
          🧩 Fill in the blank!
        </p>
        <p className="text-white/80 font-kids text-sm leading-relaxed italic mb-3">
          {q.beforeBlank}{" "}
          <span className="inline-block bg-orange-400 text-red-950 font-bold px-3 py-0.5 rounded-lg mx-1 min-w-[80px] text-center">
            {answered ? q.blank : "______"}
          </span>
          {" "}{q.afterBlank}
        </p>
        <div className="border-t border-white/10 pt-3 mt-2">
          <p className="text-orange-200 text-xs font-kids italic">"{q.meaning}"</p>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {opts.map((opt, displayIdx) => {
          const isCorrect = displayIdx === correctDisplayIdx;
          const isSelected = displayIdx === selected;
          let style = "bg-white border-gray-200 text-gray-800 hover:border-orange-300 hover:bg-orange-50";
          if (answered) {
            if (isCorrect) style = "bg-green-100 border-green-500 text-green-800";
            else if (isSelected) style = "bg-red-100 border-red-400 text-red-800";
            else style = "bg-white border-gray-200 text-gray-400 opacity-50";
          }
          return (
            <button
              key={displayIdx}
              onClick={() => handleAnswer(opt.origIdx, displayIdx)}
              disabled={answered}
              className={`border-2 rounded-xl px-3 py-3 font-kids text-sm font-semibold transition-all ${style} active:scale-95`}
            >
              {opt.text}
              {answered && isCorrect && " ✓"}
              {answered && isSelected && !isCorrect && " ✗"}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className={`rounded-xl p-3 mb-4 border text-sm font-kids ${
          selected === correctDisplayIdx
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-orange-50 border-orange-200 text-orange-800"
        }`}>
          <strong>{selected === correctDisplayIdx ? "✅ Correct!" : "❌ The answer is: " + q.blank}</strong>
          <br />
          Full verse: <em className="text-xs">{q.fullVerse}</em>
        </div>
      )}

      {answered && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-kids font-bold py-3 rounded-xl transition-all shadow-md"
        >
          {currentQ + 1 >= total ? "See Results 🏆" : "Next Verse"}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

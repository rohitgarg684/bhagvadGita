// Verse Quiz Game — Multiple choice questions about Chapter 6
import { useState, useCallback } from "react";
import { generateQuizQuestions, getScoreEmoji, getScoreMessage } from "./gameData";
import type { QuizQuestion } from "./gameData";
import { RotateCcw, ChevronRight, CheckCircle, XCircle } from "lucide-react";

interface Props {
  chapterNum: number;
}

export default function VerseQuizGame({ chapterNum: _ }: Props) {
  const [questions] = useState<QuizQuestion[]>(() => generateQuizQuestions());
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const q = questions[currentQ];
  const total = questions.length;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === q.correctIndex;
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, correct]);
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
    setAnswers([]);
  }, []);

  if (showResult) {
    const emoji = getScoreEmoji(score, total);
    const msg = getScoreMessage(score, total);
    return (
      <div className="text-center py-6 px-4">
        <div className="text-6xl mb-3">{emoji}</div>
        <h3 className="font-kids font-bold text-2xl text-indigo-900 mb-1">{msg}</h3>
        <p className="text-gray-600 font-kids text-lg mb-4">
          You got <strong className="text-teal-600">{score}</strong> out of <strong>{total}</strong> correct!
        </p>

        {/* Answer review */}
        <div className="grid grid-cols-5 gap-2 mb-6 max-w-xs mx-auto">
          {answers.map((correct, i) => (
            <div key={i} className={`rounded-full w-10 h-10 flex items-center justify-center text-white font-kids font-bold text-sm ${correct ? "bg-green-500" : "bg-red-400"}`}>
              {i + 1}
            </div>
          ))}
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-teal-800 font-kids font-bold text-sm mb-1">🌟 Keep Learning!</p>
          <p className="text-teal-700 font-kids text-sm">Review the verses you missed in the chapter, then try again!</p>
        </div>

        <button
          onClick={resetGame}
          className="flex items-center gap-2 mx-auto bg-teal-600 hover:bg-teal-500 text-white font-kids font-bold px-6 py-3 rounded-full transition-all shadow-md"
        >
          <RotateCcw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentQ) / total) * 100}%` }}
          />
        </div>
        <span className="text-xs font-kids font-bold text-gray-500 whitespace-nowrap">
          {currentQ + 1} / {total}
        </span>
      </div>

      {/* Score */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-teal-100 text-teal-700 font-kids font-bold px-3 py-1 rounded-full text-sm">
          Score: {score}
        </div>
        <div className="text-amber-600 font-kids text-sm font-semibold">
          {q.emoji} Verse {q.verseRef}
        </div>
      </div>

      {/* Question */}
      <div className="bg-indigo-950 rounded-xl p-4 mb-4">
        <p className="text-amber-300 text-xs font-kids font-bold uppercase tracking-wide mb-2">Question {currentQ + 1}</p>
        <p className="text-white font-kids text-base leading-relaxed">{q.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {q.options.map((opt, idx) => {
          let style = "bg-white border-gray-200 text-gray-800 hover:border-teal-300 hover:bg-teal-50";
          if (answered) {
            if (idx === q.correctIndex) {
              style = "bg-green-100 border-green-500 text-green-800";
            } else if (idx === selected && idx !== q.correctIndex) {
              style = "bg-red-100 border-red-400 text-red-800";
            } else {
              style = "bg-white border-gray-200 text-gray-400 opacity-60";
            }
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={answered}
              className={`w-full text-left border-2 rounded-xl px-4 py-3 font-kids text-sm transition-all flex items-center gap-3 ${style} ${!answered ? "active:scale-98" : ""}`}
            >
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                answered && idx === q.correctIndex ? "border-green-500 bg-green-500 text-white" :
                answered && idx === selected && idx !== q.correctIndex ? "border-red-400 bg-red-400 text-white" :
                "border-gray-300"
              }`}>
                {answered && idx === q.correctIndex ? <CheckCircle size={14} /> :
                 answered && idx === selected && idx !== q.correctIndex ? <XCircle size={14} /> :
                 String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className={`rounded-xl p-4 mb-4 border ${selected === q.correctIndex ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
          <p className={`font-kids font-bold text-sm mb-1 ${selected === q.correctIndex ? "text-green-700" : "text-orange-700"}`}>
            {selected === q.correctIndex ? "✅ Correct!" : "❌ Not quite!"}
          </p>
          <p className={`font-kids text-sm leading-relaxed ${selected === q.correctIndex ? "text-green-800" : "text-orange-800"}`}>
            {q.explanation}
          </p>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-kids font-bold py-3 rounded-xl transition-all shadow-md"
        >
          {currentQ + 1 >= total ? "See Results 🏆" : "Next Question"}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

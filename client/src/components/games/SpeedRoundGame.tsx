// Speed Round Game — True/False with 10-second timer per question
import { useState, useEffect, useCallback, useRef } from "react";
import { generateTrueFalseQuestions, getScoreEmoji, getScoreMessage } from "./gameData";
import type { TrueFalseQuestion } from "./gameData";
import { RotateCcw, Zap } from "lucide-react";

interface Props {
  chapterNum: number;
}

const TIME_PER_Q = 10;

export default function SpeedRoundGame({ chapterNum: _ }: Props) {
  const [questions] = useState<TrueFalseQuestion[]>(() => generateTrueFalseQuestions());
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState<boolean | null>(null); // user's answer
  const [results, setResults] = useState<{ correct: boolean; timedOut: boolean }[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = questions[currentQ];
  const total = questions.length;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goNext = useCallback(() => {
    stopTimer();
    setTimeout(() => {
      if (currentQ + 1 >= total) {
        setShowResult(true);
      } else {
        setCurrentQ((q) => q + 1);
        setTimeLeft(TIME_PER_Q);
        setAnswered(null);
      }
    }, 1000);
  }, [currentQ, total, stopTimer]);

  // Timer
  useEffect(() => {
    if (!gameStarted || answered !== null || showResult) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopTimer();
          // Timed out
          setAnswered(undefined as unknown as boolean); // sentinel for timeout
          setResults((prev) => [...prev, { correct: false, timedOut: true }]);
          goNext();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => stopTimer();
  }, [currentQ, gameStarted, answered, showResult, stopTimer, goNext]);

  const handleAnswer = (userAnswer: boolean) => {
    if (answered !== null) return;
    stopTimer();
    setAnswered(userAnswer);
    const correct = userAnswer === q.answer;
    if (correct) setScore((s) => s + 1);
    setResults((prev) => [...prev, { correct, timedOut: false }]);
    goNext();
  };

  const resetGame = useCallback(() => {
    stopTimer();
    setCurrentQ(0);
    setTimeLeft(TIME_PER_Q);
    setScore(0);
    setShowResult(false);
    setAnswered(null);
    setResults([]);
    setGameStarted(false);
  }, [stopTimer]);

  if (!gameStarted) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-6xl mb-4">⚡</div>
        <h3 className="font-kids font-bold text-2xl text-indigo-900 mb-2">Speed Round!</h3>
        <p className="text-gray-600 font-kids text-base mb-6 max-w-sm mx-auto">
          {total} True/False questions. You have <strong>{TIME_PER_Q} seconds</strong> per question. Answer as fast as you can!
        </p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 text-left max-w-sm mx-auto">
          <p className="text-indigo-800 font-kids font-bold text-sm mb-2">📋 Rules:</p>
          <ul className="text-indigo-700 font-kids text-sm space-y-1">
            <li>✅ Tap TRUE if the statement is correct</li>
            <li>❌ Tap FALSE if the statement is wrong</li>
            <li>⏰ {TIME_PER_Q} seconds per question</li>
            <li>⚡ Faster answers = more fun!</li>
          </ul>
        </div>
        <button
          onClick={() => setGameStarted(true)}
          className="flex items-center gap-2 mx-auto bg-indigo-600 hover:bg-indigo-500 text-white font-kids font-bold px-8 py-4 rounded-full transition-all shadow-lg text-lg"
        >
          <Zap size={20} />
          Start!
        </button>
      </div>
    );
  }

  if (showResult) {
    const emoji = getScoreEmoji(score, total);
    const msg = getScoreMessage(score, total);
    return (
      <div className="text-center py-6 px-4">
        <div className="text-6xl mb-3">{emoji}</div>
        <h3 className="font-kids font-bold text-2xl text-indigo-900 mb-1">{msg}</h3>
        <p className="text-gray-600 font-kids text-lg mb-4">
          <strong className="text-indigo-600">{score}</strong> / {total} correct!
        </p>

        {/* Result dots */}
        <div className="flex justify-center gap-2 flex-wrap mb-6">
          {results.map((r, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-kids font-bold text-sm ${
                r.timedOut ? "bg-gray-400" : r.correct ? "bg-green-500" : "bg-red-400"
              }`}
            >
              {r.timedOut ? "⏰" : r.correct ? "✓" : "✗"}
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-indigo-800 font-kids font-bold text-sm mb-1">⚡ Speed Tip!</p>
          <p className="text-indigo-700 font-kids text-sm">Read the verses carefully and you'll answer faster next time. The more you read, the quicker you'll know!</p>
        </div>

        <button
          onClick={resetGame}
          className="flex items-center gap-2 mx-auto bg-indigo-600 hover:bg-indigo-500 text-white font-kids font-bold px-6 py-3 rounded-full transition-all shadow-md"
        >
          <RotateCcw size={16} />
          Play Again
        </button>
      </div>
    );
  }

  const timerPct = (timeLeft / TIME_PER_Q) * 100;
  const timerColor = timeLeft > 6 ? "bg-green-500" : timeLeft > 3 ? "bg-amber-500" : "bg-red-500";
  const isAnswered = answered !== null;

  return (
    <div className="p-2">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="bg-indigo-100 text-indigo-700 font-kids font-bold px-3 py-1 rounded-full text-sm">
          Score: {score}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-kids text-gray-500">{currentQ + 1}/{total}</span>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-kids font-bold text-white text-lg ${timerColor} transition-colors shadow-md`}>
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full ${timerColor} rounded-full transition-all duration-1000`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-indigo-950 rounded-xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-amber-400" />
          <span className="text-amber-400 text-xs font-kids font-bold uppercase tracking-wide">
            True or False?
          </span>
          <span className="text-indigo-400 text-xs font-kids ml-auto">Verse {q.verseRef}</span>
        </div>
        <p className="text-white font-kids text-base leading-relaxed">{q.question}</p>
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => handleAnswer(true)}
          disabled={isAnswered}
          className={`
            py-5 rounded-2xl font-kids font-bold text-xl transition-all shadow-md active:scale-95
            ${isAnswered
              ? q.answer === true
                ? "bg-green-500 text-white scale-105"
                : answered === true
                  ? "bg-red-400 text-white"
                  : "bg-gray-200 text-gray-400"
              : "bg-green-500 hover:bg-green-400 text-white hover:shadow-lg"
            }
          `}
        >
          ✅ TRUE
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={isAnswered}
          className={`
            py-5 rounded-2xl font-kids font-bold text-xl transition-all shadow-md active:scale-95
            ${isAnswered
              ? q.answer === false
                ? "bg-green-500 text-white scale-105"
                : answered === false
                  ? "bg-red-400 text-white"
                  : "bg-gray-200 text-gray-400"
              : "bg-red-500 hover:bg-red-400 text-white hover:shadow-lg"
            }
          `}
        >
          ❌ FALSE
        </button>
      </div>

      {/* Explanation after answer */}
      {isAnswered && (
        <div className={`rounded-xl p-3 text-sm font-kids border ${
          (answered === q.answer) ? "bg-green-50 border-green-200 text-green-800" : "bg-orange-50 border-orange-200 text-orange-800"
        }`}>
          <strong>{answered === q.answer ? "✅ Correct!" : "❌ Wrong!"}</strong>
          {" "}{q.explanation}
        </div>
      )}
    </div>
  );
}

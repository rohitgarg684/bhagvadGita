// Game data helpers for Chapter 6 Dhyana Yoga
import gitaData from "@/data/gitaData.json";
import type { GitaData, Verse } from "@/types/gita";

const data = gitaData as unknown as GitaData;

export function getChapter6Verses(): Verse[] {
  return data.chapter6_full;
}

// Pick N random items from array
export function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// Shuffle an array
export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Score display helper
export function getScoreEmoji(score: number, total: number): string {
  const pct = score / total;
  if (pct >= 0.9) return "🏆";
  if (pct >= 0.7) return "⭐";
  if (pct >= 0.5) return "👍";
  return "💪";
}

export function getScoreMessage(score: number, total: number): string {
  const pct = score / total;
  if (pct >= 0.9) return "Amazing! You're a Gita Master!";
  if (pct >= 0.7) return "Great job! Keep learning!";
  if (pct >= 0.5) return "Good effort! Practice more!";
  return "Keep trying! You'll get better!";
}

// True/False questions generated from verse data
export interface TrueFalseQuestion {
  question: string;
  answer: boolean;
  explanation: string;
  verseRef: string;
}

export function generateTrueFalseQuestions(): TrueFalseQuestion[] {
  const verses = getChapter6Verses();
  const questions: TrueFalseQuestion[] = [];

  // True statements from verses
  const trueStatements: TrueFalseQuestion[] = [
    {
      question: "A true yogi performs duties without depending on the results of action.",
      answer: true,
      explanation: "Verse 6.1 says: one who acts without depending on results is the true sannyāsī and yogī.",
      verseRef: "6.1",
    },
    {
      question: "The mind is described as restless, turbulent, strong, and stubborn in Chapter 6.",
      answer: true,
      explanation: "Verse 6.34 — Arjuna says the mind is restless (chañcalam), turbulent (pramāthi), strong (balavat), and stubborn (dṛḍham).",
      verseRef: "6.34",
    },
    {
      question: "A yogi should practice meditation in a clean, quiet place.",
      answer: true,
      explanation: "Verse 6.10-11 — A yogī should stay in solitude, in a clean place, with a steady seat.",
      verseRef: "6.10",
    },
    {
      question: "One should uplift oneself by oneself, not degrade oneself.",
      answer: true,
      explanation: "Verse 6.5 — 'uddhared ātmanā ātmānam' — one should uplift oneself by oneself.",
      verseRef: "6.5",
    },
    {
      question: "For one who has conquered the mind, the mind becomes the best friend.",
      answer: true,
      explanation: "Verse 6.6 — For one who has conquered the mind, the mind is the best friend.",
      verseRef: "6.6",
    },
    {
      question: "A steady mind is compared to a lamp in a windless place.",
      answer: true,
      explanation: "Verse 6.19 — Just as a lamp in a windless place does not flicker, so is the mind of a yogī.",
      verseRef: "6.19",
    },
    {
      question: "A yogī should eat in moderation — not too much or too little.",
      answer: true,
      explanation: "Verse 6.16-17 — Yoga is not for one who eats too much or too little. Moderation is key.",
      verseRef: "6.16",
    },
    {
      question: "The yogī sees the Self in all beings and all beings in the Self.",
      answer: true,
      explanation: "Verse 6.29 — The yogī sees the Self in all beings and all beings in the Self.",
      verseRef: "6.29",
    },
  ];

  // False statements (common misconceptions)
  const falseStatements: TrueFalseQuestion[] = [
    {
      question: "A true sannyāsī is someone who completely stops all actions and sits idle.",
      answer: false,
      explanation: "Verse 6.1 — Krishna says the true sannyāsī is NOT the one who merely gives up action, but one who acts without attachment to results.",
      verseRef: "6.1",
    },
    {
      question: "The mind is easy to control and naturally stays focused.",
      answer: false,
      explanation: "Verse 6.34 — Arjuna himself says the mind is restless and as hard to control as the wind!",
      verseRef: "6.34",
    },
    {
      question: "A yogi should eat as much as possible to have energy for meditation.",
      answer: false,
      explanation: "Verse 6.16 — Yoga is NOT for one who eats too much. Moderation in food is essential.",
      verseRef: "6.16",
    },
    {
      question: "One who has not conquered the mind has the mind as a best friend.",
      answer: false,
      explanation: "Verse 6.6 — For one who has NOT conquered the mind, the mind acts as an enemy, not a friend.",
      verseRef: "6.6",
    },
    {
      question: "The yogī should sit on a very high, soft, luxurious seat for meditation.",
      answer: false,
      explanation: "Verse 6.11 — The seat should be neither too high nor too low, and steady — not luxurious.",
      verseRef: "6.11",
    },
    {
      question: "A yogī who sees the Self in all beings will feel hatred toward enemies.",
      answer: false,
      explanation: "Verse 6.29-32 — A yogī sees all beings equally, with no hatred. They see the Self everywhere.",
      verseRef: "6.29",
    },
  ];

  // Mix true and false
  const mixed = shuffle([...trueStatements.slice(0, 6), ...falseStatements.slice(0, 4)]);
  return mixed.slice(0, 10);
}

// Quiz questions
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  verseRef: string;
  emoji: string;
}

export function generateQuizQuestions(): QuizQuestion[] {
  const allQuestions: QuizQuestion[] = [
    {
      question: "According to Verse 6.1, who is the TRUE sannyāsī (renunciant)?",
      options: [
        "One who gives up all actions and sits idle",
        "One who acts without depending on the results",
        "One who gives up eating and sleeping",
        "One who lives alone in a forest",
      ],
      correctIndex: 1,
      explanation: "Krishna says the true sannyāsī is one who performs duties WITHOUT depending on results — not one who merely stops acting.",
      verseRef: "6.1",
      emoji: "🧘",
    },
    {
      question: "In Verse 6.5, what does Krishna say about self-improvement?",
      options: [
        "Ask your guru to uplift you",
        "Pray to God to improve you",
        "Uplift yourself by yourself",
        "Wait for good karma to help you",
      ],
      correctIndex: 2,
      explanation: "'Uddhared ātmanā ātmānam' — One should uplift oneself by oneself. You are your own best helper!",
      verseRef: "6.5",
      emoji: "💪",
    },
    {
      question: "What is the mind compared to in Verse 6.19?",
      options: [
        "A river flowing fast",
        "A lamp in a windless place",
        "A bird in the sky",
        "A stone in water",
      ],
      correctIndex: 1,
      explanation: "A focused yogī's mind is like a lamp in a windless place — it does not flicker or waver!",
      verseRef: "6.19",
      emoji: "🪔",
    },
    {
      question: "In Verse 6.34, what does Arjuna say about the mind?",
      options: [
        "The mind is peaceful and easy to control",
        "The mind is restless, turbulent, strong, and stubborn",
        "The mind is like a sleeping child",
        "The mind is always focused on God",
      ],
      correctIndex: 1,
      explanation: "Arjuna honestly admits: the mind is chañcalam (restless), pramāthi (turbulent), balavat (strong), and dṛḍham (stubborn)!",
      verseRef: "6.34",
      emoji: "🌪️",
    },
    {
      question: "According to Verse 6.6, when does the mind become your ENEMY?",
      options: [
        "When you eat too much",
        "When you sleep too long",
        "When you have not conquered it",
        "When you meditate too little",
      ],
      correctIndex: 2,
      explanation: "For one who has NOT conquered the mind, the mind acts as an enemy. But for one who HAS conquered it, the mind is the best friend!",
      verseRef: "6.6",
      emoji: "⚔️",
    },
    {
      question: "What does Verse 6.16 say about food for a yogī?",
      options: [
        "Eat as much as possible for energy",
        "Fast completely for spiritual power",
        "Eat in moderation — not too much or too little",
        "Only eat fruits and milk",
      ],
      correctIndex: 2,
      explanation: "Yoga is NOT for one who eats too much or too little. Moderation (yukta) in food is the key!",
      verseRef: "6.16",
      emoji: "🍎",
    },
    {
      question: "What does the yogī see in ALL beings according to Verse 6.29?",
      options: [
        "Enemies and friends",
        "The Self (Ātman) everywhere",
        "Good and bad people",
        "Rich and poor people",
      ],
      correctIndex: 1,
      explanation: "The yogī sees the Self in all beings and all beings in the Self — complete oneness and equality!",
      verseRef: "6.29",
      emoji: "🌍",
    },
    {
      question: "In Verse 6.10, where should a yogī practice meditation?",
      options: [
        "In a busy marketplace",
        "In a crowded temple",
        "In solitude, in a clean place",
        "On top of a mountain only",
      ],
      correctIndex: 2,
      explanation: "A yogī should stay in solitude (rahasi), alone, with a controlled mind and body — in a clean, quiet place.",
      verseRef: "6.10",
      emoji: "🌿",
    },
    {
      question: "What is the supreme happiness described in Verse 6.21?",
      options: [
        "Winning a battle",
        "Getting lots of gold",
        "Happiness beyond the senses, understood by the intellect",
        "Eating delicious food",
      ],
      correctIndex: 2,
      explanation: "The supreme happiness is 'ātyantikaṃ sukham' — unconditional, beyond the senses, grasped by the intellect alone!",
      verseRef: "6.21",
      emoji: "✨",
    },
    {
      question: "According to Verse 6.25, how should one withdraw the mind?",
      options: [
        "All at once, with great force",
        "Gradually, step by step, with a firm intellect",
        "By sleeping more",
        "By stopping all thoughts immediately",
      ],
      correctIndex: 1,
      explanation: "'Śanaiḥ śanaiḥ' — gradually, step by step! The mind is withdrawn slowly with a firm, patient intellect.",
      verseRef: "6.25",
      emoji: "🐢",
    },
  ];

  return shuffle(allQuestions).slice(0, 8);
}

// Fill in the blank questions
export interface FillBlankQuestion {
  beforeBlank: string;
  blank: string;
  afterBlank: string;
  options: string[];
  correctIndex: number;
  fullVerse: string;
  meaning: string;
  verseRef: string;
}

export function generateFillBlankQuestions(): FillBlankQuestion[] {
  const questions: FillBlankQuestion[] = [
    {
      beforeBlank: "anāśritaḥ karma-phalaṃ kāryaṃ karma karoti yaḥ | sa",
      blank: "sannyāsī",
      afterBlank: "ca yogī ca na niragnir na cākriyaḥ ||",
      options: ["sannyāsī", "bhakta", "jñānī", "rājā"],
      correctIndex: 0,
      fullVerse: "anāśritaḥ karma-phalaṃ kāryaṃ karma karoti yaḥ | sa sannyāsī ca yogī ca...",
      meaning: "One who acts without depending on results is the true sannyāsī and yogī.",
      verseRef: "6.1",
    },
    {
      beforeBlank: "uddhared ātmanā",
      blank: "ātmānam",
      afterBlank: "nātmānam avasādayet |",
      options: ["ātmānam", "manaḥ", "deham", "buddhi"],
      correctIndex: 0,
      fullVerse: "uddhared ātmanā ātmānam nātmānam avasādayet",
      meaning: "One should uplift oneself by oneself, not degrade oneself.",
      verseRef: "6.5",
    },
    {
      beforeBlank: "yathā dīpo nivātastho",
      blank: "neṅgate",
      afterBlank: "sopamā smṛtā | yogino yata-cittasya...",
      options: ["neṅgate", "jvalati", "paśyati", "carati"],
      correctIndex: 0,
      fullVerse: "yathā dīpo nivātastho neṅgate sopamā smṛtā",
      meaning: "Just as a lamp in a windless place does not flicker — that is the mind of a yogī.",
      verseRef: "6.19",
    },
    {
      beforeBlank: "śanaiḥ śanair uparamed",
      blank: "buddhyā",
      afterBlank: "dhṛti-gṛhītayā |",
      options: ["buddhyā", "bhaktyā", "karmāṇā", "yogena"],
      correctIndex: 0,
      fullVerse: "śanaiḥ śanair uparamed buddhyā dhṛti-gṛhītayā",
      meaning: "Gradually, step by step, one should withdraw the mind with a firm intellect.",
      verseRef: "6.25",
    },
    {
      beforeBlank: "sarva-bhūta-stham ātmānaṃ sarva-bhūtāni",
      blank: "cātmani",
      afterBlank: "| īkṣate yoga-yuktātmā...",
      options: ["cātmani", "ca deham", "ca manaḥ", "ca prāṇam"],
      correctIndex: 0,
      fullVerse: "sarva-bhūta-stham ātmānaṃ sarva-bhūtāni cātmani | īkṣate yoga-yuktātmā",
      meaning: "The yogī sees the Self in all beings and all beings in the Self.",
      verseRef: "6.29",
    },
    {
      beforeBlank: "nāty-aśnatas tu yogo 'sti na caikāntam",
      blank: "anaśnataḥ",
      afterBlank: "| na cāti-svapna-śīlasya...",
      options: ["anaśnataḥ", "bhuñjataḥ", "svapataḥ", "carantaḥ"],
      correctIndex: 0,
      fullVerse: "nāty-aśnatas tu yogo 'sti na caikāntam anaśnataḥ",
      meaning: "Yoga is not for one who eats too much or too little.",
      verseRef: "6.16",
    },
  ];

  return shuffle(questions);
}

// Word scramble data
export interface ScrambleWord {
  scrambled: string;
  correct: string;
  hint: string;
  meaning: string;
  verseRef: string;
}

export function generateScrambleWords(): ScrambleWord[] {
  const words: ScrambleWord[] = [
    { scrambled: "ANASRITH", correct: "ANASRITAH", hint: "Not depending on...", meaning: "Without depending (on results)", verseRef: "6.1" },
    { scrambled: "YOGNIYU", correct: "YOGINAM", hint: "Plural of yogī", meaning: "Of the yogīs", verseRef: "6.10" },
    { scrambled: "DHRANAM", correct: "DHYANAM", hint: "Meditation practice", meaning: "Meditation / Dhyāna", verseRef: "6.12" },
    { scrambled: "AMTNA", correct: "ATMAN", hint: "The inner Self", meaning: "The Self / Soul", verseRef: "6.5" },
    { scrambled: "BUDDYHA", correct: "BUDDHYA", hint: "With the intellect", meaning: "By/with the intellect", verseRef: "6.25" },
    { scrambled: "HCNACALM", correct: "CHANCHALAM", hint: "Restless, wandering", meaning: "Restless (mind)", verseRef: "6.34" },
    { scrambled: "SHANITAP", correct: "PRASANTAM", hint: "Peaceful, calm", meaning: "Peaceful / Calm", verseRef: "6.27" },
    { scrambled: "MUKHSA", correct: "SUKHAM", hint: "Joy and happiness", meaning: "Happiness / Joy", verseRef: "6.21" },
    { scrambled: "MANAHS", correct: "MANAH", hint: "The thinking mind", meaning: "The mind", verseRef: "6.34" },
    { scrambled: "YOAGM", correct: "YOGAM", hint: "Union, discipline", meaning: "Yoga / Union", verseRef: "6.2" },
  ];

  return shuffle(words);
}

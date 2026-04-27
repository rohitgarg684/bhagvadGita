# CLAUDE.md — Bhagavad Gita App Instructions

## Project Overview

This is a **Bhagavad Gita Interactive Learning App** — a full-stack React + Express web app (Vite, TypeScript, Firebase). All verse content lives in a single JSON file:

```
client/src/data/gitaData.json
```

TypeScript types for the data are in:

```
client/src/types/gita.ts
```

The UI that renders verse content is in:

```
client/src/pages/VersePage.tsx
```

## Your Task

**Populate the next verse with rich content, following the Chapter 12 Verse 1 gold standard.**

The app currently has 18 chapters with sparse `key_verses` (basic fields only). Chapter 12 Verse 1 is the only verse with the full rich content structure. Your job is to create the same depth of content for the next verse.

### How to determine which verse to work on

1. Open `client/src/data/gitaData.json`
2. Look through the `chapters` array and the `chapter6_full` array
3. Find the next verse that is MISSING these rich fields: `meaning_detail`, `kids_content`, `detailed_meaning`, `more_stories`, `rich_grammar`
4. If the user specifies a verse (e.g., "do 12.2"), work on that one instead
5. Chapter 6 verses already have `full_journey_text` and `grammar_notes` — these need to be CONVERTED to the rich format (see below)

## Content Schema — The Gold Standard

Every fully populated verse MUST have ALL of these fields. Use Chapter 12 Verse 1 (lines ~326-401 in gitaData.json) as your reference.

### Required Fields

```typescript
{
  "verse": number,              // verse number
  "chapter": number,            // chapter number
  "title": string,              // short evocative title (e.g., "The Question of Two Paths")
  "sanskrit": string,           // Devanagari text with verse number (e.g., "॥12.1॥")
  "transliteration": string,    // IAST transliteration with diacritics
  "one_line_meaning": string,   // single sentence English meaning
  "concise_journey": string,    // 2-3 sentence summary paragraph
  "meaning_detail": string,     // 2-4 paragraphs of detailed explanation (use \n\n between paragraphs)
  "story": string,              // a story from Mahabharata/Ramayana/Puranas illustrating the verse (3-5 paragraphs)
  "real_life_example": string,  // modern life application (2-3 paragraphs)
  "reflection": string,         // 2-3 contemplation questions (separated by \n)
  "kids_content": {
    "explanation_script": string,  // explain to a 6-10 year old (simple, friendly)
    "story": string,               // a simple parable/story a child can understand
    "reflection": string           // 2-3 questions for kids (separated by \n)
  },
  "detailed_meaning": string,   // step-by-step breakdown (Step 1, Step 2, etc.)
  "more_stories": string,       // 2-3 numbered stories: "1. Story Title\nBody...\n\n2. Story Title\nBody..."
  "rich_grammar": {
    "padacchedah": string,       // word separation in Devanagari
    "pratipadarthah": string,    // word meanings: "word1 = meaning1 | word2 = meaning2 | ..."
    "anvayah": string,           // prose order reconstruction in Devanagari
    "sandhi": string,            // sandhi analysis: "word1 + word2 → combined | ..." (pipe-separated)
    "samasa": string,            // compound word analysis (pipe-separated)
    "other": string              // other grammar notes (pipe-separated)
  },
  "final_takeaway": string      // 2-3 sentence takeaway
}
```

### Optional Fields (add when applicable)

```typescript
{
  "audio_url": string,          // only if audio file exists in Firebase Storage
  "images": { ... }             // only if images exist — DO NOT fabricate image URLs
}
```

### Important Rules for Images

- **DO NOT** create or fabricate image URLs
- **DO NOT** add the `images` field unless real images already exist
- Images are uploaded separately by the admin through the app's UI
- Leave the `images` field out entirely for new verses

## Content Quality Guidelines

### Sanskrit & Transliteration
- Sanskrit MUST be accurate Devanagari with proper verse numbering (e.g., `॥12.2॥`)
- IAST transliteration MUST use proper diacritical marks: ā, ī, ū, ṛ, ṭ, ḍ, ṇ, ś, ṣ, ṁ, ḥ
- Use `|` for half-verse break and `||` for full verse break in transliteration

### meaning_detail
- 2-4 substantive paragraphs separated by `\n\n`
- Explain the philosophical context, what Arjuna/Krishna is saying, and why it matters
- Reference previous chapters/verses for continuity

### story
- Use authentic stories from Mahabharata, Ramayana, Puranas, or Upanishads
- 3-5 paragraphs with narrative flow
- End with connection to the verse's teaching

### real_life_example
- Modern, relatable scenario (school, work, family, daily life)
- Show how the verse's teaching applies practically
- 2-3 paragraphs

### kids_content
- `explanation_script`: talk directly to the child ("You know how..."), use simple words
- `story`: a simple parable with concrete imagery (animals, children, everyday objects)
- `reflection`: 2-3 simple questions a child can think about

### detailed_meaning
- Format: "Step 1 — Topic (Sanskrit phrase):\nExplanation...\n\nStep 2 — ..."
- 4-6 steps breaking down each part of the verse
- Include Sanskrit terms with English explanations

### more_stories
- Format: "1. Story Title\nStory body...\n\n2. Story Title\nStory body..."
- 2-3 stories from different traditions (Panchatantra, saints' lives, Upanishadic insights)
- Each story should illustrate the verse from a different angle

### rich_grammar
- `padacchedah`: split compound words, show each word separately in Devanagari
- `pratipadarthah`: pipe-separated word-by-word meanings: `"word = meaning | word = meaning"`
- `anvayah`: reconstruct the verse in prose word order (Devanagari)
- `sandhi`: show phonetic combinations: `"word + word → combined"` (pipe-separated)
- `samasa`: identify compound types: `"compound → type"` (pipe-separated)
- `other`: verb forms, participles, etc. (pipe-separated)

## How to Edit gitaData.json

1. **Find the target verse** in the `chapters[].key_verses[]` array (or `chapter6_full[]`)
2. **If the verse exists** with basic fields, REPLACE it with the full rich version
3. **If the verse doesn't exist** as a key_verse, ADD it to the appropriate chapter's `key_verses` array in verse-number order
4. **Preserve all other data** — do not modify any other verses or chapters
5. **Validate JSON** — ensure the file is valid JSON after editing

### For Chapter 6 Conversion

Chapter 6 verses already have `full_journey_text` and `grammar_notes` as flat text. When enriching these:
- Keep `full_journey_text` as-is (the UI renders it)
- ALSO add the new rich fields (`meaning_detail`, `kids_content`, `detailed_meaning`, `more_stories`, `rich_grammar`)
- Convert `grammar_notes` content into the structured `rich_grammar` format
- The `rich_grammar` structured format takes precedence in the UI over `grammar_notes`

## Reference Sources for Content

Use these authoritative sources for Bhagavad Gita content:
- Swami Paramarthananda's commentaries (Advaita Vedanta tradition)
- Adi Shankaracharya's Bhashya
- Swami Mukundananda's commentary (holy-bhagavad-gita.org)
- Swami Chinmayananda's commentary
- Mahabharata stories from Vyasa's original text

## Build & Verify

After editing `gitaData.json`:

```bash
cd /Users/rohitgarg/Documents/GitHub/bhagvadGita
npm run build
```

This ensures the JSON is valid and the TypeScript types are satisfied. Fix any build errors before committing.

## Commit Convention

```
Add rich content for Chapter X Verse Y

Populate verse X.Y with detailed meaning, stories, kids content,
grammar analysis, and reflection following the Ch12.1 template.
```

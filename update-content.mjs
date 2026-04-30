import fs from 'fs';

const CONTENT_DIR = './content/ch12';
const DATA_PATH = './client/src/data/gitaData.json';

function parseDoc(text) {
  const result = {};
  const lines = text.replace(/\r/g, '').split('\n');

  function findSection(startPattern, endPatterns) {
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().match(startPattern)) { start = i + 1; break; }
    }
    if (start === -1) return '';
    let end = lines.length;
    for (const ep of endPatterns) {
      for (let i = start; i < lines.length; i++) {
        if (lines[i].trim().match(ep)) { end = Math.min(end, i); break; }
      }
    }
    return lines.slice(start, end).join('\n').trim();
  }

  // 1. Shloka — split into sanskrit (Devanagari) and transliteration (IAST)
  const shlokaBlock = findSection(/^1\.\s*Shloka/, [/^2\.\s*One-Line Meaning/]);
  if (shlokaBlock) {
    const sLines = shlokaBlock.split('\n').filter(l => l.trim());
    const devanagari = [];
    const iast = [];
    let pastDevanagari = false;
    for (const line of sLines) {
      const hasLatin = /[a-zA-Z]/.test(line);
      const hasDevanagari = /[\u0900-\u097F]/.test(line);
      if (!pastDevanagari && hasDevanagari && !hasLatin) {
        devanagari.push(line.trim());
      } else if (hasLatin) {
        pastDevanagari = true;
        iast.push(line.trim());
      } else if (pastDevanagari) {
        iast.push(line.trim());
      } else {
        devanagari.push(line.trim());
      }
    }
    result.sanskrit = devanagari.join('\n');
    result.transliteration = iast.join('\n');
  }

  // 2. One-Line Meaning
  result.one_line_meaning = findSection(/^2\.\s*One-Line Meaning/, [/^3\.\s*Meaning/]);

  // 3. Meaning -> meaning_detail
  result.meaning_detail = findSection(/^3\.\s*Meaning/, [/^4\.\s*Story/]);

  // 4. Story
  result.story = findSection(/^4\.\s*Story/, [/^5\.\s*Impact/]);

  // 5. Impact -> real_life_example
  result.real_life_example = findSection(/^5\.\s*Impact/, [/^6\.\s*Reflection/]);

  // 6. Reflection
  result.reflection = findSection(/^6\.\s*Reflection/, [/^7\.\s*How to Teach/]).split('\n').filter(l => l.trim()).join('\n');

  // 7. Kids content
  const kidsExpl = findSection(/^7A\.\s*Explanation Script/, [/^7B\.\s*Story/]);
  const kidsStory = findSection(/^7B\.\s*Story/, [/^7C\.\s*Kid/]);
  const kidsRefl = findSection(/^7C\.\s*Kid/, [/^8\.\s*Detailed/]);
  result.kids_content = {
    explanation_script: kidsExpl,
    story: kidsStory,
    reflection: kidsRefl.split('\n').filter(l => l.trim()).join('\n')
  };

  // 8. Detailed Meaning
  result.detailed_meaning = findSection(/^8\.\s*Detailed Meaning/, [/^9\.\s*Samskritam/]);

  // 9. Grammar
  const rg = {};
  rg.padacchedah = findSection(/^9A\.\s*Padacchedaḥ/, [/^9B\./]);
  
  const pratiRaw = findSection(/^9B\.\s*Prati-padārthaḥ/, [/^9C\./]);
  if (pratiRaw) {
    rg.pratipadarthah = pratiRaw.split('\n').filter(l => l.trim() && l.includes('=')).map(l => l.trim()).join(' | ');
  }

  // 9C. Padaparicayah table — two formats: tab-per-line or space-separated-on-one-line
  const padaRaw = findSection(/^9C\.\s*Padaparicayaḥ/, [/^9D\./]);
  if (padaRaw) {
    const pLines = padaRaw.split('\n');
    // Skip header lines
    let dataStart = 0;
    for (let i = 0; i < pLines.length; i++) {
      if (pLines[i].trim().match(/^Lakāra/i)) { dataStart = i + 1; break; }
    }
    if (dataStart === 0) {
      // Try alternate header: single line "Word Anta Liṅga..."
      for (let i = 0; i < pLines.length; i++) {
        if (pLines[i].trim().match(/^Word\s+Anta/i)) { dataStart = i + 1; break; }
      }
    }
    
    const dataLines = pLines.slice(dataStart).filter(l => l.trim());
    const fields = ['word', 'anta', 'linga', 'vibhakti', 'vacanam', 'type', 'dhatu', 'lakara'];
    const rows = [];
    
    // Detect format: if most lines start with tab, it's tab-per-line format
    const tabLines = dataLines.filter(l => l.startsWith('\t'));
    const isTabFormat = tabLines.length > dataLines.length * 0.5;
    
    if (isTabFormat) {
      let currentRow = {};
      let fieldIdx = 0;
      for (const line of dataLines) {
        const val = line.replace(/^\t+/, '').trim();
        if (!val) continue;
        const cleanVal = val === '—' ? '' : val;
        if (fieldIdx === 0) {
          if (currentRow.word) rows.push(currentRow);
          currentRow = {};
        }
        currentRow[fields[fieldIdx]] = cleanVal;
        fieldIdx++;
        if (fieldIdx >= 8) fieldIdx = 0;
      }
      if (currentRow.word) rows.push(currentRow);
    } else {
      // Space-separated columns on single lines — split from right since last 7 fields are single tokens
      for (const rawLine of dataLines) {
        const line = rawLine.replace(/\r/g, '').trim();
        if (!line) continue;
        // Split by spaces, then recombine: last 7 tokens are fields 2-8, everything before is the word
        const tokens = line.split(/\s+/);
        if (tokens.length < 8) continue;
        // Take last 7 tokens as anta..lakara, rest joined as word
        const word = tokens.slice(0, tokens.length - 7).join(' ');
        const rest = tokens.slice(tokens.length - 7);
        const row = { word: word === '—' ? '' : word };
        const restFields = ['anta', 'linga', 'vibhakti', 'vacanam', 'type', 'dhatu', 'lakara'];
        for (let j = 0; j < 7; j++) {
          const v = (rest[j] || '').trim();
          row[restFields[j]] = v === '—' ? '' : v;
        }
        rows.push(row);
      }
    }
    
    rg.padaparicayah = rows;
  }

  rg.anvayah = findSection(/^9D\.\s*Anvayaḥ/, [/^9E\./]);
  
  const sandhiRaw = findSection(/^9E\.\s*Sandhi/, [/^9F\./]);
  if (sandhiRaw) rg.sandhi = sandhiRaw.split('\n').filter(l => l.trim()).map(l => l.trim()).join(' | ');
  
  const samasaRaw = findSection(/^9F\.\s*Samāsa/, [/^9G\./]);
  if (samasaRaw) rg.samasa = samasaRaw.split('\n').filter(l => l.trim()).map(l => l.trim()).join(' | ');
  
  const otherRaw = findSection(/^9G\.\s*Other/, [/^10\.\s*More Stories/, /Section 10:\s*More Stories/]);
  if (otherRaw) rg.other = otherRaw.split('\n').filter(l => l.trim()).map(l => l.trim()).join(' | ');
  
  result.rich_grammar = rg;

  // 10. More Stories — handle variant headers like "12.12 Section 10: More Stories"
  let moreStories = findSection(/^10\.\s*More Stories|Section 10:\s*More Stories/, [/^If you want/]);
  if (moreStories) {
    // Strip image prompt blocks that appear at the end
    moreStories = moreStories.replace(/\nImage Prompts[\s\S]*$/, '');
    // Strip stray Image/Prompt/Section metadata lines
    moreStories = moreStories.split('\n')
      .filter(l => !l.trim().match(/^Image \d+$/) && !l.trim().startsWith('Prompt:') && !l.trim().startsWith('Section:'))
      .join('\n').trim();
  }
  result.more_stories = moreStories;

  // Strip image prompt metadata from all text fields
  function cleanImagePrompts(text) {
    if (!text) return text;
    return text.replace(/\nImage Prompts[\s\S]*$/, '')
      .split('\n')
      .filter(l => !l.trim().match(/^Image \d+$/) && !l.trim().startsWith('Prompt:') && !l.trim().startsWith('Section:'))
      .join('\n').trim();
  }
  for (const key of ['meaning_detail', 'story', 'real_life_example', 'detailed_meaning']) {
    if (result[key]) result[key] = cleanImagePrompts(result[key]);
  }
  if (result.kids_content) {
    result.kids_content.explanation_script = cleanImagePrompts(result.kids_content.explanation_script);
    result.kids_content.story = cleanImagePrompts(result.kids_content.story);
  }

  // concise_journey from first 2-3 sentences of meaning_detail
  if (result.meaning_detail) {
    const sentences = result.meaning_detail.match(/[^.!?]+[.!?]+/g) || [];
    result.concise_journey = sentences.slice(0, 3).join('').trim();
  }

  return result;
}

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const ch12 = data.chapters.find(c => c.chapter === 12);

let updated = 0;
for (let v = 1; v <= 20; v++) {
  const filePath = `${CONTENT_DIR}/12.${v}.txt`;
  if (!fs.existsSync(filePath)) { console.log(`SKIP: ${filePath} not found`); continue; }
  
  const text = fs.readFileSync(filePath, 'utf8');
  const parsed = parseDoc(text);
  
  const verse = ch12.key_verses.find(kv => kv.verse === v);
  if (!verse) { console.log(`SKIP: verse ${v} not in key_verses`); continue; }
  
  // Preserve fields
  const preserveImages = verse.images;
  const preserveAudio = verse.audio_url;
  const preserveChapter = verse.chapter;
  const preserveVerse = verse.verse;
  const preserveTitle = verse.title;
  
  // Update content fields
  if (parsed.sanskrit) verse.sanskrit = parsed.sanskrit;
  if (parsed.transliteration) verse.transliteration = parsed.transliteration;
  if (parsed.one_line_meaning) verse.one_line_meaning = parsed.one_line_meaning;
  if (parsed.meaning_detail) verse.meaning_detail = parsed.meaning_detail;
  if (parsed.story) verse.story = parsed.story;
  if (parsed.real_life_example) verse.real_life_example = parsed.real_life_example;
  if (parsed.reflection) verse.reflection = parsed.reflection;
  if (parsed.kids_content && parsed.kids_content.explanation_script) verse.kids_content = parsed.kids_content;
  if (parsed.detailed_meaning) verse.detailed_meaning = parsed.detailed_meaning;
  if (parsed.more_stories) verse.more_stories = parsed.more_stories;
  if (parsed.rich_grammar && parsed.rich_grammar.padacchedah) verse.rich_grammar = parsed.rich_grammar;
  if (parsed.concise_journey) verse.concise_journey = parsed.concise_journey;
  
  // Restore preserved fields
  verse.images = preserveImages;
  verse.audio_url = preserveAudio;
  verse.chapter = preserveChapter;
  verse.verse = preserveVerse;
  verse.title = preserveTitle;
  
  updated++;
  const padaCount = parsed.rich_grammar?.padaparicayah?.length || 0;
  console.log(`OK: 12.${v} — meaning:${parsed.meaning_detail?.length || 0}c story:${parsed.story?.length || 0}c pada:${padaCount}rows`);
}

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
console.log(`\nDone. Updated ${updated}/20 verses.`);

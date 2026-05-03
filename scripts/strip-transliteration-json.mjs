#!/usr/bin/env node
/**
 * One-time / maintenance: strip trailing ॥chapter.verse from transliteration in gitaData.json.
 * Run from repo root: node scripts/strip-transliteration-json.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../client/src/data/gitaData.json");

function strip(text) {
  return text
    .split("\n")
    .map((line) => {
      let s = line.replace(/\s+$/u, "");
      s = s.replace(/\d+\.\d+॥\s*$/u, "");
      s = s.replace(/\s+\d+\.\d+\s*॥\s*$/u, "");
      return s;
    })
    .join("\n");
}

const raw = fs.readFileSync(jsonPath, "utf8");
const data = JSON.parse(raw);
let n = 0;

for (const ch of data.chapters || []) {
  for (const v of ch.key_verses || []) {
    if (typeof v.transliteration === "string") {
      const next = strip(v.transliteration);
      if (next !== v.transliteration) {
        v.transliteration = next;
        n++;
      }
    }
  }
}

for (const v of data.chapter6_full || []) {
  if (typeof v.transliteration === "string") {
    const next = strip(v.transliteration);
    if (next !== v.transliteration) {
      v.transliteration = next;
      n++;
    }
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("Updated transliteration fields:", n);

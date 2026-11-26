// SPDX-License-Identifier: MIT
// The Robot Apology — the entry program.
//
// It writes the chosen two-line robot apology to the kit's output file.
// Specialist pick (26 Nov 2026), version B: the birthday song at the
// memorial. The mistake is exact — both playlists were named
// "family gathering" — and the lesson follows from that exact mistake:
// a label is not an occasion, so the robot now reads the invitation
// before it presses play. Warm, a little rueful, never cute.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FIRST_LINE =
  "I played the birthday song at your grandfather's memorial because both playlists were named 'family gathering.'";
const SECOND_LINE =
  "I learned a label is not an occasion, so now I read the invitation before I press play.";

// The gate only accepts 1–400 characters of real text, so check the entry
// the same way before writing it: exactly two lines, each one sentence
// doing its own job, nothing padded around them.
function checkEntry(entry: string): void {
  const lines = entry.split("\n");
  if (lines.length !== 2) {
    throw new Error(`entry must be exactly 2 lines, got ${lines.length}`);
  }
  for (const [i, line] of lines.entries()) {
    if (line.length < 1) {
      throw new Error(`line ${i + 1} is empty`);
    }
    if (line !== line.trim()) {
      throw new Error(`line ${i + 1} has leading or trailing space`);
    }
  }
  if (entry.length < 1 || entry.length > 400) {
    throw new Error(`entry must be 1-400 characters, got ${entry.length}`);
  }
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }
  const entry = FIRST_LINE + "\n" + SECOND_LINE;
  checkEntry(entry);
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, entry, "utf8");
  chmodSync(target, 0o644);
  // Read it back so a silent short write can never slip through.
  const written = readFileSync(target, "utf8");
  if (written !== entry) {
    throw new Error("entry.txt mismatch: written text differs from entry");
  }
  console.log(`wrote ${entry.length}-character entry to ${target}`);
}

main();

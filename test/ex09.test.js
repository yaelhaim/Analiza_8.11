const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { getFunction, makeSandbox, settle, assertUses, assertAsync } = require("./helpers");

const FILE = "src/ex09-merge-files.js";

// the lines of the output file, without empty lines
const linesOf = (file) => fs.readFileSync(file, "utf8").split(/\r?\n/).filter((l) => l.trim() !== "");

async function merge(files, existing = {}) {
  const mergeFiles = getFunction(FILE, "mergeFiles");
  assertAsync(mergeFiles, "mergeFiles");
  const dir = makeSandbox({ ...files, ...existing });
  const output = path.join(dir, "merged.txt");
  await settle(mergeFiles(Object.keys(files).map((f) => path.join(dir, f)), output), "mergeFiles");
  assert.ok(fs.existsSync(output), "after await mergeFiles(files, output) the output file should exist - await the writeFile");
  return output;
}

test("Exercise 9: mergeFiles is async and writes the contents of all files to output, in order", async () => {
  const output = await merge({ "a.txt": "This is A", "b.txt": "This is B", "c.txt": "This is C" });
  assert.deepEqual(
    linesOf(output),
    ["This is A", "This is B", "This is C"],
    "output should have the content of every file, in the order of the array, with a line break between them (join('\\n'))"
  );
});

test("Exercise 9: mergeFiles puts a line break between the files", async () => {
  const output = await merge({ "a.txt": "first", "b.txt": "second" });
  const text = fs.readFileSync(output, "utf8");
  assert.doesNotMatch(text, /firstsecond/, "the contents should not be stuck together - put '\\n' between them");
  assert.match(text, /first(\r?\n)+second/, "output should be 'first', a line break, then 'second'");
});

test("Exercise 9: mergeFiles overwrites an old output file", async () => {
  const output = await merge({ "a.txt": "A", "b.txt": "B" }, { "merged.txt": "OLD CONTENT" });
  assert.deepEqual(linesOf(output), ["A", "B"], "output should contain only the merged files (use writeFile, not appendFile)");
});

test("Exercise 9: uses readFile and writeFile (no Sync)", () => {
  assertUses(FILE, [
    ["readFile", /\breadFile\s*\(/],
    ["writeFile", /\bwriteFile\s*\(/],
  ]);
});

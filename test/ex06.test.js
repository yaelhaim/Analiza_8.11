const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { getFunction, makeSandbox, settle, captureConsoleAsync, trackReads, assertUses, assertAsync } = require("./helpers");

const FILE = "src/ex06-read-files-parallel.js";

function setup() {
  const dir = makeSandbox({ "a.txt": "content of A", "b.txt": "content of B", "c.txt": "content of C" });
  return ["a.txt", "b.txt", "c.txt"].map((f) => path.join(dir, f));
}

test("Exercise 6: readFilesParallel logs the content of every file", async () => {
  const reads = trackReads({ "a.txt": 30 });
  try {
    const readFilesParallel = getFunction(FILE, "readFilesParallel");
    assertAsync(readFilesParallel, "readFilesParallel");
    const lines = await captureConsoleAsync(() => settle(readFilesParallel(setup()), "readFilesParallel"));
    const out = lines.join("\n");
    for (const c of ["content of A", "content of B", "content of C"]) {
      assert.ok(
        out.includes(c),
        `log the content of every file - '${c}' was not printed before readFilesParallel finished. Printed:\n${out || "(nothing)"}\n` +
          "Remember to await Promise.all(...)."
      );
    }
  } finally {
    reads.restore();
  }
});

test("Exercise 6: readFilesParallel reads all the files at the same time", async () => {
  const reads = trackReads({ "a.txt": 30, "b.txt": 30, "c.txt": 30 });
  try {
    const readFilesParallel = getFunction(FILE, "readFilesParallel");
    assertAsync(readFilesParallel, "readFilesParallel");
    await captureConsoleAsync(() => settle(readFilesParallel(setup()), "readFilesParallel"));
    assert.equal(reads.started.length, 3, "all 3 files should be read");
    assert.equal(
      reads.maxInFlight,
      3,
      "all the reads should start together - build an array of promises (files.map(...)) and await Promise.all(...), without await inside a loop"
    );
  } finally {
    reads.restore();
  }
});

test("Exercise 6: uses Promise.all (no Sync)", () => {
  assertUses(FILE, [["Promise.all", /Promise\.all(Settled)?\s*\(/]]);
});

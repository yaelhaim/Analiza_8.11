const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { getFunction, makeSandbox, settle, captureConsoleAsync, trackReads, assertUses, assertAsync } = require("./helpers");

const FILE = "src/ex05-read-files-in-order.js";

function setup() {
  const dir = makeSandbox({ "a.txt": "content of A", "b.txt": "content of B", "c.txt": "content of C" });
  return ["a.txt", "b.txt", "c.txt"].map((f) => path.join(dir, f));
}

test("Exercise 5: readFilesInOrder logs the content of every file, in order", async () => {
  // the first file is the slowest, so code that does not wait for each read prints in the wrong order
  const reads = trackReads({ "a.txt": 80, "b.txt": 40, "c.txt": 5 });
  try {
    const readFilesInOrder = getFunction(FILE, "readFilesInOrder");
    assertAsync(readFilesInOrder, "readFilesInOrder");
    const lines = await captureConsoleAsync(() => settle(readFilesInOrder(setup()), "readFilesInOrder"));
    const out = lines.join("\n");
    const positions = ["content of A", "content of B", "content of C"].map((c) => out.indexOf(c));
    assert.ok(
      positions.every((p) => p !== -1),
      `log the content of every file (console.log). Printed before readFilesInOrder finished:\n${out || "(nothing)"}\n` +
        "If something is missing: use for...of with await, not forEach (forEach does not wait)."
    );
    assert.ok(
      positions[0] < positions[1] && positions[1] < positions[2],
      `the contents should be printed in the order of the array: A, B, C. Printed:\n${out}`
    );
  } finally {
    reads.restore();
  }
});

test("Exercise 5: readFilesInOrder reads one file at a time (waits for each read)", async () => {
  const reads = trackReads({ "a.txt": 40, "b.txt": 20 });
  try {
    const readFilesInOrder = getFunction(FILE, "readFilesInOrder");
    assertAsync(readFilesInOrder, "readFilesInOrder");
    await captureConsoleAsync(() => settle(readFilesInOrder(setup()), "readFilesInOrder"));
    assert.deepEqual(reads.started, ["a.txt", "b.txt", "c.txt"], "all 3 files should be read, in order");
    assert.equal(
      reads.maxInFlight,
      1,
      "a file should start being read only after the previous one finished - await every read inside a for...of loop (not Promise.all, not forEach)"
    );
  } finally {
    reads.restore();
  }
});

test("Exercise 5: uses await (no Sync)", () => {
  assertUses(FILE, [["await", /\bawait\b/]]);
});

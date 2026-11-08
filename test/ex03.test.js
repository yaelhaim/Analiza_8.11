const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { getFunction, makeSandbox, settle, assertUses, assertAsync } = require("./helpers");

const FILE = "src/ex03-get-file-size.js";

test("Exercise 3: getFileSize is async and returns the size in bytes", async () => {
  const getFileSize = getFunction(FILE, "getFileSize");
  assertAsync(getFileSize, "getFileSize");
  const dir = makeSandbox({ "test.txt": "x".repeat(128) });
  const size = await settle(getFileSize(path.join(dir, "test.txt")), "getFileSize");
  assert.equal(size, 128, "a file with 128 characters should have the size 128 - return stats.size");
});

test("Exercise 3: getFileSize returns bytes, not the number of characters", async () => {
  const getFileSize = getFunction(FILE, "getFileSize");
  const dir = makeSandbox({ "hebrew.txt": "שלום" }); // 4 letters, 8 bytes
  const size = await settle(getFileSize(path.join(dir, "hebrew.txt")), "getFileSize");
  assert.equal(size, 8, "'שלום' has 4 letters but takes 8 bytes - use fs.promises.stat and return stats.size");
});

test("Exercise 3: uses fs.promises.stat (no Sync)", () => {
  assertUses(FILE, [
    ["fs.promises (or require('fs/promises'))", /promises/],
    ["stat", /\bstat\s*\(/],
  ]);
});

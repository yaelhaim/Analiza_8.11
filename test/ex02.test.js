const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { getFunction, makeSandbox, settle, assertUses, assertAsync, asText } = require("./helpers");

const FILE = "src/ex02-read-file-async.js";

test("Exercise 2: readFileAsync is async and returns the file content", async () => {
  const readFileAsync = getFunction(FILE, "readFileAsync");
  assertAsync(readFileAsync, "readFileAsync");
  const dir = makeSandbox({ "test.txt": "Hello async/await!" });
  const content = await settle(readFileAsync(path.join(dir, "test.txt")), "readFileAsync");
  assert.equal(asText(content), "Hello async/await!", "readFileAsync should return the content of the file (return await ...)");
});

test("Exercise 2: readFileAsync rejects when the file does not exist", async () => {
  const readFileAsync = getFunction(FILE, "readFileAsync");
  assertAsync(readFileAsync, "readFileAsync");
  const dir = makeSandbox();
  await assert.rejects(
    settle(readFileAsync(path.join(dir, "missing.txt")), "readFileAsync"),
    /ENOENT/,
    "for a missing file the error should reach the caller - don't catch it and return something else"
  );
});

test("Exercise 2: uses fs.promises.readFile (no Sync)", () => {
  assertUses(FILE, [
    ["fs.promises (or require('fs/promises'))", /promises/],
    ["readFile", /\breadFile\s*\(/],
  ]);
});

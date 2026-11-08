const { test } = require("node:test");
const assert = require("node:assert/strict");
const { getFunction, makeSandbox, settle, assertUses, assertAsync } = require("./helpers");

const FILE = "src/ex04-list-files.js";

test("Exercise 4: listFiles is async and returns the names of the files in the folder", async () => {
  const listFiles = getFunction(FILE, "listFiles");
  assertAsync(listFiles, "listFiles");
  const dir = makeSandbox({ "a.txt": "a", "b.txt": "b", "notes.md": "# hi" });
  const names = await settle(listFiles(dir), "listFiles");
  assert.ok(Array.isArray(names), `listFiles should return an array of names, got: ${JSON.stringify(names)}`);
  assert.deepEqual([...names].sort(), ["a.txt", "b.txt", "notes.md"], "listFiles should return all the file names in the folder");
});

test("Exercise 4: listFiles works on the folder it gets, and returns [] for an empty folder", async () => {
  const listFiles = getFunction(FILE, "listFiles");
  const one = await settle(listFiles(makeSandbox({ "only.txt": "a" })), "listFiles");
  assert.deepEqual(one, ["only.txt"], "listFiles should return the names from the folder it gets (not a fixed folder)");
  const empty = await settle(listFiles(makeSandbox()), "listFiles");
  assert.deepEqual(empty, [], "for an empty folder listFiles should return []");
});

test("Exercise 4: uses fs.promises.readdir (no Sync)", () => {
  assertUses(FILE, [
    ["fs.promises (or require('fs/promises'))", /promises/],
    ["readdir", /\breaddir\s*\(/],
  ]);
});

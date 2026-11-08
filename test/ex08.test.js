const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { getFunction, makeSandbox, settle, assertUses, assertAsync, sourceOf } = require("./helpers");

const FILE = "src/ex08-copy-file.js";

test("Exercise 8: copyFile is async and creates dest with the same content as src", async () => {
  const copyFile = getFunction(FILE, "copyFile");
  assertAsync(copyFile, "copyFile");
  const dir = makeSandbox({ "a.txt": "line 1\nline 2\nשלום" });
  const dest = path.join(dir, "copy.txt");
  await settle(copyFile(path.join(dir, "a.txt"), dest), "copyFile");
  assert.ok(fs.existsSync(dest), "after await copyFile(src, dest) the file dest should exist - await the writeFile");
  assert.equal(fs.readFileSync(dest, "utf8"), "line 1\nline 2\nשלום", "dest should have exactly the same content as src");
  assert.equal(fs.readFileSync(path.join(dir, "a.txt"), "utf8"), "line 1\nline 2\nשלום", "src should not change");
});

test("Exercise 8: copyFile replaces the content of an existing dest", async () => {
  const copyFile = getFunction(FILE, "copyFile");
  assertAsync(copyFile, "copyFile");
  const dir = makeSandbox({ "a.txt": "new content", "copy.txt": "old content that is longer" });
  await settle(copyFile(path.join(dir, "a.txt"), path.join(dir, "copy.txt")), "copyFile");
  assert.equal(
    fs.readFileSync(path.join(dir, "copy.txt"), "utf8"),
    "new content",
    "after await copyFile(src, dest), dest should contain only the content of src (await the writeFile, and use writeFile - not appendFile)"
  );
});

test("Exercise 8: uses fs.promises.readFile and fs.promises.writeFile (no Sync, no fs.copyFile)", () => {
  assertUses(FILE, [
    ["fs.promises (or require('fs/promises'))", /promises/],
    ["readFile", /\breadFile\s*\(/],
    ["writeFile", /\bwriteFile\s*\(/],
  ]);
  assert.doesNotMatch(sourceOf(FILE), /\.copyFile\s*\(/, "copy with readFile + writeFile, not with fs.copyFile");
});

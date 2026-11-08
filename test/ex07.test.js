const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { getFunction, makeSandbox, settle, assertUses } = require("./helpers");

const FILE = "src/ex07-file-exists.js";

test("Exercise 7: fileExists resolves to true for a file that exists", async () => {
  const fileExists = getFunction(FILE, "fileExists");
  const dir = makeSandbox({ "test.txt": "hi" });
  const result = fileExists(path.join(dir, "test.txt"));
  assert.ok(result instanceof Promise, "fileExists should return a Promise (new Promise(...) or an async function)");
  assert.equal(await settle(result, "fileExists"), true, "for an existing file the promise should resolve to true");
});

test("Exercise 7: fileExists resolves to false (does not reject) for a missing file", async () => {
  const fileExists = getFunction(FILE, "fileExists");
  const dir = makeSandbox({ "test.txt": "hi" });
  const result = fileExists(path.join(dir, "missing.txt"));
  assert.ok(result instanceof Promise, "fileExists should return a Promise");
  let value;
  try {
    value = await settle(result, "fileExists");
  } catch (err) {
    assert.fail(`for a missing file fileExists should resolve to false, not reject (got: ${err.message})`);
  }
  assert.equal(value, false, "for a missing file the promise should resolve to false");
  assert.equal(await settle(fileExists(path.join(dir, "test.txt")), "fileExists"), true, "for an existing file it should still be true");
});

test("Exercise 7: uses fs.access (no Sync)", () => {
  assertUses(FILE, [["fs.access", /\baccess\s*\(/]]);
});

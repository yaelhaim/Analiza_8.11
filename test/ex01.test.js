const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { getFunction, makeSandbox, settle, assertUses, asText } = require("./helpers");

const FILE = "src/ex01-read-file-promise.js";

test("Exercise 1: readFilePromise returns a Promise that resolves with the file content", async () => {
  const readFilePromise = getFunction(FILE, "readFilePromise");
  const dir = makeSandbox({ "test.txt": "Hello Promise!" });
  const result = readFilePromise(path.join(dir, "test.txt"));
  assert.ok(result instanceof Promise, "readFilePromise should return a Promise: return new Promise((resolve, reject) => { ... })");
  const content = await settle(result, "the promise of readFilePromise");
  assert.equal(asText(content), "Hello Promise!", "the promise should resolve with the file content - call resolve(data)");
});

test("Exercise 1: readFilePromise rejects when the file does not exist", async () => {
  const readFilePromise = getFunction(FILE, "readFilePromise");
  const dir = makeSandbox();
  const result = readFilePromise(path.join(dir, "missing.txt"));
  assert.ok(result instanceof Promise, "readFilePromise should return a Promise");
  let error;
  try {
    await settle(result, "the promise of readFilePromise (for a missing file)");
  } catch (err) {
    error = err;
  }
  assert.ok(error, "for a missing file the promise should be rejected - when fs.readFile gives an error, call reject(err)");
  assert.doesNotMatch(String(error.message), /never finished/, "when fs.readFile gives an error, call reject(err) - right now the promise never finishes");
  assert.equal(error.code, "ENOENT", "reject with the error that fs.readFile gave you: reject(err)");
});

test("Exercise 1: builds the Promise with new Promise and fs.readFile (no Sync)", () => {
  assertUses(FILE, [
    ["new Promise", /new\s+Promise\s*\(/],
    ["fs.readFile", /\breadFile\s*\(/],
  ]);
});

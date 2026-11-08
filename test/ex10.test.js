const { test } = require("node:test");
const assert = require("node:assert/strict");
const { getFunction, makeSandbox, settle, captureConsoleAsync, assertUses, assertAsync } = require("./helpers");

const FILE = "src/ex10-search-word.js";

function setup() {
  return makeSandbox({
    "meeting.txt": "Remember: this meeting is important.",
    "shopping.txt": "milk, bread, eggs",
    "todo.txt": "The most important thing today: finish the exercises!",
    "recipe.txt": "flour, sugar, butter",
  });
}

async function search(word) {
  const searchWordInFiles = getFunction(FILE, "searchWordInFiles");
  assertAsync(searchWordInFiles, "searchWordInFiles");
  const lines = await captureConsoleAsync(() => settle(searchWordInFiles(setup(), word), "searchWordInFiles"));
  return lines.join("\n");
}

test("Exercise 10: searchWordInFiles logs the names of the files that contain the word", async () => {
  const out = await search("important");
  for (const name of ["meeting.txt", "todo.txt"]) {
    assert.ok(
      out.includes(name),
      `'${name}' contains 'important', so its name should be printed (console.log). Printed before searchWordInFiles finished:\n${out || "(nothing)"}`
    );
  }
  for (const name of ["shopping.txt", "recipe.txt"]) {
    assert.ok(!out.includes(name), `'${name}' does not contain 'important', so it should not be printed. Printed:\n${out}`);
  }
});

test("Exercise 10: searchWordInFiles searches for the word it gets", async () => {
  const out = await search("sugar");
  assert.ok(out.includes("recipe.txt"), `searching 'sugar' should print recipe.txt. Printed:\n${out || "(nothing)"}`);
  for (const name of ["meeting.txt", "todo.txt", "shopping.txt"]) {
    assert.ok(!out.includes(name), `searching 'sugar' should not print ${name}. Printed:\n${out}`);
  }
});

test("Exercise 10: prints no file name when no file contains the word", async () => {
  const out = await search("banana");
  const sugar = await search("sugar"); // must fail on an empty function too
  assert.ok(sugar.includes("recipe.txt"), "searching 'sugar' should print recipe.txt");
  assert.ok(!/\.txt/.test(out), `no file contains 'banana', so no file name should be printed. Printed:\n${out}`);
});

test("Exercise 10: uses readdir and readFile (no Sync)", () => {
  assertUses(FILE, [
    ["readdir", /\breaddir\s*\(/],
    ["readFile", /\breadFile\s*\(/],
  ]);
});

// מגרש משחקים: מריצים `node main.js` כדי לראות את הפונקציות שלכן עובדות.
// הטסטים לא משתמשים בקובץ הזה - אפשר לשנות בו מה שרוצות.
const { readFilePromise } = require("./src/ex01-read-file-promise");
const { readFileAsync } = require("./src/ex02-read-file-async");
const { getFileSize } = require("./src/ex03-get-file-size");
const { listFiles } = require("./src/ex04-list-files");
const { readFilesInOrder } = require("./src/ex05-read-files-in-order");
const { readFilesParallel } = require("./src/ex06-read-files-parallel");
const { fileExists } = require("./src/ex07-file-exists");
const { copyFile } = require("./src/ex08-copy-file");
const { mergeFiles } = require("./src/ex09-merge-files");
const { searchWordInFiles } = require("./src/ex10-search-word");

async function main() {
  console.log("--- 1. readFilePromise ---");
  await readFilePromise("./test.txt").then(console.log);

  console.log("--- 2. readFileAsync ---");
  await readFileAsync("./test.txt").then(console.log);

  console.log("--- 3. getFileSize ---");
  await getFileSize("./test.txt").then(console.log);

  console.log("--- 4. listFiles ---");
  await listFiles("./").then(console.log);

  console.log("--- 5. readFilesInOrder ---");
  await readFilesInOrder(["a.txt", "b.txt"]);

  console.log("--- 6. readFilesParallel ---");
  await readFilesParallel(["a.txt", "b.txt"]);

  console.log("--- 7. fileExists ---");
  await fileExists("./test.txt").then(console.log); // true
  await fileExists("./nope.txt").then(console.log); // false

  console.log("--- 8. copyFile ---");
  await copyFile("a.txt", "copy.txt");

  console.log("--- 9. mergeFiles ---");
  await mergeFiles(["a.txt", "b.txt"], "merged.txt");

  console.log("--- 10. searchWordInFiles ---");
  await searchWordInFiles("./texts", "important");
}

main().catch((err) => console.log("Error:", err.message));

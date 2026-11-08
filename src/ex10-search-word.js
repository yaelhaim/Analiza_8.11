const fs = require("fs");

/**
 * תרגיל 10 - searchWordInFiles
 * פונקציית async שעוברת על כל הקבצים בתיקייה, ומדפיסה (console.log) את השם
 * של כל קובץ שהתוכן שלו מכיל את המילה.
 * להשתמש ב: fs.promises.readdir + fs.promises.readFile
 *
 * @param {string} dir הנתיב לתיקייה
 * @param {string} word המילה שמחפשים
 * @returns {Promise<void>} מסתיימת אחרי שכל השמות הודפסו
 */
function searchWordInFiles(dir, word) {
  // TODO: להפוך לפונקציית async (async function searchWordInFiles...) ולכתוב את הקוד
}

module.exports = { searchWordInFiles };

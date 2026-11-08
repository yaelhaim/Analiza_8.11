const fs = require("fs");

/**
 * תרגיל 2 - readFileAsync
 * פונקציית async שקוראת את הקובץ ומחזירה את התוכן שלו.
 * אם הקובץ לא קיים - הפונקציה נדחית (reject) עם השגיאה.
 * להשתמש ב: fs.promises.readFile
 *
 * @param {string} path הנתיב לקובץ
 * @returns {Promise<string>} תוכן הקובץ כטקסט
 */
function readFileAsync(path) {
  // TODO: להפוך לפונקציית async (async function readFileAsync...) ולכתוב את הקוד
}

module.exports = { readFileAsync };

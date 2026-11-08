const fs = require("fs");

/**
 * תרגיל 1 - readFilePromise
 * מחזירה Promise שמתמלא (resolve) בתוכן הקובץ.
 * אם יש שגיאה (למשל הקובץ לא קיים) - ה-Promise נדחה (reject) עם השגיאה.
 * להשתמש ב: fs.readFile (גרסת ה-callback) בתוך new Promise
 *
 * @param {string} path הנתיב לקובץ
 * @returns {Promise<string>} תוכן הקובץ כטקסט
 */
function readFilePromise(path) {
  // TODO: return new Promise((resolve, reject) => { ... fs.readFile ... })
}

module.exports = { readFilePromise };

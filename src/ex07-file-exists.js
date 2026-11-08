const fs = require("fs");

/**
 * תרגיל 7 - fileExists
 * מחזירה Promise שמתמלא ב-true אם הקובץ קיים, וב-false אם לא.
 * כשהקובץ לא קיים ה-Promise לא נדחה - הוא מחזיר false.
 * להשתמש ב: fs.access
 *
 * @param {string} path הנתיב לקובץ
 * @returns {Promise<boolean>} true / false
 */
function fileExists(path) {
  // TODO: לכתוב את הקוד
}

module.exports = { fileExists };

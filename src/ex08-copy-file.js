const fs = require("fs");

/**
 * תרגיל 8 - copyFile
 * פונקציית async שמעתיקה קובץ: קוראת את src וכותבת את התוכן ל-dest.
 * להשתמש ב: fs.promises.readFile + fs.promises.writeFile
 *
 * @param {string} src הקובץ המקורי
 * @param {string} dest הקובץ החדש
 * @returns {Promise<void>} מסתיימת אחרי שהקובץ נכתב
 */
function copyFile(src, dest) {
  // TODO: להפוך לפונקציית async (async function copyFile...) ולכתוב את הקוד
}

module.exports = { copyFile };

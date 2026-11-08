const fs = require("fs");

/**
 * תרגיל 9 - mergeFiles
 * פונקציית async שקוראת כמה קבצי טקסט, מחברת את התוכן שלהם עם ירידת שורה ("\n") ביניהם,
 * ושומרת את התוצאה בקובץ output.
 * להשתמש ב: fs.promises.readFile + fs.promises.writeFile
 *
 * @param {string[]} files מערך של נתיבים
 * @param {string} output הקובץ שאליו כותבים את התוצאה
 * @returns {Promise<void>} מסתיימת אחרי שהקובץ נכתב
 */
function mergeFiles(files, output) {
  // TODO: להפוך לפונקציית async (async function mergeFiles...) ולכתוב את הקוד
}

module.exports = { mergeFiles };

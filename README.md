# תרגיל 9 - Promises ו-async/await עם קבצים ב-Node.js 📂

10 תרגילים קצרים עם המודול `fs`, מהקל אל הקשה: עוטפות callback ב-`Promise`, עובדות עם `fs.promises` ו-`async/await`, קוראות קבצים לפי הסדר ובמקביל (`Promise.all`), מעתיקות, ממזגות ומחפשות מילה בקבצים.

## איך מתחילים

1. לוחצות למעלה על **Use this template** ← **Create a new repository**, ויוצרות ריפו משלכן.
2. עושות `git clone` לריפו החדש ופותחות אותו ב-VS Code.
3. בטרמינל מריצות פעם אחת: `npm install` (צריך Node בגרסה 20 ומעלה. בודקות עם `node -v`).
4. כותבות את הקוד בקבצים שבתיקייה `src/` - קובץ לכל תרגיל. בכל קובץ כבר מחכה הפונקציה הריקה עם הסבר מה היא מקבלת ומה היא מחזירה.
5. רוצות לראות את הפונקציות עובדות? מריצות `node main.js` (או `npm start`). הקובץ `main.js` מריץ את הדוגמאות מהתרגיל על הקבצים `test.txt`, `a.txt`, `b.txt` והתיקייה `texts/`.

## איך בודקים

```bash
npm test
```

- בהתחלה כל הטסטים אדומים (✘). כל טסט מתחיל במספר התרגיל שהוא בודק.
- מתחת לכל טסט שנכשל כתוב מה לא עבד.
- כשכל הטסטים ירוקים (✔) מופיעה ההודעה **✅ המשימה אושרה** ואפשר לעבור למשימה הבאה.
- מריצות טסט של תרגיל אחד בלבד: `node --test test/ex04.test.js`
- אחרי `git push` הטסטים רצים גם ב-GitHub (לשונית Actions). וי ירוק ליד ה-commit = המשימה אושרה.

> אל תשנו את הקבצים בתיקייה `test/`. הטסטים יוצרים לעצמם קבצים בתיקייה זמנית, כך שהם לא נוגעים בקבצים שלכן.

## חוקים לכל התרגילים

- **אסור** להשתמש בפונקציות Sync (`readFileSync`, `statSync` וכו'). כל העבודה אסינכרונית.
- כל פונקציה **מחזירה** את התוצאה (או Promise שלה), כדי שאפשר יהיה לכתוב `.then(console.log)` כמו בדוגמאות. רק בתרגילים 5, 6 ו-10 מדפיסים (`console.log`).
- כשהתרגיל אומר "Create an `async` function" - הפונקציה חייבת להיות `async function ...`. בקבצים היא עוד לא `async` - את זה מוסיפות אתן.
- כל קובץ מייצא את הפונקציה שלו (`module.exports = { ... }`). אל תשנו את השם שלה.
- מותר שתרגיל ישתמש בפונקציה מתרגיל קודם (למשל `readFilePromise` מתרגיל 1 בתוך תרגיל 5).

## התרגילים

| # | קובץ | פונקציה | נושא |
|---|---|---|---|
| 🟢 1 | `src/ex01-read-file-promise.js` | `readFilePromise(path)` | עוטפות את `fs.readFile` ב-`new Promise` |
| 🟢 2 | `src/ex02-read-file-async.js` | `readFileAsync(path)` | `async/await` עם `fs.promises.readFile` |
| 🟡 3 | `src/ex03-get-file-size.js` | `getFileSize(path)` | גודל קובץ בבתים עם `fs.promises.stat` |
| 🟡 4 | `src/ex04-list-files.js` | `listFiles(dir)` | רשימת הקבצים בתיקייה עם `fs.promises.readdir` |
| 🟡 5 | `src/ex05-read-files-in-order.js` | `readFilesInOrder(files)` | קריאה אחד אחרי השני, לפי הסדר |
| 🔵 6 | `src/ex06-read-files-parallel.js` | `readFilesParallel(files)` | קריאה במקביל עם `Promise.all` |
| 🔵 7 | `src/ex07-file-exists.js` | `fileExists(path)` | `true` / `false` עם `fs.access` |
| 🔵 8 | `src/ex08-copy-file.js` | `copyFile(src, dest)` | העתקת קובץ עם `readFile` + `writeFile` |
| 🔴 9 | `src/ex09-merge-files.js` | `mergeFiles(files, output)` | מיזוג כמה קבצים לקובץ אחד |
| 🔴 10 | `src/ex10-search-word.js` | `searchWordInFiles(dir, word)` | חיפוש מילה בכל הקבצים בתיקייה |

---

## 🟢 Beginner Level

### 1. Read File with Promise
כתבו פונקציה `readFilePromise(path)` שמחזירה **Promise**. ה-Promise מתמלא (resolve) בתוכן הקובץ, בעזרת `fs.readFile`.

- בונות את ה-Promise בעצמכן: `return new Promise((resolve, reject) => { ... })`, ובתוכו קוראות ל-`fs.readFile` (גרסת ה-callback).
- אם `fs.readFile` מחזירה שגיאה (למשל הקובץ לא קיים) - קוראות ל-`reject(err)`.

```js
readFilePromise('./test.txt').then(console.log);
```

### 2. Async Read File
כתבו פונקציית `async` בשם `readFileAsync(path)` שקוראת את הקובץ עם `fs.promises.readFile` ומחזירה את התוכן שלו.

- אם הקובץ לא קיים, השגיאה צריכה להגיע למי שקרא לפונקציה (לא תופסות אותה ומחזירות משהו אחר).

```js
readFileAsync('./test.txt').then(console.log);
```

רמז: כדי לקבל טקסט ולא Buffer, מעבירות קידוד: `readFile(path, 'utf8')`.

## 🟡 Intermediate Level

### 3. Get File Size
כתבו פונקציית `async` בשם `getFileSize(path)` שמשתמשת ב-`fs.promises.stat` כדי להחזיר את גודל הקובץ **בבתים** (bytes).

```js
getFileSize('./test.txt').then(console.log); // Example: 128
```

רמז: גודל בבתים הוא לא מספר התווים. למשל `"שלום"` הוא 4 אותיות אבל 8 בתים.

### 4. List Files in Directory
כתבו פונקציית `async` בשם `listFiles(dir)` שמחזירה **מערך** עם השמות של כל הקבצים בתיקייה, בעזרת `fs.promises.readdir`.

```js
listFiles('./').then(console.log);
```

### 5. Read Multiple Files in Order
כתבו פונקציית `async` בשם `readFilesInOrder(files)` שמקבלת מערך של נתיבים, קוראת את הקבצים **אחד אחרי השני לפי הסדר**, ומדפיסה (`console.log`) את התוכן של כל קובץ.

- קובץ מתחיל להיקרא רק אחרי שהקודם הסתיים.
- הפונקציה מסתיימת רק אחרי שכל התוכן הודפס.

```js
readFilesInOrder(['a.txt', 'b.txt']);
```

רמז: `await` בתוך לולאת `for...of`. ⚠️ `forEach` **לא מחכה** ל-`await` שבתוכו.

## 🔵 Advanced Level

### 6. Read Files in Parallel
כתבו פונקציית `async` בשם `readFilesParallel(files)` שקוראת את כל הקבצים **במקביל** בעזרת `Promise.all`, ומדפיסה את התוכן שלהם.

- כל הקריאות מתחילות ביחד (בלי `await` בתוך לולאה).
- הפונקציה מסתיימת רק אחרי שכל התוכן הודפס.

```js
readFilesParallel(['a.txt', 'b.txt']);
```

רמז: `files.map(...)` נותן מערך של Promises, ו-`await Promise.all(...)` מחכה לכולם.

### 7. Check If File Exists with Promise
כתבו פונקציה `fileExists(path)` שמחזירה Promise שמתמלא ב-`true` אם הקובץ קיים, וב-`false` אם לא, בעזרת `fs.access`.

- כשהקובץ לא קיים, ה-Promise **לא נדחה** - הוא מחזיר `false`.
- מותר לבנות אותה עם `new Promise` ו-`fs.access` (callback), או כפונקציית `async` עם `fs.promises.access` ו-`try/catch`.

```js
fileExists('./test.txt').then(console.log); // true or false
```

### 8. Copy File with Promises
כתבו פונקציית `async` בשם `copyFile(src, dest)` שמעתיקה קובץ בעזרת `fs.promises.readFile` ו-`fs.promises.writeFile`.

- אחרי `await copyFile(...)` הקובץ `dest` כבר קיים, עם בדיוק אותו תוכן כמו `src`.
- אם `dest` כבר קיים - התוכן שלו מוחלף.
- בלי `fs.copyFile` - העתקה עם קריאה וכתיבה.

```js
copyFile('a.txt', 'copy.txt');
```

## 🔴 Expert Level

### 9. Merge Text Files
כתבו פונקציית `async` בשם `mergeFiles(files, output)` שקוראת כמה קבצי טקסט, מחברת את התוכן שלהם **עם ירידת שורה** ביניהם, ושומרת את התוצאה בקובץ `output`.

- התוכן נשמר לפי הסדר של המערך.
- אם `output` כבר קיים - התוכן שלו מוחלף.

```js
mergeFiles(['a.txt', 'b.txt'], 'merged.txt');
```

רמז: `contents.join('\n')`.

### 10. Search Word in All Files
כתבו פונקציית `async` בשם `searchWordInFiles(dir, word)` שעוברת על כל הקבצים בתיקייה, ומדפיסה (`console.log`) את **השם** של כל קובץ שהתוכן שלו מכיל את המילה.

- קבצים שלא מכילים את המילה - לא מודפסים.
- הפונקציה מסתיימת רק אחרי שכל השמות הודפסו.

```js
searchWordInFiles('./texts', 'important');
```

רמז: `readdir` נותן רק שמות. כדי לקרוא קובץ צריך את הנתיב המלא: `path.join(dir, name)`.

## בדיקה עצמית
- `node main.js` רץ עד הסוף בלי שגיאות.
- בתרגיל 5 התוכן מודפס לפי הסדר, ובתרגיל 6 כל הקבצים נקראים ביחד.
- `fileExists` על קובץ שלא קיים מחזיר `false` ולא זורק שגיאה.
- אחרי `node main.js` נוצרו `copy.txt` ו-`merged.txt` עם התוכן הנכון.
- `searchWordInFiles('./texts', 'important')` מדפיס את `notes.txt` ואת `todo.txt` בלבד.

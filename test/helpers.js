const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const util = require("node:util");
const assert = require("node:assert/strict");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");

// Loads a student module fresh (no cache), so every test starts clean.
// All files in src/ are reloaded, in case one exercise uses another (e.g. ex05 uses readFilePromise from ex01).
function load(relativePath) {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(SRC)) delete require.cache[key];
  }
  const full = path.join(ROOT, relativePath);
  try {
    return require(full);
  } catch (err) {
    throw new Error(`could not load ${relativePath}: ${err.message}`);
  }
}

// Returns the exported function, or fails with a clear message.
function getFunction(relativePath, name) {
  const mod = load(relativePath);
  assert.equal(
    typeof mod[name],
    "function",
    `${relativePath} should export a function called ${name} (module.exports = { ${name} })`
  );
  return mod[name];
}

// Creates an empty temporary folder and fills it with files/folders:
//   { "notes.txt": "text", "texts/": null, "texts/a.txt": "abc" }
function makeSandbox(files = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "promise-ex-"));
  for (const [name, content] of Object.entries(files)) {
    const full = path.join(dir, name);
    if (name.endsWith("/")) {
      fs.mkdirSync(full, { recursive: true });
    } else {
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, content);
    }
  }
  return dir;
}

// Waits for a value that should be a Promise. Fails (instead of hanging) if it never settles.
function settle(value, what, ms = 3000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${what} never finished (waited ${ms / 1000}s) - did you call resolve/reject, or return/await the promise?`)),
      ms
    );
  });
  return Promise.race([Promise.resolve(value), timeout]).finally(() => clearTimeout(timer));
}

// Runs an async fn and returns everything it printed with console.log (one string per call).
async function captureConsoleAsync(fn) {
  const lines = [];
  const original = console.log;
  console.log = (...args) => lines.push(args.map((a) => (typeof a === "string" ? a : util.inspect(a))).join(" "));
  try {
    await fn();
  } finally {
    console.log = original;
  }
  return lines;
}

// Wraps fs.readFile and fs.promises.readFile so the tests can see how many reads run at the same time.
// `delays` maps a file name to a delay in ms (so the first file can be "slow").
// Call this BEFORE load(), and call restore() at the end.
function trackReads(delays = {}) {
  const fsp = fs.promises;
  const originalCb = fs.readFile;
  const originalP = fsp.readFile;
  const stats = { inFlight: 0, maxInFlight: 0, started: [] };
  const delayFor = (file) => delays[path.basename(String(file))] ?? 5;
  const start = (file) => {
    stats.inFlight++;
    stats.maxInFlight = Math.max(stats.maxInFlight, stats.inFlight);
    stats.started.push(path.basename(String(file)));
  };

  fs.readFile = function (file, ...args) {
    const cb = args.pop();
    start(file);
    return originalCb.call(fs, file, ...args, (err, data) => {
      setTimeout(() => {
        stats.inFlight--;
        cb(err, data);
      }, delayFor(file));
    });
  };
  fsp.readFile = async function (file, ...args) {
    start(file);
    try {
      const data = await originalP.call(fsp, file, ...args);
      await new Promise((r) => setTimeout(r, delayFor(file)));
      return data;
    } finally {
      stats.inFlight--;
    }
  };
  stats.restore = () => {
    fs.readFile = originalCb;
    fsp.readFile = originalP;
  };
  return stats;
}

// Returns a student file's source without comments (to check which functions are used).
function sourceOf(relativePath) {
  const text = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

// Checks that the file calls the required functions and does not use the Sync versions.
function assertUses(relativePath, required) {
  const src = sourceOf(relativePath);
  for (const [label, pattern] of required) {
    assert.match(src, pattern, `${relativePath} should use ${label}`);
  }
  assert.doesNotMatch(src, /\w+Sync\s*\(/, `${relativePath} should not use Sync functions (readFileSync etc.) - this exercise is about async code`);
}

const isAsyncFunction = (fn) => fn.constructor.name === "AsyncFunction";

function assertAsync(fn, name) {
  assert.ok(isAsyncFunction(fn), `${name} should be an async function: async function ${name}(...) { ... }`);
}

// Text from a read result: a string, or a Buffer turned into text.
const asText = (value) => (Buffer.isBuffer(value) ? value.toString("utf8") : value);

module.exports = {
  ROOT,
  load,
  getFunction,
  makeSandbox,
  settle,
  captureConsoleAsync,
  trackReads,
  sourceOf,
  assertUses,
  assertAsync,
  asText,
};

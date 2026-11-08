// Docker Quiz server: serves the quiz and keeps a shared leaderboard.
// Storage: Postgres when DATABASE_URL is set (Render), otherwise a local JSON file.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || "";
const ROOT = __dirname;
const MAX_POINTS = 5900; // 5 x (100+200+300+400) + streak bonuses
const TYPES = { ".html": "text/html; charset=utf-8", ".png": "image/png", ".js": "text/javascript", ".css": "text/css", ".ico": "image/x-icon" };
const PUBLIC = new Set(["/index.html", "/leaderboard.html", "/logo.png"]);

// ---------- storage ----------
let store;
if (process.env.DATABASE_URL) {
  const { Pool } = require("pg");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL.includes("render.com") ? { rejectUnauthorized: false } : false });
  const ready = pool.query(`CREATE TABLE IF NOT EXISTS scores (
    id text PRIMARY KEY, name text NOT NULL, points int NOT NULL, correct int NOT NULL,
    answered int NOT NULL, best int NOT NULL, started bigint, finished bigint, updated bigint NOT NULL)`);
  store = {
    async upsert(r) {
      await ready;
      // Once an attempt is finished it is locked: the first full attempt is the one that counts.
      await pool.query(`INSERT INTO scores (id,name,points,correct,answered,best,started,finished,updated)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id) DO UPDATE SET name=$2, points=$3, correct=$4, answered=$5, best=$6, started=$7, finished=$8, updated=$9
        WHERE scores.finished IS NULL`, [r.id, r.name, r.points, r.correct, r.answered, r.best, r.started, r.finished, r.updated]);
    },
    async all() { await ready; return (await pool.query("SELECT * FROM scores")).rows.map(r => ({ ...r, started: r.started && +r.started, finished: r.finished && +r.finished, updated: +r.updated })); },
    async clear() { await ready; await pool.query("DELETE FROM scores"); },
  };
} else {
  const FILE = path.join(ROOT, "data", "scores.json");
  let rows = {};
  try { rows = JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { }
  const persist = () => { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(rows)); };
  store = {
    async upsert(r) { if (rows[r.id]?.finished) return; rows[r.id] = r; persist(); },
    async all() { return Object.values(rows); },
    async clear() { rows = {}; persist(); },
  };
  console.log("No DATABASE_URL: scores are kept in data/scores.json");
}

// ---------- helpers ----------
const int = (v, lo, hi) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo; };
const json = (res, code, body) => { res.writeHead(code, { "Content-Type": "application/json", "Cache-Control": "no-store" }); res.end(JSON.stringify(body)); };
const readBody = req => new Promise((ok, fail) => { let b = ""; req.on("data", c => { b += c; if (b.length > 4096) req.destroy(); }); req.on("end", () => ok(b)); req.on("error", fail); });

function ranked(rows) {
  return rows
    .map(r => ({ ...r, time: r.finished && r.started ? r.finished - r.started : null }))
    .sort((a, b) => b.points - a.points || b.correct - a.correct || (!!b.finished - !!a.finished) || (a.time ?? 9e15) - (b.time ?? 9e15) || a.updated - b.updated)
    .map((r, i) => ({ pos: i + 1, id: r.id, name: r.name, points: r.points, correct: r.correct, answered: r.answered, best: r.best, finished: !!r.finished, time: r.time }));
}

// ---------- server ----------
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  try {
    if (url.pathname === "/api/score" && req.method === "POST") {
      const b = JSON.parse(await readBody(req) || "{}");
      const id = String(b.id || "").slice(0, 64), name = String(b.name || "").trim().slice(0, 40);
      if (!/^[a-z0-9-]{8,64}$/i.test(id) || !name) return json(res, 400, { error: "id and name required" });
      await store.upsert({
        id, name, points: int(b.points, 0, MAX_POINTS), correct: int(b.correct, 0, 20), answered: int(b.answered, 0, 20),
        best: int(b.best, 0, 20), started: b.started ? int(b.started, 0, 9e15) : null, finished: b.finished ? int(b.finished, 0, 9e15) : null, updated: Date.now(),
      });
      return json(res, 200, { ok: true });
    }
    if (url.pathname === "/api/leaderboard" && req.method === "GET") return json(res, 200, ranked(await store.all()));
    if (url.pathname === "/api/leaderboard" && req.method === "DELETE") {
      if (!ADMIN_KEY || url.searchParams.get("key") !== ADMIN_KEY) return json(res, 403, { error: "wrong key" });
      await store.clear(); return json(res, 200, { ok: true });
    }
    let p = url.pathname === "/" ? "/index.html" : url.pathname === "/leaderboard" ? "/leaderboard.html" : url.pathname;
    if (!PUBLIC.has(p)) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
    fs.createReadStream(path.join(ROOT, p)).pipe(res);
  } catch (e) {
    console.error(e); json(res, 500, { error: "server error" });
  }
}).listen(PORT, () => console.log(`Docker Quiz on http://localhost:${PORT}  (leaderboard: /leaderboard)`));

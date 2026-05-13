import json
import os
import re
import subprocess
import sqlite3
import tempfile

from flask import Flask, jsonify, render_template, request, send_from_directory

app = Flask(__name__, static_folder="static")
DB_PATH = os.path.join(os.path.dirname(__file__), "data", "trading.db")


def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS pre_market (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            date        TEXT UNIQUE NOT NULL,
            data        TEXT NOT NULL,
            created_at  TEXT DEFAULT (datetime('now', 'localtime'))
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS trade_logs (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            date         TEXT NOT NULL,
            ticker       TEXT,
            ticker_code  TEXT,
            direction    TEXT,
            data         TEXT NOT NULL,
            created_at   TEXT DEFAULT (datetime('now', 'localtime'))
        )
    """)
    conn.commit()
    conn.close()


# ── Routes ──────────────────────────────────────────────────────────────────

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):
    dist = os.path.join(app.static_folder, "dist")
    if path and os.path.exists(os.path.join(dist, path)):
        return send_from_directory(dist, path)
    return send_from_directory(dist, "index.html")


# Pre-market

@app.route("/api/pre-market", methods=["GET"])
def list_pre_market():
    conn = get_db()
    rows = conn.execute(
        "SELECT id, date, data, created_at FROM pre_market ORDER BY date DESC"
    ).fetchall()
    conn.close()
    result = []
    for row in rows:
        d = json.loads(row["data"])
        result.append({
            "id": row["id"],
            "date": row["date"],
            "created_at": row["created_at"],
            "weekday": d.get("weekday", ""),
            "trend": d.get("trend", ""),
            "conclusion": d.get("conclusion", ""),
        })
    return jsonify(result)


@app.route("/api/pre-market", methods=["POST"])
def create_pre_market():
    body = request.get_json()
    date = body.get("date")
    payload = json.dumps(body, ensure_ascii=False)
    conn = get_db()
    try:
        conn.execute("INSERT INTO pre_market (date, data) VALUES (?, ?)", (date, payload))
    except sqlite3.IntegrityError:
        conn.execute("UPDATE pre_market SET data = ? WHERE date = ?", (payload, date))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


@app.route("/api/pre-market/<date>", methods=["GET"])
def get_pre_market(date):
    conn = get_db()
    row = conn.execute("SELECT data FROM pre_market WHERE date = ?", (date,)).fetchone()
    conn.close()
    if not row:
        return jsonify({"error": "not found"}), 404
    return jsonify(json.loads(row["data"]))


@app.route("/api/pre-market/<date>", methods=["DELETE"])
def delete_pre_market(date):
    conn = get_db()
    conn.execute("DELETE FROM pre_market WHERE date = ?", (date,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


# Trade logs

@app.route("/api/trade-logs", methods=["GET"])
def list_trade_logs():
    conn = get_db()
    rows = conn.execute(
        "SELECT id, date, ticker, ticker_code, direction, data, created_at "
        "FROM trade_logs ORDER BY date DESC, id DESC"
    ).fetchall()
    conn.close()
    result = []
    for row in rows:
        d = json.loads(row["data"])
        result.append({
            "id": row["id"],
            "date": row["date"],
            "ticker": row["ticker"],
            "ticker_code": row["ticker_code"],
            "direction": row["direction"],
            "created_at": row["created_at"],
            "price": d.get("price", ""),
            "pnl_pct": d.get("pnl_pct", ""),
            "result": d.get("result", ""),
        })
    return jsonify(result)


@app.route("/api/trade-logs", methods=["POST"])
def create_trade_log():
    body = request.get_json()
    conn = get_db()
    conn.execute(
        "INSERT INTO trade_logs (date, ticker, ticker_code, direction, data) VALUES (?, ?, ?, ?, ?)",
        (
            body.get("date"),
            body.get("ticker"),
            body.get("ticker_code"),
            body.get("direction"),
            json.dumps(body, ensure_ascii=False),
        ),
    )
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


@app.route("/api/trade-logs/<int:log_id>", methods=["GET"])
def get_trade_log(log_id):
    conn = get_db()
    row = conn.execute("SELECT data FROM trade_logs WHERE id = ?", (log_id,)).fetchone()
    conn.close()
    if not row:
        return jsonify({"error": "not found"}), 404
    return jsonify(json.loads(row["data"]))


@app.route("/api/trade-logs/<int:log_id>", methods=["DELETE"])
def delete_trade_log(log_id):
    conn = get_db()
    conn.execute("DELETE FROM trade_logs WHERE id = ?", (log_id,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


# ── Market Analysis (Skills) ─────────────────────────────────────────────────

SKILLS_DIR = os.path.join(os.path.dirname(__file__), ".claude", "skills")
MX_APIKEY  = os.environ.get("MX_APIKEY", "")


def run_skill(script_path, query):
    with tempfile.TemporaryDirectory() as tmp:
        env = {**os.environ, "MX_APIKEY": MX_APIKEY}
        result = subprocess.run(
            ["python", script_path, query, tmp],
            capture_output=True, text=True, timeout=30, env=env,
        )
        return result.stdout + result.stderr


def parse_markdown_table(text):
    rows, headers = [], []
    for line in text.splitlines():
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if all(set(c) <= set("-: ") for c in cells):
            continue
        if not headers:
            headers = cells
        else:
            rows.append(dict(zip(headers, cells)))
    return rows


def parse_mx_data_output(raw):
    sections, current = [], None
    for line in raw.splitlines():
        m = re.match(r"\*\*(.+?)\*\*.*预览\):", line)
        if m:
            current = {"title": m.group(1), "raw": ""}
            sections.append(current)
            continue
        if current is not None:
            current["raw"] += line + "\n"
    for s in sections:
        s["rows"] = parse_markdown_table(s["raw"])
        del s["raw"]
    return sections


def parse_mx_search_output(raw):
    articles, current = [], None
    for line in raw.splitlines():
        m = re.match(r"--- (\d+)\. (.+?) ---", line)
        if m:
            current = {"index": int(m.group(1)), "title": m.group(2),
                       "date": "", "type": "", "content": ""}
            articles.append(current)
            continue
        if current is None:
            continue
        dm = re.match(r"日期: (.+?) \| 类型: (.+)", line)
        if dm:
            current["date"] = dm.group(1)
            current["type"] = dm.group(2)
        else:
            current["content"] += line + "\n"
    for a in articles:
        a["content"] = a["content"].strip()
    return articles


@app.route("/api/analyze/market", methods=["GET"])
def analyze_market():
    if not MX_APIKEY:
        return jsonify({"error": "MX_APIKEY 未配置"}), 400

    mx_data   = os.path.join(SKILLS_DIR, "mx-data",   "mx_data.py")
    mx_search = os.path.join(SKILLS_DIR, "mx-search", "mx_search.py")

    a_share_raw   = run_skill(mx_data,   "上证指数 深证成指 创业板指 今日最新价 涨跌幅 成交额")
    overseas_raw  = run_skill(mx_data,   "道琼斯指数 纳斯达克指数 标普500指数 恒生指数 昨日涨跌幅")
    commodity_raw = run_skill(mx_data,   "伦敦金现货 WTI原油 LME铜 人民币兑美元 最新价涨跌幅")
    search_raw    = run_skill(mx_search, "今日A股大盘行情分析 隔夜美股港股外盘情况 资金面板块热点")

    return jsonify({
        "market_data": {
            "a_share":   parse_mx_data_output(a_share_raw),
            "overseas":  parse_mx_data_output(overseas_raw),
            "commodity": parse_mx_data_output(commodity_raw),
        },
        "news": parse_mx_search_output(search_raw),
    })


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5001)

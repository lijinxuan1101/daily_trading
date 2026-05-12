import json
import os
import sqlite3

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


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5001)

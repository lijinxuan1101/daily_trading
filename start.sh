#!/bin/bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"

# 安装 Python 依赖
pip install flask -q

# 启动 Flask 后端
python "$DIR/app.py" &
FLASK_PID=$!

# 启动 Vite 前端开发服务器
cd "$DIR/frontend"
npm run dev &
VITE_PID=$!

echo ""
echo "  后端  http://localhost:5001"
echo "  前端  http://localhost:5173  ← 开发时访问这个"
echo ""
echo "  按 Ctrl+C 停止所有服务"

trap "kill $FLASK_PID $VITE_PID 2>/dev/null; exit" INT TERM
wait

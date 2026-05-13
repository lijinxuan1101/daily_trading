# 交易日志系统

个人 A 股交易记录与分析工具。基于 Claude Code + 东方财富妙想 Skills，支持盘前分析 AI 辅助、交易日志管理。

## 功能

- **盘前分析**：隔夜外盘、大盘研判由 Claude 自动填充；板块热点、持仓梳理、候选标的手动填写
- **交易日志**：完整记录买卖逻辑、计划管理、纪律检查、情绪心态，平仓后补填复盘
- **数据持久化**：SQLite 本地存储，JSON 格式保存全量字段，便于 AI 分析

## 技术栈

| 层 | 技术 |
|---|---|
| 后端 | Python Flask + SQLite |
| 前端 | React 18 + Vite + Tailwind CSS |
| AI Skills | 东方财富妙想（行情/资讯/选股/自选/模拟组合） |

## 快速开始

### 1. 克隆项目

```bash
git clone git@github.com:lijinxuan1101/daily_trading.git
cd daily_trading
```

### 2. 配置 API Key

```bash
# 前往 https://dl.dfcfs.com/m/itc4 获取妙想 API Key
echo 'export MX_APIKEY=your_key_here' >> ~/.zshrc && source ~/.zshrc
```

### 3. 安装依赖

```bash
# Python 依赖
pip install flask

# 前端依赖
cd frontend && npm install && cd ..
```

### 4. 启动

```bash
# 开发模式（推荐，前端热更新）
./start.sh
# 前端: http://localhost:5173
# 后端: http://localhost:5001

# 或仅启动后端（使用构建产物）
python app.py
# 访问: http://localhost:5001
```

## 目录结构

```
daily_trading/
├── app.py                        # Flask 后端，REST API
├── requirements.txt
├── start.sh                      # 一键启动脚本
├── .env.example                  # 环境变量示例
├── data/
│   └── trading.db                # SQLite 数据库（自动创建，不入库）
├── frontend/                     # React + Vite 前端
│   └── src/
│       ├── App.jsx               # 主状态管理
│       ├── api.js                # API 客户端
│       ├── data/defaultForms.js  # 表单默认值
│       └── components/
│           ├── Sidebar.jsx
│           ├── home/HomePage.jsx
│           ├── forms/
│           │   ├── PreMarketForm.jsx   # 盘前分析（AI区只读）
│           │   └── TradeLogForm.jsx
│           └── views/
│               ├── PreMarketView.jsx
│               └── TradeLogView.jsx
├── static/dist/                  # Vite 构建产物（不入库）
└── .claude/skills/               # 妙想 Skills（随代码一起分发）
    ├── mx-data/                  # 金融行情 & 财务数据
    ├── mx-search/                # 资讯搜索
    ├── mx-xuangu/                # 智能选股
    ├── mx-zixuan/                # 自选股管理
    └── mx-moni/                  # 模拟组合管理
```

## API 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/pre-market` | 盘前分析列表 |
| POST | `/api/pre-market` | 创建/更新盘前分析 |
| GET | `/api/pre-market/:date` | 获取某日盘前分析 |
| DELETE | `/api/pre-market/:date` | 删除 |
| GET | `/api/trade-logs` | 交易日志列表 |
| POST | `/api/trade-logs` | 创建交易日志 |
| GET | `/api/trade-logs/:id` | 获取单条日志 |
| DELETE | `/api/trade-logs/:id` | 删除 |

## 妙想 Skills 说明

| Skill | 用途 |
|---|---|
| `mx-data` | 股票/指数/基金实时行情、财务指标、资金流向 |
| `mx-search` | 新闻、公告、研报、政策资讯搜索 |
| `mx-xuangu` | 按条件筛选股票、查询板块成分股 |
| `mx-zixuan` | 查询/添加/删除东方财富自选股 |
| `mx-moni` | 模拟组合买卖、持仓查询、资金查询 |

Skills 已内置在 `.claude/skills/` 目录，clone 后在 Claude Code 中直接可用，无需重新安装。

## 换电脑

```bash
git clone git@github.com:lijinxuan1101/daily_trading.git
echo 'export MX_APIKEY=your_key_here' >> ~/.zshrc && source ~/.zshrc
pip install flask
cd frontend && npm install
```

Skills 随代码一起，不需要额外下载。

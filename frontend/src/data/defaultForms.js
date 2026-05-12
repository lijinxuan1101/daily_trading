const today = () => new Date().toISOString().split('T')[0]
const weekdays = ['日','一','二','三','四','五','六']
const todayWeekday = () => weekdays[new Date().getDay()]

export function defaultPMForm() {
  return {
    date: today(),
    weekday: todayWeekday(),
    markets: [
      { key: 'us',     label: '美股（道/纳/标）', change_pct: '', notes: '' },
      { key: 'hk',     label: '港股（恒指）',      change_pct: '', notes: '' },
      { key: 'rmb',    label: '人民币汇率',         change_pct: '', notes: '' },
      { key: 'oil',    label: '原油',               change_pct: '', notes: '' },
      { key: 'gold',   label: '黄金',               change_pct: '', notes: '' },
      { key: 'copper', label: '铜',                 change_pct: '', notes: '' },
    ],
    overseas_sentiment: '',
    overseas_impact: '',
    events: [
      { key: 'macro',    label: '宏观数据发布',      placeholder: 'CPI、PMI、社融…', checked: false, value: '' },
      { key: 'meetings', label: '重要会议/政策窗口', placeholder: '…',               checked: false, value: '' },
      { key: 'announce', label: '持仓公司公告/财报', placeholder: '…',               checked: false, value: '' },
      { key: 'policy',   label: '行业政策/监管消息', placeholder: '…',               checked: false, value: '' },
      { key: 'other',    label: '其他',              placeholder: '…',               checked: false, value: '' },
    ],
    indices: [
      { key: 'sh',    label: '上证指数', close: '', change: '', volume: '' },
      { key: 'sz',    label: '深证成指', close: '', change: '', volume: '' },
      { key: 'cyb',   label: '创业板指', close: '', change: '', volume: '' },
      { key: 'north', label: '北向资金', close: '', change: '', volume: '' },
    ],
    trend: '', volume_forecast: '', support: '', resistance: '', trend_reason: '',
    strong_sectors: '', continued_direction: '', avoid_sectors: '', rotation: '',
    positions: [{ name: '', code: '', cost: '', pnl_pct: '', stop_loss: '', key_levels: '', intent: '', trigger: '' }],
    watchlist: [{ ticker: '', code: '', reason: '', entry_condition: '', max_position: '' }],
    max_trades: '', max_position_pct: '', special_reminder: '',
    conclusion: '',
  }
}

export function defaultTLForm() {
  return {
    date: today(), ticker: '', ticker_code: '', direction: '买入', account: '',
    price: '', quantity: '', amount: '', fee: '', actual_cost: '', position_pct: '', avg_cost: '',
    buy_logic: '',
    ref_tech: false, tech_reason: '',
    ref_fundamental: false, fundamental_reason: '',
    ref_news: false, news_reason: '',
    ref_capital: false, capital_reason: '',
    risk_note: '',
    stop_loss: '', stop_loss_pct: '', target1: '', target1_pct: '', target2: '', target2_pct: '', max_loss: '',
    discipline_rules: [
      { key: 'd1', label: '符合大盘趋势方向，未逆势操作', checked: false },
      { key: 'd2', label: '单票仓位未超过上限', checked: false },
      { key: 'd3', label: '止损位已预设，风险金额在承受范围内', checked: false },
      { key: 'd4', label: '等待 K 线收盘确认，未提前抢跑', checked: false },
      { key: 'd5', label: '买入前已检查财报/公告，无重大风险事项', checked: false },
      { key: 'd6', label: '未在情绪激动时下单', checked: false },
    ],
    d_custom_checked: false, d_custom: '', discipline_note: '',
    emotions: [
      { key: 'calm',    label: '冷静理性', checked: false },
      { key: 'excited', label: '轻微兴奋', checked: false },
      { key: 'fomo',    label: 'FOMO',    checked: false },
      { key: 'anxious', label: '焦虑',    checked: false },
      { key: 'panic',   label: '恐慌',    checked: false },
    ],
    confidence: 3, market_feeling: '',
    sell_date: '', sell_price: '', hold_days: '', pnl_amount: '', pnl_pct: '', result: '',
    review_questions: [
      { q: '买入时机是否合适？', a: '' },
      { q: '过程中是否严格执行了计划？有无临时改变止损或目标位？', a: '' },
      { q: '这笔交易犯了哪些错误？', a: '' },
      { q: '有什么可以改进的地方？', a: '' },
      { q: '下次遇到类似形态，会怎么做？', a: '' },
    ],
  }
}

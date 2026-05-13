import { useState } from 'react'
import { defaultPMForm } from '../../data/defaultForms'

function Tag({ label, active, onClick }) {
  return <button type="button" className={`tag-btn ${active ? 'on' : ''}`} onClick={onClick}>{label}</button>
}

function SectionTitle({ num, children }) {
  return (
    <div className="section-title">
      <span className="section-num">{num}</span>
      {children}
    </div>
  )
}

// ── 涨跌幅颜色 ───────────────────────────────────────────────
function pctColor(val) {
  if (!val) return ''
  return val.toString().startsWith('-') ? 'text-red-500' : 'text-emerald-600'
}

// ── 行情数据 Tab ──────────────────────────────────────────────
function MarketDataTab({ data }) {
  if (!data) return null
  const { a_share = [], overseas = [], commodity = [] } = data
  const allEmpty = [...a_share, ...overseas, ...commodity].every(s => !s.rows?.length)
  if (allEmpty) return <EmptyHint text="行情数据加载失败，请重试" />

  return (
    <div className="space-y-6">
      {/* A 股指数 */}
      {a_share.map((section, si) => (
        <div key={si}>
          <div className="text-xs font-semibold text-ash uppercase tracking-widest mb-2">A 股指数</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>指数</th>
                {section.rows[0] && Object.keys(section.rows[0]).filter(k => k !== 'date').map(k => <th key={k}>{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, ri) => (
                <tr key={ri}>
                  <td className="text-sm font-medium text-ink/80">{row.date}</td>
                  {Object.entries(row).filter(([k]) => k !== 'date').map(([k, v]) => (
                    <td key={k} className={`font-mono text-sm ${k.includes('涨跌') ? pctColor(v) : ''}`}>{v || '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* 海外指数 */}
      {overseas.map((section, si) => (
        <div key={si}>
          <div className="text-xs font-semibold text-ash uppercase tracking-widest mb-2">隔夜外盘</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>日期</th>
                {section.rows[0] && Object.keys(section.rows[0]).filter(k => k !== 'date').map(k => <th key={k}>{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, ri) => (
                <tr key={ri}>
                  <td className="text-sm text-ash font-mono">{row.date}</td>
                  {Object.entries(row).filter(([k]) => k !== 'date').map(([k, v]) => (
                    <td key={k} className={`font-mono text-sm ${pctColor(v)}`}>{v || '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* 大宗商品 */}
      {commodity.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-ash uppercase tracking-widest mb-2">大宗商品 & 汇率</div>
          <table className="data-table">
            <thead><tr><th>品种</th><th>最新价</th><th>涨跌幅</th></tr></thead>
            <tbody>
              {commodity.map((section, si) => (
                section.rows.map((row, ri) => (
                  <tr key={`${si}-${ri}`}>
                    <td className="text-sm font-medium text-ink/80">{section.title.split('当')[0]}</td>
                    <td className="font-mono text-sm">{row['最新价'] || row[Object.keys(row).find(k=>k!=='date')] || '—'}</td>
                    <td className={`font-mono text-sm ${pctColor(row['涨跌幅'])}`}>{row['涨跌幅'] || '—'}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── 资讯 Tab ──────────────────────────────────────────────────
function NewsTab({ news }) {
  const [expanded, setExpanded] = useState(null)
  if (!news?.length) return <EmptyHint text="暂无资讯数据" />

  return (
    <div className="space-y-2">
      {news.map((item) => (
        <div key={item.index}
          className="rounded-xl border cursor-pointer transition-all duration-150"
          style={{ borderColor: expanded === item.index ? '#C8622A' : '#E5DDD0', background: expanded === item.index ? 'white' : '#FDFAF6' }}
          onClick={() => setExpanded(expanded === item.index ? null : item.index)}
        >
          <div className="flex items-start justify-between gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-xs font-mono text-ash">{item.date}</span>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#F5F1EB', color: '#9C8B7A' }}>{item.type}</span>
              </div>
              <p className="text-sm font-medium text-ink leading-snug">{item.title}</p>
            </div>
            <svg className="flex-shrink-0 mt-1 transition-transform duration-150 text-ash"
              style={{ transform: expanded === item.index ? 'rotate(90deg)' : 'none' }}
              width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3l4 4-4 4"/>
            </svg>
          </div>
          {expanded === item.index && item.content && (
            <div className="px-4 pb-4 pt-0">
              <div style={{ borderTop: '1px solid #F5F1EB', paddingTop: '12px' }}>
                <p className="font-body text-sm text-ink/80 leading-relaxed whitespace-pre-line">{item.content}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── 空状态 ────────────────────────────────────────────────────
function EmptyHint({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-smoke bg-paper/60 py-10 text-center">
      <p className="text-sm text-ash">{text}</p>
    </div>
  )
}

// ── AI 大盘分析展示区（双 Tab） ───────────────────────────────
function MarketAnalysisBlock({ aiResult, onAnalyze, analyzing }) {
  const [activeTab, setActiveTab] = useState('market')
  const hasData = !!aiResult

  return (
    <div className="form-section">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="section-title mb-0">
            <span className="section-num" style={{ background: '#C8622A' }}>AI</span>
            大盘基本信息
          </div>
          {hasData && <span className="text-xs text-ash px-2 py-0.5 rounded-full border border-smoke bg-paper">已更新</span>}
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={analyzing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 border"
          style={analyzing
            ? { background: '#F5F1EB', color: '#9C8B7A', borderColor: '#E5DDD0', cursor: 'not-allowed' }
            : { background: '#1C1917', color: 'white', borderColor: '#1C1917' }
          }
        >
          {analyzing ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 rounded-full animate-spin"
                style={{ borderColor: 'rgba(255,255,255,0.25)', borderTopColor: 'white' }} />
              分析中…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 1.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"/>
                <path d="M7 4.5v3l2 1.5"/>
              </svg>
              {hasData ? '重新分析' : '获取大盘数据'}
            </>
          )}
        </button>
      </div>

      {/* 无数据占位 */}
      {!hasData && !analyzing && (
        <div className="rounded-xl border border-dashed border-smoke bg-paper/60 py-10 text-center">
          <p className="text-sm text-ash">点击「获取大盘数据」拉取今日行情与资讯</p>
          <p className="text-xs mt-1" style={{ color: '#C8C0B5' }}>由东方财富妙想 Skills 提供</p>
        </div>
      )}

      {/* 加载中占位 */}
      {analyzing && (
        <div className="rounded-xl border border-smoke bg-paper/40 py-10 text-center">
          <div className="loading-spinner mx-auto mb-3" />
          <p className="text-sm text-ash">正在拉取行情数据与今日资讯…</p>
        </div>
      )}

      {/* 双 Tab 内容 */}
      {hasData && (
        <div>
          {/* Tab 切换 */}
          <div className="flex gap-1 mb-5" style={{ borderBottom: '1px solid #E5DDD0' }}>
            {[
              { key: 'market', label: '行情数据', count: null },
              { key: 'news',   label: '资讯',     count: aiResult.news?.length },
            ].map(t => (
              <button
                key={t.key}
                type="button"
                className={`tab ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
                {t.count != null && (
                  <span className="tab-count">{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 'market' && <MarketDataTab data={aiResult.market_data} />}
          {activeTab === 'news'   && <NewsTab news={aiResult.news} />}
        </div>
      )}
    </div>
  )
}

// ── 主表单 ────────────────────────────────────────────────────
export default function PreMarketForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(defaultPMForm)
  const [submitting, setSubmitting] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState(null)

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const setPosition = (i, field, val) => setForm(f => ({
    ...f, positions: f.positions.map((p, idx) => idx === i ? { ...p, [field]: val } : p)
  }))

  const setWatchlist = (i, field, val) => setForm(f => ({
    ...f, watchlist: f.watchlist.map((w, idx) => idx === i ? { ...w, [field]: val } : w)
  }))

  const addPosition = () => setForm(f => ({
    ...f, positions: [...f.positions, { name:'', code:'', cost:'', pnl_pct:'', stop_loss:'', key_levels:'', intent:'', trigger:'' }]
  }))

  const removePosition = (i) => setForm(f => ({ ...f, positions: f.positions.filter((_, idx) => idx !== i) }))

  const addWatchlist = () => setForm(f => ({
    ...f, watchlist: [...f.watchlist, { ticker:'', code:'', reason:'', entry_condition:'', max_position:'' }]
  }))

  const removeWatchlist = (i) => setForm(f => ({ ...f, watchlist: f.watchlist.filter((_, idx) => idx !== i) }))

  // 调用后端 /api/analyze/market，拉取妙想行情+资讯
  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      const res = await fetch('/api/analyze/market')
      if (!res.ok) throw new Error(await res.text())
      setAiResult(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.date) return
    setSubmitting(true)
    try { await onSubmit(form) } finally { setSubmitting(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      {/* Header */}
      <div className="mb-9">
        <button className="back-btn" onClick={onCancel}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2L4 7l5 5"/></svg>
          返回
        </button>
        <h1 className="font-display text-2xl font-semibold mt-3 text-ink">盘前分析</h1>
        <p className="text-ash text-sm mt-1">开盘前 30–60 分钟完成，理清思路、设定预期</p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* 日期 */}
        <div className="form-section">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="form-label">日期</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="form-input" />
            </div>
            <div className="w-32">
              <label className="form-label">星期</label>
              <select value={form.weekday} onChange={e => set('weekday', e.target.value)} className="form-input">
                <option value="">—</option>
                {['一','二','三','四','五','六','日'].map(d => <option key={d} value={d}>周{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* AI 大盘分析区（双 Tab） */}
        <MarketAnalysisBlock
          aiResult={aiResult}
          onAnalyze={handleAnalyze}
          analyzing={analyzing}
        />

        {/* 四、板块与热点 */}
        <div className="form-section">
          <SectionTitle num="四">板块与热点</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            {[
              { field: 'strong_sectors',      label: '昨日强势板块' },
              { field: 'continued_direction', label: '今日预计延续方向' },
              { field: 'avoid_sectors',       label: '需要回避的板块' },
              { field: 'rotation',            label: '资金轮动方向判断' },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="form-label">{label}</label>
                <textarea value={form[field]} onChange={e => set(field, e.target.value)} className="form-textarea" rows={2} placeholder="…" />
              </div>
            ))}
          </div>
        </div>

        {/* 五、持仓梳理 */}
        <div className="form-section">
          <SectionTitle num="五">持仓梳理</SectionTitle>
          {form.positions.map((pos, i) => (
            <div key={i} className="position-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-ink/60">持仓 {i + 1}</span>
                {form.positions.length > 1 && (
                  <button type="button" onClick={() => removePosition(i)} className="w-6 h-6 flex items-center justify-center rounded text-ash hover:text-red-400 hover:bg-red-50 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 2l8 8M10 2l-8 8"/></svg>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { f: 'name',       label: '标的名称',                   ph: '名称' },
                  { f: 'code',       label: '代码',                       ph: '000001' },
                  { f: 'cost',       label: '持仓成本',                   ph: '¥' },
                  { f: 'pnl_pct',    label: '当前浮盈/亏',               ph: '%' },
                  { f: 'stop_loss',  label: '止损位',                     ph: '¥' },
                  { f: 'key_levels', label: '今日关键价位（支撑/压力）', ph: '¥ / ¥' },
                ].map(({ f, label, ph }) => (
                  <div key={f}>
                    <label className="form-label">{label}</label>
                    <input value={pos[f]} onChange={e => setPosition(i, f, e.target.value)} className="form-input" placeholder={ph} />
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <label className="form-label">今日操作意图</label>
                <div className="flex flex-wrap gap-2">
                  {['持有观望','逢高减仓','跌破止损卖出','择机加仓'].map(intent => (
                    <Tag key={intent} label={intent} active={pos.intent === intent} onClick={() => setPosition(i, 'intent', intent)} />
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label">触发条件</label>
                <textarea value={pos.trigger} onChange={e => setPosition(i, 'trigger', e.target.value)} className="form-textarea" rows={2} placeholder="如：缩量回踩均线不破则持有，放量跌破 XX 元则止损…" />
              </div>
            </div>
          ))}
          <button type="button" onClick={addPosition} className="add-row-btn">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6.5 1.5v10M1.5 6.5h10"/></svg>
            添加持仓
          </button>
        </div>

        {/* 六、候选标的 */}
        <div className="form-section">
          <SectionTitle num="六">候选标的</SectionTitle>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>标的</th><th>代码</th><th>关注理由</th><th>入场条件</th><th>仓位上限</th><th></th></tr></thead>
              <tbody>
                {form.watchlist.map((cand, i) => (
                  <tr key={i}>
                    <td><input value={cand.ticker} onChange={e => setWatchlist(i, 'ticker', e.target.value)} className="form-input-sm w-20" /></td>
                    <td><input value={cand.code} onChange={e => setWatchlist(i, 'code', e.target.value)} className="form-input-sm w-20" /></td>
                    <td><input value={cand.reason} onChange={e => setWatchlist(i, 'reason', e.target.value)} className="form-input-sm w-32" /></td>
                    <td><input value={cand.entry_condition} onChange={e => setWatchlist(i, 'entry_condition', e.target.value)} className="form-input-sm w-36" /></td>
                    <td><input value={cand.max_position} onChange={e => setWatchlist(i, 'max_position', e.target.value)} className="form-input-sm w-16" placeholder="%" /></td>
                    <td>
                      {form.watchlist.length > 1 && (
                        <button type="button" onClick={() => removeWatchlist(i)} className="w-6 h-6 flex items-center justify-center rounded text-ash hover:text-red-400 transition-colors">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 2l8 8M10 2l-8 8"/></svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={addWatchlist} className="add-row-btn mt-3">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6.5 1.5v10M1.5 6.5h10"/></svg>
            添加标的
          </button>
        </div>

        {/* 七、交易纪律 */}
        <div className="form-section">
          <SectionTitle num="七">交易纪律提醒</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">今日最多操作（笔）</label>
              <input type="number" value={form.max_trades} onChange={e => set('max_trades', e.target.value)} className="form-input" min="1" placeholder="如 3" />
            </div>
            <div>
              <label className="form-label">总仓位上限（%）</label>
              <input type="number" value={form.max_position_pct} onChange={e => set('max_position_pct', e.target.value)} className="form-input" min="1" max="100" placeholder="如 70" />
            </div>
          </div>
          <div className="mt-4">
            <label className="form-label">特别提醒</label>
            <textarea value={form.special_reminder} onChange={e => set('special_reminder', e.target.value)} className="form-textarea" rows={2} placeholder="如：上周两次追高被套，今天开盘涨停不追…" />
          </div>
        </div>

        {/* 八、核心结论 */}
        <div className="form-section">
          <SectionTitle num="八">今日核心结论</SectionTitle>
          <textarea value={form.conclusion} onChange={e => set('conclusion', e.target.value)} className="form-textarea text-base" rows={4} placeholder="用 1–3 句话总结今天的操作基调，开盘后不要频繁推翻…" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 pb-12">
          <button type="button" onClick={onCancel} className="btn-ghost">取消</button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? '保存中…' : '保存盘前分析'}
          </button>
        </div>

      </form>
    </div>
  )
}

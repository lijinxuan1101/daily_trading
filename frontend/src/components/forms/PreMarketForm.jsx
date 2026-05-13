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

// ── AI 大盘分析展示区 ─────────────────────────────────────────
function MarketAnalysisBlock({ form, onAnalyze, analyzing }) {
  const hasData = form.markets?.some(m => m.change_pct || m.notes) || form.trend

  return (
    <div className="form-section">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="section-title mb-0">
            <span className="section-num" style={{ background: '#C8622A' }}>AI</span>
            大盘基本信息
          </div>
          <span className="text-xs text-ash px-2 py-0.5 rounded-full border border-smoke bg-paper">
            由 Claude 填充
          </span>
        </div>

        {/* 分析按钮 */}
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
              <span className="inline-block w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
              分析中…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="7" r="5.5" />
                <path d="M4.5 7c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5" />
                <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
              </svg>
              Claude 分析大盘
            </>
          )}
        </button>
      </div>

      {/* 无数据状态 */}
      {!hasData && (
        <div className="rounded-xl border border-dashed border-smoke bg-paper/60 py-10 text-center">
          <div className="w-10 h-10 rounded-full bg-paper border border-smoke flex items-center justify-center mx-auto mb-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#9C8B7A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="9" r="7" />
              <path d="M6 9c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3" />
              <circle cx="9" cy="9" r="1.2" fill="#9C8B7A" stroke="none" />
            </svg>
          </div>
          <p className="text-sm text-ash">点击「Claude 分析大盘」自动填充隔夜外盘、重要事件和大盘研判</p>
          <p className="text-xs text-ash/60 mt-1">接入 Skill 后启用</p>
        </div>
      )}

      {/* 有数据时展示 */}
      {hasData && (
        <div className="space-y-5">

          {/* 隔夜外盘 */}
          {form.markets?.some(m => m.change_pct || m.notes) && (
            <div>
              <div className="text-xs font-semibold text-ash uppercase tracking-widest mb-2">一、隔夜外盘</div>
              <table className="data-table">
                <thead><tr><th>市场</th><th>涨跌幅</th><th>关键信息</th></tr></thead>
                <tbody>
                  {form.markets.filter(m => m.change_pct || m.notes).map(mkt => (
                    <tr key={mkt.key}>
                      <td className="text-sm font-medium text-ink/80">{mkt.label}</td>
                      <td className={`font-mono text-sm ${mkt.change_pct?.includes('-') ? 'text-red-500' : 'text-emerald-600'}`}>
                        {mkt.change_pct || '—'}
                      </td>
                      <td className="text-sm text-ink/70">{mkt.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {form.overseas_impact && (
                <p className="mt-2 text-sm text-ink/70 leading-relaxed">
                  {form.overseas_sentiment && <span className="font-semibold text-ink mr-1">[{form.overseas_sentiment}]</span>}
                  {form.overseas_impact}
                </p>
              )}
            </div>
          )}

          {/* 今日重要事件 */}
          {form.events?.some(e => e.checked || e.value) && (
            <div>
              <div className="text-xs font-semibold text-ash uppercase tracking-widest mb-2">二、今日重要事件</div>
              <div className="space-y-1.5">
                {form.events.filter(e => e.checked || e.value).map(evt => (
                  <div key={evt.key} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 w-4 h-4 flex-shrink-0 rounded flex items-center justify-center" style={{ background: evt.checked ? '#C8622A' : '#E5DDD0' }}>
                      {evt.checked && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </span>
                    <span>
                      <span className="font-medium text-ink/80">{evt.label}</span>
                      {evt.value && <span className="text-ash ml-1.5">{evt.value}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 大盘研判 */}
          {(form.indices?.some(i => i.close) || form.trend) && (
            <div>
              <div className="text-xs font-semibold text-ash uppercase tracking-widest mb-2">三、大盘研判</div>
              {form.indices?.some(i => i.close) && (
                <table className="data-table mb-3">
                  <thead><tr><th>指数</th><th>收盘价</th><th>涨跌幅</th><th>成交量</th></tr></thead>
                  <tbody>
                    {form.indices.filter(i => i.close || i.change).map(idx => (
                      <tr key={idx.key}>
                        <td className="text-sm font-medium text-ink/80">{idx.label}</td>
                        <td className="font-mono text-sm">{idx.close || '—'}</td>
                        <td className={`font-mono text-sm ${idx.change?.includes('-') ? 'text-red-500' : 'text-emerald-600'}`}>{idx.change || '—'}</td>
                        <td className="font-mono text-sm text-ash">{idx.volume || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                {form.trend && <span><span className="text-ash">趋势：</span><span className="font-semibold">{form.trend}</span></span>}
                {form.volume_forecast && <span><span className="text-ash">量能：</span><span className="font-semibold">{form.volume_forecast}</span></span>}
                {form.support && <span><span className="text-ash">支撑：</span><span className="font-mono">{form.support}</span></span>}
                {form.resistance && <span><span className="text-ash">压力：</span><span className="font-mono">{form.resistance}</span></span>}
              </div>
              {form.trend_reason && (
                <p className="mt-2 text-sm text-ink/70 leading-relaxed">{form.trend_reason}</p>
              )}
            </div>
          )}
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

  // 预留：Skill 接入后在这里调用 Claude API，把返回结果 merge 进 form
  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      // TODO: 调用 Claude Skill 获取大盘分析数据
      // const aiData = await callMarketAnalysisSkill(form.date)
      // setForm(f => ({ ...f, ...aiData }))
      await new Promise(r => setTimeout(r, 800)) // placeholder
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

        {/* AI 大盘分析区（一、二、三节） */}
        <MarketAnalysisBlock
          form={form}
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

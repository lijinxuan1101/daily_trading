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

export default function PreMarketForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(defaultPMForm)
  const [submitting, setSubmitting] = useState(false)

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const setMarket = (i, field, val) => setForm(f => ({
    ...f, markets: f.markets.map((m, idx) => idx === i ? { ...m, [field]: val } : m)
  }))

  const setEvent = (i, field, val) => setForm(f => ({
    ...f, events: f.events.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
  }))

  const setIndex = (i, field, val) => setForm(f => ({
    ...f, indices: f.indices.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
  }))

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

        {/* 一、隔夜外盘 */}
        <div className="form-section">
          <SectionTitle num="一">隔夜外盘</SectionTitle>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>市场</th><th>涨跌幅</th><th>关键信息</th></tr></thead>
              <tbody>
                {form.markets.map((mkt, i) => (
                  <tr key={mkt.key}>
                    <td className="font-medium text-ink/80 w-36 text-sm">{mkt.label}</td>
                    <td><input value={mkt.change_pct} onChange={e => setMarket(i, 'change_pct', e.target.value)} className="form-input-sm w-24" placeholder="+1.2%" /></td>
                    <td><input value={mkt.notes} onChange={e => setMarket(i, 'notes', e.target.value)} className="form-input-sm w-full" placeholder="关键信息…" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5">
            <label className="form-label">外盘对今日 A 股的潜在影响</label>
            <div className="flex gap-2 mb-2">
              {['正面','中性','负面'].map(s => <Tag key={s} label={s} active={form.overseas_sentiment === s} onClick={() => set('overseas_sentiment', s)} />)}
            </div>
            <textarea value={form.overseas_impact} onChange={e => set('overseas_impact', e.target.value)} className="form-textarea" rows={2} placeholder="简要说明影响逻辑…" />
          </div>
        </div>

        {/* 二、今日重要事件 */}
        <div className="form-section">
          <SectionTitle num="二">今日重要事件</SectionTitle>
          <div className="space-y-3">
            {form.events.map((evt, i) => (
              <div key={evt.key} className="flex items-start gap-3">
                <input type="checkbox" checked={evt.checked} onChange={e => setEvent(i, 'checked', e.target.checked)} className="form-checkbox mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink/80 mb-1">{evt.label}</div>
                  <input value={evt.value} onChange={e => setEvent(i, 'value', e.target.value)} className="form-input-sm w-full" placeholder={evt.placeholder} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 三、大盘研判 */}
        <div className="form-section">
          <SectionTitle num="三">大盘研判</SectionTitle>
          <p className="text-xs text-ash mb-3">昨日收盘数据</p>
          <div className="overflow-x-auto mb-5">
            <table className="data-table">
              <thead><tr><th>指数</th><th>收盘价</th><th>涨跌幅</th><th>成交量</th></tr></thead>
              <tbody>
                {form.indices.map((idx, i) => (
                  <tr key={idx.key}>
                    <td className="font-medium text-ink/80 w-28 text-sm">{idx.label}</td>
                    <td><input value={idx.close} onChange={e => setIndex(i, 'close', e.target.value)} className="form-input-sm w-24" placeholder="点位" /></td>
                    <td><input value={idx.change} onChange={e => setIndex(i, 'change', e.target.value)} className="form-input-sm w-20" placeholder="±%" /></td>
                    <td><input value={idx.volume} onChange={e => setIndex(i, 'volume', e.target.value)} className="form-input-sm w-28" placeholder="亿元" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">趋势方向</label>
              <div className="flex gap-2">
                {['强势','震荡','偏弱'].map(t => <Tag key={t} label={t} active={form.trend === t} onClick={() => set('trend', t)} />)}
              </div>
            </div>
            <div>
              <label className="form-label">量能预估</label>
              <div className="flex gap-2">
                {['放量','持平','缩量'].map(v => <Tag key={v} label={v} active={form.volume_forecast === v} onClick={() => set('volume_forecast', v)} />)}
              </div>
            </div>
            <div>
              <label className="form-label">关键支撑位</label>
              <input value={form.support} onChange={e => set('support', e.target.value)} className="form-input" placeholder="点位" />
            </div>
            <div>
              <label className="form-label">关键压力位</label>
              <input value={form.resistance} onChange={e => set('resistance', e.target.value)} className="form-input" placeholder="点位" />
            </div>
          </div>
          <div className="mt-4">
            <label className="form-label">判断理由</label>
            <textarea value={form.trend_reason} onChange={e => set('trend_reason', e.target.value)} className="form-textarea" rows={3} placeholder="在此填写判断依据…" />
          </div>
        </div>

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
                  { f: 'name',       label: '标的名称',           ph: '名称' },
                  { f: 'code',       label: '代码',               ph: '000001' },
                  { f: 'cost',       label: '持仓成本',           ph: '¥' },
                  { f: 'pnl_pct',    label: '当前浮盈/亏',       ph: '%' },
                  { f: 'stop_loss',  label: '止损位',             ph: '¥' },
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

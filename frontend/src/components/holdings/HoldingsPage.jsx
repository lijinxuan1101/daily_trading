import { useState, useEffect, useCallback } from 'react'

// ── helpers ───────────────────────────────────────────────────
const fmt = (v, prefix = '') => v != null ? `${prefix}${v}` : '—'
const pctCls = v => v == null ? '' : v >= 0 ? 'text-emerald-600' : 'text-red-500'
const today = () => new Date().toISOString().split('T')[0]

const emptyForm = () => ({
  ticker: '', ticker_code: '', cost_price: '', quantity: '',
  stop_loss: '', target1: '', target2: '', open_date: today(), notes: '',
})

// ── HoldingModal ──────────────────────────────────────────────
function HoldingModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || emptyForm())
  const [saving, setSaving] = useState(false)
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSave = async () => {
    if (!form.ticker || !form.ticker_code) return
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  const fields = [
    { f: 'ticker',      label: '标的名称',     ph: '如：贵州茅台',  span: 1 },
    { f: 'ticker_code', label: '股票代码',     ph: '如：600519',    span: 1 },
    { f: 'cost_price',  label: '持仓成本（¥）', ph: '0.00',         span: 1, mono: true },
    { f: 'quantity',    label: '持仓数量（股）', ph: '0',            span: 1, mono: true },
    { f: 'stop_loss',   label: '止损位（¥）',   ph: '0.00',         span: 1, mono: true },
    { f: 'target1',     label: '目标一（¥）',   ph: '0.00',         span: 1, mono: true },
    { f: 'target2',     label: '目标二（¥）',   ph: '0.00',         span: 1, mono: true },
    { f: 'open_date',   label: '建仓日期',      ph: '',             span: 1, type: 'date' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(28,25,23,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #E5DDD0' }}>
          <h2 className="font-display text-lg font-semibold text-ink">
            {initial ? '编辑持仓' : '新增持仓'}
          </h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-paper transition-colors text-ash">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 2l9 9M11 2l-9 9"/></svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto">
          {fields.map(({ f, label, ph, mono, type }) => (
            <div key={f}>
              <label className="form-label">{label}</label>
              <input
                type={type || 'text'}
                value={form[f]}
                onChange={e => set(f, e.target.value)}
                className={`form-input${mono ? ' font-mono' : ''}`}
                placeholder={ph}
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="form-label">备注</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              className="form-textarea" rows={2} placeholder="投资逻辑、注意事项…" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #E5DDD0' }}>
          <button onClick={onClose} className="btn-ghost">取消</button>
          <button onClick={handleSave} className="btn-primary" disabled={saving}>
            {saving ? '保存中…' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── HoldingCard ───────────────────────────────────────────────
function HoldingCard({ h, onEdit, onDelete }) {
  const totalCost   = h.cost_price && h.quantity ? h.cost_price * h.quantity : null
  const marketValue = h.current_price && h.quantity ? h.current_price * h.quantity : null

  return (
    <div className="bg-white rounded-xl p-5 transition-all duration-150" style={{ border: '1px solid #E5DDD0' }}>

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-display text-lg font-semibold text-ink">{h.ticker}</span>
            <span className="font-mono text-xs text-ash">{h.ticker_code}</span>
          </div>
          {h.open_date && <span className="text-xs text-ash">建仓 {h.open_date}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(h)} className="w-7 h-7 flex items-center justify-center rounded-lg text-ash hover:text-ink hover:bg-paper transition-colors">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 2l2 2-6 6H3V8l6-6z"/>
            </svg>
          </button>
          <button onClick={() => onDelete(h.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-ash hover:text-red-500 hover:bg-red-50 transition-colors">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3.5h9M4.5 3.5V2.5h4v1M5.5 6v3M7.5 6v3"/>
              <rect x="2.5" y="3.5" width="8" height="8" rx="1.5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div>
          <div className="stat-label">持仓成本</div>
          <div className="font-mono text-sm font-semibold text-ink">{fmt(h.cost_price, '¥')}</div>
        </div>
        <div>
          <div className="stat-label">当前价</div>
          <div className="font-mono text-sm font-semibold">
            {h.current_price
              ? <span className={pctCls(h.pnl_pct)}>{fmt(h.current_price, '¥')}</span>
              : <span className="text-ash">—</span>
            }
          </div>
        </div>
        <div>
          <div className="stat-label">持仓数量</div>
          <div className="font-mono text-sm font-semibold text-ink">{h.quantity ? `${h.quantity} 股` : '—'}</div>
        </div>
        <div>
          <div className="stat-label">市值</div>
          <div className="font-mono text-sm font-semibold text-ink">
            {marketValue ? `¥${marketValue.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}` : '—'}
          </div>
        </div>
      </div>

      {/* P&L bar */}
      {h.pnl_pct != null && (
        <div className="rounded-lg px-4 py-2.5 mb-4 flex items-center justify-between"
          style={{ background: h.pnl_pct >= 0 ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${h.pnl_pct >= 0 ? '#BBF7D0' : '#FECACA'}` }}>
          <span className="text-xs font-semibold" style={{ color: h.pnl_pct >= 0 ? '#065F46' : '#991B1B' }}>
            {h.pnl_pct >= 0 ? '浮盈' : '浮亏'}
          </span>
          <div className="flex items-center gap-3">
            {h.pnl_amount != null && (
              <span className={`font-mono text-sm font-bold ${pctCls(h.pnl_pct)}`}>
                {h.pnl_amount >= 0 ? '+' : ''}¥{h.pnl_amount.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
              </span>
            )}
            <span className={`font-mono text-sm font-bold ${pctCls(h.pnl_pct)}`}>
              {h.pnl_pct >= 0 ? '+' : ''}{h.pnl_pct}%
            </span>
          </div>
        </div>
      )}

      {/* Stop loss & targets */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
        {h.stop_loss  && <span><span className="text-ash">止损 </span><span className="font-mono text-red-500/80">¥{h.stop_loss}</span></span>}
        {h.target1    && <span><span className="text-ash">目标一 </span><span className="font-mono text-emerald-600/80">¥{h.target1}</span></span>}
        {h.target2    && <span><span className="text-ash">目标二 </span><span className="font-mono text-emerald-600/80">¥{h.target2}</span></span>}
        {h.refreshed_at && <span className="ml-auto text-ash">更新 {h.refreshed_at.slice(11, 16)}</span>}
      </div>

      {h.notes && (
        <p className="mt-3 text-xs text-ash leading-relaxed border-t border-paper pt-2">{h.notes}</p>
      )}
    </div>
  )
}

// ── HoldingsPage ──────────────────────────────────────────────
export default function HoldingsPage() {
  const [holdings, setHoldings]   = useState([])
  const [loading, setLoading]     = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [modal, setModal]         = useState(null) // null | 'new' | holdingObj

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetch('/api/holdings').then(r => r.json())
      setHoldings(data)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (form) => {
    const isEdit = form.id != null
    await fetch(isEdit ? `/api/holdings/${form.id}` : '/api/holdings', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setModal(null)
    await load()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('确认删除这条持仓记录？')) return
    await fetch(`/api/holdings/${id}`, { method: 'DELETE' })
    await load()
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const res  = await fetch('/api/holdings/refresh', { method: 'POST' }).then(r => r.json())
      if (res.holdings) setHoldings(res.holdings)
    } finally { setRefreshing(false) }
  }

  // summary stats
  const totalCost    = holdings.reduce((s, h) => s + (h.cost_price && h.quantity ? h.cost_price * h.quantity : 0), 0)
  const totalMarket  = holdings.reduce((s, h) => s + (h.current_price && h.quantity ? h.current_price * h.quantity : 0), 0)
  const totalPnl     = totalMarket - totalCost
  const totalPnlPct  = totalCost > 0 ? (totalPnl / totalCost * 100) : null

  return (
    <div className="max-w-4xl mx-auto px-10 py-10">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink mb-1">我的持仓</h1>
          <p className="text-ash text-sm">{holdings.length} 只持仓</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleRefresh} disabled={refreshing || holdings.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 border"
            style={{ borderColor: '#E5DDD0', color: refreshing ? '#9C8B7A' : '#1C1917', background: 'white', cursor: refreshing || holdings.length === 0 ? 'not-allowed' : 'pointer', opacity: holdings.length === 0 ? 0.5 : 1 }}>
            {refreshing
              ? <><span className="inline-block w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: '#E5DDD0', borderTopColor: '#9C8B7A' }} />刷新中…</>
              : <><svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 6.5A4.5 4.5 0 112.5 4"/><path d="M2.5 1.5v3h3"/></svg>刷新行情</>
            }
          </button>
          <button onClick={() => setModal('new')} className="btn-primary">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6.5 1.5v10M1.5 6.5h10"/></svg>
            新增持仓
          </button>
        </div>
      </div>

      {/* Summary stats */}
      {holdings.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="stat-label">持仓数量</div>
            <div className="stat-value">{holdings.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">总成本</div>
            <div className="font-mono font-semibold text-ink text-xl mt-1">
              {totalCost > 0 ? `¥${(totalCost / 10000).toFixed(2)}万` : '—'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">总市值</div>
            <div className="font-mono font-semibold text-ink text-xl mt-1">
              {totalMarket > 0 ? `¥${(totalMarket / 10000).toFixed(2)}万` : '—'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">总浮盈亏</div>
            <div className={`font-mono font-semibold text-xl mt-1 ${pctCls(totalPnlPct)}`}>
              {totalPnlPct != null ? `${totalPnlPct >= 0 ? '+' : ''}${totalPnlPct.toFixed(2)}%` : '—'}
            </div>
          </div>
        </div>
      )}

      {/* Holdings list */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="loading-spinner" />
        </div>
      )}

      {!loading && holdings.length === 0 && (
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-smoke mx-auto mb-3">
            <rect x="8" y="10" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M14 18h12M14 22h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M20 10V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="text-ash text-sm mb-4">还没有持仓记录</p>
          <button className="btn-primary" onClick={() => setModal('new')}>新增持仓</button>
        </div>
      )}

      {!loading && holdings.length > 0 && (
        <div className="grid gap-4">
          {holdings.map(h => (
            <HoldingCard
              key={h.id}
              h={h}
              onEdit={h => setModal(h)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <HoldingModal
          initial={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

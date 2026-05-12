import { useState } from 'react'
import { defaultTLForm } from '../../data/defaultForms'

function Tag({ label, active, onClick }) {
  return <button type="button" className={`tag-btn ${active ? 'on' : ''}`} onClick={onClick}>{label}</button>
}

export default function TradeLogForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(defaultTLForm)
  const [submitting, setSubmitting] = useState(false)

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const setRule = (i, checked) => setForm(f => ({
    ...f, discipline_rules: f.discipline_rules.map((r, idx) => idx === i ? { ...r, checked } : r)
  }))

  const setEmotion = (i, checked) => setForm(f => ({
    ...f, emotions: f.emotions.map((e, idx) => idx === i ? { ...e, checked } : e)
  }))

  const setReview = (i, val) => setForm(f => ({
    ...f, review_questions: f.review_questions.map((q, idx) => idx === i ? { ...q, a: val } : q)
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.date || !form.ticker) return
    setSubmitting(true)
    try { await onSubmit(form) } finally { setSubmitting(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <div className="mb-9">
        <button className="back-btn" onClick={onCancel}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2L4 7l5 5"/></svg>
          返回
        </button>
        <h1 className="font-display text-2xl font-semibold mt-3 text-ink">交易日志</h1>
        <p className="text-ash text-sm mt-1">买入/加仓时填写基本信息；平仓后补填复盘总结</p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* 基本信息 */}
        <div className="form-section">
          <div className="section-title"><span className="section-num" style={{background:'#C8622A'}}>1</span>基本信息</div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">日期</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="form-input" /></div>
            <div><label className="form-label">账户</label><input value={form.account} onChange={e => set('account', e.target.value)} className="form-input" placeholder="账户名称" /></div>
            <div><label className="form-label">标的名称</label><input value={form.ticker} onChange={e => set('ticker', e.target.value)} className="form-input" placeholder="如：贵州茅台" /></div>
            <div><label className="form-label">股票代码</label><input value={form.ticker_code} onChange={e => set('ticker_code', e.target.value)} className="form-input" placeholder="如：600519" /></div>
          </div>
          <div className="mt-4">
            <label className="form-label">操作方向</label>
            <div className="flex gap-2">
              {['买入','加仓','减仓','卖出'].map(d => <Tag key={d} label={d} active={form.direction === d} onClick={() => set('direction', d)} />)}
            </div>
          </div>
        </div>

        {/* 交易详情 */}
        <div className="form-section">
          <div className="section-title"><span className="section-num" style={{background:'#C8622A'}}>2</span>交易详情</div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { f: 'price',        label: '成交价格（¥）',          ph: '0.00' },
              { f: 'quantity',     label: '成交数量（股）',          ph: '0' },
              { f: 'amount',       label: '成交金额（¥）',          ph: '0.00' },
              { f: 'fee',          label: '手续费（¥）',            ph: '0.00' },
              { f: 'actual_cost',  label: '实际成本（¥）',          ph: '0.00' },
              { f: 'position_pct', label: '占总仓位比例（%）',      ph: '0' },
            ].map(({ f, label, ph }) => (
              <div key={f}>
                <label className="form-label">{label}</label>
                <input value={form[f]} onChange={e => set(f, e.target.value)} className="form-input font-mono" placeholder={ph} />
              </div>
            ))}
            <div className="col-span-2">
              <label className="form-label">持仓均价（加减仓后）（¥）</label>
              <input value={form.avg_cost} onChange={e => set('avg_cost', e.target.value)} className="form-input font-mono" placeholder="0.00" />
            </div>
          </div>
        </div>

        {/* 交易理由 */}
        <div className="form-section">
          <div className="section-title"><span className="section-num" style={{background:'#C8622A'}}>3</span>交易理由</div>
          <div className="mb-4">
            <label className="form-label">买入逻辑</label>
            <textarea value={form.buy_logic} onChange={e => set('buy_logic', e.target.value)} className="form-textarea" rows={3} placeholder="用自己的话说清楚：为什么现在买？买的是什么预期？" />
          </div>
          <div className="mb-4">
            <label className="form-label mb-3 block">参考依据</label>
            <div className="space-y-2.5">
              {[
                { refField: 'ref_tech',         valField: 'tech_reason',         label: '技术面', ph: '技术分析依据…' },
                { refField: 'ref_fundamental',  valField: 'fundamental_reason',  label: '基本面', ph: '基本面依据…' },
                { refField: 'ref_news',         valField: 'news_reason',         label: '消息面', ph: '相关消息…' },
                { refField: 'ref_capital',      valField: 'capital_reason',      label: '资金面', ph: '资金动向…' },
              ].map(({ refField, valField, label, ph }) => (
                <div key={refField} className="flex items-start gap-3">
                  <input type="checkbox" checked={form[refField]} onChange={e => set(refField, e.target.checked)} className="form-checkbox mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink/80 mb-1">{label}</div>
                    <input value={form[valField]} onChange={e => set(valField, e.target.value)} className="form-input-sm w-full" placeholder={ph} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="form-label">风险提示</label>
            <textarea value={form.risk_note} onChange={e => set('risk_note', e.target.value)} className="form-textarea" rows={2} placeholder="什么情况说明这笔交易的逻辑被证伪？" />
          </div>
        </div>

        {/* 计划管理 */}
        <div className="form-section">
          <div className="section-title"><span className="section-num" style={{background:'#C8622A'}}>4</span>计划管理</div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>类型</th><th>价格（¥）</th><th>涨跌幅</th></tr></thead>
              <tbody>
                <tr>
                  <td className="text-red-600/80 font-medium text-sm">止损位</td>
                  <td><input value={form.stop_loss} onChange={e => set('stop_loss', e.target.value)} className="form-input-sm w-28 font-mono" /></td>
                  <td><input value={form.stop_loss_pct} onChange={e => set('stop_loss_pct', e.target.value)} className="form-input-sm w-20 font-mono" placeholder="-%" /></td>
                </tr>
                <tr>
                  <td className="text-emerald-600/80 font-medium text-sm">目标一（减仓/止盈）</td>
                  <td><input value={form.target1} onChange={e => set('target1', e.target.value)} className="form-input-sm w-28 font-mono" /></td>
                  <td><input value={form.target1_pct} onChange={e => set('target1_pct', e.target.value)} className="form-input-sm w-20 font-mono" placeholder="+%" /></td>
                </tr>
                <tr>
                  <td className="text-emerald-600/80 font-medium text-sm">目标二（清仓）</td>
                  <td><input value={form.target2} onChange={e => set('target2', e.target.value)} className="form-input-sm w-28 font-mono" /></td>
                  <td><input value={form.target2_pct} onChange={e => set('target2_pct', e.target.value)} className="form-input-sm w-20 font-mono" placeholder="+%" /></td>
                </tr>
                <tr>
                  <td className="text-ink/60 font-medium text-sm">最大可承受亏损</td>
                  <td><input value={form.max_loss} onChange={e => set('max_loss', e.target.value)} className="form-input-sm w-28 font-mono" placeholder="¥" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 纪律检查 */}
        <div className="form-section">
          <div className="section-title"><span className="section-num" style={{background:'#C8622A'}}>5</span>交易纪律检查</div>
          <div className="space-y-3">
            {form.discipline_rules.map((rule, i) => (
              <div key={rule.key} className="flex items-center gap-3">
                <input type="checkbox" checked={rule.checked} onChange={e => setRule(i, e.target.checked)} className="form-checkbox" />
                <span className="text-sm text-ink/80">{rule.label}</span>
              </div>
            ))}
            <div className="flex items-start gap-3 pt-1">
              <input type="checkbox" checked={form.d_custom_checked} onChange={e => set('d_custom_checked', e.target.checked)} className="form-checkbox mt-0.5" />
              <input value={form.d_custom} onChange={e => set('d_custom', e.target.value)} className="form-input-sm flex-1" placeholder="其他规则…" />
            </div>
          </div>
          <div className="mt-4">
            <label className="form-label">违反项备注</label>
            <textarea value={form.discipline_note} onChange={e => set('discipline_note', e.target.value)} className="form-textarea" rows={2} placeholder="无 / 说明原因…" />
          </div>
        </div>

        {/* 情绪与心态 */}
        <div className="form-section">
          <div className="section-title"><span className="section-num" style={{background:'#C8622A'}}>6</span>情绪与心态</div>
          <div className="mb-4">
            <label className="form-label">决策时的情绪状态</label>
            <div className="flex flex-wrap gap-2">
              {form.emotions.map((emo, i) => (
                <Tag key={emo.key} label={emo.label} active={emo.checked} onClick={() => setEmotion(i, !emo.checked)} />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">执行信心评分</label>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => set('confidence', n)} className={`conf-dot ${form.confidence >= n ? 'on' : ''}`}>{n}</button>
              ))}
              <span className="text-sm text-ash ml-1">{form.confidence} / 5</span>
            </div>
          </div>
          <div>
            <label className="form-label">入场前的市场感受</label>
            <textarea value={form.market_feeling} onChange={e => set('market_feeling', e.target.value)} className="form-textarea" rows={2} placeholder="如：市场情绪偏乐观，板块轮动明显，但整体量能不足…" />
          </div>
        </div>

        {/* 复盘总结（可选）*/}
        <div className="form-section">
          <div className="flex items-center justify-between mb-5">
            <div className="section-title mb-0"><span className="section-num" style={{background:'#C8622A'}}>7</span>复盘总结</div>
            <span className="text-xs text-ash px-2 py-0.5 rounded-full border border-smoke bg-paper">平仓后填写</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div><label className="form-label">卖出日期</label><input type="date" value={form.sell_date} onChange={e => set('sell_date', e.target.value)} className="form-input" /></div>
            <div><label className="form-label">卖出价格（¥）</label><input value={form.sell_price} onChange={e => set('sell_price', e.target.value)} className="form-input font-mono" /></div>
            <div><label className="form-label">持仓天数</label><input type="number" value={form.hold_days} onChange={e => set('hold_days', e.target.value)} className="form-input font-mono" placeholder="天" /></div>
            <div><label className="form-label">盈亏金额（¥）</label><input value={form.pnl_amount} onChange={e => set('pnl_amount', e.target.value)} className="form-input font-mono" /></div>
            <div><label className="form-label">盈亏百分比（%）</label><input value={form.pnl_pct} onChange={e => set('pnl_pct', e.target.value)} className="form-input font-mono" /></div>
            <div>
              <label className="form-label">结果</label>
              <div className="flex gap-2">
                {['盈利','亏损','保本'].map(r => <Tag key={r} label={r} active={form.result === r} onClick={() => set('result', r)} />)}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {form.review_questions.map((rq, i) => (
              <div key={i}>
                <label className="form-label">{i + 1}. {rq.q}</label>
                <textarea value={rq.a} onChange={e => setReview(i, e.target.value)} className="form-textarea" rows={2} placeholder="在此填写…" />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 pb-12">
          <button type="button" onClick={onCancel} className="btn-ghost">取消</button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? '保存中…' : '保存交易日志'}
          </button>
        </div>

      </form>
    </div>
  )
}

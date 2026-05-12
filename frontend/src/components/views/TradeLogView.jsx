const dirCls  = d => d === '买入' || d === '加仓' ? 'badge-buy' : 'badge-sell'
const resCls  = r => ({ '盈利': 'badge-profit', '亏损': 'badge-loss', '保本': 'badge-break' })[r] || 'badge-break'
const pnlCls  = v => parseFloat(v) >= 0 ? 'text-emerald-600' : 'text-red-500'

export default function TradeLogView({ entry, onBack }) {
  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <div className="mb-9">
        <button className="back-btn" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2L4 7l5 5"/></svg>
          返回
        </button>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <h1 className="font-display text-2xl font-semibold text-ink">{entry.ticker}</h1>
          {entry.ticker_code && <span className="font-mono text-ash text-sm">{entry.ticker_code}</span>}
          {entry.direction && <span className={`badge ${dirCls(entry.direction)}`}>{entry.direction}</span>}
          {entry.result && <span className={`badge ${resCls(entry.result)}`}>{entry.result}</span>}
        </div>
        <p className="text-ash text-sm mt-1">{entry.date}</p>
      </div>

      <div className="space-y-5">

        {/* 关键数字 */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '成交价',  value: entry.price ? `¥${entry.price}` : '—', cls: '' },
            { label: '成交量',  value: entry.quantity ? `${entry.quantity} 股` : '—', cls: '' },
            { label: '止损位',  value: entry.stop_loss ? `¥${entry.stop_loss}` : '—', cls: 'text-red-500/80' },
            { label: '盈亏',    value: entry.pnl_pct ? `${entry.pnl_pct}%` : '—', cls: entry.pnl_pct ? pnlCls(entry.pnl_pct) : '' },
          ].map(({ label, value, cls }) => (
            <div key={label} className="stat-card">
              <div className="stat-label">{label}</div>
              <div className={`font-mono leading-tight mt-1 font-semibold text-xl ${cls}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* 买入逻辑 */}
        {entry.buy_logic && (
          <div className="view-section">
            <div className="view-section-title">买入逻辑</div>
            <p className="font-body text-sm leading-relaxed">{entry.buy_logic}</p>
          </div>
        )}

        {/* 参考依据 */}
        {(entry.tech_reason || entry.fundamental_reason || entry.news_reason || entry.capital_reason) && (
          <div className="view-section">
            <div className="view-section-title">参考依据</div>
            <div className="space-y-2">
              {[
                { label: '技术面', val: entry.tech_reason },
                { label: '基本面', val: entry.fundamental_reason },
                { label: '消息面', val: entry.news_reason },
                { label: '资金面', val: entry.capital_reason },
              ].filter(({ val }) => val).map(({ label, val }) => (
                <div key={label} className="text-sm">
                  <span className="text-ash font-medium mr-2">{label}</span>
                  <span className="text-ink/80">{val}</span>
                </div>
              ))}
            </div>
            {entry.risk_note && (
              <div className="mt-3 pt-3 border-t border-paper">
                <span className="text-xs font-semibold text-ash uppercase tracking-widest">风险提示 </span>
                <span className="text-sm text-ink/80">{entry.risk_note}</span>
              </div>
            )}
          </div>
        )}

        {/* 计划管理 */}
        {(entry.stop_loss || entry.target1 || entry.target2) && (
          <div className="view-section">
            <div className="view-section-title">计划管理</div>
            <table className="data-table">
              <thead><tr><th>类型</th><th>价格</th><th>幅度</th></tr></thead>
              <tbody>
                {entry.stop_loss && <tr><td className="text-red-600/80 font-medium text-sm">止损位</td><td className="font-mono text-sm">¥{entry.stop_loss}</td><td className={`font-mono text-sm text-red-500`}>{entry.stop_loss_pct || '—'}</td></tr>}
                {entry.target1 && <tr><td className="text-emerald-600/80 font-medium text-sm">目标一</td><td className="font-mono text-sm">¥{entry.target1}</td><td className="font-mono text-sm text-emerald-600">{entry.target1_pct || '—'}</td></tr>}
                {entry.target2 && <tr><td className="text-emerald-600/80 font-medium text-sm">目标二</td><td className="font-mono text-sm">¥{entry.target2}</td><td className="font-mono text-sm text-emerald-600">{entry.target2_pct || '—'}</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* 情绪 */}
        {(entry.emotions?.some(e => e.checked) || entry.confidence || entry.market_feeling) && (
          <div className="view-section">
            <div className="view-section-title">情绪与心态</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {entry.emotions?.filter(e => e.checked).map(e => (
                <span key={e.key} className="tag-btn on text-xs">{e.label}</span>
              ))}
            </div>
            {entry.confidence && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-ash text-sm">信心评分</span>
                <div className="flex gap-1.5">
                  {[1,2,3,4,5].map(n => (
                    <span key={n} className={`conf-dot ${entry.confidence >= n ? 'on' : ''}`} style={{ width: '24px', height: '24px', fontSize: '11px' }}>{n}</span>
                  ))}
                </div>
              </div>
            )}
            {entry.market_feeling && <p className="text-sm text-ink/80 leading-relaxed">{entry.market_feeling}</p>}
          </div>
        )}

        {/* 复盘 */}
        {entry.result && (
          <div className="view-section">
            <div className="view-section-title">复盘总结</div>
            <div className="grid grid-cols-3 gap-4 mb-5 text-sm">
              {entry.sell_price && <div><div className="text-ash text-xs mb-0.5">卖出价格</div><div className="font-mono font-semibold">¥{entry.sell_price}</div></div>}
              {entry.hold_days && <div><div className="text-ash text-xs mb-0.5">持仓天数</div><div className="font-mono font-semibold">{entry.hold_days} 天</div></div>}
              {entry.pnl_amount && <div><div className="text-ash text-xs mb-0.5">盈亏金额</div><div className={`font-mono font-semibold ${pnlCls(entry.pnl_amount)}`}>¥{entry.pnl_amount}</div></div>}
            </div>
            <div className="space-y-4">
              {entry.review_questions?.filter(q => q.a).map((q, i) => (
                <div key={i}>
                  <div className="text-xs font-semibold text-ash mb-1">{i + 1}. {q.q}</div>
                  <p className="font-body text-sm leading-relaxed">{q.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

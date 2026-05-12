const trendCls = { '强势': 'badge-bull', '偏弱': 'badge-bear', '震荡': 'badge-neutral' }

export default function PreMarketView({ entry, onBack }) {
  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <div className="mb-9">
        <button className="back-btn" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2L4 7l5 5"/></svg>
          返回
        </button>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <h1 className="font-display text-2xl font-semibold text-ink">{entry.date}</h1>
          {entry.weekday && <span className="text-ash">周{entry.weekday}</span>}
          {entry.trend && <span className={`badge ${trendCls[entry.trend] || 'badge-neutral'}`}>{entry.trend}</span>}
        </div>
        <p className="text-ash text-sm mt-1">盘前分析</p>
      </div>

      <div className="space-y-5">

        {/* 结论 */}
        {entry.conclusion && (
          <div className="conclusion-banner">
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(200,98,42,0.8)' }}>今日核心结论</div>
            <p className="font-body text-base leading-relaxed text-ink">{entry.conclusion}</p>
          </div>
        )}

        {/* 外盘 */}
        {entry.markets?.some(m => m.change_pct || m.notes) && (
          <div className="view-section">
            <div className="view-section-title">一、隔夜外盘</div>
            <table className="data-table">
              <thead><tr><th>市场</th><th>涨跌幅</th><th>关键信息</th></tr></thead>
              <tbody>
                {entry.markets.filter(m => m.change_pct || m.notes).map(mkt => (
                  <tr key={mkt.key}>
                    <td className="text-sm font-medium text-ink/80">{mkt.label}</td>
                    <td className={`font-mono text-sm ${mkt.change_pct?.includes('-') ? 'text-red-500' : 'text-emerald-600'}`}>{mkt.change_pct || '—'}</td>
                    <td className="text-sm">{mkt.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {entry.overseas_impact && (
              <p className="mt-3 text-sm text-ink/80 leading-relaxed">
                <span className="text-ash">影响：</span>
                {entry.overseas_sentiment && <span className="font-medium">[{entry.overseas_sentiment}] </span>}
                {entry.overseas_impact}
              </p>
            )}
          </div>
        )}

        {/* 大盘研判 */}
        {(entry.indices?.some(i => i.close) || entry.trend) && (
          <div className="view-section">
            <div className="view-section-title">三、大盘研判</div>
            {entry.indices?.some(i => i.close) && (
              <table className="data-table mb-4">
                <thead><tr><th>指数</th><th>收盘价</th><th>涨跌幅</th><th>成交量</th></tr></thead>
                <tbody>
                  {entry.indices.filter(i => i.close || i.change).map(idx => (
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
            <div className="flex flex-wrap gap-4 text-sm mb-2">
              {entry.trend && <span><span className="text-ash">趋势：</span><span className="font-semibold">{entry.trend}</span></span>}
              {entry.volume_forecast && <span><span className="text-ash">量能：</span><span className="font-semibold">{entry.volume_forecast}</span></span>}
              {entry.support && <span><span className="text-ash">支撑：</span><span className="font-mono">{entry.support}</span></span>}
              {entry.resistance && <span><span className="text-ash">压力：</span><span className="font-mono">{entry.resistance}</span></span>}
            </div>
            {entry.trend_reason && <p className="text-sm text-ink/80 leading-relaxed">{entry.trend_reason}</p>}
          </div>
        )}

        {/* 板块热点 */}
        {(entry.strong_sectors || entry.continued_direction || entry.avoid_sectors || entry.rotation) && (
          <div className="view-section">
            <div className="view-section-title">四、板块与热点</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { field: 'strong_sectors',      label: '昨日强势板块' },
                { field: 'continued_direction', label: '今日延续方向' },
                { field: 'avoid_sectors',       label: '需要回避的板块' },
                { field: 'rotation',            label: '资金轮动方向' },
              ].filter(({ field }) => entry[field]).map(({ field, label }) => (
                <div key={field}>
                  <div className="text-xs font-semibold text-ash uppercase tracking-widest mb-1">{label}</div>
                  <p className="text-sm text-ink/80 leading-relaxed">{entry[field]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 持仓 */}
        {entry.positions?.some(p => p.name) && (
          <div className="view-section">
            <div className="view-section-title">五、持仓梳理</div>
            {entry.positions.filter(p => p.name).map((pos, i) => (
              <div key={i} className="position-card">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="font-display font-semibold">{pos.name}</span>
                  {pos.code && <span className="font-mono text-xs text-ash">{pos.code}</span>}
                  {pos.intent && <span className="tag-btn on text-xs">{pos.intent}</span>}
                </div>
                <div className="grid grid-cols-4 gap-3 text-sm mb-2">
                  <div><div className="text-ash text-xs mb-0.5">成本</div><div className="font-mono">{pos.cost ? `¥${pos.cost}` : '—'}</div></div>
                  <div><div className="text-ash text-xs mb-0.5">浮盈亏</div><div className={`font-mono ${pos.pnl_pct && parseFloat(pos.pnl_pct) < 0 ? 'text-red-500' : 'text-emerald-600'}`}>{pos.pnl_pct ? `${pos.pnl_pct}%` : '—'}</div></div>
                  <div><div className="text-ash text-xs mb-0.5">止损位</div><div className="font-mono text-red-500/80">{pos.stop_loss ? `¥${pos.stop_loss}` : '—'}</div></div>
                  <div><div className="text-ash text-xs mb-0.5">关键价位</div><div className="font-mono text-xs">{pos.key_levels || '—'}</div></div>
                </div>
                {pos.trigger && <p className="text-xs text-ash leading-relaxed">{pos.trigger}</p>}
              </div>
            ))}
          </div>
        )}

        {/* 候选标的 */}
        {entry.watchlist?.some(w => w.ticker) && (
          <div className="view-section">
            <div className="view-section-title">六、候选标的</div>
            <table className="data-table">
              <thead><tr><th>标的</th><th>代码</th><th>关注理由</th><th>入场条件</th><th>仓位上限</th></tr></thead>
              <tbody>
                {entry.watchlist.filter(w => w.ticker).map((w, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-sm">{w.ticker}</td>
                    <td className="font-mono text-sm text-ash">{w.code}</td>
                    <td className="text-sm">{w.reason}</td>
                    <td className="text-sm">{w.entry_condition}</td>
                    <td className="font-mono text-sm">{w.max_position ? `${w.max_position}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 纪律 */}
        {(entry.max_trades || entry.max_position_pct || entry.special_reminder) && (
          <div className="view-section">
            <div className="view-section-title">七、交易纪律</div>
            <div className="flex gap-6 text-sm mb-3">
              {entry.max_trades && <span><span className="text-ash">最多操作：</span><span className="font-mono font-semibold">{entry.max_trades} 笔</span></span>}
              {entry.max_position_pct && <span><span className="text-ash">仓位上限：</span><span className="font-mono font-semibold">{entry.max_position_pct}%</span></span>}
            </div>
            {entry.special_reminder && <p className="text-sm text-ink/80 leading-relaxed">{entry.special_reminder}</p>}
          </div>
        )}

      </div>
    </div>
  )
}

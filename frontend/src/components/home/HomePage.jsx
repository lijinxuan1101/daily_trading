function trendBadge(trend) {
  if (!trend) return null
  const map = { '强势': 'badge-bull', '偏弱': 'badge-bear', '震荡': 'badge-neutral' }
  return <span className={`badge ${map[trend] || 'badge-neutral'}`}>{trend}</span>
}

function dirBadge(dir) {
  const cls = dir === '买入' || dir === '加仓' ? 'badge-buy' : 'badge-sell'
  return <span className={`badge ${cls}`}>{dir}</span>
}

function resultBadge(result) {
  if (!result) return null
  const map = { '盈利': 'badge-profit', '亏损': 'badge-loss', '保本': 'badge-break' }
  return <span className={`badge ${map[result] || 'badge-break'}`}>{result}</span>
}

function weekCount(pmList, tlList) {
  const d = new Date()
  const dow = d.getDay() === 0 ? 6 : d.getDay() - 1
  const monday = new Date(d); monday.setDate(d.getDate() - dow); monday.setHours(0,0,0,0)
  const ms = monday.toISOString().split('T')[0]
  return pmList.filter(e => e.date >= ms).length + tlList.filter(e => e.date >= ms).length
}

export default function HomePage({ preMarketList, tradeLogList, activeTab, onTabChange, onNavigate, onViewPreMarket, onViewTradeLog }) {
  const d = new Date()
  const days = ['日','一','二','三','四','五','六']
  const h = d.getHours()
  const greeting = h < 6 ? '夜深了' : h < 9 ? '早上好' : h < 12 ? '上午好' : h < 14 ? '午盘时间' : h < 18 ? '下午好' : '收盘了，做个复盘吧'
  const dateStr = `${d.getFullYear()} 年 ${d.getMonth()+1} 月 ${d.getDate()} 日，周${days[d.getDay()]}`

  return (
    <div className="max-w-4xl mx-auto px-10 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink mb-1">{greeting}</h1>
        <p className="text-ash text-sm">{dateStr}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <div className="stat-label">盘前分析</div>
          <div className="stat-value">{preMarketList.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">交易日志</div>
          <div className="stat-value">{tradeLogList.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">本周记录</div>
          <div className="stat-value">{weekCount(preMarketList, tradeLogList)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6" style={{ borderBottom: '1px solid #E5DDD0' }}>
        <button className={`tab ${activeTab === 'pre-market' ? 'active' : ''}`} onClick={() => onTabChange('pre-market')}>
          盘前分析 <span className="tab-count">{preMarketList.length}</span>
        </button>
        <button className={`tab ${activeTab === 'trade-logs' ? 'active' : ''}`} onClick={() => onTabChange('trade-logs')}>
          交易日志 <span className="tab-count">{tradeLogList.length}</span>
        </button>
      </div>

      {/* Pre-market list */}
      {activeTab === 'pre-market' && (
        preMarketList.length === 0
          ? <div className="empty-state">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-smoke mx-auto mb-3"><rect x="6" y="6" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="1.5"/><path d="M13 20h14M13 14h8M13 26h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <p className="text-ash text-sm mb-4">还没有盘前分析记录</p>
              <button className="btn-primary" onClick={() => onNavigate('new-pre-market')}>新建盘前分析</button>
            </div>
          : <div className="grid gap-3">
              {preMarketList.map(item => (
                <div key={item.date} className="entry-card" onClick={() => onViewPreMarket(item.date)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-mono text-sm font-medium text-ink">{item.date}</span>
                        {item.weekday && <span className="text-xs text-ash">周{item.weekday}</span>}
                        {trendBadge(item.trend)}
                      </div>
                      <p className="text-sm text-ash leading-relaxed line-clamp-2">{item.conclusion || '暂无结论'}</p>
                    </div>
                    <svg className="flex-shrink-0 mt-1 ml-3 text-smoke" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3l5 5-5 5"/></svg>
                  </div>
                </div>
              ))}
            </div>
      )}

      {/* Trade log list */}
      {activeTab === 'trade-logs' && (
        tradeLogList.length === 0
          ? <div className="empty-state">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-smoke mx-auto mb-3"><circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5"/><path d="M20 13v7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <p className="text-ash text-sm mb-4">还没有交易日志记录</p>
              <button className="btn-primary" onClick={() => onNavigate('new-trade-log')}>新建交易日志</button>
            </div>
          : <div className="grid gap-3">
              {tradeLogList.map(item => (
                <div key={item.id} className="entry-card" onClick={() => onViewTradeLog(item.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-display text-base font-semibold">{item.ticker}</span>
                        {item.ticker_code && <span className="font-mono text-xs text-ash">{item.ticker_code}</span>}
                        {item.direction && dirBadge(item.direction)}
                        {resultBadge(item.result)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-ash flex-wrap">
                        <span>{item.date}</span>
                        {item.price && <span>成交价 <span className="font-mono text-ink/70">¥{item.price}</span></span>}
                        {item.pnl_pct && (
                          <span className={parseFloat(item.pnl_pct) >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                            {item.pnl_pct}%
                          </span>
                        )}
                      </div>
                    </div>
                    <svg className="flex-shrink-0 mt-1 ml-3 text-smoke" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3l5 5-5 5"/></svg>
                  </div>
                </div>
              ))}
            </div>
      )}
    </div>
  )
}

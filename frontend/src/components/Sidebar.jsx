const today = new Date().toISOString().split('T')[0]

const IconHome = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 6L7.5 1.5L13.5 6V13H9.5V9.5H5.5V13H1.5V6Z"/>
  </svg>
)
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <rect x="1.5" y="1.5" width="12" height="12" rx="2"/><path d="M7.5 4.5V10.5M4.5 7.5H10.5"/>
  </svg>
)
const IconLog = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h11M2 7.5h7M2 11h5"/><circle cx="12" cy="11" r="2.5"/><path d="M12 9.5V11h1.5" strokeLinecap="round"/>
  </svg>
)
const IconHoldings = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1.5" y="5" width="12" height="8.5" rx="1.5"/>
    <path d="M4.5 5V3.5a3 3 0 016 0V5"/>
    <path d="M5.5 9h4M7.5 7.5V10.5"/>
  </svg>
)

export default function Sidebar({ page, onNavigate, pmCount, tlCount }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-6 pt-7 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-clay flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 9 L6 3 L10 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 7 L8 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display text-[15px] font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.9)' }}>
            交易日志
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <button onClick={() => onNavigate('home')} className={`nav-item ${page === 'home' ? 'active' : ''}`}>
          <IconHome /> <span>首页</span>
        </button>

        <div className="pt-4 pb-1 px-3">
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>新建</span>
        </div>

        <button onClick={() => onNavigate('new-pre-market')} className={`nav-item ${page === 'new-pre-market' ? 'active' : ''}`}>
          <IconPlus /> <span>盘前分析</span>
        </button>
        <button onClick={() => onNavigate('new-trade-log')} className={`nav-item ${page === 'new-trade-log' ? 'active' : ''}`}>
          <IconLog /> <span>交易日志</span>
        </button>

        <div className="pt-4 pb-1 px-3">
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>持仓</span>
        </div>

        <button onClick={() => onNavigate('holdings')} className={`nav-item ${page === 'holdings' ? 'active' : ''}`}>
          <IconHoldings /> <span>我的持仓</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex justify-between font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>
          <span>记录 <span style={{ color: 'rgba(255,255,255,0.48)' }}>{pmCount + tlCount}</span></span>
          <span>{today}</span>
        </div>
      </div>
    </aside>
  )
}

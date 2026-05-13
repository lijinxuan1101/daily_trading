import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import HomePage from './components/home/HomePage'
import PreMarketForm from './components/forms/PreMarketForm'
import TradeLogForm from './components/forms/TradeLogForm'
import PreMarketView from './components/views/PreMarketView'
import TradeLogView from './components/views/TradeLogView'
import Toast from './components/Toast'
import HoldingsPage from './components/holdings/HoldingsPage'
import * as api from './api'

export default function App() {
  const [page, setPage] = useState('home')
  const [activeTab, setActiveTab] = useState('pre-market')
  const [preMarketList, setPreMarketList] = useState([])
  const [tradeLogList, setTradeLogList] = useState([])
  const [currentEntry, setCurrentEntry] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2800)
  }, [])

  const loadLists = useCallback(async () => {
    setLoading(true)
    try {
      const [pm, tl] = await Promise.all([api.fetchPreMarketList(), api.fetchTradeLogList()])
      setPreMarketList(pm)
      setTradeLogList(tl)
    } catch { showToast('加载失败', 'error') }
    finally { setLoading(false) }
  }, [showToast])

  useEffect(() => { loadLists() }, [loadLists])

  const navigate = useCallback((p) => {
    setPage(p)
    window.scrollTo(0, 0)
  }, [])

  const handleViewPreMarket = useCallback(async (date) => {
    setLoading(true)
    try {
      setCurrentEntry(await api.getPreMarket(date))
      navigate('view-pre-market')
    } catch { showToast('加载失败', 'error') }
    finally { setLoading(false) }
  }, [navigate, showToast])

  const handleViewTradeLog = useCallback(async (id) => {
    setLoading(true)
    try {
      setCurrentEntry(await api.getTradeLog(id))
      navigate('view-trade-log')
    } catch { showToast('加载失败', 'error') }
    finally { setLoading(false) }
  }, [navigate, showToast])

  const handleSubmitPreMarket = useCallback(async (formData) => {
    await api.createPreMarket(formData)
    await loadLists()
    showToast('盘前分析已保存')
    setActiveTab('pre-market')
    navigate('home')
  }, [loadLists, navigate, showToast])

  const handleSubmitTradeLog = useCallback(async (formData) => {
    await api.createTradeLog(formData)
    await loadLists()
    showToast('交易日志已保存')
    setActiveTab('trade-logs')
    navigate('home')
  }, [loadLists, navigate, showToast])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        page={page}
        onNavigate={navigate}
        pmCount={preMarketList.length}
        tlCount={tradeLogList.length}
      />

      <main className="flex-1 overflow-y-auto bg-paper">
        {page === 'home' && (
          <HomePage
            preMarketList={preMarketList}
            tradeLogList={tradeLogList}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onNavigate={navigate}
            onViewPreMarket={handleViewPreMarket}
            onViewTradeLog={handleViewTradeLog}
          />
        )}
        {page === 'new-pre-market' && (
          <PreMarketForm
            onSubmit={handleSubmitPreMarket}
            onCancel={() => navigate('home')}
          />
        )}
        {page === 'new-trade-log' && (
          <TradeLogForm
            onSubmit={handleSubmitTradeLog}
            onCancel={() => navigate('home')}
          />
        )}
        {page === 'view-pre-market' && currentEntry && (
          <PreMarketView entry={currentEntry} onBack={() => navigate('home')} />
        )}
        {page === 'view-trade-log' && currentEntry && (
          <TradeLogView entry={currentEntry} onBack={() => navigate('home')} />
        )}
        {page === 'holdings' && (
          <HoldingsPage />
        )}
      </main>

      {loading && (
        <div className="fixed inset-0 bg-paper/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="loading-spinner" />
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

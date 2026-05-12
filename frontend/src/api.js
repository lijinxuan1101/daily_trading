async function json(res) {
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const fetchPreMarketList = () => fetch('/api/pre-market').then(json)
export const fetchTradeLogList  = () => fetch('/api/trade-logs').then(json)
export const getPreMarket       = (date) => fetch(`/api/pre-market/${date}`).then(json)
export const getTradeLog        = (id)   => fetch(`/api/trade-logs/${id}`).then(json)

export const createPreMarket = (data) =>
  fetch('/api/pre-market', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(json)

export const createTradeLog = (data) =>
  fetch('/api/trade-logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(json)

export const deletePreMarket = (date) => fetch(`/api/pre-market/${date}`, { method: 'DELETE' }).then(json)
export const deleteTradeLog  = (id)   => fetch(`/api/trade-logs/${id}`, { method: 'DELETE' }).then(json)

import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Assistant from '../components/Assistant'

export default function Dashboard() {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/stats/overview')
        setOverview(data)
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const chartData = useMemo(() => overview?.clicksPerDay || [], [overview])

  if (loading) return <p>Loading…</p>
  if (error) return <p className="text-red-400">{error}</p>

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-sm text-neutral-400">Total Links</div>
          <div className="text-3xl font-bold">{overview.totalLinks}</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-neutral-400">Total Clicks</div>
          <div className="text-3xl font-bold">{overview.totalClicks}</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-neutral-400">Avg Clicks / Link</div>
          <div className="text-3xl font-bold">{overview.totalLinks ? Math.round(overview.totalClicks / overview.totalLinks) : 0}</div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Clicks (last 14 days)</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="date" tick={{ fill: 'currentColor', fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: 'currentColor', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', color: '#fff' }} />
              <Line type="monotone" dataKey="clicks" stroke="#7c3aed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Assistant overview={overview} />
    </section>
  )
}

import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Analytics() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null) // Track which URL is being deleted

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/analytics')
        setItems(data.urls)
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const exportCsv = async () => {
    const res = await api.get('/api/stats/export', { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'analytics.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const deleteUrl = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    try {
      setDeleting(id);
      await api.delete(`/api/url/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (e) {
      alert('Failed to delete URL: ' + (e?.response?.data?.message || 'Unknown error'));
    } finally {
      setDeleting(null);
    }
  }

  if (loading) return <p>Loading…</p>
  if (error) return <p className="text-red-400">{error}</p>

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Your Links</h2>
        <button onClick={exportCsv} className="button bg-neutral-800 hover:bg-neutral-700">Export CSV</button>
      </div>
      {items.length === 0 ? (
        <p className="text-neutral-400">No links yet. Create one on the Shorten page.</p>
      ) : (
        <div className="grid gap-4">
          {items.map(it => (
            <div key={it._id} className="card p-5 flex flex-col md:flex-row md:items-center gap-3">
              <div className="md:flex-1">
                <div className="text-sm text-neutral-400">{new Date(it.createdAt).toLocaleString()}</div>
                <a href={it.shortUrl} target="_blank" rel="noreferrer" className="text-lg font-semibold link">{it.shortUrl}</a>
                <div className="text-sm text-neutral-300 truncate">{it.originalUrl}</div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <div>
                  <div className="text-2xl font-bold">{it.clicks}</div>
                  <div className="text-xs text-neutral-400">clicks</div>
                  {it.expiresAt && <div className="text-xs text-neutral-400 mt-1">expires {new Date(it.expiresAt).toLocaleString()}</div>}
                </div>
                <button
                  onClick={() => deleteUrl(it._id)}
                  disabled={deleting === it._id}
                  className="button bg-red-900 hover:bg-red-800 px-3 py-1 text-sm"
                >
                  {deleting === it._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

import { useState } from 'react'
import api from '../lib/api'
import UrlCard from '../components/UrlCard'
import { useAuth } from '../context/AuthContext'

export default function Shorten() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [category, setCategory] = useState('Other')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [urlDoc, setUrlDoc] = useState(null)
  const { isAuthenticated } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true); setUrlDoc(null)
    try {
      const payload = { originalUrl, category, tags }
      if (customSlug) payload.customSlug = customSlug
      if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString()
      const { data } = await api.post('/api/url/shorten', payload)
      setUrlDoc(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to shorten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Create a short link</h2>
      {!isAuthenticated && (
        <p className="mb-4 text-sm text-neutral-400">Tip: Login to track your links and analytics.</p>
      )}
      <form onSubmit={submit} className="card p-6 space-y-4">
        <div>
          <label className="block mb-2 text-sm text-neutral-400">Original URL</label>
          <input required className="input" placeholder="https://example.com/very/long/link" value={originalUrl} onChange={e=>setOriginalUrl(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm text-neutral-400">Custom slug (optional)</label>
            <input className="input" placeholder="my-custom" value={customSlug} onChange={e=>setCustomSlug(e.target.value)} />
          </div>
          <div>
            <label className="block mb-2 text-sm text-neutral-400">Expiration (optional)</label>
            <input type="datetime-local" className="input" value={expiresAt} onChange={e=>setExpiresAt(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm text-neutral-400">Category</label>
            <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
              <option>Work</option>
              <option>Personal</option>
              <option>Projects</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm text-neutral-400">Tags (comma separated)</label>
            <input className="input" placeholder="news, marketing" value={tags} onChange={e=>setTags(e.target.value)} />
          </div>
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button disabled={loading} className="button w-full">{loading ? 'Shortening…' : 'Shorten URL'}</button>
      </form>

      {urlDoc && (
        <div className="mt-6">
          <UrlCard urlDoc={urlDoc} />
        </div>
      )}
    </section>
  )
}

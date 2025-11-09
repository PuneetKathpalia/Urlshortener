import { useState } from 'react'
import QRCodeBox from './QRCodeBox'
import api from '../lib/api'

export default function UrlCard({ urlDoc, onDelete }) {
  const [copied, setCopied] = useState(false)
  const short = urlDoc?.shortUrl

  const copy = async () => {
    if (!short) return
    try {
      await navigator.clipboard.writeText(short)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const downloadQR = () => {
    const el = document.getElementById(`qr-${urlDoc._id}`)
    if (!el) return
    const svgData = new XMLSerializer().serializeToString(el)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${urlDoc.slug}-qr.svg`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <input readOnly value={short || ''} className="input md:flex-1" />
        <button onClick={copy} className="button min-w-28">{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <div className="flex items-center gap-4">
        <QRCodeBox value={short} id={`qr-${urlDoc._id}`} />
        <div className="text-sm text-neutral-300">
          <div><span className="text-neutral-500">Original:</span> {urlDoc.originalUrl}</div>
          <div><span className="text-neutral-500">Clicks:</span> {urlDoc.clicks}</div>
          {urlDoc.category && <div><span className="text-neutral-500">Category:</span> {urlDoc.category}</div>}
          {(urlDoc.tags?.length>0) && <div><span className="text-neutral-500">Tags:</span> {urlDoc.tags.join(', ')}</div>}
          {urlDoc.expiresAt && (
            <div><span className="text-neutral-500">Expires:</span> {new Date(urlDoc.expiresAt).toLocaleString()}</div>
          )}
          <div className="mt-3 flex gap-2">
            <button onClick={downloadQR} className="button bg-neutral-800 hover:bg-neutral-700">Download QR</button>
            <button 
              onClick={async () => {
                if (!window.confirm('Are you sure you want to delete this URL?')) return;
                try {
                  await api.delete(`/api/url/${urlDoc._id}`);
                  onDelete?.(urlDoc._id);
                } catch (e) {
                  alert('Failed to delete URL');
                }
              }} 
              className="button bg-red-900 hover:bg-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

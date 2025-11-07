import { useMemo, useRef, useState } from 'react'

export default function Assistant({ overview }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! Ask me about your clicks, top days, or how to use features.' }
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const answer = (q) => {
    const lc = q.toLowerCase()
    let resp = "I didn't get that. Try: 'total clicks', 'best day', 'how to create custom slug'"
    if (!overview) resp = 'Analytics not loaded yet.'
    else if (lc.includes('total') && lc.includes('click')) resp = `You have ${overview.totalClicks} total clicks across ${overview.totalLinks} links.`
    else if (lc.includes('total') && (lc.includes('link') || lc.includes('urls'))) resp = `You created ${overview.totalLinks} links.`
    else if (lc.includes('best') || lc.includes('top')) {
      const best = [...(overview.clicksPerDay||[])].sort((a,b)=>b.clicks-a.clicks)[0]
      resp = best ? `Your top day was ${best.date} with ${best.clicks} clicks.` : 'No clicks yet.'
    }
    else if (lc.includes('custom') && lc.includes('slug')) resp = 'On Shorten page, fill "Custom slug" to choose your link ID.'
    else if (lc.includes('export') && lc.includes('csv')) resp = 'Go to Analytics and click Export CSV.'
    return resp
  }

  const send = () => {
    if (!input.trim()) return
    const q = input.trim()
    setMessages(m => [...m, { from: 'user', text: q }, { from: 'bot', text: answer(q) }])
    setInput('')
    inputRef.current?.focus()
  }

  const suggestions = useMemo(() => [
    'What are my total clicks?',
    'Which day performed best?',
    'How do I create a custom slug?',
    'How to export CSV?'
  ], [])

  return (
    <div className="card p-6">
      <h3 className="font-semibold mb-3">Assistant</h3>
      <div className="space-y-2 max-h-64 overflow-auto">
        {messages.map((m,i) => (
          <div key={i} className={m.from==='bot' ? 'text-sm text-neutral-200' : 'text-sm text-brand-500'}>
            {m.from==='bot' ? '🤖 ' : '🧑 '} {m.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input ref={inputRef} className="input flex-1" placeholder="Ask about your analytics..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && send()} />
        <button onClick={send} className="button">Send</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {suggestions.map(s => (
          <button key={s} onClick={()=>{ setInput(s); setTimeout(send, 0); }} className="px-2 py-1 rounded border border-neutral-700 hover:bg-neutral-800">{s}</button>
        ))}
      </div>
    </div>
  )
}

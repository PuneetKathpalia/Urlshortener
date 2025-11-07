import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="container py-16">
      <div className="grid md:grid-cols-2 items-center gap-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Shorten. Share. Track.
          </h1>
          <p className="text-neutral-300 text-lg">
            LinkLite turns long URLs into sleek short links with analytics, QR codes, expirations, and custom slugs.
          </p>
          <div className="flex gap-3">
            <Link to="/shorten" className="button">Get Started</Link>
            <Link to="/analytics" className="button bg-neutral-800 hover:bg-neutral-700">View Analytics</Link>
          </div>
        </div>
        <div className="card p-8">
          <div className="aspect-video rounded-lg bg-gradient-to-br from-brand-700 to-neutral-800 flex items-center justify-center text-2xl font-semibold">
            URL Shortener
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-neutral-300">
            <li className="card p-3">Custom Links</li>
            <li className="card p-3">Click Analytics</li>
            <li className="card p-3">QR Codes</li>
            <li className="card p-3">Expiration</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

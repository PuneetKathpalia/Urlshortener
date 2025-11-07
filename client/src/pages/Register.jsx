import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6">Create account</h2>
      <form onSubmit={submit} className="card p-6 space-y-4">
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <div>
          <label className="block mb-2 text-sm text-neutral-400">Name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-2 text-sm text-neutral-400">Email</label>
          <input type="email" className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-2 text-sm text-neutral-400">Password</label>
          <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button disabled={loading} className="button w-full">{loading ? 'Creating…' : 'Register'}</button>
        <p className="text-sm text-neutral-400">Have an account? <Link className="link" to="/login">Login</Link></p>
      </form>
    </section>
  )
}

import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-neutral-800/80 bg-neutral-950/60">
      <div className="container py-3 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand-600">🔗</span>
          <span>LinkLite</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'}>Home</NavLink>
          <NavLink to="/shorten" className={({isActive}) => isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'}>Shorten</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'}>Dashboard</NavLink>
          <NavLink to="/analytics" className={({isActive}) => isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'}>Analytics</NavLink>
          <ThemeToggle />
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className="button !py-1.5">Login</NavLink>
              <NavLink to="/register" className="button !py-1.5 bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700">Register</NavLink>
            </>
          ) : (
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="button !py-1.5 bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            >Logout</button>
          )}
        </nav>
      </div>
    </header>
  )
}

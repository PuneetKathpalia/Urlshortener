import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle} title="Toggle theme"
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}

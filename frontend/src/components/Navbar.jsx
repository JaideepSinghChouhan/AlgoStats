import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navLinks = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { to: '/profile', label: 'Profile', icon: '👤' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-dark-500 bg-dark-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-sm font-bold shadow-glow-brand">
              AS
            </div>
            <span className="font-bold text-lg text-white tracking-tight">AlgoStats</span>
          </Link>

          {/* Nav Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon }) => {
                const active = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-dark-600'
                    }`}
                  >
                    <span>{icon}</span>
                    {label}
                  </Link>
                )
              })}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-500">
                  <div className="w-6 h-6 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{user.username}</span>
                </div>
                <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary text-sm px-4 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {user && (
        <div className="md:hidden border-t border-dark-600 px-4 py-2 flex gap-1 overflow-x-auto">
          {navLinks.map(({ to, label, icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  active ? 'bg-brand-500/20 text-brand-400' : 'text-slate-400'
                }`}
              >
                {icon} {label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}

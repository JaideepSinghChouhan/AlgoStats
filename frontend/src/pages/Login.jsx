import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.toLowerCase().endsWith('@skit.ac.in')) {
      toast.error('Only @skit.ac.in college emails are allowed')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login({ _id: data._id, username: data.username, email: data.email }, data.token)
      toast.success(`Welcome back, ${data.username}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-brand mx-auto mb-4 flex items-center justify-center text-xl font-bold shadow-glow-brand">
            AS
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-brand-400 mt-1 font-medium tracking-wide text-sm">Compete. Climb. Conquer your campus.</p>
          <p className="text-slate-400 mt-2">Sign in to your AlgoStats account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">College Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                pattern=".+@skit\.ac\.in$"
                title="Must be a valid @skit.ac.in college email"
                placeholder="b230xxx@skit.ac.in"
                required
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="input"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

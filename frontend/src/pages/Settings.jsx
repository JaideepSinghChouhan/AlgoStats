import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const PLATFORMS = [
  { key: 'cfHandle', label: 'Codeforces Handle', icon: '🔴', placeholder: 'e.g. tourist', link: 'https://codeforces.com', color: 'focus:border-red-500 focus:ring-red-500' },
  { key: 'lcHandle', label: 'LeetCode Handle', icon: '🟡', placeholder: 'e.g. neal_wu', link: 'https://leetcode.com', color: 'focus:border-amber-500 focus:ring-amber-500' },
  { key: 'ccHandle', label: 'CodeChef Handle', icon: '🟢', placeholder: 'e.g. gennady', link: 'https://codechef.com', color: 'focus:border-emerald-500 focus:ring-emerald-500' },
  { key: 'acHandle', label: 'AtCoder Handle', icon: '🔵', placeholder: 'e.g. tourist', link: 'https://atcoder.jp', color: 'focus:border-blue-500 focus:ring-blue-500' },
]

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [handles, setHandles] = useState({ cfHandle: '', lcHandle: '', ccHandle: '', acHandle: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/user/profile')
      .then(({ data }) => {
        setHandles({
          cfHandle: data.cfHandle || '',
          lcHandle: data.lcHandle || '',
          ccHandle: data.ccHandle || '',
          acHandle: data.acHandle || '',
        })
      })
      .catch(() => toast.error('Could not load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => setHandles({ ...handles, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put('/user/handles', handles)
      updateUser(data)
      toast.success('Handles saved and stats fetched! 🎉')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save handles')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">⚙️ Settings</h1>
        <p className="text-slate-400 mt-1">Connect your CP platform handles to track your stats</p>
      </div>

      <div className="card p-8 animate-slide-up">
        <form onSubmit={handleSave} className="space-y-6">
          {PLATFORMS.map(({ key, label, icon, placeholder, link, color }) => (
            <div key={key}>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                <span>{icon}</span>
                <span>{label}</span>
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto text-xs text-slate-500 hover:text-brand-400"
                >
                  Visit ↗
                </a>
              </label>
              <input
                type="text"
                name={key}
                value={handles[key]}
                onChange={handleChange}
                placeholder={placeholder}
                className={`input ${color}`}
              />
            </div>
          ))}

          <div className="pt-2">
            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving & fetching stats...
                </span>
              ) : '💾 Save Handles & Refresh Stats'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 rounded-xl bg-dark-800 border border-dark-500">
          <p className="text-xs text-slate-500">
            <span className="text-slate-400 font-medium">ℹ️ Note:</span> Stats are automatically fetched from each platform when you save. This may take a few seconds. Stats are also refreshed every 24 hours automatically.
          </p>
        </div>
      </div>

      {/* Score formula reminder */}
      <div className="card p-5 mt-4 border border-brand-500/20">
        <h3 className="text-sm font-semibold text-white mb-2">📐 Score Formula</h3>
        <code className="text-xs text-brand-400 leading-relaxed block">
          score = CF_rating × 1.5<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ LC_contest_rating × 1.0<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ LC_solved × 2<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ CC_rating × 1.0<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ AC_rating × 1.0
        </code>
      </div>
    </div>
  )
}

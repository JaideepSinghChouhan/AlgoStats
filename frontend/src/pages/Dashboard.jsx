import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const PLATFORM_CONFIG = [
  {
    key: 'cf',
    name: 'Codeforces',
    color: 'from-red-500/20 to-red-600/5',
    border: 'border-red-500/30',
    accent: 'text-red-400',
    icon: '🔴',
    ratingKey: 'cfRating',
    solvedKey: 'cfSolved',
    maxRatingKey: 'cfMaxRating',
    handleKey: 'cfHandle',
    link: (h) => `https://codeforces.com/profile/${h}`,
  },
  {
    key: 'lc',
    name: 'LeetCode',
    color: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/30',
    accent: 'text-amber-400',
    icon: '🟡',
    ratingKey: 'lcContestRating',
    solvedKey: 'lcSolved',
    handleKey: 'lcHandle',
    link: (h) => `https://leetcode.com/${h}`,
  },
  {
    key: 'cc',
    name: 'CodeChef',
    color: 'from-emerald-500/20 to-emerald-600/5',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-400',
    icon: '🟢',
    ratingKey: 'ccRating',
    solvedKey: 'ccSolved',
    handleKey: 'ccHandle',
    link: (h) => `https://www.codechef.com/users/${h}`,
  },
  {
    key: 'ac',
    name: 'AtCoder',
    color: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/30',
    accent: 'text-blue-400',
    icon: '🔵',
    ratingKey: 'acRating',
    solvedKey: 'acSolved',
    handleKey: 'acHandle',
    link: (h) => `https://atcoder.jp/users/${h}`,
  },
]

function StatCard({ platform, data }) {
  const handle = data[platform.handleKey]
  const rating = data[platform.ratingKey] || 0
  const solved = data[platform.solvedKey] || 0
  const maxRating = platform.maxRatingKey ? data[platform.maxRatingKey] : null

  return (
    <div className={`card p-6 bg-gradient-to-br ${platform.color} border ${platform.border} animate-slide-up hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{platform.icon}</span>
          <div>
            <h3 className="font-semibold text-white">{platform.name}</h3>
            {handle ? (
              <a
                href={platform.link(handle)}
                target="_blank"
                rel="noreferrer"
                className={`text-xs ${platform.accent} hover:underline`}
              >
                @{handle}
              </a>
            ) : (
              <Link to="/settings" className="text-xs text-slate-500 hover:text-slate-400">
                + Add handle
              </Link>
            )}
          </div>
        </div>
        {maxRating !== null && maxRating > 0 && (
          <div className="text-right">
            <div className="text-xs text-slate-500">Max</div>
            <div className={`text-sm font-semibold ${platform.accent}`}>{maxRating}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Rating</div>
          <div className={`text-2xl font-bold ${rating > 0 ? platform.accent : 'text-slate-600'}`}>
            {rating > 0 ? rating : '—'}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Solved</div>
          <div className={`text-2xl font-bold ${solved > 0 ? 'text-white' : 'text-slate-600'}`}>
            {solved > 0 ? solved : '—'}
          </div>
        </div>
      </div>

      {/* Progress bar representing solved relative to 1000 problems */}
      {solved > 0 && (
        <div className="mt-4">
          <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${platform.color.replace('/20', '').replace('/5', '')} transition-all duration-700`}
              style={{ width: `${Math.min((solved / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [rank, setRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const [profileRes, lbRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/leaderboard'),
      ])
      setProfile(profileRes.data)
      const userRank = lbRes.data.findIndex((u) => u._id === profileRes.data._id) + 1
      setRank(userRank > 0 ? userRank : null)
    } catch {
      toast.error('Could not load your data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const { data } = await api.post('/user/refresh')
      setProfile(data)
      toast.success('Stats refreshed!')
    } catch {
      toast.error('Refresh failed')
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalSolved = (profile?.cfSolved || 0) + (profile?.lcSolved || 0) + (profile?.ccSolved || 0) + (profile?.acSolved || 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Hey, <span className="text-transparent bg-clip-text bg-gradient-brand">{user?.username}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1">Here's your competitive programming overview</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-secondary flex items-center gap-2 self-start sm:self-auto"
        >
          {refreshing ? (
            <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : '🔄'}
          {refreshing ? 'Refreshing...' : 'Refresh Stats'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Overall Score', value: Math.round(profile?.score || 0), icon: '⭐', accent: 'text-brand-400' },
          { label: 'Global Rank', value: rank ? `#${rank}` : '—', icon: '🏆', accent: 'text-amber-400' },
          { label: 'Total Solved', value: totalSolved, icon: '✅', accent: 'text-emerald-400' },
          { label: 'Platforms', value: [profile?.cfHandle, profile?.lcHandle, profile?.ccHandle, profile?.acHandle].filter(Boolean).length + ' / 4', icon: '🌐', accent: 'text-purple-400' },
        ].map(({ label, value, icon, accent }) => (
          <div key={label} className="card p-5 flex flex-col gap-1 hover:scale-105 transition-transform duration-200">
            <div className="text-2xl">{icon}</div>
            <div className={`text-2xl font-bold ${accent}`}>{value}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      {/* Platform Cards */}
      <h2 className="text-lg font-semibold text-white mb-4">Platform Stats</h2>
      {profile ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {PLATFORM_CONFIG.map((p) => (
            <StatCard key={p.key} platform={p} data={profile} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center text-slate-500">
          <p>Add your platform handles in <Link to="/settings" className="text-brand-400 hover:underline">Settings</Link> to see your stats!</p>
        </div>
      )}

      {/* Score breakdown */}
      {profile && profile.score > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Score Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Codeforces Rating × 1.5', value: Math.round((profile.cfRating || 0) * 1.5), color: 'bg-red-500' },
              { label: 'LeetCode Contest Rating × 1.0', value: Math.round((profile.lcContestRating || 0) * 1.0), color: 'bg-amber-500' },
              { label: 'LeetCode Solved × 2', value: Math.round((profile.lcSolved || 0) * 2), color: 'bg-yellow-500' },
              { label: 'CodeChef Rating × 1.0', value: Math.round((profile.ccRating || 0) * 1.0), color: 'bg-emerald-500' },
              { label: 'AtCoder Rating × 1.0', value: Math.round((profile.acRating || 0) * 1.0), color: 'bg-blue-500' },
            ].map(({ label, value, color }) => {
              const total = Math.round(profile.score) || 1
              const pct = Math.round((value / total) * 100)
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-semibold">{value} pts</span>
                  </div>
                  <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
            <div className="flex justify-between text-sm pt-3 border-t border-dark-500">
              <span className="font-semibold text-white">Total Score</span>
              <span className="text-brand-400 font-bold text-lg">{Math.round(profile.score)} pts</span>
            </div>
          </div>
        </div>
      )}

      {/* Last updated */}
      {profile?.lastUpdated && (
        <p className="text-xs text-slate-600 mt-4 text-center">
          Last updated: {new Date(profile.lastUpdated).toLocaleString()}
        </p>
      )}
    </div>
  )
}

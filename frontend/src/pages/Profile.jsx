import { useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [rank, setRank] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/user/profile'), api.get('/leaderboard')])
      .then(([pRes, lbRes]) => {
        setProfile(pRes.data)
        const r = lbRes.data.findIndex((u) => u._id === pRes.data._id) + 1
        setRank(r > 0 ? r : null)
      })
      .catch(() => toast.error('Could not load profile'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) return null

  const platforms = [
    { name: 'Codeforces', handle: profile.cfHandle, rating: profile.cfRating, solved: profile.cfSolved, icon: '🔴', link: `https://codeforces.com/profile/${profile.cfHandle}`, accent: 'text-red-400 border-red-500/30 bg-red-500/10' },
    { name: 'LeetCode', handle: profile.lcHandle, rating: profile.lcContestRating, solved: profile.lcSolved, icon: '🟡', link: `https://leetcode.com/${profile.lcHandle}`, accent: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { name: 'CodeChef', handle: profile.ccHandle, rating: profile.ccRating, solved: profile.ccSolved, icon: '🟢', link: `https://www.codechef.com/users/${profile.ccHandle}`, accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { name: 'AtCoder', handle: profile.acHandle, rating: profile.acRating, solved: profile.acSolved, icon: '🔵', link: `https://atcoder.jp/users/${profile.acHandle}`, accent: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="card p-8 mb-6 animate-slide-up">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center text-3xl font-bold shadow-glow-brand flex-shrink-0">
            {profile.username?.[0]?.toUpperCase()}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{profile.email}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {rank && (
                <span className="px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-400 text-sm font-semibold">
                  🏆 Rank #{rank}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm font-semibold">
                ⭐ {Math.round(profile.score)} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <h2 className="text-lg font-semibold text-white mb-4">Platform Stats</h2>
      <div className="space-y-3">
        {platforms.map((p) => (
          p.handle ? (
            <div key={p.name} className={`card p-5 border ${p.accent.split(' ').find(c => c.startsWith('border'))} ${p.accent.split(' ').find(c => c.startsWith('bg'))} animate-slide-up`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{p.name}</div>
                    <a href={p.link} target="_blank" rel="noreferrer" className={`text-xs ${p.accent.split(' ')[0]} hover:underline`}>
                      @{p.handle}
                    </a>
                  </div>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <div className="text-xs text-slate-500 uppercase">Rating</div>
                    <div className={`font-bold ${p.accent.split(' ')[0]}`}>{p.rating || '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase">Solved</div>
                    <div className="font-bold text-white">{p.solved || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key={p.name} className="card p-5 border border-dark-500 opacity-50">
              <div className="flex items-center gap-3">
                <span className="text-2xl grayscale">{p.icon}</span>
                <span className="text-slate-500">{p.name} — not connected</span>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

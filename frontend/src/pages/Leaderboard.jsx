import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const RANK_ICONS = { 1: '🥇', 2: '🥈', 3: '🥉' }

function getRankClass(rank) {
  if (rank === 1) return 'badge-rank-gold'
  if (rank === 2) return 'badge-rank-silver'
  if (rank === 3) return 'badge-rank-bronze'
  return 'badge-rank-default'
}

export default function Leaderboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/leaderboard')
      .then(({ data }) => setUsers(data))
      .catch(() => toast.error('Failed to load leaderboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          🏆 <span>Leaderboard</span>
        </h1>
        <p className="text-slate-400 mt-1">{users.length} coders ranked by score</p>
      </div>

      {users.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          No users on the leaderboard yet. Be the first!
        </div>
      ) : (
        <div className="card overflow-hidden animate-slide-up">
          {/* Top 3 podium */}
          {users.length >= 1 && (
            <div className="p-6 border-b border-dark-500 bg-gradient-to-r from-dark-700 to-dark-800">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {users.slice(0, Math.min(3, users.length)).map((u) => (
                  <div
                    key={u._id}
                    className={`flex flex-col items-center p-4 rounded-xl border ${
                      u.rank === 1 ? 'border-amber-500/40 bg-amber-500/10' :
                      u.rank === 2 ? 'border-slate-400/40 bg-slate-400/10' :
                      'border-orange-500/40 bg-orange-500/10'
                    } ${u.rank === 1 ? 'order-first sm:order-2 scale-110' : u.rank === 2 ? 'sm:order-1' : 'sm:order-3'} min-w-[120px]`}
                  >
                    <div className="text-3xl mb-1">{RANK_ICONS[u.rank]}</div>
                    <div className="font-bold text-white text-sm">{u.username}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{Math.round(u.score)} pts</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-500 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 w-16">Rank</th>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-right px-4 py-3">Score</th>
                  <th className="text-right px-4 py-3">CF</th>
                  <th className="text-right px-4 py-3">LC Rating</th>
                  <th className="text-right px-4 py-3">LC Solved</th>
                  <th className="text-right px-4 py-3">CC</th>
                  <th className="text-right px-4 py-3">AC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600">
                {users.map((u) => {
                  const isMe = user && u._id === user._id
                  return (
                    <tr
                      key={u._id}
                      className={`transition-colors ${isMe ? 'bg-brand-500/10 border-l-2 border-l-brand-500' : 'hover:bg-dark-700/50'}`}
                    >
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${getRankClass(u.rank)}`}>
                          {RANK_ICONS[u.rank] || `#${u.rank}`}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {u.username?.[0]?.toUpperCase()}
                          </div>
                          <span className={`font-medium ${isMe ? 'text-brand-400' : 'text-white'}`}>
                            {u.username} {isMe && <span className="text-xs text-brand-500">(you)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-brand-400">{Math.round(u.score)}</td>
                      <td className="px-4 py-3.5 text-right text-red-400">{u.cfRating || '—'}</td>
                      <td className="px-4 py-3.5 text-right text-amber-400">{u.lcContestRating || '—'}</td>
                      <td className="px-4 py-3.5 text-right text-yellow-300">{u.lcSolved || '—'}</td>
                      <td className="px-4 py-3.5 text-right text-emerald-400">{u.ccRating || '—'}</td>
                      <td className="px-4 py-3.5 text-right text-blue-400">{u.acRating || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-600 mt-4 text-center">
        Score = CF × 1.5 + LC Contest × 1.0 + LC Solved × 2 + CC × 1.0 + AC × 1.0
      </p>
    </div>
  )
}

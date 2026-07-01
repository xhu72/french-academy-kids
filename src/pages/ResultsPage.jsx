import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LEVELS } from '../data/levels'
import { saveQuizResult, getUserProgress, unlockNextLevel } from '../services/progressService'

export default function ResultsPage() {
  const { levelId, topic } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const level = LEVELS.find(l => l.id === Number(levelId))
  const topicName = decodeURIComponent(topic)

  const { score = 0, maxScore = 0, total = 0 } = location.state ?? {}
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  const passed = percentage >= (level?.passMark ?? 70)

  const [levelUnlocked, setLevelUnlocked] = useState(false)

  useEffect(() => {
    if (!user || !level) return

    async function saveAndCheck() {
      // 1 — save this topic's result
      await saveQuizResult(user.uid, topicName, { score, maxScore, percentage })

      // 2 — reload all progress and check if every topic now meets the pass mark
      const allProgress = await getUserProgress(user.uid)

      const allTopicsPassed = level.topics.every(t => {
        const topicProgress = allProgress[t]
        return topicProgress && topicProgress.bestPercentage >= level.passMark
      })

      // 3 — unlock the next level if all topics passed and next level exists
      if (allTopicsPassed && level.id < 4) {
        await unlockNextLevel(user.uid, level.id)
        setLevelUnlocked(true)
      }

    }

    saveAndCheck()
  }, [])

  function getStars() {
    if (!passed)                           return 0
    if (percentage >= level.passMark + 20) return 3
    if (percentage >= level.passMark + 10) return 2
    return 1
  }
  const stars = getStars()

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => navigate('/home')} className="text-blue-600 underline">
          Back to home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">

      <nav className="border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇫🇷</span>
          <span className="font-bold">French Academy Kids</span>
        </div>
        <button onClick={() => navigate('/home')} className="text-sm text-gray-500">
          Home
        </button>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        <div>
          <h1 className="text-2xl font-bold">Quiz complete</h1>
          <p className="text-gray-500">{topicName} · Level {levelId}</p>
        </div>

        {/* Score banner */}
        <div className="border rounded px-6 py-8 text-center">
          <div className="text-4xl mb-3">
            {[1, 2, 3].map(n => (
              <span key={n} style={{ opacity: n <= stars ? 1 : 0.25 }}>⭐</span>
            ))}
          </div>
          <p className="text-5xl font-bold mb-1">{percentage}%</p>
          <p className="text-sm text-gray-500 mb-3">
            {score} / {maxScore} points · {total} questions
          </p>
          <span
            className="px-4 py-1 rounded-full font-bold text-sm"
            style={{
              background: passed ? '#DCFCE7' : '#FEE2E2',
              color:      passed ? '#15803D' : '#B91C1C',
            }}
          >
            {passed ? `Passed! (${level.passMark}% needed)` : `Not yet (${level.passMark}% needed)`}
          </span>
        </div>

        {/* Level unlock celebration */}
        {levelUnlocked && (
          <div className="border rounded px-6 py-4">
            <p className="text-3xl mb-2">🎉</p>
            <p className="font-bold">Level {level.id + 1} unlocked!</p>
            <p className="text-sm text-gray-500 mt-1">
              You completed all topics in Level {level.id}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          {!passed && (
            <button
              onClick={() => navigate(`/quiz/${levelId}/${encodeURIComponent(topicName)}`)}
              className="w-full py-4 rounded border font-bold"
            >
              Try again
            </button>
          )}

          <button
            onClick={() => navigate(`/level/${levelId}`)}
            className="w-full py-4 rounded border font-bold"
          >
            Back to topics
          </button>

          <button
            onClick={() => navigate('/home')}
            className="w-full py-3 text-sm text-gray-400"
          >
            Back to home
          </button>
        </div>

      </main>
    </div>
  )
}

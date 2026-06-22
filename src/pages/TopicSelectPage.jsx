import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { useAuth } from '../context/AuthContext'
import { LEVELS } from '../data/levels'
import questions from '../data/questions.json'
import TopicCard from '../components/TopicCard'

export default function TopicSelectPage() {
  const { levelId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const level = LEVELS.find(l => l.id === Number(levelId))
  const hasPhrases = questions.some(
    q => q.level === Number(levelId) && q.type === 'fill-in-blank'
  )
  const hasSentenceBuilder = questions.some(
    q => q.level === Number(levelId) && q.type === 'sentence-build'
  )
  const [progress, setProgress] = useState({}) 
  const [loading,  setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function load() {
      const snap = await getDocs(
        collection(db, 'users', user.uid, 'progress')
      )
      const map = {}
      snap.forEach(d => { map[d.id] = d.data() })
      setProgress(map)
      setLoading(false)
    }

    load()
  }, [user])

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">🤔</p>
          <p className="text-gray-500">Level not found.</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-4 text-blue-600 underline"
          >
            Back to home
          </button>
        </div>
      </div>
    )
  }

  const { color } = level

  return (
    <div className="min-h-screen">

      <div className="border-b">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/home')} className="text-sm text-gray-500">
            ← 
          </button>
          <div>
            <h1 className="font-bold">Level {level.id} - {level.name}</h1>
            <p className="text-sm text-gray-500">{level.grades} · {level.points}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {(hasPhrases || hasSentenceBuilder) && (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {hasPhrases && (
            <button
              onClick={() => navigate(`/phrases/${levelId}`)}
              className="text-left rounded p-4 w-full"
              style={{ background: color.bg, border: `1px solid ${color.border}` }}
            >
              <div className="text-3xl mb-2">💬</div>
              <p className="font-bold text-sm mb-1">Practise phrases</p>
              <p className="text-xs text-gray-600">Fill-in-the-blank</p>
            </button>
          )}

          {hasSentenceBuilder && (
            <button
              onClick={() => navigate(`/sentence-builder/${levelId}`)}
              className="text-left rounded p-4 w-full"
              style={{ background: color.bg, border: `1px solid ${color.border}` }}
            >
              <div className="text-3xl mb-2">🧩</div>
              <p className="font-bold text-sm mb-1">Build sentences</p>
              <p className="text-xs text-gray-600">Word tile puzzle</p>
            </button>
          )}
        </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold">Choose a topic</h2>
          {!loading && (
            <p className="text-gray-500">
              {level.topics.filter(t => (progress[t]?.percentage ?? 0) >= level.passMark).length}
              {' '}of {level.topics.length} topics completed
            </p>
          )}
        </div>
        
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {level.topics.map(topic => {
              const topicQuestions = questions.filter(
                q => q.level === level.id && q.topic === topic
              )
              const wordCount  = topicQuestions.length
              const topicScore = progress[topic]?.percentage ?? 0
              const isDone     = topicScore >= level.passMark

              return (
                <TopicCard
                  key={topic}
                  topic={topic}
                  wordCount={wordCount}
                  isDone={isDone}
                  score={topicScore}
                  color={color}
                  onClick={() => navigate(`/lesson/${levelId}/${encodeURIComponent(topic)}`)}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


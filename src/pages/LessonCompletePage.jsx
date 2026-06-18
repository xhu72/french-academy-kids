import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { LEVELS } from '../data/levels'

export default function LessonCompletePage() {
  const { levelId, topic } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const level = LEVELS.find(l => l.id === Number(levelId))
  const questions = location.state?.questions ?? []
  const topicName = topic

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => navigate('/home')} className="text-blue-600 underline">
          Back to home
        </button>
      </div>
    )
  }

  const { color } = level

  function getFrench(q) {
    if (q.question && q.question.includes("'")) {
      const start = q.question.indexOf("'")
      const end = q.question.lastIndexOf("'")

      if (start !== -1 && end !== -1 && end > start) {
        const word = q.question.slice(start + 1, end)
        return word
      }
    }

    return q.answer
  }

  return (
    <div className="min-h-screen">

      <div className="border-b">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(`/level/${levelId}`)} className="text-sm text-gray-500">
            ← Topics
          </button>
          <p className="font-bold">{topicName} - Complete</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">

        <div
          className="rounded p-6 text-center mb-6"
          style={{ background: color.bg, border: `1px solid ${color.border}` }}
        >
          <div className="text-5xl mb-2">🎉</div>
          <h1 className="text-2xl font-bold mb-1">Lesson complete!</h1>
          <p className="text-gray-600">You studied {questions.length} words in {topicName}</p>
        </div>

        <h2 className="font-bold mb-3">Words you studied</h2>

        <div className="space-y-2 mb-6">
          {questions.map(q => (
            <div key={q.id} className="border rounded px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {q.image && <span className="text-2xl">{q.image}</span>}
                <span className="text-sm text-gray-500">{q.english || q.topic}</span>
              </div>
              <span className="font-bold text-sm">{getFrench(q)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate(`/lesson/${levelId}/${encodeURIComponent(topicName)}`)}
            className="w-full py-3 rounded font-bold text-white"
            style={{ background: color.bar }}
          >
            Study again
          </button>
          <button
            onClick={() => navigate(`/level/${levelId}`)}
            className="w-full py-3 rounded font-bold border text-gray-700"
          >
            Back to topics
          </button>
          <button
            onClick={() => navigate('/home')}
            className="w-full py-2 text-sm text-gray-500"
          >
            Back to home
          </button>
        </div>

      </div>
    </div>
  )
}
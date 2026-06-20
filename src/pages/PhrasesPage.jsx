import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import FillInBlank from '../components/FillInBlank'
import { LEVELS } from '../data/levels'
import questions from '../data/questions.json'

export default function PhrasesPage() {
  const { levelId } = useParams()
  const navigate = useNavigate()

  const level = LEVELS.find(l => l.id === Number(levelId))
  const phraseQuestions = questions.filter(
    q => q.level === Number(levelId) && q.type === 'fill-in-blank'
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const total = phraseQuestions.length

  if (!level || total === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No phrases found for this level.</p>
          <button onClick={() => navigate(`/level/${levelId}`)} className="text-blue-600 underline">
            Back to topics
          </button>
        </div>
      </div>
    )
  }

  const question = phraseQuestions[currentIndex]
  const isLast = currentIndex === total - 1

  function handleNext() {
    if (isLast) navigate(`/level/${levelId}`)
    else setCurrentIndex(i => i + 1)
  }

  return (
    <div className="min-h-screen">

      <div className="border-b">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(`/level/${levelId}`)} className="text-sm text-gray-500">
            ← Topics
          </button>
          <div className="text-center">
            <p className="font-bold">Phrases</p>
            <p className="text-sm text-gray-500">Level {level.id} — {level.name}</p>
          </div>
          <div style={{ width: 60 }} />
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8 space-y-6">
        <ProgressBar current={currentIndex + 1} total={total} levelColor={level.color} />
        <FillInBlank key={currentIndex} question={question} level={level} onNext={handleNext} />
      </div>

    </div>
  )
}

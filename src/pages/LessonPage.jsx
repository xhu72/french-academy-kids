import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FlashCard from '../components/FlashCard'
import ProgressBar from '../components/ProgressBar'
import { LEVELS } from '../data/levels'
import questions from '../data/questions.json'

export default function LessonPage() {
  const { levelId, topic } = useParams()
  const navigate = useNavigate()

  const level = LEVELS.find(l => l.id === Number(levelId))

  const lessonQuestions = questions.filter(
    q => q.level === Number(levelId) && q.topic === topic
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const total = lessonQuestions.length

  if (!level || total === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🤔</p>
          <p className="text-gray-500 mb-4">No questions found for this topic.</p>
          <button
            onClick={() => navigate(`/level/${levelId}`)}
            className="text-blue-600 underline"
          >
            Back to topics
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = lessonQuestions[currentIndex]
  const isLastCard      = currentIndex === total - 1

  function handleNext() {
    if (isLastCard) {
      navigate(
        `/lesson/${levelId}/${encodeURIComponent(topic)}/complete`,
        { state: { questions: lessonQuestions } }
      )
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  function handlePrev() {
    setCurrentIndex(i => i - 1)
  }

  return (
    <div className="min-h-screen">

      <div className="border-b">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/level/${levelId}`)}
            className="text-sm text-gray-500"
          >
            ← Topics
          </button>
          <div className="text-center">
            <p className="font-bold">{topic}</p>
            <p className="text-sm text-gray-500">Level {level.id} — {level.name}</p>
          </div>
          <div style={{ width: 60 }} />
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8 space-y-6">

        <ProgressBar
          current={currentIndex + 1}
          total={total}
          levelColor={level.color}
        />

        <FlashCard
          key={currentIndex}
          question={currentQuestion}
          levelColor={level.color}
        />

        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 py-3 rounded font-bold text-white disabled:opacity-40"
            style={{ background: level.color.bar }}
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded font-bold text-white"
            style={{ background: isLastCard ? '#22C55E' : level.color.bar }}
          >
            {isLastCard ? 'Finish lesson' : 'Next →'}
          </button>
        </div>

      </div>
    </div>
  )
}
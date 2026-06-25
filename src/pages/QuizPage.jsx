import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LEVELS } from '../data/levels'
import questions from '../data/questions.json'
import { shuffleArray } from '../utils/shuffle'

export default function QuizPage() {
  const { levelId, topic } = useParams()
  const navigate = useNavigate()

  const level = LEVELS.find(l => l.id === Number(levelId))
  const topicName = decodeURIComponent(topic)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const [answers, setAnswers] = useState([])

  const filtered = questions.filter(
    q => q.level === Number(levelId) && q.topic === topicName
  )

  const [quizQuestions] = useState(() =>shuffleArray(filtered))

  const total = quizQuestions.length
  const question = quizQuestions[currentIndex]
  const isLast = currentIndex === total - 1

  if (!level || total === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No questions found for this topic.</p>
          <button onClick={() => navigate(`/level/${levelId}`)} className="text-blue-600 underline">
            Back to topics
          </button>
        </div>
      </div>
    )
  }

  function handleAnswer(isCorrect, pointsEarned) {
    setAnswers(prev => [...prev, {
      questionId: question.id,
      isCorrect,
      pointsEarned,
    }])
    setScore(s => s + pointsEarned)
    setMaxScore(m => m + question.points)

    const finalScore = score + pointsEarned
    const finalMax = maxScore + question.points
    setTimeout(() => {
      if (isLast) {
        navigate(`/results/${levelId}/${encodeURIComponent(topicName)}`, {
          state: {
            score: finalScore,
            maxScore: finalMax,
            total,
            topicName,
          },
        })
      } else {
        setCurrentIndex(i => i + 1)
      }
    }, 2000)
  }

  return (
    <div className="min-h-screen">

      <div className="border-b">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(`/level/${levelId}`)} className="text-sm text-gray-500">
            ← Topics
          </button>
          <div className="text-center">
            <p className="font-bold">Quiz</p>
            <p className="text-sm text-gray-500">{topicName}</p>
          </div>
          <p className="text-sm text-gray-500">{score} pts</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8 space-y-6">

        <p className="text-center text-sm text-gray-500">
          Question {currentIndex + 1} of {total}
        </p>

        <div className="rounded border p-4 text-center space-y-3">
          <p className="text-xs text-gray-500">Type: {question.type}</p>
          <p className="font-semibold">{question.question}</p>
          <button
            onClick={() => handleAnswer(true, question.points)}
            className="px-4 py-2 rounded font-bold text-sm text-white mr-2"
            style={{ background: '#22C55E' }}
          >
            Mark correct (test)
          </button>
        </div>

      </div>
    </div>
  )
}
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import { LEVELS } from '../data/levels'
import questions from '../data/questions.json'

export default function PhrasesPage() {
  const { levelId } = useParams()
  const navigate     = useNavigate()

  const level = LEVELS.find(l => l.id === Number(levelId))

  const phraseQuestions = questions.filter(
    q => q.level === Number(levelId) && q.type === 'fill-in-blank'
  )

  const [currentIndex, setCurrentIndex]   = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered]       = useState(false)

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

  const question  = phraseQuestions[currentIndex]
  const isLast    = currentIndex === total - 1
  const isCorrect = selectedOption === question.answer

  function handleSelect(option) {
    if (isAnswered) return  
    setSelectedOption(option)
    setIsAnswered(true)

    // Auto-advance after 2s
    setTimeout(() => {
      if (isLast) {
        navigate(`/level/${levelId}`)
      } else {
        setCurrentIndex(i => i + 1)
        setSelectedOption(null)
        setIsAnswered(false)
      }
    }, 2000)
  }

  const defaultStyle = { background: '#fff', border: `2px solid ${level.color.border}`, color: level.color.title }

  function getOptionStyle(option) {
    if (!isAnswered)                
      return defaultStyle
    if (option === question.answer) 
      return { background: '#DCFCE7', border: '2px solid #86EFAC', color: '#15803D' }
    if (option === selectedOption)  
      return { background: '#FEE2E2', border: '2px solid #FCA5A5', color: '#B91C1C' }
    return { ...defaultStyle, opacity: 0.4 }
  }

  function renderSentence() {
    const parts = question.question.split('___')
    if (parts.length === 1) return question.question
    return (
      <>
        {parts[0]}
        <span
          className="inline-block border-b-2 px-2"
          style={{ borderColor: level.color.title, color: level.color.title, minWidth: '50px' }}
        >
          {isAnswered ? selectedOption : '\u00A0\u00A0\u00A0\u00A0'}
        </span>
        {parts[1]}
      </>
    )
  }

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="border-b">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/level/${levelId}`)}
            className="text-sm text-gray-500"
          >
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

        {/* Question card */}
        <div
          className="rounded-xl p-6 text-center"
          style={{ background: level.color.bg, border: `2px solid ${level.color.border}` }}
        >
          <p className="font-semibold" style={{ color: level.color.title }}>
            {renderSentence()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map(option => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              className="py-3 rounded font-bold text-sm"
              style={getOptionStyle(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {isAnswered && (
          <p className="text-center font-semibold" style={{ color: isCorrect ? '#15803D' : '#B91C1C' }}>
            {isCorrect ? 'Correct! Well done' : `The correct answer is "${question.answer}"`}
          </p>
        )}

      </div>
    </div>
  )
}
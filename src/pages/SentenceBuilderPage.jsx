import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LEVELS } from '../data/levels'
import questions from '../data/questions.json'
import { shuffleArray } from '../utils/shuffle'
import WordTile from '../components/WordTile'

export default function SentenceBuilderPage() {
  const { levelId } = useParams()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shuffledWords, setShuffledWords] = useState([])
  const [placedWords, setPlacedWords] = useState([])   // [{ word, index }]
  const [showHint, setShowHint] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState({ show: false, isCorrect: true })
  const [locked, setLocked] = useState(false)

  const level = LEVELS.find(l => l.id === Number(levelId))
  const sentenceQuestions = questions.filter(
    q => q.level === Number(levelId) && q.type === 'sentence-build'
  )
  const total = sentenceQuestions.length
  const question = sentenceQuestions[currentIndex]

  useEffect(() => {
    if (!question) return
    setShuffledWords(shuffleArray(question.words))
    setPlacedWords([])
    setShowHint(false)
    setAttempts(0)
    setLocked(false)
  }, [currentIndex, question])

  useEffect(() => {
    if (!feedback.show) return
    const timer = setTimeout(() => {
      setFeedback(f => ({ ...f, show: false }))
      if (feedback.isCorrect) {
        if (currentIndex === total - 1) navigate(`/level/${levelId}`)
        else setCurrentIndex(i => i + 1)
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [feedback.show, feedback.isCorrect, currentIndex, total, levelId, navigate])

  if (!level || total === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No sentence builder questions for this level.</p>
          <button onClick={() => navigate(`/level/${levelId}`)} className="text-blue-600 underline">
            Back to topics
          </button>
        </div>
      </div>
    )
  }

  const placedIndexes = placedWords.map(p => p.index)
  const builtSentence = placedWords.map(p => p.word)

  function handleTileTap(word, tileIndex) {
    if (locked) return
    setPlacedWords(prev => [...prev, { word: word, index: tileIndex }])
  }

  function handleAnswerTap(answerIndex) {
    if (locked) return
    setPlacedWords(prev => prev.filter((_, i) => i !== answerIndex))
  }

  function handleCheck() {
    if (locked) return
    const isCorrect = JSON.stringify(builtSentence) === JSON.stringify(question.answer)

    if (isCorrect) setLocked(true)
    else setAttempts(a => a + 1)

    setFeedback({ show: true, isCorrect })
  }

  const canCheck = placedWords.length === question.words.length && !locked

  return (
    <div className="min-h-screen">

      <AnimatePresence>
        {feedback.show && (
          <motion.div
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            exit={{ y: -60 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded font-bold text-sm ${
              feedback.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {feedback.isCorrect ? 'Correct! Well done' : 'Not quite — try again'}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-b">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(`/level/${levelId}`)} className="text-sm text-gray-500">
            ← Topics
          </button>
          <div className="text-center">
            <p className="font-bold">Sentence Builder</p>
            <p className="text-sm text-gray-500">Level {level.id} - {level.name}</p>
          </div>
          <div style={{ width: 60 }} />
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8 space-y-6">

        <p className="text-center text-sm text-gray-500">
          Question {currentIndex + 1} of {total}
        </p>

        <p className="font-semibold text-center">{question.question}</p>

        <div className="min-h-20 rounded border p-3 flex flex-wrap gap-2 items-center">
          {placedWords.length === 0 && (
            <p className="text-sm text-gray-500 px-2">
              Tap words below to build the sentence
            </p>
          )}
          {placedWords.map((p, i) => (
            <button
              key={`${p.word}-${p.index}`}
              onClick={() => handleAnswerTap(i)}
              className="px-4 py-2 rounded font-bold text-sm text-white"
              style={{ background: level.color.bar }}
            >
              {p.word}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {shuffledWords.map((word, index) => (
            <WordTile
              key={index}
              word={word}
              isPlaced={placedIndexes.includes(index)}
              onClick={() => handleTileTap(word, index)}
              levelColor={level.color}
            />
          ))}
        </div>

        {question.hint && (
          <div className="text-center">
            <button
              onClick={() => setShowHint(s => !s)}
              className="text-sm text-gray-500 underline"
            >
              {showHint ? 'Hide hint' : 'Show hint'}
            </button>
            {showHint && <p className="text-sm mt-2">{question.hint}</p>}
          </div>
        )}

        <button
          onClick={handleCheck}
          disabled={!canCheck}
          className="w-full py-3 rounded font-bold text-white disabled:opacity-40"
          style={{ background: level.color.bar }}
        >
          Check answer
        </button>

        {attempts > 0 && !feedback.show && (
          <p className="text-center text-xs text-gray-400">
            Attempt {attempts + 1} - keep going!
          </p>
        )}

      </div>
    </div>
  )
}
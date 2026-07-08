import { useState } from 'react'
import { shuffleArray } from '../utils/shuffle'
import WordTile from './WordTile'

export default function SentenceQuizCard({question, levelColor, isAnswered, onSubmit}) {
  const [shuffledWords] = useState(() => shuffleArray(question.words))
  const [placedWords, setPlacedWords] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [attempts, setAttempts] = useState(0)

  const placedIndexes = placedWords.map(p => p.index)
  const builtSentence  = placedWords.map(p => p.word)
  const canCheck = placedWords.length === question.words.length && !isAnswered

  function handleTileTap(word, tileIndex) {
    if (isAnswered) return
    setPlacedWords(prev => [...prev, { word, index: tileIndex }])
  }

  function handleAnswerTap(answerIndex) {
    if (isAnswered) return
    setPlacedWords(prev => prev.filter((_, i) => i !== answerIndex))
  }

  function handleCheck() {
    if (isAnswered) return
    const isCorrect = JSON.stringify(builtSentence) === JSON.stringify(question.answer)

    if (isCorrect) {
      setFeedback({ isCorrect: true })
      const pointsEarned = attempts === 0
        ? question.points
        : Math.floor(question.points / 2)
      onSubmit(true, pointsEarned)
    } else {
      setAttempts(a => a + 1)
      setFeedback({ isCorrect: false })
      if (attempts + 1 >= 2) {
        onSubmit(false, 0)
      }
    }
  }

  return (
    <>
      <div
        className="rounded p-6 text-center"
        style={{ background: levelColor.bg, border: `2px solid ${levelColor.border}` }}
      >
        <p className="font-semibold" style={{ color: levelColor.title }}>
          {question.question}
        </p>
      </div>

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
            disabled={isAnswered}
            className="px-4 py-2 rounded font-bold text-sm text-white"
            style={{ background: levelColor.bar }}
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
            isPlaced={placedIndexes.includes(index) || isAnswered}
            onClick={() => handleTileTap(word, index)}
            levelColor={levelColor}
          />
        ))}
      </div>

      {feedback && (
        <p className="text-center font-semibold" style={{ color: feedback.isCorrect ? '#15803D' : '#B91C1C' }}>
          {feedback.isCorrect
            ? attempts === 0 ? 'Correct! Full points' : 'Correct! Half points (2nd try)'
            : attempts >= 2
              ? `The correct order is: ${question.answer.join(' ')}`
              : 'Not quite — try again'}
        </p>
      )}

      {!isAnswered && (
        <button
          onClick={handleCheck}
          disabled={!canCheck}
          className="w-full py-3 rounded font-bold text-white disabled:opacity-40"
          style={{ background: levelColor.bar }}
        >
          Check answer
        </button>
      )}
    </>
  )
}
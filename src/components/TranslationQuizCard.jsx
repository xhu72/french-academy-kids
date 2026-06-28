import { useState } from 'react'

export default function TranslationQuizCard({question, levelColor, isAnswered, onSubmit}) {
  const [inputValue, setInputValue] = useState('')
  const [feedback, setFeedback] = useState(null)

  function normalize(str) {
    let result = str.trim().toLowerCase();

    result = result.replace('.', '');
    result = result.replace(',', '');
    result = result.replace('!', '');
    result = result.replace('?', '');
    result = result.replace(';', '');
    result = result.replace(':', '');

    while (result.includes('  ')) {
      result = result.replace('  ', ' ');
    }

    return result;
  }

  function handleSubmit() {
    if (isAnswered || !inputValue.trim()) return

    const isCorrect = normalize(inputValue) === normalize(question.answer)
    const pointsEarned = isCorrect ? question.points : 0

    setFeedback({ isCorrect })
    onSubmit(isCorrect, pointsEarned)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
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

      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isAnswered}
        placeholder="Type your answer in French..."
        className="w-full border rounded px-4 py-2 text-center font-semibold disabled:opacity-60"
        autoFocus
      />

      {feedback && (
        <p className="text-center font-semibold" style={{ color: feedback.isCorrect ? '#15803D' : '#B91C1C' }}>
          {feedback.isCorrect
            ? 'Correct! Well done'
            : `Correct answer: "${question.answer}"`}
        </p>
      )}

      {!isAnswered && (
        <button
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
          className="w-full py-3 rounded font-bold text-white disabled:opacity-40"
          style={{ background: levelColor.bar }}
        >
          Submit answer
        </button>
      )}
    </>
  )
}
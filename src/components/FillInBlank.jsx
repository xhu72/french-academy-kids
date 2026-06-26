import { useState } from 'react'

export default function FillInBlank({ question, level, onNext }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const isCorrect = selectedOption === question.answer
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
    if (parts.length === 1) 
      return question.question
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

  function handleSelect(option) {
    if (isAnswered) return
    setSelectedOption(option)
    setIsAnswered(true)
    setTimeout(() => onNext(), 2000)
  }

  return (
    <>
      <div
        className="rounded p-6 text-center"
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
    </>
  )
}

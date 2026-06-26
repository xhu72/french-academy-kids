export default function PictureMatchCard({
  question,
  levelColor,
  selectedOption,
  isAnswered,
  onSelect,
}) {
  const isCorrect = selectedOption === question.answer
  const defaultStyle = { background: '#fff', border: `2px solid ${levelColor.border}`, color: levelColor.title }

  function getOptionStyle(option) {
    if (!isAnswered)
      return defaultStyle
    if (option === question.answer)
      return { background: '#DCFCE7', border: '2px solid #86EFAC', color: '#15803D' }
    if (option === selectedOption)
      return { background: '#FEE2E2', border: '2px solid #FCA5A5', color: '#B91C1C' }
    return { ...defaultStyle, opacity: 0.4 }
  }

  return (
    <>
      <div
        className="rounded p-6 text-center"
        style={{ background: levelColor.bg, border: `2px solid ${levelColor.border}` }}
      >
        {question.image && (
          <div className="text-6xl mb-4 select-none">
            {question.image}
          </div>
        )}
        <p className="font-semibold" style={{ color: levelColor.title }}>
          {question.question}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map(option => (
          <button
            key={option}
            onClick={() => onSelect(option)}
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
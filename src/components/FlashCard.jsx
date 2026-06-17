import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FlashCard({ question, levelColor }) {
  const [isFlipped, setIsFlipped] = useState(false)

  function handleFlip() {
    setIsFlipped(prev => !prev)
  }

  return (
    <div
      onClick={handleFlip}
      style={{ perspective: '1000px', cursor: 'pointer' }}
      className="w-full"
    >
      {/* Card wrapper — this is what rotates */}
      <motion.div
        style={{ transformStyle: 'preserve-3d', position: 'relative' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="w-full"
      >

        {/* FRONT */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: levelColor.bg,
            border: `1px solid ${levelColor.border}`,
          }}
          className="rounded p-8 flex flex-col items-center justify-center min-h-64 w-full"
        >
          {question.image && (
            <div className="text-6xl mb-4 select-none">{question.image}</div>
          )}
          <p className="font-semibold text-center mb-3">{question.question}</p>
          <p className="text-sm text-center text-gray-500">Tap to reveal the French word</p>
        </div>

        {/* BACK */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: levelColor.bg,
            border: `1px solid ${levelColor.border}`,
            position: 'absolute',
            top: 0, left: 0, right: 0,
          }}
          className="rounded p-8 flex flex-col items-center justify-center min-h-64 w-full"
        >
          <p className="text-4xl font-bold text-center mb-2 select-none">{question.answer}</p>
          <p className="text-center mb-4 text-gray-600">
            {question.english || question.image}
          </p>
          {question.hint && (
            <div className="rounded px-3 py-2 text-sm text-center bg-white text-gray-700">
              💡 {question.hint}
            </div>
          )}
          <p className="text-xs text-center mt-3 text-gray-500">Tap to flip back</p>
        </div>

      </motion.div>
    </div>
  )
}
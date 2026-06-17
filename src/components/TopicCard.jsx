import { TOPIC_EMOJIS } from '../data/topicEmojis'

export default function TopicCard({ topic, wordCount, isDone, score, color, onClick }) {
  const emoji = TOPIC_EMOJIS[topic] ?? '📖'

  return (
    <button
      onClick={onClick}
      className="text-left rounded p-4 w-full"
      style={{ background: color.bg, border: `1px solid ${color.border}` }}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <p className="font-bold text-sm mb-1">{topic}</p>
      <p className="text-xs mb-2 text-gray-600">{wordCount} words</p>
      {isDone ? (
        <span className="text-xs px-2 py-1 rounded bg-white text-gray-700">
          Done · {Math.round(score)}%
        </span>
      ) : (
        <div className="h-1 rounded bg-gray-200 mt-1" />
      )}
    </button>
  )
}

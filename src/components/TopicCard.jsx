import { TOPIC_EMOJIS } from '../data/topicEmojis'

export default function TopicCard({ topic, wordCount, isDone, score, color, levelId, navigate }) {
  const emoji = TOPIC_EMOJIS[topic] ?? '📖'

  return (
    <div
      className="text-left rounded p-4 w-full"
      style={{ background: color.bg, border: `1px solid ${color.border}` }}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <p className="font-bold text-sm mb-1">{topic}</p>
      <p className="text-xs mb-2 text-gray-600">{wordCount} words</p>

      {isDone && (
        <span className="text-xs px-2 py-1 rounded bg-white text-gray-700">
          Done · {Math.round(score)}%
        </span>
      )}

      <div className="flex flex-col gap-1 mt-2">
        <button
          onClick={() => navigate(`/lesson/${levelId}/${encodeURIComponent(topic)}`)}
          className="text-xs px-2 py-1 rounded bg-white text-gray-700 w-full"
        >
          Study
        </button>
        <button
          onClick={() => navigate(`/quiz/${levelId}/${encodeURIComponent(topic)}`)}
          className="text-xs px-2 py-1 rounded text-white w-full"
          style={{ background: color.bar }}
        >
          Take quiz
        </button>
      </div>
    </div>
  )
}
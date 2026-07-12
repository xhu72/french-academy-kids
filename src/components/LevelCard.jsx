export default function LevelCard({ level, isUnlocked, completedTopics, onClick }) {
  const { color } = level
  const topicCount     = level.topics.length
  const completedCount = completedTopics.length
  const progressPct    = Math.round((completedCount / topicCount) * 100)

  return (
    <div
      onClick={isUnlocked ? onClick : undefined}
      style={{
        background: color.bg,
        border:     `1px solid ${color.border}`,
        opacity:    isUnlocked ? 1 : 0.55,
        cursor:     isUnlocked ? 'pointer' : 'default',
      }}
      className="rounded p-4 relative"
    >
      {!isUnlocked && (
        <div className="absolute top-3 right-3 opacity-40">🔒</div>
      )}

      <h2 className="font-bold mb-1">
        Level {level.id} - {level.name}
      </h2>
      <p className="text-sm mb-2 text-gray-600">
        {level.grades} · {level.points}
      </p>

      {isUnlocked ? (
        <span className="text-xs px-2 py-1 rounded bg-white text-gray-700">
          🔓 Unlocked
        </span>
      ) : (
        <span className="text-xs px-2 py-1 rounded bg-white text-gray-700">
          Pass Level {level.id - 1} to unlock
        </span>
      )}

      {isUnlocked && (
        <div className="mt-2">
          <div className="h-1.5 rounded bg-gray-200 overflow-hidden">
            <div className="h-full" style={{ width: `${progressPct}%`, background: color.bar }} />
          </div>
          <p className="text-xs mt-1 text-gray-600">
            {completedCount} / {topicCount} topics completed
          </p>
        </div>
      )}
    </div>
  )
}

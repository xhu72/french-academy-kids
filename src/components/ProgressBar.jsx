export default function ProgressBar({ current, total, levelColor }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <p className="text-sm text-gray-600">Card {current} of {total}</p>
        <p className="text-sm text-gray-600">{percentage}%</p>
      </div>
      <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
        <div className="h-full" style={{ width: `${percentage}%`, background: levelColor.bar }} />
      </div>
    </div>
  )
}
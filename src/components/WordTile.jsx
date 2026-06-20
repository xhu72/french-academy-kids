export default function WordTile({ word, isPlaced, onClick, levelColor }) {
  return (
    <button
      onClick={onClick}
      disabled={isPlaced}
      className="px-4 py-2 rounded font-bold text-sm"
      style={{
        background: isPlaced ? '#fff' : levelColor.bar,
        color:      isPlaced ? levelColor.title : '#fff',
        border:     `2px solid ${isPlaced ? levelColor.border : levelColor.bar}`,
        opacity:    isPlaced ? 0.4 : 1,
      }}
    >
      {word}
    </button>
  )
}

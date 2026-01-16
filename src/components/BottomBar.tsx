interface BottomBarProps {
  onOpenBag: () => void
  onOpenCultivate: () => void
  onOpenExplore: () => void
  onOpenQuest: () => void
}

function BottomBar({ onOpenBag, onOpenCultivate, onOpenExplore, onOpenQuest }: BottomBarProps) {
  return (
    <div className="h-32 flex items-center justify-center" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <div className="flex justify-center gap-4">
        <button
          className="px-6 py-2 rounded shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium uppercase tracking-wide"
          style={{ backgroundColor: '#1976d2', color: '#ffffff' }}
          onClick={onOpenBag}
        >
          背包
        </button>
        <button
          className="px-6 py-2 rounded shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium uppercase tracking-wide"
          style={{ backgroundColor: '#4caf50', color: '#ffffff' }}
          onClick={onOpenCultivate}
        >
          修炼
        </button>
        <button
          className="px-6 py-2 rounded shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium uppercase tracking-wide"
          style={{ backgroundColor: '#ff9800', color: '#ffffff' }}
          onClick={onOpenExplore}
        >
          探索
        </button>
        <button
          className="px-6 py-2 rounded shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium uppercase tracking-wide"
          style={{ backgroundColor: '#9c27b0', color: '#ffffff' }}
          onClick={onOpenQuest}
        >
          任务
        </button>
      </div>
    </div>
  )
}

export default BottomBar

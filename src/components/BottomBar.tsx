import { Button } from './ui/button'

interface BottomBarProps {
  onOpenBag: () => void
  onOpenCultivate: () => void
  onOpenExplore: () => void
  onOpenQuest: () => void
}

function BottomBar({ onOpenBag, onOpenCultivate, onOpenExplore, onOpenQuest }: BottomBarProps) {
  return (
    <div className="h-32 flex items-center justify-center border-t border-black/12">
      <div className="flex justify-center gap-4">
        <Button size="lg" onClick={onOpenBag}>
          背包
        </Button>
        <Button size="lg" variant="secondary" onClick={onOpenCultivate}>
          修炼
        </Button>
        <Button size="lg" variant="outline" onClick={onOpenExplore}>
          探索
        </Button>
        <Button size="lg" variant="secondary" onClick={onOpenQuest}>
          任务
        </Button>
      </div>
    </div>
  )
}

export default BottomBar

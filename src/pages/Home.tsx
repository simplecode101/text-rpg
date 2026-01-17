import { useNavigate } from 'react-router-dom'
import { usePlayerStore } from '../stores/playerStore'
import { useBagStore } from '../stores/bagStore'
import { Button } from '../components/ui/button'

function Home() {
  const navigate = useNavigate()
  const player = usePlayerStore()
  const bag = useBagStore()

  const handleReset = () => {
    if (confirm('确定要重置所有游戏数据吗？这将清除所有进度！')) {
      // 重置玩家状态
      player.resetPlayer()
      // 清空背包
      bag.clearBag()
      // 清空 localStorage
      localStorage.clear()
      alert('游戏数据已重置！')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-4xl font-light text-center mb-4 text-neutral-700">
        欢迎来到文字RPG
      </h1>
      <p className="text-sm mb-8 text-neutral-600">
        探索、战斗、成长，开启你的冒险之旅
      </p>
      <Button
        size="lg"
        className="w-56"
        onClick={() => navigate('/game')}
      >
        新的一局
      </Button>
      <Button
        size="lg"
        variant="secondary"
        className="w-56"
        onClick={() => navigate('/item-editor')}
      >
        物品编辑器
      </Button>
      <Button size="lg" variant="outline" className="w-56">
        导入存档
      </Button>
      <div className="flex gap-4">
        <Button
          size="lg"
          variant="secondary"
          className="w-56"
          onClick={handleReset}
        >
          重置进度
        </Button>
        <Button
          size="lg"
          variant="destructive"
          className="w-56"
        >
          结束游戏
        </Button>
      </div>
    </div>
  )
}

export default Home

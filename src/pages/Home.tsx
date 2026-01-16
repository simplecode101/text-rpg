import { useNavigate } from 'react-router-dom'
import { usePlayerStore } from '../stores/playerStore'
import { useBagStore } from '../stores/bagStore'

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
      <h1 className="text-4xl font-light text-center mb-4" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
        欢迎来到文字RPG
      </h1>
      <p className="text-sm mb-8" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
        探索、战斗、成长，开启你的冒险之旅
      </p>
      <button
        className="w-56 px-8 py-3 rounded shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider text-sm font-medium"
        style={{ backgroundColor: '#1976d2', color: '#ffffff' }}
        onClick={() => navigate('/game')}
      >
        新的一局
      </button>
      <button
        className="w-56 px-8 py-3 rounded shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider text-sm font-medium"
        style={{ backgroundColor: '#4caf50', color: '#ffffff' }}
        onClick={() => navigate('/item-editor')}
      >
        物品编辑器
      </button>
      <button className="w-56 px-8 py-3 rounded border-2 hover:shadow-md transition-all duration-200 uppercase tracking-wider text-sm font-medium" style={{ borderColor: '#1976d2', color: '#1976d2' }}>
        导入存档
      </button>
      <div className="flex gap-4">
        <button
          className="w-56 px-8 py-3 rounded shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider text-sm font-medium"
          style={{ backgroundColor: '#ff9800', color: '#ffffff' }}
          onClick={handleReset}
        >
          重置进度
        </button>
        <button
          className="w-56 px-8 py-3 rounded shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider text-sm font-medium"
          style={{ backgroundColor: '#f44336', color: '#ffffff' }}
        >
          结束游戏
        </button>
      </div>
    </div>
  )
}

export default Home

import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

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
      <button className="w-56 px-8 py-3 rounded border-2 hover:shadow-md transition-all duration-200 uppercase tracking-wider text-sm font-medium" style={{ borderColor: '#1976d2', color: '#1976d2' }}>
        导入存档
      </button>
      <button className="w-56 px-8 py-3 rounded shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider text-sm font-medium" style={{ backgroundColor: '#f44336', color: '#ffffff' }}>
        结束游戏
      </button>
    </div>
  )
}

export default Home

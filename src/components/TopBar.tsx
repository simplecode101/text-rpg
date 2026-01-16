import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerStore } from '../stores/playerStore'

function TopBar() {
  const navigate = useNavigate()
  const player = usePlayerStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editingName, setEditingName] = useState(player.name)

  const handleNameClick = () => {
    setIsEditing(true)
    setEditingName(player.name)
  }

  const handleNameSave = () => {
    if (editingName.trim()) {
      player.setName(editingName.trim())
    }
    setIsEditing(false)
  }

  const handleNameCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="flex justify-between items-center px-4 py-3 shadow-sm" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <div className="flex items-center gap-3">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="px-2 py-1 border rounded text-lg"
              style={{ borderColor: 'rgba(0, 0, 0, 0.2)' }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave()
                if (e.key === 'Escape') handleNameCancel()
              }}
            />
            <button
              className="px-3 py-1 rounded text-sm"
              style={{ backgroundColor: '#4caf50', color: '#ffffff' }}
              onClick={handleNameSave}
            >
              保存
            </button>
            <button
              className="px-3 py-1 rounded text-sm"
              style={{ backgroundColor: '#f44336', color: '#ffffff' }}
              onClick={handleNameCancel}
            >
              取消
            </button>
          </div>
        ) : (
          <h2
            className="text-xl font-medium cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: 'rgba(0, 0, 0, 0.87)' }}
            onClick={handleNameClick}
            title="点击修改名字"
          >
            {player.name}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="px-3 py-1 rounded" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#2e7d32' }}>
          {player.getRealmDisplay()}
        </div>
        <div className="px-3 py-1 rounded" style={{ backgroundColor: 'rgba(156, 39, 176, 0.1)', color: '#7b1fa2' }}>
          寿命: {player.lifespan.toFixed(1)}年
        </div>
        <div className="px-3 py-1 rounded" style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#c62828' }}>
          HP: {player.hp}/{player.maxHp}
        </div>
        <div className="px-3 py-1 rounded" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#1565c0' }}>
          MP: {player.mp}/{player.maxMp}
        </div>
        <div className="px-3 py-1 rounded" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#f57f17' }}>
          {player.gold} G
        </div>
        <div className="px-3 py-1 rounded" style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#ef6c00' }}>
          ⚔ {player.attack}
        </div>
        <div className="px-3 py-1 rounded" style={{ backgroundColor: 'rgba(158, 158, 158, 0.1)', color: '#616161' }}>
          🛡 {player.defense}
        </div>
      </div>
      <button
        className="px-4 py-2 rounded shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
        style={{ backgroundColor: '#f44336', color: '#ffffff' }}
        onClick={() => navigate('/home')}
      >
        退出
      </button>
    </div>
  )
}

export default TopBar

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerStore } from '../stores/playerStore'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'

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
    <div className="flex justify-between items-center px-4 py-3 shadow-sm border-b border-black/12">
      <div className="flex items-center gap-3">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="px-2 py-1 text-lg"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave()
                if (e.key === 'Escape') handleNameCancel()
              }}
            />
            <Button size="sm" onClick={handleNameSave}>
              保存
            </Button>
            <Button size="sm" variant="destructive" onClick={handleNameCancel}>
              取消
            </Button>
          </div>
        ) : (
          <h2
            className="text-xl font-medium cursor-pointer hover:opacity-70 transition-opacity text-neutral-700"
            onClick={handleNameClick}
            title="点击修改名字"
          >
            {player.name}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm">
        <Badge variant="secondary" className="bg-green-500/10 text-green-800 hover:bg-green-500/20">
          {player.getRealmDisplay()}
        </Badge>
        <Badge variant="secondary" className="bg-purple-600/10 text-purple-800 hover:bg-purple-600/20">
          寿命: {player.lifespan.toFixed(1)}年
        </Badge>
        <Badge variant="secondary" className="bg-red-500/10 text-red-800 hover:bg-red-500/20">
          HP: {player.hp}/{player.maxHp}
        </Badge>
        <Badge variant="secondary" className="bg-blue-500/10 text-blue-800 hover:bg-blue-500/20">
          MP: {player.mp}/{player.maxMp}
        </Badge>
        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
          {player.gold} G
        </Badge>
        <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 hover:bg-orange-500/20">
          ⚔ {player.attack}
        </Badge>
        <Badge variant="secondary" className="bg-gray-500/10 text-gray-700 hover:bg-gray-500/20">
          🛡 {player.defense}
        </Badge>
      </div>
      <Button size="sm" variant="destructive" onClick={() => navigate('/home')}>
        退出
      </Button>
    </div>
  )
}

export default TopBar

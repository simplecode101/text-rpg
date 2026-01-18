import { useState } from 'react'
import { usePlayerStore } from '../stores/playerStore'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { X } from 'lucide-react'

interface TopBarProps {
  onClose?: () => void
}

function TopBar({ onClose }: TopBarProps) {
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
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default TopBar

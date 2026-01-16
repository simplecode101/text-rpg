import { useState } from 'react'
import { usePlayerStore } from '../stores/playerStore'
import { useBagStore } from '../stores/bagStore'
import { useItemLibraryStore } from '../stores/itemLibraryStore'
import { useMonsterLibraryStore } from '../stores/monsterStore'

interface ExploreProps {
  onClose: () => void
  onBattle: (monsterId: string) => void
}

type EventType = 'monster' | 'treasure' | 'item' | 'nothing'

interface Log {
  id: number
  message: string
  timestamp: number
  type: 'info' | 'success' | 'danger' | 'warning'
}

function Explore({ onClose, onBattle }: ExploreProps) {
  const player = usePlayerStore()
  const bag = useBagStore()
  const itemLibrary = useItemLibraryStore()
  const monsterLibrary = useMonsterLibraryStore()
  const [logs, setLogs] = useState<Log[]>([])

  const addLog = (message: string, type: Log['type'] = 'info') => {
    const newLog: Log = {
      id: Date.now(),
      message,
      timestamp: Date.now(),
      type,
    }
    setLogs((prev) => [newLog, ...prev])
    setTimeout(() => {
      setLogs((prev) => prev.filter((log) => log.id !== newLog.id))
    }, 5000)
  }

  const explore = () => {
    // 检查每日探索额度
    if (!player.useExplore()) {
      addLog('今日探索次数已用完！', 'danger')
      return
    }

    // 随机决定事件类型
    const roll = Math.random()
    let eventType: EventType

    if (roll < 0.4) {
      eventType = 'monster' // 40% 遇到怪物
    } else if (roll < 0.6) {
      eventType = 'treasure' // 20% 发现宝箱
    } else if (roll < 0.8) {
      eventType = 'item' // 20% 发现物品
    } else {
      eventType = 'nothing' // 20% 什么都没发现
    }

    handleEvent(eventType)
  }

  const handleEvent = (eventType: EventType) => {
    switch (eventType) {
      case 'monster':
        {
          const monster = monsterLibrary.getRandomMonster(player.level)
          if (monster) {
            addLog(`你遇到了 ${monster.name}！准备战斗！`, 'danger')
            setTimeout(() => {
              onBattle(monster.id)
            }, 1000)
          }
        }
        break
      case 'treasure':
        {
          const gold = Math.floor(Math.random() * 100) + 50
          player.addGold(gold)
          addLog(`你发现了一个宝箱，获得了 ${gold} 金币！`, 'success')
        }
        break
      case 'item':
        {
          const rarities = ['gray', 'white', 'green', 'blue', 'purple', 'orange'] as const
          const rarityRoll = Math.random()
          let rarity: typeof rarities[number] = 'gray'

          if (rarityRoll < 0.01) rarity = 'orange'
          else if (rarityRoll < 0.05) rarity = 'purple'
          else if (rarityRoll < 0.15) rarity = 'blue'
          else if (rarityRoll < 0.35) rarity = 'green'
          else if (rarityRoll < 0.65) rarity = 'white'

          const randomItem = itemLibrary.getRandomItemByRarity(rarity)
          if (randomItem) {
            bag.addItem(randomItem)
            addLog(`你发现了 ${randomItem.name}！`, 'success')
          }
        }
        break
      case 'nothing':
        addLog('你探索了一番，但什么也没发现。', 'info')
        break
    }
  }

  const getLogColor = (type: Log['type']) => {
    switch (type) {
      case 'success':
        return { backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#2e7d32' }
      case 'danger':
        return { backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#c62828' }
      case 'warning':
        return { backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#ef6c00' }
      default:
        return { backgroundColor: 'rgba(0, 0, 0, 0.05)', color: 'rgba(0, 0, 0, 0.87)' }
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 探索信息 */}
      <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <div>
          <h3 className="text-lg font-medium mb-2" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>探索系统</h3>
          <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
            <div>剩余探索次数: {player.getRemainingExplores()}/{player.maxDailyExplores}</div>
            <div>每日探索次数会在0点重置</div>
          </div>
        </div>
        <button
          className="px-4 py-2 rounded-full transition-all duration-200"
          style={{ color: 'rgba(0, 0, 0, 0.54)' }}
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* 日志区域 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-center" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>点击探索按钮开始冒险...</div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="text-sm p-3 rounded transition-opacity duration-1000 shadow-sm"
                style={{
                  ...getLogColor(log.type),
                  animation: 'fadeInOut 5s forwards',
                }}
              >
                {log.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 探索按钮 */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <button
          className="w-full px-8 py-3 text-lg rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium uppercase tracking-wide"
          style={{ backgroundColor: '#ff9800', color: '#ffffff' }}
          onClick={explore}
          disabled={player.getRemainingExplores() <= 0}
        >
          探索
        </button>
      </div>

      {/* 淡出动画样式 */}
      <style>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default Explore

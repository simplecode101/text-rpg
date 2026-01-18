import { useState } from 'react'
import { usePlayerStore } from '../stores/playerStore'
import { useBagStore } from '../stores/bagStore'
import { useItemLibraryStore } from '../stores/itemLibraryStore'
import { useMonsterLibraryStore } from '../stores/monsterStore'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'

interface ExploreProps {
  onBattle: (monsterId: string) => void
}

type EventType = 'monster' | 'treasure' | 'item' | 'nothing'

interface Log {
  id: number
  message: string
  timestamp: number
  type: 'info' | 'success' | 'danger' | 'warning'
}

function Explore({ onBattle }: ExploreProps) {
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
    // 检查是否死亡
    if (player.checkDeath()) {
      addLog('你已寿元耗尽，无法继续探索', 'danger')
      return
    }

    // 检查每日探索额度
    if (!player.useExplore()) {
      addLog('今日探索次数已用完！', 'danger')
      return
    }

    // 探索消耗时间（每次探索增加0.1岁）
    player.increaseAge(0.1)

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
          const monster = monsterLibrary.getRandomMonster(player.getEffectiveLevel())
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
        return 'bg-green-500/10 text-green-800'
      case 'danger':
        return 'bg-red-500/10 text-red-800'
      case 'warning':
        return 'bg-orange-500/10 text-orange-700'
      default:
        return 'bg-black/5 text-neutral-700'
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 探索信息 */}
      <div className="p-4 border-b border-black/12">
        <h3 className="text-lg font-medium mb-2 text-neutral-700">探索系统</h3>
        <div className="text-sm text-black/60">
          <div>剩余探索次数: {player.getRemainingExplores()}/{player.maxDailyExplores}</div>
          <div>每日探索次数会在0点重置</div>
        </div>
      </div>

      {/* 日志区域 */}
      <div className="flex-1 p-4">
        <ScrollArea className="h-full">
          {logs.length === 0 ? (
            <div className="text-center text-black/38 py-8">点击探索按钮开始冒险...</div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`text-sm p-3 rounded transition-opacity duration-1000 shadow-sm ${getLogColor(log.type)}`}
                >
                  {log.message}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* 探索按钮 */}
      <div className="p-4 border-t border-black/12">
        <Button
          className="w-full"
          size="lg"
          variant="default"
          onClick={explore}
          disabled={player.getRemainingExplores() <= 0}
        >
          探索
        </Button>
      </div>
    </div>
  )
}

export default Explore

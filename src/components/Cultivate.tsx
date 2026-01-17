import { useState, useEffect, useRef } from 'react'
import { usePlayerStore } from '../stores/playerStore'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'

interface CultivateProps {
  onClose: () => void
}

interface Log {
  id: number
  message: string
  timestamp: number
  type?: 'normal' | 'breakthrough' | 'failed'
}

function Cultivate({ onClose }: CultivateProps) {
  const player = usePlayerStore()
  const [logs, setLogs] = useState<Log[]>([])
  const [isCultivating, setIsCultivating] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const addLog = (message: string, type: 'normal' | 'breakthrough' | 'failed' = 'normal') => {
    const newLog: Log = {
      id: Date.now() + Math.random(),
      message,
      timestamp: Date.now(),
      type,
    }

    setLogs((prev) => [newLog, ...prev])

    // 5秒后淡出并移除日志
    setTimeout(() => {
      setLogs((prev) => prev.filter((log) => log.id !== newLog.id))
    }, 5000)
  }

  const cultivate = () => {
    // 检查是否死亡
    if (player.checkDeath()) {
      setIsCultivating(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      addLog('你已寿元耗尽，无法继续修炼', 'failed')
      return
    }

    // 修炼消耗时间（每次修炼增加0.01岁）
    player.increaseAge(0.01)

    // 如果在灵感状态，积累经验但不增加显示
    if (player.isInspirationState) {
      const expGain = Math.floor(Math.random() * 20) + 10
      player.addExp(expGain)
      addLog(`修炼获得: 经验+${expGain} (已积累: ${player.accumulatedExp + expGain})`)
      return
    }

    // 正常修炼，只增加经验
    const expGain = Math.floor(Math.random() * 20) + 10

    player.addExp(expGain)

    addLog(`修炼获得: 经验+${expGain}`)
  }

  const handleInsight = () => {
    const success = player.attainInsight()
    if (success) {
      addLog(`✨ 顿悟成功！晋升至${player.getRealmDisplay()}！`, 'breakthrough')
    } else {
      addLog(`❌ 顿悟失败，消耗了一半积累经验`, 'failed')
    }
  }

  const toggleCultivation = () => {
    if (isCultivating) {
      // 停止修炼
      setIsCultivating(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      addLog('停止修炼')
    } else {
      // 开始修炼
      setIsCultivating(true)
      addLog('开始修炼...')

      // 立即修炼一次
      cultivate()

      // 每0.5秒自动修炼一次
      intervalRef.current = setInterval(() => {
        cultivate()
      }, 500)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-4 border-b border-black/12">
        <h3 className="text-lg font-medium text-neutral-700">修炼系统</h3>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-medium">境界:</span> {player.getRealmDisplay()}
          </div>
          <div>
            <span className="font-medium">生命值:</span> {player.hp}/{player.maxHp}
          </div>
          <div>
            <span className="font-medium">经验:</span> {player.exp}/{player.maxExp}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          ✕
        </Button>
      </div>

      {/* 灵感状态提示 */}
      {player.isInspirationState && (
        <div className="mx-4 mt-4 p-3 rounded text-center bg-yellow-500/10 border border-yellow-500/30">
          <div className="font-bold text-orange-600">✨ 灵感状态 ✨</div>
          <div className="text-sm mt-1 text-black/60">
            已积累经验: {player.accumulatedExp}
          </div>
          <div className="text-sm mt-1 text-black/60">
            当前顿悟成功率: <span className="font-bold text-blue-600">{player.getInsightSuccessRate()}%</span>
          </div>
        </div>
      )}

      {/* 日志区域 */}
      <div className="flex-1 p-4">
        <ScrollArea className="h-full">
          {logs.length === 0 ? (
            <div className="text-center text-black/38 py-8">
              {isCultivating ? '修炼中...' : '点击修炼按钮开始修炼...'}
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => {
                let bgColorClass = 'bg-black/5 text-neutral-700'

                if (log.type === 'breakthrough') {
                  bgColorClass = 'bg-green-500/10 text-green-800'
                } else if (log.type === 'failed') {
                  bgColorClass = 'bg-red-500/10 text-red-800'
                }

                return (
                  <div
                    key={log.id}
                    className={`text-sm p-3 rounded transition-opacity duration-1000 shadow-sm ${bgColorClass}`}
                  >
                    {log.message}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* 修炼按钮 */}
      <div className="p-4 border-t border-black/12">
        {player.isInspirationState ? (
          <div className="flex gap-3">
            <Button
              className="flex-1"
              size="lg"
              variant={isCultivating ? 'destructive' : 'default'}
              onClick={toggleCultivation}
            >
              {isCultivating ? '停止修炼' : '开始修炼'}
            </Button>
            <Button
              className="flex-1"
              size="lg"
              variant="secondary"
              onClick={handleInsight}
            >
              顿悟
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            size="lg"
            variant={isCultivating ? 'destructive' : 'default'}
            onClick={toggleCultivation}
          >
            {isCultivating ? '停止修炼' : '开始修炼'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Cultivate

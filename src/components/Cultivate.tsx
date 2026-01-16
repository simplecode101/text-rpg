import { useState, useEffect, useRef } from 'react'
import { usePlayerStore } from '../stores/playerStore'

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
      <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <h3 className="text-lg font-medium" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>修炼系统</h3>
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
        <button
          className="px-4 py-2 rounded-full transition-all duration-200"
          style={{ color: 'rgba(0, 0, 0, 0.54)' }}
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* 灵感状态提示 */}
      {player.isInspirationState && (
        <div className="mx-4 mt-4 p-3 rounded text-center" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)' }}>
          <div style={{ color: '#f57c00', fontWeight: 'bold' }}>✨ 灵感状态 ✨</div>
          <div className="text-sm mt-1" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
            已积累经验: {player.accumulatedExp}
          </div>
          <div className="text-sm mt-1" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
            当前顿悟成功率: <span style={{ color: '#1976d2', fontWeight: 'bold' }}>{player.getInsightSuccessRate()}%</span>
          </div>
        </div>
      )}

      {/* 日志区域 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-center" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>
            {isCultivating ? '修炼中...' : '点击修炼按钮开始修炼...'}
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => {
              let bgColor = 'rgba(0, 0, 0, 0.05)'
              let textColor = 'rgba(0, 0, 0, 0.87)'

              if (log.type === 'breakthrough') {
                bgColor = 'rgba(76, 175, 80, 0.1)'
                textColor = '#2e7d32'
              } else if (log.type === 'failed') {
                bgColor = 'rgba(244, 67, 54, 0.1)'
                textColor = '#c62828'
              }

              return (
                <div
                  key={log.id}
                  className="text-sm p-3 rounded transition-opacity duration-1000 shadow-sm"
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    animation: 'fadeInOut 5s forwards',
                  }}
                >
                  {log.message}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 修炼按钮 */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        {player.isInspirationState ? (
          <div className="flex gap-3">
            <button
              className={`flex-1 px-8 py-3 text-lg rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium uppercase tracking-wide ${
                isCultivating ? 'bg-red-500' : ''
              }`}
              style={{
                backgroundColor: isCultivating ? '#f44336' : '#4caf50',
                color: '#ffffff',
              }}
              onClick={toggleCultivation}
            >
              {isCultivating ? '停止修炼' : '开始修炼'}
            </button>
            <button
              className="flex-1 px-8 py-3 text-lg rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium uppercase tracking-wide"
              style={{ backgroundColor: '#ff9800', color: '#ffffff' }}
              onClick={handleInsight}
            >
              顿悟
            </button>
          </div>
        ) : (
          <button
            className={`w-full px-8 py-3 text-lg rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium uppercase tracking-wide ${
              isCultivating ? 'bg-red-500' : ''
            }`}
            style={{
              backgroundColor: isCultivating ? '#f44336' : '#4caf50',
              color: '#ffffff',
            }}
            onClick={toggleCultivation}
          >
            {isCultivating ? '停止修炼' : '开始修炼'}
          </button>
        )}
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

export default Cultivate

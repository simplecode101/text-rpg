import { useState } from 'react'
import { usePlayerStore } from '../stores/playerStore'

interface CultivateProps {
  onClose: () => void
}

interface Log {
  id: number
  message: string
  timestamp: number
}

function Cultivate({ onClose }: CultivateProps) {
  const player = usePlayerStore()
  const [logs, setLogs] = useState<Log[]>([])

  const cultivate = () => {
    const expGain = Math.floor(Math.random() * 20) + 10
    const hpGain = Math.floor(Math.random() * 10) + 5
    const mpGain = Math.floor(Math.random() * 10) + 5

    // 更新玩家状态
    player.addExp(expGain)
    player.heal(hpGain)
    player.restoreMp(mpGain)

    // 添加日志
    const newLog: Log = {
      id: Date.now(),
      message: `修炼获得: 经验+${expGain}, 生命+${hpGain}, 法力+${mpGain}`,
      timestamp: Date.now(),
    }

    setLogs((prev) => [newLog, ...prev])

    // 5秒后淡出并移除日志
    setTimeout(() => {
      setLogs((prev) => prev.filter((log) => log.id !== newLog.id))
    }, 5000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <h3 className="text-lg font-medium" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>修炼系统</h3>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-medium">等级:</span> {player.level}
          </div>
          <div>
            <span className="font-medium">生命值:</span> {player.hp}/{player.maxHp}
          </div>
          <div>
            <span className="font-medium">法力值:</span> {player.mp}/{player.maxMp}
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
          <div className="text-center" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>开始修炼获取经验...</div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="text-sm p-3 rounded transition-opacity duration-1000 shadow-sm"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  color: 'rgba(0, 0, 0, 0.87)',
                  animation: 'fadeInOut 5s forwards',
                }}
              >
                {log.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 修炼按钮 */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <button
          className="w-full px-8 py-3 text-lg rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium uppercase tracking-wide"
          style={{ backgroundColor: '#4caf50', color: '#ffffff' }}
          onClick={cultivate}
        >
          修炼
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

export default Cultivate

import type { Item } from '../stores/bagStore'
import { RARITY_CONFIG } from '../stores/bagStore'

interface BattleLootProps {
  exp: number
  gold: number
  items: Item[]
  onClaim: () => void
}

function BattleLoot({ exp, gold, items, onClaim }: BattleLootProps) {
  return (
    <div className="flex flex-col h-full p-4">
      {/* 标题 */}
      <div className="text-2xl font-medium mb-6 text-center" style={{ color: '#4caf50' }}>
        胜利！
      </div>

      {/* 奖励信息 */}
      <div className="flex-1 overflow-y-auto">
        {/* 经验和金币 */}
        <div className="rounded p-4 mb-4 shadow-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-sm mb-1" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>经验值</div>
              <div className="text-2xl font-medium" style={{ color: '#1976d2' }}>+{exp}</div>
            </div>
            <div className="text-center">
              <div className="text-sm mb-1" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>金币</div>
              <div className="text-2xl font-medium" style={{ color: '#ffc107' }}>+{gold}</div>
            </div>
          </div>
        </div>

        {/* 战利品物品 */}
        {items.length > 0 && (
          <div className="rounded p-4 shadow-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <div className="text-sm mb-3" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
              获得物品
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded flex justify-between items-center"
                  style={{ backgroundColor: RARITY_CONFIG[item.rarity].bgColor }}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${RARITY_CONFIG[item.rarity].textColor}`}>
                      {item.name}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                      {item.description}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded`} style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                    {RARITY_CONFIG[item.rarity].name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 没有物品掉落 */}
        {items.length === 0 && (
          <div className="rounded p-4 shadow-sm text-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <div style={{ color: 'rgba(0, 0, 0, 0.38)' }}>没有获得物品</div>
          </div>
        )}
      </div>

      {/* 按钮 */}
      <div className="text-center mt-4">
        <button
          className="px-6 py-3 rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium uppercase tracking-wide"
          style={{ backgroundColor: '#1976d2', color: '#ffffff' }}
          onClick={onClaim}
        >
          取战利品
        </button>
      </div>
    </div>
  )
}

export default BattleLoot

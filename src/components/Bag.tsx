import { useState } from 'react'
import { useBagStore, RARITY_CONFIG } from '../stores/bagStore'
import { usePlayerStore } from '../stores/playerStore'

type TabType = 'weapon' | 'equipment' | 'material' | 'food' | 'quest' | 'status'

interface BagProps {
  onClose: () => void
}

const TABS = [
  { key: 'status' as TabType, label: '装备状态' },
  { key: 'weapon' as TabType, label: '武器' },
  { key: 'equipment' as TabType, label: '装备' },
  { key: 'material' as TabType, label: '材料' },
  { key: 'food' as TabType, label: '食物' },
  { key: 'quest' as TabType, label: '任务' },
]

function Bag({ onClose }: BagProps) {
  const [activeTab, setActiveTab] = useState<TabType>('status')
  const getItemsByType = useBagStore((state) => state.getItemsByType)
  const player = usePlayerStore()
  const removeItem = useBagStore((state) => state.removeItem)
  const addItem = useBagStore((state) => state.addItem)

  const items = activeTab === 'status' ? [] : getItemsByType(activeTab)

  // 穿戴装备
  const handleEquip = (item: any) => {
    if (item.type === 'weapon') {
      // 如果已装备武器，先卸下
      if (player.equipment.weapon) {
        addItem(player.equipment.weapon)
      }
      player.equipItem(item, 'weapon')
      removeItem(item.id)
    } else if (item.type === 'equipment') {
      // 根据装备部位穿戴
      const slot = item.slot as keyof typeof player.equipment
      if (player.equipment[slot]) {
        addItem(player.equipment[slot]!)
      }
      player.equipItem(item, slot)
      removeItem(item.id)
    }
  }

  // 卸下装备
  const handleUnequip = (slot: keyof typeof player.equipment) => {
    const item = player.equipment[slot]
    if (item) {
      addItem(item)
      player.unequipItem(slot)
    }
  }

  // 检查物品是否已装备
  const isEquipped = (item: any) => {
    if (item.type === 'weapon') {
      return player.equipment.weapon?.id === item.id
    } else if (item.type === 'equipment') {
      const slot = item.slot as keyof typeof player.equipment
      return player.equipment[slot]?.id === item.id
    }
    return false
  }

  // 渲染装备状态
  const renderEquipmentStatus = () => {
    return (
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-medium mb-4" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>当前装备</h3>

        <div className="rounded p-3 shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <div className="font-medium" style={{ color: '#ff9800' }}>武器</div>
          {player.equipment.weapon ? (
            <div className="mt-2">
              <div className={RARITY_CONFIG[player.equipment.weapon.rarity].color}>
                {player.equipment.weapon.name}
              </div>
              <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>攻击力: +{player.equipment.weapon.attack}</div>
              <button
                className="mt-2 px-3 py-1 text-sm rounded shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: '#f44336', color: '#ffffff' }}
                onClick={() => handleUnequip('weapon')}
              >
                卸下
              </button>
            </div>
          ) : (
            <div style={{ color: 'rgba(0, 0, 0, 0.38)' }}>未装备</div>
          )}
        </div>

        <div className="rounded p-3 shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <div className="font-medium" style={{ color: '#1976d2' }}>头盔</div>
          {player.equipment.head ? (
            <div className="mt-2">
              <div className={RARITY_CONFIG[player.equipment.head.rarity].color}>
                {player.equipment.head.name}
              </div>
              <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>防御力: +{player.equipment.head.defense}</div>
              <button
                className="mt-2 px-3 py-1 text-sm rounded shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: '#f44336', color: '#ffffff' }}
                onClick={() => handleUnequip('head')}
              >
                卸下
              </button>
            </div>
          ) : (
            <div style={{ color: 'rgba(0, 0, 0, 0.38)' }}>未装备</div>
          )}
        </div>

        <div className="rounded p-3 shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <div className="font-medium" style={{ color: '#1976d2' }}>护甲</div>
          {player.equipment.body ? (
            <div className="mt-2">
              <div className={RARITY_CONFIG[player.equipment.body.rarity].color}>
                {player.equipment.body.name}
              </div>
              <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>防御力: +{player.equipment.body.defense}</div>
              <button
                className="mt-2 px-3 py-1 text-sm rounded shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: '#f44336', color: '#ffffff' }}
                onClick={() => handleUnequip('body')}
              >
                卸下
              </button>
            </div>
          ) : (
            <div style={{ color: 'rgba(0, 0, 0, 0.38)' }}>未装备</div>
          )}
        </div>

        <div className="rounded p-3 shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <div className="font-medium" style={{ color: '#1976d2' }}>护腿</div>
          {player.equipment.legs ? (
            <div className="mt-2">
              <div className={RARITY_CONFIG[player.equipment.legs.rarity].color}>
                {player.equipment.legs.name}
              </div>
              <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>防御力: +{player.equipment.legs.defense}</div>
              <button
                className="mt-2 px-3 py-1 text-sm rounded shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: '#f44336', color: '#ffffff' }}
                onClick={() => handleUnequip('legs')}
              >
                卸下
              </button>
            </div>
          ) : (
            <div style={{ color: 'rgba(0, 0, 0, 0.38)' }}>未装备</div>
          )}
        </div>

        <div className="rounded p-3 shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <div className="font-medium" style={{ color: '#1976d2' }}>饰品</div>
          {player.equipment.accessory ? (
            <div className="mt-2">
              <div className={RARITY_CONFIG[player.equipment.accessory.rarity].color}>
                {player.equipment.accessory.name}
              </div>
              <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>防御力: +{player.equipment.accessory.defense}</div>
              <button
                className="mt-2 px-3 py-1 text-sm rounded shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: '#f44336', color: '#ffffff' }}
                onClick={() => handleUnequip('accessory')}
              >
                卸下
              </button>
            </div>
          ) : (
            <div style={{ color: 'rgba(0, 0, 0, 0.38)' }}>未装备</div>
          )}
        </div>

        <div className="pt-3 mt-3" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <div className="text-sm">
            <div>总攻击力: {player.attack}</div>
            <div>总防御力: {player.defense}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab 导航 */}
      <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-3 cursor-pointer text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? ''
                  : ''
              }`}
              style={{
                backgroundColor: activeTab === tab.key ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                color: activeTab === tab.key ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          className="px-4 py-3 mr-2 rounded-full transition-all duration-200"
          style={{ color: 'rgba(0, 0, 0, 0.54)' }}
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Tab 内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'status' ? (
          renderEquipmentStatus()
        ) : items.length === 0 ? (
          <div className="p-4 text-center" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>暂无物品</div>
        ) : (
          <div>
            {items.map((item, index) => (
              <div
                key={item.id}
                style={{
                  borderBottom: index === items.length - 1 ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
                  borderTop: index === 0 ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
                }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className={`font-medium ${RARITY_CONFIG[item.rarity].color}`}>
                        {item.name}
                        <span className="ml-2 text-sm font-normal" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                          [{RARITY_CONFIG[item.rarity].name}]
                        </span>
                      </div>
                      <div className="text-sm mt-1" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>{item.description}</div>
                      {'type' in item && item.type === 'weapon' && (
                        <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>攻击力: {item.attack}</div>
                      )}
                      {'type' in item && item.type === 'equipment' && (
                        <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>防御力: {item.defense} | 部位: {item.slot}</div>
                      )}
                      {'type' in item && item.type === 'food' && (
                        <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>恢复: {item.heal}</div>
                      )}
                      {'quantity' in item && (
                        <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>数量: {item.quantity}</div>
                      )}
                    </div>
                    {(item.type === 'weapon' || item.type === 'equipment') && (
                      <button
                        className={`px-3 py-1 text-sm rounded shadow-sm hover:shadow-md transition-all duration-200 ${
                          isEquipped(item) ? '' : ''
                        }`}
                        style={{
                          backgroundColor: isEquipped(item) ? 'rgba(0, 0, 0, 0.12)' : '#4caf50',
                          color: isEquipped(item) ? 'rgba(0, 0, 0, 0.38)' : '#ffffff',
                          cursor: isEquipped(item) ? 'not-allowed' : 'pointer',
                        }}
                        onClick={() => !isEquipped(item) && handleEquip(item)}
                        disabled={isEquipped(item)}
                      >
                        {isEquipped(item) ? '已装备' : '装备'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Bag

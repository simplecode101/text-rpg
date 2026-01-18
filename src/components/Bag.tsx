import { useState } from 'react'
import { useBagStore, RARITY_CONFIG } from '../stores/bagStore'
import { usePlayerStore } from '../stores/playerStore'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'

type TabType = 'weapon' | 'equipment' | 'material' | 'food' | 'quest' | 'status'

const TABS = [
  { key: 'status' as TabType, label: '装备' },
  { key: 'weapon' as TabType, label: '武器' },
  { key: 'equipment' as TabType, label: '护甲' },
  { key: 'material' as TabType, label: '材料' },
  { key: 'food' as TabType, label: '食物' },
  { key: 'quest' as TabType, label: '任务' },
]

function Bag() {
  const [activeTab, setActiveTab] = useState<TabType>('status')
  const getItemsByType = useBagStore((state) => state.getItemsByType)
  const player = usePlayerStore()
  const removeItem = useBagStore((state) => state.removeItem)
  const addItem = useBagStore((state) => state.addItem)

  const handleEquip = (item: any) => {
    if (item.type === 'weapon') {
      if (player.equipment.weapon) {
        addItem(player.equipment.weapon)
      }
      player.equipItem(item, 'weapon')
      removeItem(item.id)
    } else if (item.type === 'equipment') {
      const slot = item.slot as keyof typeof player.equipment
      if (player.equipment[slot]) {
        addItem(player.equipment[slot]!)
      }
      player.equipItem(item, slot)
      removeItem(item.id)
    }
  }

  const handleUnequip = (slot: keyof typeof player.equipment) => {
    const item = player.equipment[slot]
    if (item) {
      addItem(item)
      player.unequipItem(slot)
    }
  }

  const isEquipped = (item: any) => {
    if (item.type === 'weapon') {
      return player.equipment.weapon?.id === item.id
    } else if (item.type === 'equipment') {
      const slot = item.slot as keyof typeof player.equipment
      return player.equipment[slot]?.id === item.id
    }
    return false
  }

  const renderEquipmentStatus = () => {
    return (
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Card className="p-2">
            <div className="text-xs text-black/60 mb-1">武器</div>
            {player.equipment.weapon ? (
              <div>
                <div className={`text-sm font-medium ${RARITY_CONFIG[player.equipment.weapon.rarity].color}`}>
                  {player.equipment.weapon.name}
                </div>
                <div className="text-xs text-black/38">攻击: +{player.equipment.weapon.attack}</div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs mt-1"
                  onClick={() => handleUnequip('weapon')}
                >
                  卸下
                </Button>
              </div>
            ) : (
              <div className="text-xs text-black/38">空</div>
            )}
          </Card>

          <Card className="p-2">
            <div className="text-xs text-black/60 mb-1">头盔</div>
            {player.equipment.head ? (
              <div>
                <div className={`text-sm font-medium ${RARITY_CONFIG[player.equipment.head.rarity].color}`}>
                  {player.equipment.head.name}
                </div>
                <div className="text-xs text-black/38">防御: +{player.equipment.head.defense}</div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs mt-1"
                  onClick={() => handleUnequip('head')}
                >
                  卸下
                </Button>
              </div>
            ) : (
              <div className="text-xs text-black/38">空</div>
            )}
          </Card>

          <Card className="p-2">
            <div className="text-xs text-black/60 mb-1">护甲</div>
            {player.equipment.body ? (
              <div>
                <div className={`text-sm font-medium ${RARITY_CONFIG[player.equipment.body.rarity].color}`}>
                  {player.equipment.body.name}
                </div>
                <div className="text-xs text-black/38">防御: +{player.equipment.body.defense}</div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs mt-1"
                  onClick={() => handleUnequip('body')}
                >
                  卸下
                </Button>
              </div>
            ) : (
              <div className="text-xs text-black/38">空</div>
            )}
          </Card>

          <Card className="p-2">
            <div className="text-xs text-black/60 mb-1">护腿</div>
            {player.equipment.legs ? (
              <div>
                <div className={`text-sm font-medium ${RARITY_CONFIG[player.equipment.legs.rarity].color}`}>
                  {player.equipment.legs.name}
                </div>
                <div className="text-xs text-black/38">防御: +{player.equipment.legs.defense}</div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs mt-1"
                  onClick={() => handleUnequip('legs')}
                >
                  卸下
                </Button>
              </div>
            ) : (
              <div className="text-xs text-black/38">空</div>
            )}
          </Card>

          <Card className="p-2 col-span-2">
            <div className="text-xs text-black/60 mb-1">饰品</div>
            {player.equipment.accessory ? (
              <div className="flex justify-between">
                <div>
                  <div className={`text-sm font-medium ${RARITY_CONFIG[player.equipment.accessory.rarity].color}`}>
                    {player.equipment.accessory.name}
                  </div>
                  <div className="text-xs text-black/38">防御: +{player.equipment.accessory.defense}</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleUnequip('accessory')}
                >
                  卸下
                </Button>
              </div>
            ) : (
              <div className="text-xs text-black/38">空</div>
            )}
          </Card>
        </div>

        <Card className="p-3">
          <div className="flex justify-between text-sm">
            <span className="text-black/60">总攻击: {player.attack}</span>
            <span className="text-black/60">总防御: {player.defense}</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="flex flex-col h-full">
        <div className="border-b border-black/12 bg-black/2">
          <TabsList className="w-full justify-start rounded-none h-10 bg-transparent px-2 gap-1">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="rounded-md px-3 py-1.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="status" className="m-0 h-full">
            <ScrollArea className="h-full">
              {renderEquipmentStatus()}
            </ScrollArea>
          </TabsContent>

          {TABS.filter(tab => tab.key !== 'status').map((tab) => {
            const tabItems = getItemsByType(tab.key as any)
            return (
              <TabsContent key={tab.key} value={tab.key} className="m-0 h-full">
                <ScrollArea className="h-full">
                  <div className="p-2">
                    {tabItems.length === 0 ? (
                      <div className="text-center text-black/38 py-8 text-sm">暂无物品</div>
                    ) : (
                      <div className="space-y-1.5">
                        {tabItems.map((item) => (
                          <Card key={item.id} className="p-2">
                            <div className="flex justify-between items-center gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-sm font-medium truncate ${RARITY_CONFIG[item.rarity].color}`}>
                                    {item.name}
                                  </span>
                                  <Badge variant="secondary" className={`text-xs px-1.5 py-0 ${RARITY_CONFIG[item.rarity].bgColor}`}>
                                    {RARITY_CONFIG[item.rarity].name}
                                  </Badge>
                                </div>
                                <div className="text-xs text-black/48 truncate">{item.description}</div>
                                <div className="flex gap-2 text-xs text-black/38 mt-0.5">
                                  {'type' in item && item.type === 'weapon' && (
                                    <span>攻: {item.attack}</span>
                                  )}
                                  {'type' in item && item.type === 'equipment' && (
                                    <span>防: {item.defense} | {item.slot}</span>
                                  )}
                                  {'type' in item && item.type === 'food' && (
                                    <span>恢复: {item.heal}</span>
                                  )}
                                  {'quantity' in item && (
                                    <span>x{item.quantity}</span>
                                  )}
                                </div>
                              </div>
                              {(item.type === 'weapon' || item.type === 'equipment') && (
                                <Button
                                  size="sm"
                                  variant={isEquipped(item) ? 'secondary' : 'default'}
                                  className="h-7 px-3 text-xs whitespace-nowrap"
                                  onClick={() => !isEquipped(item) && handleEquip(item)}
                                  disabled={isEquipped(item)}
                                >
                                  {isEquipped(item) ? '已装备' : '装备'}
                                </Button>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            )
          })}
        </div>
      </Tabs>
    </div>
  )
}

export default Bag

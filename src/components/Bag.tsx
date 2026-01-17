import { useState } from 'react'
import { useBagStore, RARITY_CONFIG } from '../stores/bagStore'
import { usePlayerStore } from '../stores/playerStore'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'

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
        <h3 className="text-lg font-medium mb-4 text-neutral-700">当前装备</h3>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-orange-500">武器</CardTitle>
          </CardHeader>
          <CardContent>
            {player.equipment.weapon ? (
              <div className="space-y-2">
                <div className={RARITY_CONFIG[player.equipment.weapon.rarity].color}>
                  {player.equipment.weapon.name}
                </div>
                <div className="text-sm text-black/60">攻击力: +{player.equipment.weapon.attack}</div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleUnequip('weapon')}
                >
                  卸下
                </Button>
              </div>
            ) : (
              <div className="text-black/38">未装备</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-blue-600">头盔</CardTitle>
          </CardHeader>
          <CardContent>
            {player.equipment.head ? (
              <div className="space-y-2">
                <div className={RARITY_CONFIG[player.equipment.head.rarity].color}>
                  {player.equipment.head.name}
                </div>
                <div className="text-sm text-black/60">防御力: +{player.equipment.head.defense}</div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleUnequip('head')}
                >
                  卸下
                </Button>
              </div>
            ) : (
              <div className="text-black/38">未装备</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-blue-600">护甲</CardTitle>
          </CardHeader>
          <CardContent>
            {player.equipment.body ? (
              <div className="space-y-2">
                <div className={RARITY_CONFIG[player.equipment.body.rarity].color}>
                  {player.equipment.body.name}
                </div>
                <div className="text-sm text-black/60">防御力: +{player.equipment.body.defense}</div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleUnequip('body')}
                >
                  卸下
                </Button>
              </div>
            ) : (
              <div className="text-black/38">未装备</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-blue-600">护腿</CardTitle>
          </CardHeader>
          <CardContent>
            {player.equipment.legs ? (
              <div className="space-y-2">
                <div className={RARITY_CONFIG[player.equipment.legs.rarity].color}>
                  {player.equipment.legs.name}
                </div>
                <div className="text-sm text-black/60">防御力: +{player.equipment.legs.defense}</div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleUnequip('legs')}
                >
                  卸下
                </Button>
              </div>
            ) : (
              <div className="text-black/38">未装备</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-blue-600">饰品</CardTitle>
          </CardHeader>
          <CardContent>
            {player.equipment.accessory ? (
              <div className="space-y-2">
                <div className={RARITY_CONFIG[player.equipment.accessory.rarity].color}>
                  {player.equipment.accessory.name}
                </div>
                <div className="text-sm text-black/60">防御力: +{player.equipment.accessory.defense}</div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleUnequip('accessory')}
                >
                  卸下
                </Button>
              </div>
            ) : (
              <div className="text-black/38">未装备</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm space-y-1">
              <div>总攻击力: {player.attack}</div>
              <div>总防御力: {player.defense}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab 导航 */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
        <div className="flex items-center justify-between border-b border-black/12">
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        {/* Tab 内容区域 */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="status" className="m-0 h-full">
            <ScrollArea className="h-full">
              {renderEquipmentStatus()}
            </ScrollArea>
          </TabsContent>

          {TABS.filter(tab => tab.key !== 'status').map((tab) => (
            <TabsContent key={tab.key} value={tab.key} className="m-0 h-full">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {getItemsByType(tab.key as TabType).length === 0 ? (
                    <div className="text-center text-black/38 py-8">暂无物品</div>
                  ) : (
                    <div className="space-y-2">
                      {getItemsByType(tab.key as TabType).map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`font-medium ${RARITY_CONFIG[item.rarity].color}`}>
                                    {item.name}
                                  </span>
                                  <Badge variant="secondary" className={RARITY_CONFIG[item.rarity].bgColor}>
                                    {RARITY_CONFIG[item.rarity].name}
                                  </Badge>
                                </div>
                                <div className="text-sm text-black/60">{item.description}</div>
                                {'type' in item && item.type === 'weapon' && (
                                  <div className="text-sm text-black/38 mt-1">攻击力: {item.attack}</div>
                                )}
                                {'type' in item && item.type === 'equipment' && (
                                  <div className="text-sm text-black/38 mt-1">防御力: {item.defense} | 部位: {item.slot}</div>
                                )}
                                {'type' in item && item.type === 'food' && (
                                  <div className="text-sm text-black/38 mt-1">恢复: {item.heal}</div>
                                )}
                                {'quantity' in item && (
                                  <div className="text-sm text-black/38 mt-1">数量: {item.quantity}</div>
                                )}
                              </div>
                              {(item.type === 'weapon' || item.type === 'equipment') && (
                                <Button
                                  size="sm"
                                  variant={isEquipped(item) ? 'secondary' : 'default'}
                                  onClick={() => !isEquipped(item) && handleEquip(item)}
                                  disabled={isEquipped(item)}
                                >
                                  {isEquipped(item) ? '已装备' : '装备'}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}

export default Bag

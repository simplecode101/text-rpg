import type { Item } from '../stores/bagStore'
import { RARITY_CONFIG } from '../stores/bagStore'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'

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
      <div className="text-2xl font-medium mb-6 text-center text-green-500">
        胜利！
      </div>

      {/* 奖励信息 */}
      <div className="flex-1 overflow-y-auto">
        {/* 经验和金币 */}
        <Card className="mb-4 bg-black/2">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-sm mb-1 text-black/60">经验值</div>
                <div className="text-2xl font-medium text-blue-600">+{exp}</div>
              </div>
              <div className="text-center">
                <div className="text-sm mb-1 text-black/60">金币</div>
                <div className="text-2xl font-medium text-yellow-500">+{gold}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 战利品物品 */}
        {items.length > 0 && (
          <Card className="bg-black/2">
            <CardContent className="p-4">
              <div className="text-sm mb-3 text-black/60">
                获得物品
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded flex justify-between items-center ${RARITY_CONFIG[item.rarity].bgColor}`}
                  >
                    <div className="flex-1">
                      <div className={`font-medium ${RARITY_CONFIG[item.rarity].textColor}`}>
                        {item.name}
                      </div>
                      <div className="text-xs mt-1 text-black/60">
                        {item.description}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-black/4">
                      {RARITY_CONFIG[item.rarity].name}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 没有物品掉落 */}
        {items.length === 0 && (
          <Card className="text-center bg-black/2">
            <CardContent className="p-4">
              <div className="text-black/38">没有获得物品</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 按钮 */}
      <div className="text-center mt-4">
        <Button size="lg" onClick={onClaim}>
          取战利品
        </Button>
      </div>
    </div>
  )
}

export default BattleLoot

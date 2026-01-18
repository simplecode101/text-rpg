import { useState } from 'react'
import { useQuestStore } from '../stores/questStore'
import { usePlayerStore } from '../stores/playerStore'
import { useBagStore } from '../stores/bagStore'
import { useItemLibraryStore } from '../stores/itemLibraryStore'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'

function Quest() {
  const player = usePlayerStore()
  const questStore = useQuestStore()
  const bag = useBagStore()
  const itemLibrary = useItemLibraryStore()
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available')

  const availableQuests = questStore.getAvailableQuests()
  const activeQuests = questStore.getActiveQuests()
  const completedQuests = questStore.getCompletedQuests()

  const handleStartQuest = (questId: string) => {
    questStore.startQuest(questId)
  }

  const handleClaimReward = (quest: any) => {
    // 给予经验
    player.addExp(quest.rewards.exp)
    player.addGold(quest.rewards.gold)

    // 给予物品
    if (quest.rewards.items) {
      quest.rewards.items.forEach((itemId: string) => {
        const item = itemLibrary.getItemById(itemId)
        if (item) {
          bag.addItem({ ...item, id: `${itemId}-${Date.now()}` } as any)
        }
      })
    }

    questStore.claimReward(quest.id)
  }

  const renderQuestCard = (quest: any) => {
    return (
      <Card key={quest.id} className="mb-3">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className={`font-medium ${RARITY_COLOR[quest.rarity]} mb-1`}>{quest.name}</div>
              <div className="text-sm text-black/60 mb-1">{quest.description}</div>
              <div className="text-xs text-black/38">需要等级: {quest.level}</div>
            </div>
            {quest.status === 'available' && player.getEffectiveLevel() >= quest.level && (
              <Button
                size="sm"
                onClick={() => handleStartQuest(quest.id)}
              >
                接取
              </Button>
            )}
            {quest.status === 'completed' && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleClaimReward(quest)}
              >
                领取奖励
              </Button>
            )}
          </div>

          {/* 任务目标 */}
          <div className="mt-2 space-y-2">
            {quest.objectives.map((obj: any, index: number) => {
              const isCompleted = obj.current >= obj.required
              const progress = Math.min((obj.current / obj.required) * 100, 100)

              return (
                <div key={index} className="text-sm">
                  <div className="flex justify-between">
                    <span>
                      {obj.type === 'kill' && '击败'}
                      {obj.type === 'collect' && '收集'}
                      {obj.type === 'reach_level' && '达到'}
                      {obj.type === 'explore' && '探索'}
                      : {obj.target}
                    </span>
                    <span className={isCompleted ? 'text-green-500' : ''}>
                      {obj.current}/{obj.required}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2 mt-1" />
                </div>
              )
            })}
          </div>

          {/* 任务奖励 */}
          <div className="mt-3 pt-3 border-t border-black/12">
            <div className="text-sm font-medium mb-1">奖励:</div>
            <div className="text-sm text-black/60">
              <div>经验: {quest.rewards.exp}</div>
              <div>金币: {quest.rewards.gold}</div>
              {quest.rewards.items && quest.rewards.items.length > 0 && (
                <div>
                  物品:{' '}
                  {quest.rewards.items.map((itemId: string) => {
                    const item = itemLibrary.getItemById(itemId)
                    return item?.name
                  }).join(', ')}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-4 border-b border-black/12">
        <h3 className="text-lg font-medium text-neutral-700">任务系统</h3>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'available' | 'active' | 'completed')}>
          <TabsList>
            <TabsTrigger value="available">可接任务 ({availableQuests.length})</TabsTrigger>
            <TabsTrigger value="active">进行中 ({activeQuests.length})</TabsTrigger>
            <TabsTrigger value="completed">已完成 ({completedQuests.length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 任务列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'available' && (
          <>
            {availableQuests.length === 0 ? (
              <div className="text-center text-black/38 py-8">暂无可用任务</div>
            ) : (
              availableQuests.map(renderQuestCard)
            )}
          </>
        )}

        {activeTab === 'active' && (
          <>
            {activeQuests.length === 0 ? (
              <div className="text-center text-black/38 py-8">暂无进行中任务</div>
            ) : (
              activeQuests.map(renderQuestCard)
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedQuests.length === 0 ? (
              <div className="text-center text-black/38 py-8">暂无已完成任务</div>
            ) : (
              completedQuests.map(renderQuestCard)
            )}
          </>
        )}
      </div>
    </div>
  )
}

const RARITY_COLOR: Record<string, string> = {
  orange: 'text-orange-500',
  purple: 'text-purple-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
  white: 'text-gray-500',
  gray: 'text-gray-400',
}

export default Quest

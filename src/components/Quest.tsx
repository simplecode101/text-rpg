import { useState } from 'react'
import { useQuestStore } from '../stores/questStore'
import { usePlayerStore } from '../stores/playerStore'
import { useBagStore } from '../stores/bagStore'
import { useItemLibraryStore } from '../stores/itemLibraryStore'

interface QuestProps {
  onClose: () => void
}

function Quest({ onClose }: QuestProps) {
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
      <div key={quest.id} className="rounded p-4 mb-3 shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className={`font-medium ${RARITY_COLOR[quest.rarity]}`}>{quest.name}</div>
            <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>{quest.description}</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>需要等级: {quest.level}</div>
          </div>
          {quest.status === 'available' && player.getEffectiveLevel() >= quest.level && (
            <button
              className="px-3 py-1 text-sm rounded shadow-sm hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: '#4caf50', color: '#ffffff' }}
              onClick={() => handleStartQuest(quest.id)}
            >
              接取
            </button>
          )}
          {quest.status === 'completed' && (
            <button
              className="px-3 py-1 text-sm rounded shadow-sm hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: '#ff9800', color: '#ffffff' }}
              onClick={() => handleClaimReward(quest)}
            >
              领取奖励
            </button>
          )}
        </div>

        {/* 任务目标 */}
        <div className="mt-2 space-y-1">
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
                  <span style={isCompleted ? { color: '#4caf50' } : {}}>
                    {obj.current}/{obj.required}
                  </span>
                </div>
                <div className="w-full rounded-full h-2 mt-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.12)' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%`, backgroundColor: isCompleted ? '#4caf50' : '#2196f3' }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* 任务奖励 */}
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <div className="text-sm font-medium mb-1">奖励:</div>
          <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
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
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <h3 className="text-lg font-medium" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>任务系统</h3>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            style={{
              backgroundColor: activeTab === 'available' ? '#1976d2' : 'transparent',
              color: activeTab === 'available' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              border: activeTab === 'available' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)'
            }}
            onClick={() => setActiveTab('available')}
          >
            可接任务 ({availableQuests.length})
          </button>
          <button
            className="px-4 py-2 rounded text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            style={{
              backgroundColor: activeTab === 'active' ? '#1976d2' : 'transparent',
              color: activeTab === 'active' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              border: activeTab === 'active' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)'
            }}
            onClick={() => setActiveTab('active')}
          >
            进行中 ({activeQuests.length})
          </button>
          <button
            className="px-4 py-2 rounded text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            style={{
              backgroundColor: activeTab === 'completed' ? '#1976d2' : 'transparent',
              color: activeTab === 'completed' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              border: activeTab === 'completed' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)'
            }}
            onClick={() => setActiveTab('completed')}
          >
            已完成 ({completedQuests.length})
          </button>
        </div>
        <button
          className="px-4 py-2 rounded-full transition-all duration-200"
          style={{ color: 'rgba(0, 0, 0, 0.54)' }}
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* 任务列表 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'available' && (
          <>
            {availableQuests.length === 0 ? (
              <div className="text-center" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>暂无可用任务</div>
            ) : (
              availableQuests.map(renderQuestCard)
            )}
          </>
        )}

        {activeTab === 'active' && (
          <>
            {activeQuests.length === 0 ? (
              <div className="text-center" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>暂无进行中任务</div>
            ) : (
              activeQuests.map(renderQuestCard)
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedQuests.length === 0 ? (
              <div className="text-center" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>暂无已完成任务</div>
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

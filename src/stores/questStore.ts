import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Rarity } from './bagStore'

// 任务类型
type QuestType = 'kill' | 'collect' | 'reach_level' | 'explore'

// 任务目标
interface QuestObjective {
  type: QuestType
  target: string // 目标ID（怪物ID、物品ID等）
  current: number
  required: number
}

// 任务状态
type QuestStatus = 'available' | 'active' | 'completed' | 'claimed'

// 任务接口
interface Quest {
  id: string
  name: string
  description: string
  rarity: Rarity
  level: number
  status: QuestStatus
  objectives: QuestObjective[]
  rewards: {
    exp: number
    gold: number
    items?: string[] // 物品ID列表
  }
}

// 任务状态接口
interface QuestState {
  quests: Quest[]

  // 获取所有任务
  getAllQuests: () => Quest[]

  // 获取可用任务
  getAvailableQuests: () => Quest[]

  // 获取进行中任务
  getActiveQuests: () => Quest[]

  // 获取已完成任务
  getCompletedQuests: () => Quest[]

  // 开始任务
  startQuest: (questId: string) => void

  // 更新任务进度
  updateObjective: (questId: string, objectiveIndex: number, progress: number) => void

  // 完成任务
  completeQuest: (questId: string) => void

  // 领取奖励
  claimReward: (questId: string) => void

  // 检查任务是否完成
  checkQuestCompletion: (questId: string) => boolean
}

// 初始任务数据
const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-001',
    name: '新手训练',
    description: '击败3只史莱姆',
    rarity: 'gray',
    level: 1,
    status: 'available',
    objectives: [
      {
        type: 'kill',
        target: 'monster-slime',
        current: 0,
        required: 3,
      },
    ],
    rewards: {
      exp: 50,
      gold: 20,
    },
  },
  {
    id: 'quest-002',
    name: '首次探险',
    description: '探索5次',
    rarity: 'gray',
    level: 1,
    status: 'available',
    objectives: [
      {
        type: 'explore',
        target: 'explore',
        current: 0,
        required: 5,
      },
    ],
    rewards: {
      exp: 30,
      gold: 10,
      items: ['food-bread'],
    },
  },
  {
    id: 'quest-003',
    name: '装备升级',
    description: '穿戴一件装备',
    rarity: 'white',
    level: 1,
    status: 'available',
    objectives: [
      {
        type: 'collect',
        target: 'equipment',
        current: 0,
        required: 1,
      },
    ],
    rewards: {
      exp: 100,
      gold: 50,
    },
  },
  {
    id: 'quest-004',
    name: '成长之路',
    description: '达到5级',
    rarity: 'white',
    level: 1,
    status: 'available',
    objectives: [
      {
        type: 'reach_level',
        target: 'level',
        current: 1,
        required: 5,
      },
    ],
    rewards: {
      exp: 200,
      gold: 100,
      items: ['weapon-wooden-sword'],
    },
  },
  {
    id: 'quest-005',
    name: '猎人',
    description: '击败10只巨鼠',
    rarity: 'green',
    level: 3,
    status: 'available',
    objectives: [
      {
        type: 'kill',
        target: 'monster-rat',
        current: 0,
        required: 10,
      },
    ],
    rewards: {
      exp: 300,
      gold: 150,
      items: ['food-apple', 'food-apple'],
    },
  },
  {
    id: 'quest-006',
    name: '勇者之路',
    description: '达到10级',
    rarity: 'blue',
    level: 5,
    status: 'available',
    objectives: [
      {
        type: 'reach_level',
        target: 'level',
        current: 1,
        required: 10,
      },
    ],
    rewards: {
      exp: 1000,
      gold: 500,
      items: ['weapon-iron-sword', 'equipment-leather-armor'],
    },
  },
]

// 创建任务 store
export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
  quests: INITIAL_QUESTS,

  getAllQuests: () => {
    return get().quests
  },

  getAvailableQuests: () => {
    return get().quests.filter((quest) => quest.status === 'available')
  },

  getActiveQuests: () => {
    return get().quests.filter((quest) => quest.status === 'active')
  },

  getCompletedQuests: () => {
    return get().quests.filter((quest) => quest.status === 'completed')
  },

  startQuest: (questId: string) => {
    set((state) => ({
      quests: state.quests.map((quest) =>
        quest.id === questId ? { ...quest, status: 'active' as QuestStatus } : quest
      ),
    }))
  },

  updateObjective: (questId: string, objectiveIndex: number, progress: number) => {
    set((state) => ({
      quests: state.quests.map((quest) => {
        if (quest.id === questId) {
          const newObjectives = [...quest.objectives]
          newObjectives[objectiveIndex] = {
            ...newObjectives[objectiveIndex],
            current: Math.min(progress, newObjectives[objectiveIndex].required),
          }

          const updatedQuest = { ...quest, objectives: newObjectives }

          // 检查任务是否完成
          if (get().checkQuestCompletion(questId)) {
            return { ...updatedQuest, status: 'completed' as QuestStatus }
          }

          return updatedQuest
        }
        return quest
      }),
    }))
  },

  completeQuest: (questId: string) => {
    set((state) => ({
      quests: state.quests.map((quest) =>
        quest.id === questId ? { ...quest, status: 'completed' as QuestStatus } : quest
      ),
    }))
  },

  claimReward: (questId: string) => {
    set((state) => ({
      quests: state.quests.map((quest) =>
        quest.id === questId ? { ...quest, status: 'claimed' as QuestStatus } : quest
      ),
    }))
  },

  checkQuestCompletion: (questId: string) => {
    const quest = get().quests.find((q) => q.id === questId)
    if (!quest) return false

    return quest.objectives.every((obj) => obj.current >= obj.required)
  },
}),
    {
      name: 'quest-storage', // localStorage key
    }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useSkillLibraryStore, type Skill } from './skillLibraryStore'

// 重新导出 Skill 类型和常量
export type { Skill }
export { rarityColors, rarityNames } from './skillLibraryStore'

// 玩家技能状态（包含学习等级和冷却）
export interface PlayerSkill {
  id: string
  learnedLevel: number // 学习等级
  currentCooldown: number // 当前冷却回合
}

// 技能状态接口
interface SkillState {
  // 玩家已学习的技能
  learnedSkills: Record<string, PlayerSkill>

  // 学习技能
  learnSkill: (skillId: string) => boolean

  // 检查是否已学习技能
  hasSkill: (skillId: string) => boolean

  // 获取已学习的技能列表
  getLearnedSkills: () => PlayerSkill[]

  // 获取可用技能（冷却完毕）
  getAvailableSkills: () => PlayerSkill[]

  // 使用技能（设置冷却）
  useSkill: (skillId: string) => void

  // 减少所有技能冷却（回合结束时调用）
  reduceCooldowns: () => void

  // 重置所有冷却
  resetCooldowns: () => void

  // 初始化默认技能
  initializeDefaultSkills: () => void

  // 升级技能
  upgradeSkill: (skillId: string) => boolean

  // 遗忘技能
  forgetSkill: (skillId: string) => void
}

export const useSkillStore = create<SkillState>()(
  persist(
    (set, get) => ({
  learnedSkills: {},

  learnSkill: (skillId: string) => {
    const skillLibrary = useSkillLibraryStore.getState()
    const skill = skillLibrary.getSkillById(skillId)

    if (!skill) return false

    set((state) => {
      // 如果已经学习，不重复学习
      if (state.learnedSkills[skillId]) {
        return state
      }

      return {
        learnedSkills: {
          ...state.learnedSkills,
          [skillId]: {
            id: skillId,
            learnedLevel: 1,
            currentCooldown: 0,
          },
        },
      }
    })

    return true
  },

  hasSkill: (skillId: string) => {
    const state = get()
    return !!state.learnedSkills[skillId]
  },

  getLearnedSkills: () => {
    const state = get()
    return Object.values(state.learnedSkills)
  },

  getAvailableSkills: () => {
    const state = get()
    return Object.values(state.learnedSkills).filter(
      (skill) => skill.currentCooldown === 0
    )
  },

  useSkill: (skillId: string) => {
    const skillLibrary = useSkillLibraryStore.getState()
    const skill = skillLibrary.getSkillById(skillId)

    if (!skill) return

    set((state) => {
      const playerSkill = state.learnedSkills[skillId]
      if (!playerSkill) return state

      return {
        learnedSkills: {
          ...state.learnedSkills,
          [skillId]: {
            ...playerSkill,
            currentCooldown: skill.cooldown,
          },
        },
      }
    })
  },

  reduceCooldowns: () => {
    set((state) => {
      const newLearnedSkills = { ...state.learnedSkills }

      Object.keys(newLearnedSkills).forEach((skillId) => {
        const playerSkill = newLearnedSkills[skillId]!
        if (playerSkill.currentCooldown > 0) {
          newLearnedSkills[skillId] = {
            ...playerSkill,
            currentCooldown: playerSkill.currentCooldown - 1,
          }
        }
      })

      return { learnedSkills: newLearnedSkills }
    })
  },

  resetCooldowns: () => {
    set((state) => {
      const newLearnedSkills = { ...state.learnedSkills }

      Object.keys(newLearnedSkills).forEach((skillId) => {
        newLearnedSkills[skillId] = {
          ...newLearnedSkills[skillId]!,
          currentCooldown: 0,
        }
      })

      return { learnedSkills: newLearnedSkills }
    })
  },

  initializeDefaultSkills: () => {
    // 初始化学习普通攻击和治疗术
    set({
      learnedSkills: {
        basic_attack: {
          id: 'basic_attack',
          learnedLevel: 1,
          currentCooldown: 0,
        },
        heal: {
          id: 'heal',
          learnedLevel: 1,
          currentCooldown: 0,
        },
      },
    })
  },

  upgradeSkill: (skillId: string) => {
    const skillLibrary = useSkillLibraryStore.getState()
    const skill = skillLibrary.getSkillById(skillId)

    if (!skill) return false

    set((state) => {
      const playerSkill = state.learnedSkills[skillId]
      if (!playerSkill || playerSkill.learnedLevel >= skill.maxLevel) {
        return state
      }

      return {
        learnedSkills: {
          ...state.learnedSkills,
          [skillId]: {
            ...playerSkill,
            learnedLevel: playerSkill.learnedLevel + 1,
          },
        },
      }
    })

    return true
  },

  forgetSkill: (skillId: string) => {
    set((state) => {
      const newLearnedSkills = { ...state.learnedSkills }
      delete newLearnedSkills[skillId]
      return { learnedSkills: newLearnedSkills }
    })
  },
}),
    {
      name: 'skill-storage', // localStorage key
    }
  )
)

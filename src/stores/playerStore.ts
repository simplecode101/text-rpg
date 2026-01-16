import { create } from 'zustand'
import type { Equipment, Weapon } from './bagStore'

// 装备槽
interface EquipmentSlots {
  weapon: Weapon | null
  head: Equipment | null
  body: Equipment | null
  legs: Equipment | null
  accessory: Equipment | null
}

// 玩家状态接口
interface PlayerState {
  // 基础属性
  name: string
  level: number
  exp: number
  maxExp: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  baseAttack: number
  baseDefense: number
  gold: number
  equipment: EquipmentSlots

  // 每日探索额度
  dailyExploreCount: number
  lastExploreDate: string
  maxDailyExplores: number

  // 计算总属性（基础+装备）
  attack: number
  defense: number

  // 重新计算属性
  recalculateStats: () => void

  // 穿戴装备
  equipItem: (item: Weapon | Equipment, slot: keyof EquipmentSlots) => void

  // 卸下装备
  unequipItem: (slot: keyof EquipmentSlots) => void

  // 增加经验值
  addExp: (amount: number) => void

  // 升级
  levelUp: () => void

  // 恢复生命值
  heal: (amount: number) => void

  // 受到伤害
  takeDamage: (damage: number) => void

  // 恢复蓝量
  restoreMp: (amount: number) => void

  // 消耗蓝量
  useMp: (amount: number) => boolean

  // 增加金币
  addGold: (amount: number) => void

  // 减少金币
  spendGold: (amount: number) => boolean

  // 更新属性
  updateStats: (stats: Partial<Pick<PlayerState, 'baseAttack' | 'baseDefense' | 'maxHp' | 'maxMp'>>) => void

  // 重置玩家
  resetPlayer: () => void

  // 检查并重置每日探索次数
  checkAndResetDailyExplore: () => void

  // 消耗探索次数
  useExplore: () => boolean

  // 获取剩余探索次数
  getRemainingExplores: () => number
}

// 计算总攻击力的辅助函数
const calculateTotalAttack = (state: PlayerState): number => {
  let totalAttack = state.baseAttack
  if (state.equipment.weapon) {
    totalAttack += state.equipment.weapon.attack
  }
  return totalAttack
}

// 计算总防御力的辅助函数
const calculateTotalDefense = (state: PlayerState): number => {
  let totalDefense = state.baseDefense
  Object.values(state.equipment).forEach((item) => {
    if (item && 'defense' in item) {
      totalDefense += item.defense
    }
  })
  return totalDefense
}

// 创建玩家 store
export const usePlayerStore = create<PlayerState>((set, get) => {
  // 初始状态
  const initialState = {
    name: '冒险者',
    level: 1,
    exp: 0,
    maxExp: 100,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    baseAttack: 10,
    baseDefense: 5,
    gold: 0,
    dailyExploreCount: 0,
    lastExploreDate: new Date().toDateString(),
    maxDailyExplores: 20,
    equipment: {
      weapon: null,
      head: null,
      body: null,
      legs: null,
      accessory: null,
    },
    attack: 10, // 初始总攻击力 = 基础攻击力
    defense: 5, // 初始总防御力 = 基础防御力
  }

  return {
    ...initialState,

    recalculateStats: () => {
      const state = get()
      set({
        attack: calculateTotalAttack(state),
        defense: calculateTotalDefense(state),
      })
    },

    equipItem: (item: Weapon | Equipment, slot: keyof EquipmentSlots) => {
      set((state) => {
        const newEquipment = { ...state.equipment }
        // 类型断言，因为我们已经在组件层面做了类型检查
        ;(newEquipment[slot] as any) = item

        // 计算新的总属性
        const newState: any = { equipment: newEquipment }

        // 更新攻击力
        if (slot === 'weapon' && item.type === 'weapon') {
          newState.attack = state.baseAttack + item.attack
        }

        // 更新防御力
        if (item.type === 'equipment') {
          newState.defense = calculateTotalDefense({ ...state, equipment: newEquipment })
        }

        return newState
      })
    },

    unequipItem: (slot: keyof EquipmentSlots) => {
      set((state) => {
        const newEquipment = { ...state.equipment }
        const item = newEquipment[slot]
        newEquipment[slot] = null

        // 计算新的总属性
        const newState: any = { equipment: newEquipment }

        // 更新攻击力
        if (slot === 'weapon') {
          newState.attack = state.baseAttack
        }

        // 更新防御力
        if (item && 'defense' in item) {
          newState.defense = calculateTotalDefense({ ...state, equipment: newEquipment })
        }

        return newState
      })
    },

  addExp: (amount: number) => {
    set((state) => {
      let newExp = state.exp + amount
      let newLevel = state.level
      let maxExp = state.maxExp

      // 检查是否升级
      while (newExp >= maxExp) {
        newExp -= maxExp
        newLevel += 1
        maxExp = Math.floor(maxExp * 1.5) // 每级经验需求增加 50%
      }

      // 如果升级了，更新属性
      if (newLevel > state.level) {
        const hpIncrease = 20
        const mpIncrease = 10
        const attackIncrease = 5
        const defenseIncrease = 3
        const levels = newLevel - state.level

        return {
          exp: newExp,
          level: newLevel,
          maxExp,
          maxHp: state.maxHp + hpIncrease * levels,
          hp: state.hp + hpIncrease * levels,
          maxMp: state.maxMp + mpIncrease * levels,
          mp: state.mp + mpIncrease * levels,
          baseAttack: state.baseAttack + attackIncrease * levels,
          baseDefense: state.baseDefense + defenseIncrease * levels,
          attack: state.baseAttack + attackIncrease * levels + (state.equipment.weapon?.attack || 0),
          defense: state.baseDefense + defenseIncrease * levels,
        }
      }

      return { exp: newExp }
    })
  },

  levelUp: () => {
    set((state) => {
      const newLevel = state.level + 1
      const hpIncrease = 20
      const mpIncrease = 10
      const attackIncrease = 5
      const defenseIncrease = 3

      return {
        level: newLevel,
        maxExp: Math.floor(state.maxExp * 1.5),
        maxHp: state.maxHp + hpIncrease,
        hp: state.maxHp + hpIncrease, // 升级回满血
        maxMp: state.maxMp + mpIncrease,
        mp: state.maxMp + mpIncrease, // 升级回满蓝
        baseAttack: state.baseAttack + attackIncrease,
        baseDefense: state.baseDefense + defenseIncrease,
        attack: state.baseAttack + attackIncrease + (state.equipment.weapon?.attack || 0),
        defense: state.baseDefense + defenseIncrease,
      }
    })
  },

  heal: (amount: number) => {
    set((state) => ({
      hp: Math.min(state.hp + amount, state.maxHp),
    }))
  },

  takeDamage: (damage: number) => {
    set((state) => ({
      hp: Math.max(state.hp - damage, 0),
    }))
  },

  restoreMp: (amount: number) => {
    set((state) => ({
      mp: Math.min(state.mp + amount, state.maxMp),
    }))
  },

  useMp: (amount: number) => {
    const state = get()
    if (state.mp < amount) {
      return false
    }
    set({ mp: state.mp - amount })
    return true
  },

  addGold: (amount: number) => {
    set((state) => ({
      gold: state.gold + amount,
    }))
  },

  spendGold: (amount: number) => {
    const state = get()
    if (state.gold < amount) {
      return false
    }
    set({ gold: state.gold - amount })
    return true
  },

  updateStats: (stats: Partial<Pick<PlayerState, 'baseAttack' | 'baseDefense' | 'maxHp' | 'maxMp'>>) => {
    set((state) => ({
      ...state,
      ...stats,
      // 如果更新了 maxHp，确保 hp 不超过新的 maxHp
      hp: stats.maxHp ? Math.min(state.hp, stats.maxHp) : state.hp,
      // 如果更新了 maxMp，确保 mp 不超过新的 maxMp
      mp: stats.maxMp ? Math.min(state.mp, stats.maxMp) : state.mp,
    }))
  },

  resetPlayer: () => {
    set({
      name: '冒险者',
      level: 1,
      exp: 0,
      maxExp: 100,
      hp: 100,
      maxHp: 100,
      mp: 50,
      maxMp: 50,
      baseAttack: 10,
      baseDefense: 5,
      gold: 0,
      dailyExploreCount: 0,
      lastExploreDate: new Date().toDateString(),
      maxDailyExplores: 20,
      equipment: {
        weapon: null,
        head: null,
        body: null,
        legs: null,
        accessory: null,
      },
      attack: 10,
      defense: 5,
    })
  },

  checkAndResetDailyExplore: () => {
    const state = get()
    const today = new Date().toDateString()
    if (state.lastExploreDate !== today) {
      set({
        dailyExploreCount: 0,
        lastExploreDate: today,
      })
    }
  },

  useExplore: () => {
    const state = get()
    state.checkAndResetDailyExplore()
    if (state.dailyExploreCount >= state.maxDailyExplores) {
      return false
    }
    set({ dailyExploreCount: state.dailyExploreCount + 1 })
    return true
  },

  getRemainingExplores: () => {
    const state = get()
    state.checkAndResetDailyExplore()
    return state.maxDailyExplores - state.dailyExploreCount
  },
}
})

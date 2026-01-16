import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Equipment, Weapon } from './bagStore'

// 修仙境界
type CultivationRealm =
  | '练气'
  | '筑基'
  | '金丹'
  | '元婴'
  | '化神'
  | '炼虚'
  | '合体'
  | '大乘'
  | '渡劫'

// 境界顺序
const REALM_ORDER: CultivationRealm[] = [
  '练气',
  '筑基',
  '金丹',
  '元婴',
  '化神',
  '炼虚',
  '合体',
  '大乘',
  '渡劫',
]

// 境界配置
const REALM_CONFIG: Record<
  CultivationRealm,
  { baseExp: number; baseHp: number; baseMp: number; baseAttack: number; baseDefense: number }
> = {
  练气: { baseExp: 100, baseHp: 100, baseMp: 50, baseAttack: 10, baseDefense: 5 },
  筑基: { baseExp: 500, baseHp: 200, baseMp: 100, baseAttack: 20, baseDefense: 10 },
  金丹: { baseExp: 2000, baseHp: 400, baseMp: 200, baseAttack: 40, baseDefense: 20 },
  元婴: { baseExp: 10000, baseHp: 800, baseMp: 400, baseAttack: 80, baseDefense: 40 },
  化神: { baseExp: 50000, baseHp: 1600, baseMp: 800, baseAttack: 160, baseDefense: 80 },
  炼虚: { baseExp: 200000, baseHp: 3200, baseMp: 1600, baseAttack: 320, baseDefense: 160 },
  合体: { baseExp: 1000000, baseHp: 6400, baseMp: 3200, baseAttack: 640, baseDefense: 320 },
  大乘: { baseExp: 5000000, baseHp: 12800, baseMp: 6400, baseAttack: 1280, baseDefense: 640 },
  渡劫: { baseExp: 20000000, baseHp: 25600, baseMp: 12800, baseAttack: 2560, baseDefense: 1280 },
}

// 装备槽
interface EquipmentSlots {
  weapon: Weapon | null
  head: Equipment | null
  body: Equipment | null
  legs: Equipment | null
  accessory: Equipment | null
}

// 计算每个境界的等级跨度（每个境界有3个小级别，但跨度是累乘的）
// 练气：3级，筑基：6级，金丹：18级，元婴：72级...
const getRealmSpan = (realmIndex: number): number => {
  let span = 3
  for (let i = 1; i <= realmIndex; i++) {
    span *= (i + 1)
  }
  return span
}

// 计算境界前所有境界的总等级数
const getPreviousRealmsTotalLevels = (realmIndex: number): number => {
  let total = 0
  for (let i = 0; i < realmIndex; i++) {
    total += getRealmSpan(i)
  }
  return total
}

// 玩家状态接口
interface PlayerState {
  // 基础属性
  name: string
  realm: CultivationRealm // 境界
  realmLevel: number // 境界内等级 (1-3)
  exp: number
  maxExp: number
  isInspirationState: boolean // 是否在灵感状态（3级满经验后）
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

  // 升级（境界内等级提升）
  levelUp: () => void

  // 尝试突破（提升境界）
  attemptBreakthrough: () => boolean

  // 获取境界等级显示文本
  getRealmDisplay: () => string

  // 获取等效等级（用于怪物生成等）
  getEffectiveLevel: () => number

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
export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => {
      // 计算当前境界等级的属性和经验需求
      const calculateRealmStats = (realm: CultivationRealm, realmLevel: number) => {
        const config = REALM_CONFIG[realm]
        const levelMultiplier = Math.pow(2, realmLevel - 1) // 每级属性翻倍

        return {
          maxExp: config.baseExp * levelMultiplier,
          baseHp: config.baseHp * levelMultiplier,
          baseMp: config.baseMp * levelMultiplier,
          baseAttack: config.baseAttack * levelMultiplier,
          baseDefense: config.baseDefense * levelMultiplier,
        }
      }

      // 初始状态
      const initialRealm = '练气' as CultivationRealm
      const initialStats = calculateRealmStats(initialRealm, 1)

      const initialState = {
        name: '冒险者',
        realm: initialRealm,
        realmLevel: 1,
        exp: 0,
        maxExp: initialStats.maxExp,
        isInspirationState: false,
        hp: initialStats.baseHp,
        maxHp: initialStats.baseHp,
        mp: initialStats.baseMp,
        maxMp: initialStats.baseMp,
        baseAttack: initialStats.baseAttack,
        baseDefense: initialStats.baseDefense,
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
        attack: initialStats.baseAttack, // 初始总攻击力 = 基础攻击力
        defense: initialStats.baseDefense, // 初始总防御力 = 基础防御力
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
      // 如果在灵感状态，经验不再增加
      if (state.isInspirationState) {
        return state
      }

      let newExp = state.exp + amount
      let newRealmLevel = state.realmLevel
      let newMaxExp = state.maxExp

      // 检查是否升级（境界内等级）
      while (newExp >= newMaxExp && newRealmLevel < 3) {
        newExp -= newMaxExp
        newRealmLevel += 1
        const stats = calculateRealmStats(state.realm, newRealmLevel)
        newMaxExp = stats.maxExp
      }

      // 如果3级满经验，进入灵感状态
      if (newRealmLevel === 3 && newExp >= newMaxExp) {
        return {
          exp: newMaxExp,
          isInspirationState: true,
        }
      }

      // 如果升级了，更新属性
      if (newRealmLevel !== state.realmLevel) {
        const stats = calculateRealmStats(state.realm, newRealmLevel)

        return {
          exp: newExp,
          realmLevel: newRealmLevel,
          maxExp: newMaxExp,
          maxHp: stats.baseHp,
          hp: stats.baseHp, // 升级恢复满血
          maxMp: stats.baseMp,
          mp: stats.baseMp, // 升级恢复满蓝
          baseAttack: stats.baseAttack,
          baseDefense: stats.baseDefense,
          attack: stats.baseAttack + (state.equipment.weapon?.attack || 0),
          defense: stats.baseDefense,
        }
      }

      return { exp: newExp }
    })
  },

  levelUp: () => {
    // 境界内升级，直接加满经验
    set((state) => {
      if (state.realmLevel >= 3) return state

      const newRealmLevel = state.realmLevel + 1
      const stats = calculateRealmStats(state.realm, newRealmLevel)
      const hpDiff = stats.baseHp - state.maxHp
      const mpDiff = stats.baseMp - state.maxMp

      return {
        realmLevel: newRealmLevel,
        exp: 0,
        maxExp: stats.maxExp,
        maxHp: stats.baseHp,
        hp: state.maxHp + hpDiff, // 升级回满血
        maxMp: stats.baseMp,
        mp: state.maxMp + mpDiff, // 升级回满蓝
        baseAttack: stats.baseAttack,
        baseDefense: stats.baseDefense,
        attack: stats.baseAttack + (state.equipment.weapon?.attack || 0),
        defense: stats.baseDefense,
      }
    })
  },

  attemptBreakthrough: () => {
    // 尝试突破到下一境界，20%成功率
    const success = Math.random() < 0.2
    const currentState = get()

    if (!success) {
      // 突破失败，保持灵感状态
      return false
    }

    const currentRealmIndex = REALM_ORDER.indexOf(currentState.realm)

    // 已经是最高境界，无法继续突破
    if (currentRealmIndex >= REALM_ORDER.length - 1) {
      return false
    }

    // 突破成功，进入下一境界1级
    const newRealm = REALM_ORDER[currentRealmIndex + 1]
    const stats = calculateRealmStats(newRealm, 1)

    set({
      realm: newRealm,
      realmLevel: 1,
      exp: 0,
      maxExp: stats.maxExp,
      isInspirationState: false, // 重置灵感状态
      maxHp: stats.baseHp,
      hp: stats.baseHp, // 突破回满血
      maxMp: stats.baseMp,
      mp: stats.baseMp, // 突破回满蓝
      baseAttack: stats.baseAttack,
      baseDefense: stats.baseDefense,
      attack: stats.baseAttack + (currentState.equipment.weapon?.attack || 0),
      defense: stats.baseDefense,
    })

    return true
  },

  getRealmDisplay: () => {
    const state = get()
    return `${state.realm}${state.realmLevel}级`
  },

  getEffectiveLevel: () => {
    const state = get()
    const realmIndex = REALM_ORDER.indexOf(state.realm)
    const previousLevels = getPreviousRealmsTotalLevels(realmIndex)
    const realmSpan = getRealmSpan(realmIndex)
    // 使用线性插值：等级 = 起始等级 + floor((小级别-1) * 跨度 / 3)
    return previousLevels + Math.floor((state.realmLevel - 1) * realmSpan / 3) + 1
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
    const initialRealm = '练气' as CultivationRealm
    const initialStats = calculateRealmStats(initialRealm, 1)

    set({
      name: '冒险者',
      realm: initialRealm,
      realmLevel: 1,
      exp: 0,
      maxExp: initialStats.maxExp,
      isInspirationState: false,
      hp: initialStats.baseHp,
      maxHp: initialStats.baseHp,
      mp: initialStats.baseMp,
      maxMp: initialStats.baseMp,
      baseAttack: initialStats.baseAttack,
      baseDefense: initialStats.baseDefense,
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
      attack: initialStats.baseAttack,
      defense: initialStats.baseDefense,
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
},
    {
      name: 'player-storage', // localStorage key
    }
  )
)

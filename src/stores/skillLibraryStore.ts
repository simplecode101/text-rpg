import { create } from 'zustand'

// 技能类型
export type SkillType = 'attack' | 'heal' | 'buff' | 'debuff'

// 技能稀有度
export type SkillRarity = 'common' | 'rare' | 'epic' | 'legendary'

// 稀有度颜色
export const rarityColors: Record<SkillRarity, string> = {
  common: '#9e9e9e',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ff9800',
}

// 稀有度名称
export const rarityNames: Record<SkillRarity, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
}

// 技能接口
export interface Skill {
  id: string
  name: string
  description: string
  type: SkillType
  target: 'self' | 'enemy'
  rarity: SkillRarity
  mpCost: number
  cooldown: number
  currentCooldown: number
  level: number
  maxLevel: number
  // 伤害相关
  damageMultiplier?: number
  // 治疗相关
  healAmount?: number
  healPercent?: number
  // Buff 相关
  buffAttack?: number
  buffDefense?: number
  buffDuration?: number
}

// 技能库状态接口
interface SkillLibraryState {
  // 所有可用技能
  allSkills: Skill[]

  // 根据ID获取技能
  getSkillById: (id: string) => Skill | undefined

  // 根据类型获取技能
  getSkillsByType: (type: SkillType) => Skill[]

  // 根据稀有度获取随机技能
  getRandomSkillByRarity: (rarity: SkillRarity) => Skill | undefined

  // 根据等级获取可学习技能
  getLearnableSkills: (playerLevel: number) => Skill[]

  // 初始化技能库
  initializeSkills: () => void
}

// 创建技能数据
const createSkills = (): Skill[] => [
  // === 普通技能 ===
  {
    id: 'basic_attack',
    name: '强力攻击',
    description: '发动一次强力攻击，造成150%攻击力的伤害',
    type: 'attack',
    target: 'enemy',
    rarity: 'common',
    mpCost: 10,
    cooldown: 0,
    currentCooldown: 0,
    level: 1,
    maxLevel: 5,
    damageMultiplier: 1.5,
  },
  {
    id: 'heal',
    name: '治疗术',
    description: '恢复30点生命值',
    type: 'heal',
    target: 'self',
    rarity: 'common',
    mpCost: 15,
    cooldown: 3,
    currentCooldown: 0,
    level: 1,
    maxLevel: 5,
    healAmount: 30,
  },
  {
    id: 'defend',
    name: '防御姿态',
    description: '提升30%防御力，持续2回合',
    type: 'buff',
    target: 'self',
    rarity: 'common',
    mpCost: 10,
    cooldown: 2,
    currentCooldown: 0,
    level: 1,
    maxLevel: 5,
    buffDefense: 0.3,
    buffDuration: 2,
  },

  // === 稀有技能 ===
  {
    id: 'fireball',
    name: '火球术',
    description: '发射一枚火球，造成200%攻击力的伤害',
    type: 'attack',
    target: 'enemy',
    rarity: 'rare',
    mpCost: 20,
    cooldown: 2,
    currentCooldown: 0,
    level: 1,
    maxLevel: 5,
    damageMultiplier: 2.0,
  },
  {
    id: 'lightning',
    name: '闪电链',
    description: '召唤闪电，造成180%攻击力的伤害，有20%几率眩晕敌人1回合',
    type: 'attack',
    target: 'enemy',
    rarity: 'rare',
    mpCost: 25,
    cooldown: 3,
    currentCooldown: 0,
    level: 1,
    maxLevel: 5,
    damageMultiplier: 1.8,
  },
  {
    id: 'group_heal',
    name: '群体治疗',
    description: '恢复50点生命值',
    type: 'heal',
    target: 'self',
    rarity: 'rare',
    mpCost: 30,
    cooldown: 4,
    currentCooldown: 0,
    level: 1,
    maxLevel: 5,
    healAmount: 50,
  },
  {
    id: 'rage',
    name: '狂暴',
    description: '提升50%攻击力，持续3回合',
    type: 'buff',
    target: 'self',
    rarity: 'rare',
    mpCost: 25,
    cooldown: 4,
    currentCooldown: 0,
    level: 1,
    maxLevel: 3,
    buffAttack: 0.5,
    buffDuration: 3,
  },

  // === 史诗技能 ===
  {
    id: 'meteor',
    name: '流星火雨',
    description: '召唤流星，造成300%攻击力的毁灭性伤害',
    type: 'attack',
    target: 'enemy',
    rarity: 'epic',
    mpCost: 40,
    cooldown: 4,
    currentCooldown: 0,
    level: 1,
    maxLevel: 3,
    damageMultiplier: 3.0,
  },
  {
    id: 'blizzard',
    name: '暴风雪',
    description: '释放冰霜风暴，造成250%攻击力的伤害，并降低敌人30%攻击力2回合',
    type: 'attack',
    target: 'enemy',
    rarity: 'epic',
    mpCost: 35,
    cooldown: 3,
    currentCooldown: 0,
    level: 1,
    maxLevel: 3,
    damageMultiplier: 2.5,
  },
  {
    id: 'divine_heal',
    name: '神圣治疗',
    description: '恢复80点生命值',
    type: 'heal',
    target: 'self',
    rarity: 'epic',
    mpCost: 45,
    cooldown: 5,
    currentCooldown: 0,
    level: 1,
    maxLevel: 3,
    healAmount: 80,
  },
  {
    id: 'shield_wall',
    name: '盾墙',
    description: '提升100%防御力，持续2回合',
    type: 'buff',
    target: 'self',
    rarity: 'epic',
    mpCost: 35,
    cooldown: 5,
    currentCooldown: 0,
    level: 1,
    maxLevel: 3,
    buffDefense: 1.0,
    buffDuration: 2,
  },

  // === 传说技能 ===
  {
    id: 'ultima',
    name: '终极奥义',
    description: '释放全力，造成500%攻击力的终极伤害',
    type: 'attack',
    target: 'enemy',
    rarity: 'legendary',
    mpCost: 60,
    cooldown: 6,
    currentCooldown: 0,
    level: 1,
    maxLevel: 1,
    damageMultiplier: 5.0,
  },
  {
    id: 'resurrection',
    name: '复苏之光',
    description: '恢复100%生命值',
    type: 'heal',
    target: 'self',
    rarity: 'legendary',
    mpCost: 80,
    cooldown: 8,
    currentCooldown: 0,
    level: 1,
    maxLevel: 1,
    healPercent: 1.0,
  },
  {
    id: 'god_mode',
    name: '神之庇护',
    description: '提升100%攻击力和防御力，持续5回合',
    type: 'buff',
    target: 'self',
    rarity: 'legendary',
    mpCost: 70,
    cooldown: 10,
    currentCooldown: 0,
    level: 1,
    maxLevel: 1,
    buffAttack: 1.0,
    buffDefense: 1.0,
    buffDuration: 5,
  },
]

export const useSkillLibraryStore = create<SkillLibraryState>((set, get) => ({
  allSkills: [],

  initializeSkills: () => {
    set({ allSkills: createSkills() })
  },

  getSkillById: (id: string) => {
    const state = get()
    return state.allSkills.find((skill) => skill.id === id)
  },

  getSkillsByType: (type: SkillType) => {
    const state = get()
    return state.allSkills.filter((skill) => skill.type === type)
  },

  getRandomSkillByRarity: (rarity: SkillRarity) => {
    const state = get()
    const skills = state.allSkills.filter((skill) => skill.rarity === rarity)
    if (skills.length === 0) return undefined
    return skills[Math.floor(Math.random() * skills.length)]
  },

  getLearnableSkills: (playerLevel: number) => {
    const state = get()
    // 根据等级返回可学习的技能
    // 普通: 1级起
    // 稀有: 5级起
    // 史诗: 10级起
    // 传说: 15级起
    return state.allSkills.filter((skill) => {
      switch (skill.rarity) {
        case 'common':
          return playerLevel >= 1
        case 'rare':
          return playerLevel >= 5
        case 'epic':
          return playerLevel >= 10
        case 'legendary':
          return playerLevel >= 15
        default:
          return false
      }
    })
  },
}))

// 初始化技能库
useSkillLibraryStore.getState().initializeSkills()

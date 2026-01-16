import { create } from 'zustand'
import type { Rarity } from './bagStore'

// 怪物接口
export interface Monster {
  id: string
  name: string
  description: string
  level: number
  hp: number
  maxHp: number
  attack: number
  defense: number
  expReward: number
  goldReward: number
  rarity: Rarity
}

// 怪物库状态接口
interface MonsterLibraryState {
  monsters: Monster[]

  // 根据等级获取怪物
  getMonstersByLevel: (level: number) => Monster[]

  // 获取随机怪物（根据玩家等级）
  getRandomMonster: (playerLevel: number) => Monster | undefined

  // 根据ID获取怪物
  getMonsterById: (id: string) => Monster | undefined
}

// 创建怪物库 store
export const useMonsterLibraryStore = create<MonsterLibraryState>((_set, get) => ({
  monsters: [
    // ===== 橙色传说怪物 =====
    {
      id: 'monster-dragon-ancient',
      name: '远古巨龙',
      description: '传说中的龙族之王，力量无与伦比',
      level: 50,
      hp: 10000,
      maxHp: 10000,
      attack: 500,
      defense: 300,
      expReward: 5000,
      goldReward: 2000,
      rarity: 'orange',
    },
    {
      id: 'monster-demon-lord',
      name: '魔界魔王',
      description: '魔界的统治者，恐怖的化身',
      level: 45,
      hp: 8000,
      maxHp: 8000,
      attack: 450,
      defense: 250,
      expReward: 4000,
      goldReward: 1500,
      rarity: 'orange',
    },

    // ===== 紫色史诗怪物 =====
    {
      id: 'monster-dragon',
      name: '成年巨龙',
      description: '强大的龙族生物',
      level: 30,
      hp: 5000,
      maxHp: 5000,
      attack: 300,
      defense: 150,
      expReward: 2000,
      goldReward: 800,
      rarity: 'purple',
    },
    {
      id: 'monster-lich',
      name: '巫妖',
      description: '不死的法师，掌握强大的魔法',
      level: 28,
      hp: 4000,
      maxHp: 4000,
      attack: 350,
      defense: 100,
      expReward: 1800,
      goldReward: 700,
      rarity: 'purple',
    },
    {
      id: 'monster-titan',
      name: '泰坦巨人',
      description: '巨大的神话生物',
      level: 32,
      hp: 6000,
      maxHp: 6000,
      attack: 280,
      defense: 200,
      expReward: 2200,
      goldReward: 900,
      rarity: 'purple',
    },

    // ===== 蓝色稀有怪物 =====
    {
      id: 'monster-orc-chief',
      name: '兽人首领',
      description: '兽人部落的强大领袖',
      level: 15,
      hp: 1500,
      maxHp: 1500,
      attack: 120,
      defense: 60,
      expReward: 500,
      goldReward: 200,
      rarity: 'blue',
    },
    {
      id: 'monster-dark-knight',
      name: '黑暗骑士',
      description: '堕落的骑士，战斗力强大',
      level: 18,
      hp: 1800,
      maxHp: 1800,
      attack: 140,
      defense: 80,
      expReward: 600,
      goldReward: 250,
      rarity: 'blue',
    },
    {
      id: 'monster-vampire',
      name: '吸血鬼',
      description: '不死生物，吸取生命',
      level: 20,
      hp: 2000,
      maxHp: 2000,
      attack: 160,
      defense: 70,
      expReward: 700,
      goldReward: 300,
      rarity: 'blue',
    },

    // ===== 绿色优秀怪物 =====
    {
      id: 'monster-goblin',
      name: '哥布林',
      description: '狡猾的小怪物',
      level: 5,
      hp: 200,
      maxHp: 200,
      attack: 30,
      defense: 10,
      expReward: 50,
      goldReward: 20,
      rarity: 'green',
    },
    {
      id: 'monster-wolf',
      name: '恶狼',
      description: '凶猛的野兽',
      level: 7,
      hp: 300,
      maxHp: 300,
      attack: 40,
      defense: 15,
      expReward: 70,
      goldReward: 30,
      rarity: 'green',
    },
    {
      id: 'monster-skeleton',
      name: '骷髅战士',
      description: '复生的骸骨',
      level: 8,
      hp: 350,
      maxHp: 350,
      attack: 45,
      defense: 20,
      expReward: 80,
      goldReward: 35,
      rarity: 'green',
    },

    // ===== 白色普通怪物 =====
    {
      id: 'monster-slime',
      name: '史莱姆',
      description: '弱小的软体生物',
      level: 1,
      hp: 50,
      maxHp: 50,
      attack: 10,
      defense: 5,
      expReward: 10,
      goldReward: 5,
      rarity: 'white',
    },
    {
      id: 'monster-rat',
      name: '巨鼠',
      description: '巨大的老鼠',
      level: 2,
      hp: 80,
      maxHp: 80,
      attack: 15,
      defense: 8,
      expReward: 20,
      goldReward: 8,
      rarity: 'white',
    },
    {
      id: 'monster-bat',
      name: '吸血蝙蝠',
      description: '常见的蝙蝠',
      level: 3,
      hp: 100,
      maxHp: 100,
      attack: 18,
      defense: 6,
      expReward: 25,
      goldReward: 10,
      rarity: 'white',
    },

    // ===== 灰色破旧怪物 =====
    {
      id: 'monster-slug',
      name: '蛞蝓',
      description: '极其弱小的生物',
      level: 1,
      hp: 30,
      maxHp: 30,
      attack: 5,
      defense: 2,
      expReward: 5,
      goldReward: 2,
      rarity: 'gray',
    },
  ],

  getMonstersByLevel: (level: number) => {
    return get().monsters.filter((monster) => monster.level <= level + 5 && monster.level >= level - 5)
  },

  getRandomMonster: (playerLevel: number) => {
    const monsters = get().monsters.filter(
      (monster) => monster.level <= playerLevel + 5 && monster.level >= playerLevel - 5
    )
    if (monsters.length === 0) return undefined

    // 根据稀有度权重随机
    const weights = monsters.map((m) => {
      switch (m.rarity) {
        case 'orange':
          return 1
        case 'purple':
          return 3
        case 'blue':
          return 10
        case 'green':
          return 30
        case 'white':
          return 40
        case 'gray':
          return 20
        default:
          return 10
      }
    })

    const totalWeight = weights.reduce((sum, w) => sum + w, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < monsters.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        return monsters[i]
      }
    }

    return monsters[0]
  },

  getMonsterById: (id: string) => {
    return get().monsters.find((monster) => monster.id === id)
  },
}))

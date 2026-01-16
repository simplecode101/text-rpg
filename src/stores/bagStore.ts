import { create } from 'zustand'

// 物品类型
type ItemType = 'weapon' | 'equipment' | 'material' | 'food' | 'quest'

// 物品稀有度（由高到低）
export type Rarity = 'orange' | 'purple' | 'blue' | 'green' | 'white' | 'gray'

// 稀有度配置
export const RARITY_CONFIG: Record<
  Rarity,
  { name: string; color: string; textColor: string; bgColor: string }
> = {
  orange: { name: '传说', color: 'text-orange-500', textColor: 'text-orange-500', bgColor: 'bg-orange-50' },
  purple: { name: '史诗', color: 'text-purple-500', textColor: 'text-purple-500', bgColor: 'bg-purple-50' },
  blue: { name: '稀有', color: 'text-blue-500', textColor: 'text-blue-500', bgColor: 'bg-blue-50' },
  green: { name: '优秀', color: 'text-green-500', textColor: 'text-green-500', bgColor: 'bg-green-50' },
  white: { name: '普通', color: 'text-gray-700', textColor: 'text-gray-700', bgColor: 'bg-gray-50' },
  gray: { name: '破旧', color: 'text-gray-400', textColor: 'text-gray-400', bgColor: 'bg-gray-100' },
}

// 基础物品接口
interface BaseItem {
  id: string
  name: string
  description: string
  rarity: Rarity
  icon?: string
}

// 武器
export interface Weapon extends BaseItem {
  type: 'weapon'
  attack: number
  durability: number
  maxDurability: number
}

// 装备
export interface Equipment extends BaseItem {
  type: 'equipment'
  defense: number
  slot: 'head' | 'body' | 'legs' | 'accessory'
  durability: number
  maxDurability: number
}

// 材料
interface Material extends BaseItem {
  type: 'material'
  quantity: number
  stackable: true
}

// 食物
interface Food extends BaseItem {
  type: 'food'
  heal: number
  quantity: number
  stackable: true
}

// 任务物品
interface QuestItem extends BaseItem {
  type: 'quest'
  questId: string
  quantity: number
}

// 物品联合类型
export type Item = Weapon | Equipment | Material | Food | QuestItem

// 背包状态接口
interface BagState {
  items: Item[]

  // 获取指定类型的物品
  getItemsByType: (type: ItemType) => Item[]

  // 添加物品
  addItem: (item: Item) => void

  // 删除物品
  removeItem: (itemId: string) => void

  // 更新物品
  updateItem: (itemId: string, updates: Partial<Omit<Item, 'id' | 'type'>>) => void

  // 清空背包
  clearBag: () => void
}

// 创建背包 store
export const useBagStore = create<BagState>((set, get) => ({
  items: [
    // 武器
    {
      id: 'weapon-001',
      name: '屠龙刀',
      description: '传说中的神兵利器，攻击力极强',
      rarity: 'orange',
      type: 'weapon',
      attack: 500,
      durability: 1000,
      maxDurability: 1000,
    },
    {
      id: 'weapon-002',
      name: '青龙偃月刀',
      description: '青龙偃月刀，威力无穷',
      rarity: 'purple',
      type: 'weapon',
      attack: 300,
      durability: 800,
      maxDurability: 800,
    },
    {
      id: 'weapon-003',
      name: '精钢剑',
      description: '一把锋利的精钢宝剑',
      rarity: 'blue',
      type: 'weapon',
      attack: 150,
      durability: 500,
      maxDurability: 500,
    },
    {
      id: 'weapon-004',
      name: '铁剑',
      description: '普通的铁制长剑',
      rarity: 'white',
      type: 'weapon',
      attack: 50,
      durability: 300,
      maxDurability: 300,
    },
    {
      id: 'weapon-005',
      name: '木棍',
      description: '一根普通的木棍',
      rarity: 'gray',
      type: 'weapon',
      attack: 5,
      durability: 50,
      maxDurability: 50,
    },
    // 装备
    {
      id: 'equipment-001',
      name: '龙鳞甲',
      description: '用龙鳞制成的护甲，防御力极强',
      rarity: 'orange',
      type: 'equipment',
      defense: 400,
      slot: 'body',
      durability: 1000,
      maxDurability: 1000,
    },
    {
      id: 'equipment-002',
      name: '麒麟头盔',
      description: '传说中的神兽麒麟之盔',
      rarity: 'purple',
      type: 'equipment',
      defense: 200,
      slot: 'head',
      durability: 800,
      maxDurability: 800,
    },
    {
      id: 'equipment-003',
      name: '精钢护腿',
      description: '精钢打造的护腿',
      rarity: 'blue',
      type: 'equipment',
      defense: 100,
      slot: 'legs',
      durability: 500,
      maxDurability: 500,
    },
    {
      id: 'equipment-004',
      name: '布甲',
      description: '普通的布制护甲',
      rarity: 'white',
      type: 'equipment',
      defense: 30,
      slot: 'body',
      durability: 300,
      maxDurability: 300,
    },
    {
      id: 'equipment-005',
      name: '破旧的护符',
      description: '一个破旧的护符',
      rarity: 'gray',
      type: 'equipment',
      defense: 5,
      slot: 'accessory',
      durability: 100,
      maxDurability: 100,
    },
    // 材料
    {
      id: 'material-001',
      name: '龙鳞',
      description: '珍贵的龙鳞材料',
      rarity: 'orange',
      type: 'material',
      quantity: 5,
      stackable: true,
    },
    {
      id: 'material-002',
      name: '秘银矿石',
      description: '稀有的秘银矿石',
      rarity: 'purple',
      type: 'material',
      quantity: 10,
      stackable: true,
    },
    {
      id: 'material-003',
      name: '精铁',
      description: '精炼的铁块',
      rarity: 'green',
      type: 'material',
      quantity: 50,
      stackable: true,
    },
    {
      id: 'material-004',
      name: '皮革',
      description: '普通的兽皮',
      rarity: 'white',
      type: 'material',
      quantity: 100,
      stackable: true,
    },
    {
      id: 'material-005',
      name: '废铁',
      description: '废弃的铁块',
      rarity: 'gray',
      type: 'material',
      quantity: 200,
      stackable: true,
    },
    // 食物
    {
      id: 'food-001',
      name: '仙丹',
      description: '传说中的仙丹，能瞬间恢复大量生命值',
      rarity: 'orange',
      type: 'food',
      heal: 1000,
      quantity: 3,
      stackable: true,
    },
    {
      id: 'food-002',
      name: '灵芝',
      description: '珍贵的灵芝，恢复大量生命值',
      rarity: 'purple',
      type: 'food',
      heal: 500,
      quantity: 5,
      stackable: true,
    },
    {
      id: 'food-003',
      name: '烤肉',
      description: '美味的烤肉，恢复中等生命值',
      rarity: 'green',
      type: 'food',
      heal: 100,
      quantity: 20,
      stackable: true,
    },
    {
      id: 'food-004',
      name: '面包',
      description: '普通的面包',
      rarity: 'white',
      type: 'food',
      heal: 50,
      quantity: 50,
      stackable: true,
    },
    {
      id: 'food-005',
      name: '发霉的馒头',
      description: '已经发霉的馒头',
      rarity: 'gray',
      type: 'food',
      heal: 10,
      quantity: 100,
      stackable: true,
    },
    // 任务物品
    {
      id: 'quest-001',
      name: '屠龙令',
      description: '发布屠龙任务的令牌',
      rarity: 'orange',
      type: 'quest',
      questId: 'quest-dragon-slayer',
      quantity: 1,
    },
    {
      id: 'quest-002',
      name: '勇士勋章',
      description: '证明勇士身份的勋章',
      rarity: 'purple',
      type: 'quest',
      questId: 'quest-warrior-proof',
      quantity: 1,
    },
    {
      id: 'quest-003',
      name: '密信',
      description: '一封神秘的信件',
      rarity: 'blue',
      type: 'quest',
      questId: 'quest-secret-letter',
      quantity: 1,
    },
    {
      id: 'quest-004',
      name: '村长的委托书',
      description: '村长的委托信',
      rarity: 'white',
      type: 'quest',
      questId: 'quest-village-request',
      quantity: 1,
    },
    {
      id: 'quest-005',
      name: '破损的地图',
      description: '一张破损的地图碎片',
      rarity: 'gray',
      type: 'quest',
      questId: 'quest-map-fragment',
      quantity: 5,
    },
  ],

  getItemsByType: (type: ItemType) => {
    return get().items.filter((item) => item.type === type)
  },

  addItem: (item: Item) => {
    set((state) => {
      // 如果是可堆叠物品，检查是否已存在
      if ('stackable' in item && item.stackable) {
        const existingIndex = state.items.findIndex(
          (i) => i.id === item.id && i.type === item.type
        )
        if (existingIndex !== -1) {
          const newItems = [...state.items]
          const existingItem = newItems[existingIndex] as Material | Food
          existingItem.quantity += item.quantity
          return { items: newItems }
        }
      }
      return { items: [...state.items, item] }
    })
  },

  removeItem: (itemId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }))
  },

  updateItem: (itemId: string, updates: Partial<Omit<Item, 'id' | 'type'>>) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    }))
  },

  clearBag: () => {
    set({ items: [] })
  },
}))

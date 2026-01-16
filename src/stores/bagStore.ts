import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Papa from 'papaparse'

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

  // 从CSV初始化背包
  initializeFromCSV: () => Promise<void>

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
export const useBagStore = create<BagState>()(
  persist(
    (set, get) => ({
      items: [],

      initializeFromCSV: async () => {
        const response = await fetch('/bag_store.csv')
        const csvText = await response.text()

        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results: any) => {
            const items: Item[] = []

            for (const row of results.data as any[]) {
              const baseItem = {
                id: row.id,
                name: row.name,
                description: row.description,
                rarity: row.rarity,
              }

              switch (row.type) {
                case 'weapon':
                  items.push({
                    ...baseItem,
                    type: 'weapon',
                    attack: row.attack,
                    durability: row.durability,
                    maxDurability: row.maxDurability,
                  })
                  break
                case 'equipment':
                  items.push({
                    ...baseItem,
                    type: 'equipment',
                    defense: row.defense,
                    slot: row.slot,
                    durability: row.durability,
                    maxDurability: row.maxDurability,
                  })
                  break
                case 'material':
                  items.push({
                    ...baseItem,
                    type: 'material',
                    quantity: row.quantity,
                    stackable: true,
                  })
                  break
                case 'food':
                  items.push({
                    ...baseItem,
                    type: 'food',
                    heal: row.heal,
                    quantity: row.quantity,
                    stackable: true,
                  })
                  break
                case 'quest':
                  items.push({
                    ...baseItem,
                    type: 'quest',
                    questId: row.questId,
                    quantity: row.quantity,
                  })
                  break
              }
            }

            set({ items })
          },
        })
      },

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
              const existingItem = newItems[existingIndex] as any
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
    }),
    {
      name: 'bag-storage', // localStorage key
    }
  )
)

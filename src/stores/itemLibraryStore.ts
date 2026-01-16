import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Papa from 'papaparse'
import type { Item, Rarity } from './bagStore'

// 物品库状态接口
interface ItemLibraryState {
  // 所有可获得的物品（物品库/图鉴）
  items: Item[]

  // 初始化物品库（从CSV加载）
  initializeFromCSV: () => Promise<void>

  // 根据类型获取物品
  getItemsByType: (type: string) => Item[]

  // 根据稀有度获取物品
  getItemsByRarity: (rarity: Rarity) => Item[]

  // 根据ID获取物品
  getItemById: (id: string) => Item | undefined

  // 添加物品到物品库
  addItem: (item: Item) => void

  // 更新物品
  updateItem: (id: string, item: Item) => void

  // 删除物品
  deleteItem: (id: string) => void

  // 批量添加物品
  addItems: (items: Item[]) => void

  // 随机获取指定类型和稀有度的物品
  getRandomItem: (type: string, rarity?: Rarity) => Item | undefined

  // 随机获取指定稀有度的物品
  getRandomItemByRarity: (rarity: Rarity) => Item | undefined

  // 清空物品库
  clearLibrary: () => void
}

// 创建物品库 store
export const useItemLibraryStore = create<ItemLibraryState>()(
  persist(
    (set, get) => ({
      items: [],

      initializeFromCSV: async () => {
        const response = await fetch('/items.csv')
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

      getItemsByType: (type: string) => {
        return get().items.filter((item) => item.type === type)
      },

      getItemsByRarity: (rarity: Rarity) => {
        return get().items.filter((item) => item.rarity === rarity)
      },

      getItemById: (id: string) => {
        return get().items.find((item) => item.id === id)
      },

      addItem: (item: Item) => {
        set((state) => {
          // 检查是否已存在
          if (state.items.find((i) => i.id === item.id)) {
            return state
          }
          return { items: [...state.items, item] }
        })
      },

      updateItem: (id: string, item: Item) => {
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? item : i)),
        }))
      },

      deleteItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },

      addItems: (items: Item[]) => {
        set((state) => {
          const existingIds = new Set(state.items.map((i) => i.id))
          const newItems = items.filter((item) => !existingIds.has(item.id))
          return { items: [...state.items, ...newItems] }
        })
      },

      getRandomItem: (type: string, rarity?: Rarity) => {
        const items = get().items.filter(
          (item) => item.type === type && (!rarity || item.rarity === rarity)
        )
        if (items.length === 0) return undefined
        return items[Math.floor(Math.random() * items.length)]
      },

      getRandomItemByRarity: (rarity: Rarity) => {
        const items = get().items.filter((item) => item.rarity === rarity)
        if (items.length === 0) return undefined
        return items[Math.floor(Math.random() * items.length)]
      },

      clearLibrary: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'item-library-storage', // localStorage key
    }
  )
)

import { create } from 'zustand'
import type { Item } from './bagStore'
import type { Rarity } from './bagStore'

// 物品库状态接口
interface ItemLibraryState {
  // 所有可获得的物品（物品库/图鉴）
  items: Item[]

  // 根据类型获取物品
  getItemsByType: (type: string) => Item[]

  // 根据稀有度获取物品
  getItemsByRarity: (rarity: Rarity) => Item[]

  // 根据ID获取物品
  getItemById: (id: string) => Item | undefined

  // 添加物品到物品库
  addItem: (item: Item) => void

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
export const useItemLibraryStore = create<ItemLibraryState>((set, get) => ({
  items: [
    // ===== 橙色传说物品 =====
    // 武器
    {
      id: 'weapon-excalibur',
      name: '誓约胜利之剑',
      description: '传说中的圣剑，光芒万丈',
      rarity: 'orange',
      type: 'weapon',
      attack: 1000,
      durability: 5000,
      maxDurability: 5000,
    },
    {
      id: 'weapon-gungnir',
      name: '永恒之枪',
      description: '奥丁的神枪，无坚不摧',
      rarity: 'orange',
      type: 'weapon',
      attack: 950,
      durability: 5000,
      maxDurability: 5000,
    },
    // 装备
    {
      id: 'equipment-armor-divine',
      name: '神圣战甲',
      description: '神赐予的铠甲，坚不可摧',
      rarity: 'orange',
      type: 'equipment',
      defense: 800,
      slot: 'body',
      durability: 5000,
      maxDurability: 5000,
    },
    {
      id: 'equipment-helmet-crown',
      name: '王者皇冠',
      description: '象征王权的皇冠',
      rarity: 'orange',
      type: 'equipment',
      defense: 600,
      slot: 'head',
      durability: 5000,
      maxDurability: 5000,
    },
    // 材料
    {
      id: 'material-dragon-core',
      name: '龙之心',
      description: '巨龙的核心，蕴含无穷力量',
      rarity: 'orange',
      type: 'material',
      quantity: 1,
      stackable: true,
    },
    {
      id: 'material-phoenix-feather',
      name: '凤凰羽毛',
      description: '不死鸟的羽毛，可以起死回生',
      rarity: 'orange',
      type: 'material',
      quantity: 1,
      stackable: true,
    },
    // 食物
    {
      id: 'food-ambrosia',
      name: '仙馔密酒',
      description: '神灵的食物，恢复所有生命和法力',
      rarity: 'orange',
      type: 'food',
      heal: 2000,
      quantity: 1,
      stackable: true,
    },
    // 任务
    {
      id: 'quest-divine-relic',
      name: '神圣遗物',
      description: '寻找失落的圣物',
      rarity: 'orange',
      type: 'quest',
      questId: 'quest-divine',
      quantity: 1,
    },

    // ===== 紫色史诗物品 =====
    // 武器
    {
      id: 'weapon-dragon-slayer',
      name: '屠龙刀',
      description: '传说中的神兵利器，攻击力极强',
      rarity: 'purple',
      type: 'weapon',
      attack: 500,
      durability: 2000,
      maxDurability: 2000,
    },
    {
      id: 'weapon-falchion',
      name: '青龙偃月刀',
      description: '青龙偃月刀，威力无穷',
      rarity: 'purple',
      type: 'weapon',
      attack: 480,
      durability: 2000,
      maxDurability: 2000,
    },
    {
      id: 'weapon-thunder-hammer',
      name: '雷神之锤',
      description: '蕴含雷霆之力的战锤',
      rarity: 'purple',
      type: 'weapon',
      attack: 520,
      durability: 1800,
      maxDurability: 1800,
    },
    // 装备
    {
      id: 'equipment-dragon-scale',
      name: '龙鳞甲',
      description: '用龙鳞制成的护甲，防御力极强',
      rarity: 'purple',
      type: 'equipment',
      defense: 400,
      slot: 'body',
      durability: 2000,
      maxDurability: 2000,
    },
    {
      id: 'equipment-qilin-helmet',
      name: '麒麟头盔',
      description: '传说中的神兽麒麟之盔',
      rarity: 'purple',
      type: 'equipment',
      defense: 350,
      slot: 'head',
      durability: 1800,
      maxDurability: 1800,
    },
    {
      id: 'equipment-wind-walker',
      name: '风行护腿',
      description: '轻如羽毛，移动速度大幅提升',
      rarity: 'purple',
      type: 'equipment',
      defense: 200,
      slot: 'legs',
      durability: 2000,
      maxDurability: 2000,
    },
    // 材料
    {
      id: 'material-mithril',
      name: '秘银矿石',
      description: '稀有的秘银矿石',
      rarity: 'purple',
      type: 'material',
      quantity: 10,
      stackable: true,
    },
    {
      id: 'material-dragon-crystal',
      name: '龙晶',
      description: '巨龙的力量结晶',
      rarity: 'purple',
      type: 'material',
      quantity: 5,
      stackable: true,
    },
    // 食物
    {
      id: 'food-ginseng',
      name: '万年人参',
      description: '千年难得一见的神药',
      rarity: 'purple',
      type: 'food',
      heal: 800,
      quantity: 3,
      stackable: true,
    },
    {
      id: 'food-elixir',
      name: '灵丹妙药',
      description: '恢复大量生命和法力值',
      rarity: 'purple',
      type: 'food',
      heal: 600,
      quantity: 5,
      stackable: true,
    },
    // 任务
    {
      id: 'quest-dragon-slayer',
      name: '屠龙令',
      description: '发布屠龙任务的令牌',
      rarity: 'purple',
      type: 'quest',
      questId: 'quest-dragon-slayer',
      quantity: 1,
    },
    {
      id: 'quest-hero-medal',
      name: '英雄勋章',
      description: '证明英雄身份的勋章',
      rarity: 'purple',
      type: 'quest',
      questId: 'quest-hero-medal',
      quantity: 1,
    },

    // ===== 蓝色稀有物品 =====
    // 武器
    {
      id: 'weapon-steel-sword',
      name: '精钢剑',
      description: '一把锋利的精钢宝剑',
      rarity: 'blue',
      type: 'weapon',
      attack: 150,
      durability: 1000,
      maxDurability: 1000,
    },
    {
      id: 'weapon-frost-blade',
      name: '冰霜之刃',
      description: '附带着冰霜之力的宝剑',
      rarity: 'blue',
      type: 'weapon',
      attack: 180,
      durability: 900,
      maxDurability: 900,
    },
    {
      id: 'weapon-flame-sword',
      name: '烈焰之剑',
      description: '燃烧着熊熊烈火的魔剑',
      rarity: 'blue',
      type: 'weapon',
      attack: 175,
      durability: 900,
      maxDurability: 900,
    },
    // 装备
    {
      id: 'equipment-steel-armor',
      name: '精钢护甲',
      description: '精钢打造的护甲',
      rarity: 'blue',
      type: 'equipment',
      defense: 120,
      slot: 'body',
      durability: 1000,
      maxDurability: 1000,
    },
    {
      id: 'equipment-knight-helmet',
      name: '骑士头盔',
      description: '精良的骑士头盔',
      rarity: 'blue',
      type: 'equipment',
      defense: 100,
      slot: 'head',
      durability: 800,
      maxDurability: 800,
    },
    {
      id: 'equipment-boots-swift',
      name: '迅捷之靴',
      description: '提升移动速度的战靴',
      rarity: 'blue',
      type: 'equipment',
      defense: 80,
      slot: 'legs',
      durability: 900,
      maxDurability: 900,
    },
    // 材料
    {
      id: 'material-gold-ingot',
      name: '金锭',
      description: '纯金打造的锭',
      rarity: 'blue',
      type: 'material',
      quantity: 20,
      stackable: true,
    },
    {
      id: 'material-magic-crystal',
      name: '魔法水晶',
      description: '蕴含魔力的水晶',
      rarity: 'blue',
      type: 'material',
      quantity: 15,
      stackable: true,
    },
    // 食物
    {
      id: 'food-roasted-meat',
      name: '烤肉',
      description: '美味的烤肉，恢复中等生命值',
      rarity: 'blue',
      type: 'food',
      heal: 150,
      quantity: 20,
      stackable: true,
    },
    {
      id: 'food-mana-potion',
      name: '法力药水',
      description: '恢复法力值的药水',
      rarity: 'blue',
      type: 'food',
      heal: 100,
      quantity: 15,
      stackable: true,
    },
    // 任务
    {
      id: 'quest-secret-letter',
      name: '密信',
      description: '一封神秘的信件',
      rarity: 'blue',
      type: 'quest',
      questId: 'quest-secret-letter',
      quantity: 1,
    },
    {
      id: 'quest-ancient-map',
      name: '古地图',
      description: '记载着宝藏位置的地图',
      rarity: 'blue',
      type: 'quest',
      questId: 'quest-ancient-map',
      quantity: 1,
    },

    // ===== 绿色优秀物品 =====
    // 武器
    {
      id: 'weapon-iron-sword',
      name: '铁剑',
      description: '普通的铁制长剑',
      rarity: 'green',
      type: 'weapon',
      attack: 80,
      durability: 500,
      maxDurability: 500,
    },
    {
      id: 'weapon-spear',
      name: '长矛',
      description: '常见的长矛武器',
      rarity: 'green',
      type: 'weapon',
      attack: 75,
      durability: 500,
      maxDurability: 500,
    },
    // 装备
    {
      id: 'equipment-leather-armor',
      name: '皮甲',
      description: '兽皮制成的护甲',
      rarity: 'green',
      type: 'equipment',
      defense: 60,
      slot: 'body',
      durability: 500,
      maxDurability: 500,
    },
    {
      id: 'equipment-iron-helmet',
      name: '铁盔',
      description: '铁制的头盔',
      rarity: 'green',
      type: 'equipment',
      defense: 50,
      slot: 'head',
      durability: 400,
      maxDurability: 400,
    },
    // 材料
    {
      id: 'material-iron-ore',
      name: '铁矿',
      description: '常见的铁矿石',
      rarity: 'green',
      type: 'material',
      quantity: 50,
      stackable: true,
    },
    {
      id: 'material-herb',
      name: '草药',
      description: '常见的药草',
      rarity: 'green',
      type: 'material',
      quantity: 100,
      stackable: true,
    },
    // 食物
    {
      id: 'food-bread',
      name: '面包',
      description: '普通的面包',
      rarity: 'green',
      type: 'food',
      heal: 80,
      quantity: 50,
      stackable: true,
    },
    {
      id: 'food-apple',
      name: '苹果',
      description: '新鲜的水果',
      rarity: 'green',
      type: 'food',
      heal: 60,
      quantity: 30,
      stackable: true,
    },
    // 任务
    {
      id: 'quest-herbalist',
      name: '采药任务',
      description: '为村长采集草药',
      rarity: 'green',
      type: 'quest',
      questId: 'quest-herbalist',
      quantity: 1,
    },

    // ===== 白色普通物品 =====
    // 武器
    {
      id: 'weapon-wooden-sword',
      name: '木剑',
      description: '木制的训练用剑',
      rarity: 'white',
      type: 'weapon',
      attack: 30,
      durability: 200,
      maxDurability: 200,
    },
    {
      id: 'weapon-stick',
      name: '木棍',
      description: '一根普通的木棍',
      rarity: 'white',
      type: 'weapon',
      attack: 15,
      durability: 150,
      maxDurability: 150,
    },
    // 装备
    {
      id: 'equipment-cloth-armor',
      name: '布甲',
      description: '普通的布制护甲',
      rarity: 'white',
      type: 'equipment',
      defense: 25,
      slot: 'body',
      durability: 300,
      maxDurability: 300,
    },
    {
      id: 'equipment-simple-ring',
      name: '普通戒指',
      description: '普通的装饰戒指',
      rarity: 'white',
      type: 'equipment',
      defense: 10,
      slot: 'accessory',
      durability: 500,
      maxDurability: 500,
    },
    // 材料
    {
      id: 'material-wood',
      name: '木材',
      description: '普通的木材',
      rarity: 'white',
      type: 'material',
      quantity: 100,
      stackable: true,
    },
    {
      id: 'material-stone',
      name: '石块',
      description: '普通的石块',
      rarity: 'white',
      type: 'material',
      quantity: 100,
      stackable: true,
    },
    // 食物
    {
      id: 'food-porridge',
      name: '稀粥',
      description: '清淡的粥',
      rarity: 'white',
      type: 'food',
      heal: 40,
      quantity: 50,
      stackable: true,
    },
    // 任务
    {
      id: 'quest-village-request',
      name: '村长的委托',
      description: '帮助村民解决困难',
      rarity: 'white',
      type: 'quest',
      questId: 'quest-village-request',
      quantity: 1,
    },

    // ===== 灰色破旧物品 =====
    // 武器
    {
      id: 'weapon-broken-blade',
      name: '断剑',
      description: '一把断裂的剑，勉强能用',
      rarity: 'gray',
      type: 'weapon',
      attack: 8,
      durability: 50,
      maxDurability: 50,
    },
    // 装备
    {
      id: 'equipment-tattered-cape',
      name: '破旧的斗篷',
      description: '一个破旧的斗篷',
      rarity: 'gray',
      type: 'equipment',
      defense: 5,
      slot: 'accessory',
      durability: 100,
      maxDurability: 100,
    },
    // 材料
    {
      id: 'material-scrap-metal',
      name: '废铁',
      description: '废弃的铁块',
      rarity: 'gray',
      type: 'material',
      quantity: 200,
      stackable: true,
    },
    {
      id: 'material-broken-bone',
      name: '碎骨',
      description: '破碎的骨头',
      rarity: 'gray',
      type: 'material',
      quantity: 150,
      stackable: true,
    },
    // 食物
    {
      id: 'food-moldy-bread',
      name: '发霉的馒头',
      description: '已经发霉的馒头',
      rarity: 'gray',
      type: 'food',
      heal: 10,
      quantity: 100,
      stackable: true,
    },
    // 任务
    {
      id: 'quest-map-fragment',
      name: '破损的地图',
      description: '一张破损的地图碎片',
      rarity: 'gray',
      type: 'quest',
      questId: 'quest-map-fragment',
      quantity: 5,
    },
  ],

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
}))

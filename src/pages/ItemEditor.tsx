import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Item, Rarity } from '../stores/bagStore'
import { RARITY_CONFIG } from '../stores/bagStore'
import { useItemLibraryStore } from '../stores/itemLibraryStore'

type ItemType = 'weapon' | 'equipment' | 'material' | 'food' | 'quest'

const ITEM_TYPES: ItemType[] = ['weapon', 'equipment', 'material', 'food', 'quest']
const RARITIES: Rarity[] = ['gray', 'white', 'green', 'blue', 'purple', 'orange']

const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  weapon: '武器',
  equipment: '装备',
  material: '材料',
  food: '食物',
  quest: '任务物品',
}

function ItemEditor() {
  const navigate = useNavigate()
  const itemLibrary = useItemLibraryStore()
  const [items, setItems] = useState<Item[]>(itemLibrary.items)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Item>>({})

  const handleCreate = () => {
    setEditingIndex(-1) // -1 表示新建
    setFormData({
      type: 'weapon',
      rarity: 'white',
      id: `custom-${Date.now()}`,
      name: '',
      description: '',
    })
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setFormData({ ...items[index] })
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个物品吗？')) {
      itemLibrary.deleteItem(id)
      setItems(itemLibrary.items.filter((item) => item.id !== id))
    }
  }

  const handleSave = () => {
    if (!formData.name || !formData.type || !formData.rarity) {
      alert('请填写完整信息')
      return
    }

    let newItem: Item

    switch (formData.type) {
      case 'weapon':
        newItem = {
          id: formData.id || `custom-${Date.now()}`,
          name: formData.name,
          description: formData.description || '',
          rarity: formData.rarity,
          type: 'weapon',
          attack: (formData as any).attack || 0,
          durability: (formData as any).maxDurability || 100,
          maxDurability: (formData as any).maxDurability || 100,
        }
        break
      case 'equipment':
        newItem = {
          id: formData.id || `custom-${Date.now()}`,
          name: formData.name,
          description: formData.description || '',
          rarity: formData.rarity,
          type: 'equipment',
          defense: (formData as any).defense || 0,
          slot: (formData as any).slot || 'body',
          durability: (formData as any).maxDurability || 100,
          maxDurability: (formData as any).maxDurability || 100,
        }
        break
      case 'material':
        newItem = {
          id: formData.id || `custom-${Date.now()}`,
          name: formData.name,
          description: formData.description || '',
          rarity: formData.rarity,
          type: 'material',
          quantity: (formData as any).quantity || 1,
          stackable: true,
        }
        break
      case 'food':
        newItem = {
          id: formData.id || `custom-${Date.now()}`,
          name: formData.name,
          description: formData.description || '',
          rarity: formData.rarity,
          type: 'food',
          heal: (formData as any).heal || 0,
          quantity: (formData as any).quantity || 1,
          stackable: true,
        }
        break
      case 'quest':
        newItem = {
          id: formData.id || `custom-${Date.now()}`,
          name: formData.name,
          description: formData.description || '',
          rarity: formData.rarity,
          type: 'quest',
          questId: (formData as any).questId || `quest-${Date.now()}`,
          quantity: (formData as any).quantity || 1,
        }
        break
      default:
        return
    }

    const isNew = editingIndex === -1

    if (isNew) {
      itemLibrary.addItem(newItem)
    } else if (editingIndex !== null) {
      itemLibrary.updateItem(items[editingIndex].id, newItem)
    }

    setItems(itemLibrary.items)
    setEditingIndex(null)
    setFormData({})
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setFormData({})
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `items-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const importedItems = JSON.parse(event.target?.result as string)
          if (Array.isArray(importedItems)) {
            itemLibrary.addItems(importedItems)
            setItems(itemLibrary.items)
            alert(`成功导入 ${importedItems.length} 个物品`)
          }
        } catch (err) {
          alert('导入失败：无效的JSON文件')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const renderEditor = () => {
    if (editingIndex === null) return null

    const isNew = editingIndex === -1

    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
        <div className="rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-xl font-medium mb-4">{isNew ? '新建物品' : '编辑物品'}</h2>

          <div className="space-y-4">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">物品名称 *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">物品ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={formData.id || ''}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={!isNew}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">物品类型 *</label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={formData.type || 'weapon'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ItemType })}
                >
                  {ITEM_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {ITEM_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">稀有度 *</label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={formData.rarity || 'white'}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value as Rarity })}
                >
                  {RARITIES.map((rarity) => (
                    <option key={rarity} value={rarity}>
                      {RARITY_CONFIG[rarity].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">描述</label>
              <textarea
                className="w-full px-3 py-2 border rounded"
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* 武器属性 */}
            {formData.type === 'weapon' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">攻击力</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded"
                    value={(formData as any).attack || 0}
                    onChange={(e) => setFormData({ ...formData, attack: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">耐久度</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded"
                    value={(formData as any).maxDurability || 100}
                    onChange={(e) => setFormData({ ...formData, maxDurability: Number(e.target.value), durability: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {/* 装备属性 */}
            {formData.type === 'equipment' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">防御力</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded"
                      value={(formData as any).defense || 0}
                      onChange={(e) => setFormData({ ...formData, defense: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">装备部位</label>
                    <select
                      className="w-full px-3 py-2 border rounded"
                      value={(formData as any).slot || 'body'}
                      onChange={(e) => setFormData({ ...formData, slot: e.target.value as any })}
                    >
                      <option value="head">头部</option>
                      <option value="body">身体</option>
                      <option value="legs">腿部</option>
                      <option value="accessory">饰品</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">耐久度</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded"
                    value={(formData as any).maxDurability || 100}
                    onChange={(e) => setFormData({ ...formData, maxDurability: Number(e.target.value), durability: Number(e.target.value) })}
                  />
                </div>
              </>
            )}

            {/* 食物属性 */}
            {formData.type === 'food' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">恢复生命值</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded"
                    value={(formData as any).heal || 0}
                    onChange={(e) => setFormData({ ...formData, heal: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">数量</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded"
                    value={(formData as any).quantity || 1}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {/* 材料属性 */}
            {formData.type === 'material' && (
              <div>
                <label className="block text-sm font-medium mb-1">数量</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded"
                  value={(formData as any).quantity || 1}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
              </div>
            )}

            {/* 任务物品属性 */}
            {formData.type === 'quest' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">任务ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={(formData as any).questId || ''}
                    onChange={(e) => setFormData({ ...formData, questId: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">数量</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded"
                    value={(formData as any).quantity || 1}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 rounded"
              style={{ backgroundColor: '#9e9e9e', color: '#ffffff' }}
              onClick={handleCancel}
            >
              取消
            </button>
            <button
              className="px-4 py-2 rounded"
              style={{ backgroundColor: '#1976d2', color: '#ffffff' }}
              onClick={handleSave}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between px-6 py-4 shadow-sm" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <h1 className="text-2xl font-medium">物品编辑器</h1>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded"
            style={{ backgroundColor: '#4caf50', color: '#ffffff' }}
            onClick={handleCreate}
          >
            新建物品
          </button>
          <button
            className="px-4 py-2 rounded"
            style={{ backgroundColor: '#2196f3', color: '#ffffff' }}
            onClick={handleExport}
          >
            导出JSON
          </button>
          <button
            className="px-4 py-2 rounded"
            style={{ backgroundColor: '#ff9800', color: '#ffffff' }}
            onClick={handleImport}
          >
            导入JSON
          </button>
          <button
            className="px-4 py-2 rounded"
            style={{ backgroundColor: '#f44336', color: '#ffffff' }}
            onClick={() => navigate('/home')}
          >
            返回
          </button>
        </div>
      </div>

      {/* 物品列表 */}
      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>
            <div className="text-lg mb-2">还没有自定义物品</div>
            <div className="text-sm">点击"新建物品"开始创建</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-lg shadow-sm p-4 border"
                style={{ borderColor: 'rgba(0, 0, 0, 0.12)' }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`font-medium ${RARITY_CONFIG[item.rarity].textColor}`}>
                    {item.name}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${RARITY_CONFIG[item.rarity].bgColor}`}>
                    {RARITY_CONFIG[item.rarity].name}
                  </span>
                </div>
                <div className="text-sm mb-2" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                  {item.description}
                </div>
                <div className="text-xs mb-3" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>
                  类型: {ITEM_TYPE_LABELS[item.type]}
                  {'type' in item && 'attack' in item && (
                    <span> | 攻击力: {item.attack}</span>
                  )}
                  {'type' in item && 'defense' in item && (
                    <span> | 防御力: {item.defense}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-1 text-sm rounded"
                    style={{ backgroundColor: '#2196f3', color: '#ffffff' }}
                    onClick={() => handleEdit(index)}
                  >
                    编辑
                  </button>
                  <button
                    className="flex-1 px-3 py-1 text-sm rounded"
                    style={{ backgroundColor: '#f44336', color: '#ffffff' }}
                    onClick={() => handleDelete(item.id)}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {renderEditor()}
    </div>
  )
}

export default ItemEditor

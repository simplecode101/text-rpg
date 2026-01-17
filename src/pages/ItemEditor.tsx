import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Item, Rarity } from '../stores/bagStore'
import { RARITY_CONFIG } from '../stores/bagStore'
import { useItemLibraryStore } from '../stores/itemLibraryStore'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog'

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

  const isNew = editingIndex === -1

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between px-6 py-4 shadow-sm border-b border-black/12">
        <h1 className="text-2xl font-medium">物品编辑器</h1>
        <div className="flex gap-3">
          <Button onClick={handleCreate}>
            新建物品
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            导出JSON
          </Button>
          <Button variant="secondary" onClick={handleImport}>
            导入JSON
          </Button>
          <Button variant="destructive" onClick={() => navigate('/home')}>
            返回
          </Button>
        </div>
      </div>

      {/* 物品列表 */}
      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="text-center py-12 text-black/38">
            <div className="text-lg mb-2">还没有自定义物品</div>
            <div className="text-sm">点击"新建物品"开始创建</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-lg shadow-sm p-4 border border-black/12"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`font-medium ${RARITY_CONFIG[item.rarity].textColor}`}>
                    {item.name}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${RARITY_CONFIG[item.rarity].bgColor}`}>
                    {RARITY_CONFIG[item.rarity].name}
                  </div>
                </div>
                <div className="text-sm mb-2 text-black/60">
                  {item.description}
                </div>
                <div className="text-xs mb-3 text-black/38">
                  类型: {ITEM_TYPE_LABELS[item.type]}
                  {'type' in item && 'attack' in item && (
                    <span> | 攻击力: {item.attack}</span>
                  )}
                  {'type' in item && 'defense' in item && (
                    <span> | 防御力: {item.defense}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handleEdit(index)}
                  >
                    编辑
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDelete(item.id)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 编辑对话框 */}
      <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNew ? '新建物品' : '编辑物品'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">物品名称 *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id">物品ID</Label>
                <Input
                  id="id"
                  value={formData.id || ''}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={!isNew}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">物品类型 *</Label>
                <Select value={formData.type || 'weapon'} onValueChange={(value) => setFormData({ ...formData, type: value as ItemType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {ITEM_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rarity">稀有度 *</Label>
                <Select value={formData.rarity || 'white'} onValueChange={(value) => setFormData({ ...formData, rarity: value as Rarity })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RARITIES.map((rarity) => (
                      <SelectItem key={rarity} value={rarity}>
                        {RARITY_CONFIG[rarity].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* 武器属性 */}
            {formData.type === 'weapon' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="attack">攻击力</Label>
                  <Input
                    id="attack"
                    type="number"
                    value={(formData as any).attack || 0}
                    onChange={(e) => setFormData({ ...formData, attack: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weapon-durability">耐久度</Label>
                  <Input
                    id="weapon-durability"
                    type="number"
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
                  <div className="space-y-2">
                    <Label htmlFor="defense">防御力</Label>
                    <Input
                      id="defense"
                      type="number"
                      value={(formData as any).defense || 0}
                      onChange={(e) => setFormData({ ...formData, defense: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slot">装备部位</Label>
                    <Select value={(formData as any).slot || 'body'} onValueChange={(value) => setFormData({ ...formData, slot: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="head">头部</SelectItem>
                        <SelectItem value="body">身体</SelectItem>
                        <SelectItem value="legs">腿部</SelectItem>
                        <SelectItem value="accessory">饰品</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equip-durability">耐久度</Label>
                  <Input
                    id="equip-durability"
                    type="number"
                    value={(formData as any).maxDurability || 100}
                    onChange={(e) => setFormData({ ...formData, maxDurability: Number(e.target.value), durability: Number(e.target.value) })}
                  />
                </div>
              </>
            )}

            {/* 食物属性 */}
            {formData.type === 'food' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heal">恢复生命值</Label>
                  <Input
                    id="heal"
                    type="number"
                    value={(formData as any).heal || 0}
                    onChange={(e) => setFormData({ ...formData, heal: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="food-quantity">数量</Label>
                  <Input
                    id="food-quantity"
                    type="number"
                    value={(formData as any).quantity || 1}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {/* 材料属性 */}
            {formData.type === 'material' && (
              <div className="space-y-2">
                <Label htmlFor="material-quantity">数量</Label>
                <Input
                  id="material-quantity"
                  type="number"
                  value={(formData as any).quantity || 1}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
              </div>
            )}

            {/* 任务物品属性 */}
            {formData.type === 'quest' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quest-id">任务ID</Label>
                  <Input
                    id="quest-id"
                    value={(formData as any).questId || ''}
                    onChange={(e) => setFormData({ ...formData, questId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quest-quantity">数量</Label>
                  <Input
                    id="quest-quantity"
                    type="number"
                    value={(formData as any).quantity || 1}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={handleCancel}>
              取消
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ItemEditor

import { useEffect } from 'react'
import { usePlayerStore } from '../stores/playerStore'
import { useBattleStore } from '../stores/battleStore'
import { useBagStore } from '../stores/bagStore'
import { useItemLibraryStore } from '../stores/itemLibraryStore'
import { useSkillStore } from '../stores/skillStore'
import { useMonsterLibraryStore } from '../stores/monsterStore'
import BattleAction from './BattleAction'
import BattleLoot from './BattleLoot'
import type { Skill } from '../stores/skillLibraryStore'
import type { Item } from '../stores/bagStore'

interface BattleProps {
  monsterId?: string
  onVictory: () => void
  onDefeat: () => void
  onFlee: () => void
}

function Battle({ monsterId, onVictory, onDefeat, onFlee }: BattleProps) {
  const player = usePlayerStore()
  const battle = useBattleStore()
  const bag = useBagStore()
  const skillStore = useSkillStore()
  const itemLibrary = useItemLibraryStore()
  const monsterLibrary = useMonsterLibraryStore()

  // 初始化默认技能
  useEffect(() => {
    if (skillStore.getLearnedSkills().length === 0) {
      skillStore.initializeDefaultSkills()
    }
  }, [skillStore])

  // 如果传入了怪物ID，开始战斗
  useEffect(() => {
    if (monsterId && !battle.inBattle) {
      const monster = monsterLibrary.getMonsterById(monsterId)
      if (monster) {
        battle.startBattle(monster, player.maxHp)
        skillStore.resetCooldowns()
      }
    }
  }, [monsterId, battle.inBattle, monsterLibrary, player.maxHp, skillStore])

  const handleAttack = () => {
    if (battle.status !== 'playerTurn') return

    // 玩家攻击
    battle.playerAttack(player.attack, player.defense)

    // 检查战斗是否结束
    setTimeout(() => {
      if (battle.status === 'victory') {
        // 战斗胜利
      } else if (battle.status === 'playerTurn') {
        // 敌人没死，结束回合
        battle.endTurn(player.defense)
      }
    }, 500)
  }

  const handleUseSkill = (skill: Skill) => {
    if (battle.status !== 'playerTurn') return

    // 检查法力值
    if (!player.useMp(skill.mpCost)) {
      return
    }

    // 使用技能
    const result = battle.playerUseSkill(skill, player.attack, player.maxHp, player.mp)

    if (result) {
      // 更新技能冷却
      skillStore.useSkill(skill.id)

      // 检查战斗是否结束
      setTimeout(() => {
        if (battle.status === 'victory') {
          // 战斗胜利
        } else if (battle.status === 'playerTurn') {
          // 敌人没死，结束回合
          battle.endTurn(player.defense)
        }
      }, 500)
    }
  }

  const handleFlee = () => {
    if (battle.status !== 'playerTurn') return

    // 50% 逃跑成功率
    if (Math.random() < 0.5) {
      battle.addLog('你成功逃脱了！', 'system')
      setTimeout(() => {
        battle.endBattle()
        onFlee()
      }, 1000)
    } else {
      battle.addLog('逃跑失败！', 'enemy')
      // 逃跑失败，结束回合
      setTimeout(() => {
        battle.endTurn(player.defense)
      }, 500)
    }
  }

  const handleVictory = () => {
    if (!battle.enemy) return

    // 获得经验和金币
    player.addExp(battle.enemy.expReward)
    player.addGold(battle.enemy.goldReward)

    // 随机掉落物品
    const droppedItems: Item[] = []
    const dropChance = Math.random()
    if (dropChance < 0.3) {
      const rarities = ['gray', 'white', 'green', 'blue', 'purple', 'orange'] as const
      const rarityRoll = Math.random()
      let rarity: typeof rarities[number] = 'gray'

      if (rarityRoll < 0.01) rarity = 'orange'
      else if (rarityRoll < 0.05) rarity = 'purple'
      else if (rarityRoll < 0.15) rarity = 'blue'
      else if (rarityRoll < 0.4) rarity = 'green'
      else if (rarityRoll < 0.7) rarity = 'white'

      const randomItem = itemLibrary.getRandomItemByRarity(rarity)
      if (randomItem) {
        bag.addItem(randomItem)
        droppedItems.push(randomItem)
        battle.addLog(`获得了 ${randomItem.name}！`, 'system')
      }
    }

    battle.addLog(`获得 ${battle.enemy.expReward} 经验和 ${battle.enemy.goldReward} 金币`, 'system')

    // 保存战利品信息
    battle.setLoot({
      exp: battle.enemy.expReward,
      gold: battle.enemy.goldReward,
      items: droppedItems,
    })
  }

  const handleClaimLoot = () => {
    battle.endBattle()
    onVictory()
  }

  const handleDefeat = () => {
    // 死亡惩罚
    player.takeDamage(player.hp)
    battle.addLog('你失去了所有生命...', 'system')

    setTimeout(() => {
      battle.endBattle()
      onDefeat()
    }, 2000)
  }

  const getLogStyle = (type: string) => {
    switch (type) {
      case 'player':
        return { color: '#1976d2' }
      case 'enemy':
        return { color: '#d32f2f' }
      case 'critical':
        return { color: '#f57c00', fontWeight: 'bold' }
      case 'heal':
        return { color: '#4caf50' }
      case 'buff':
        return { color: '#2196f3' }
      case 'system':
        return { color: '#388e3c' }
      default:
        return { color: 'rgba(0, 0, 0, 0.6)' }
    }
  }

  if (!battle.inBattle || !battle.enemy) {
    return (
      <div className="flex items-center justify-center h-full">
        <div style={{ color: 'rgba(0, 0, 0, 0.38)' }}>准备战斗...</div>
      </div>
    )
  }

  const playerHpPercent = (battle.playerHp / player.maxHp) * 100
  const enemyHpPercent = (battle.enemyHp / battle.enemy.maxHp) * 100

  // 计算显示的总属性（包含 Buff）
  const displayPlayerAttack = battle.calculateTotalAttack(player.attack, battle.playerBuffs)
  const displayPlayerDefense = battle.calculateTotalDefense(player.defense, battle.playerBuffs)

  // 格式化 Buff 显示
  const formatBuffs = (buffs: typeof battle.playerBuffs) => {
    const buffTexts: string[] = []
    buffs.attack.forEach((buff) => {
      buffTexts.push(`攻击+${Math.floor(buff.value * 100)}%(${buff.duration})`)
    })
    buffs.defense.forEach((buff) => {
      buffTexts.push(`防御+${Math.floor(buff.value * 100)}%(${buff.duration})`)
    })
    return buffTexts.join(' ')
  }

  return (
    <div className="flex flex-col h-full p-4">
      {/* 回合信息 */}
      {battle.status !== 'victory' && battle.status !== 'defeat' && (
        <div className="text-center mb-2" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
          回合 {battle.turnCount} - {battle.currentTurn === 'player' ? '你的回合' : '敌人回合'}
        </div>
      )}

      {/* 战斗信息 */}
      <div className="flex justify-between items-start mb-4">
        {/* 玩家信息 */}
        <div className="flex-1">
          <div className="text-lg font-medium mb-2" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{player.name}</div>
          <div className="text-sm mb-1" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
            HP: {battle.playerHp}/{player.maxHp} | MP: {player.mp}/{player.maxMp}
          </div>
          <div className="w-full rounded-full h-4 shadow-sm mb-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.12)' }}>
            <div
              className="h-4 rounded-full transition-all"
              style={{ width: `${playerHpPercent}%`, backgroundColor: '#4caf50' }}
            />
          </div>
          {Object.values(battle.playerBuffs).some((b) => b.length > 0) && (
            <div className="text-xs mt-1" style={{ color: '#2196f3' }}>
              Buff: {formatBuffs(battle.playerBuffs)}
            </div>
          )}
          <div className="text-xs mt-2" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>
            攻击: {displayPlayerAttack} | 防御: {displayPlayerDefense}
          </div>
        </div>

        <div className="text-2xl mx-4" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>VS</div>

        {/* 敌人信息 */}
        <div className="flex-1 text-right">
          <div className={`text-lg font-medium mb-2 ${RARITY_COLOR[battle.enemy.rarity]}`}>
            {battle.enemy.name}
          </div>
          <div className="text-sm mb-1" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
            HP: {battle.enemyHp}/{battle.enemy.maxHp}
          </div>
          <div className="w-full rounded-full h-4 shadow-sm ml-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.12)' }}>
            <div
              className="h-4 rounded-full transition-all"
              style={{ width: `${enemyHpPercent}%`, backgroundColor: '#f44336' }}
            />
          </div>
          <div className="text-xs mt-2" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>
            攻击: {battle.enemy.attack} | 防御: {battle.enemy.defense}
          </div>
        </div>
      </div>

      {/* 战斗日志 */}
      <div className="flex-1 overflow-y-auto rounded p-3 mb-4 shadow-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <div className="space-y-1">
          {battle.logs.slice(-10).map((log) => (
            <div key={log.id} className="text-sm" style={getLogStyle(log.type)}>
              {log.message}
            </div>
          ))}
        </div>
      </div>

      {/* 战斗状态和按钮 */}
      <div>
        {battle.status === 'playerTurn' && (
          <BattleAction
            onAttack={handleAttack}
            onUseSkill={handleUseSkill}
            onFlee={handleFlee}
            isEnemyTurn={false}
          />
        )}

        {battle.status === 'enemyTurn' && (
          <div className="text-center py-3" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
            敌人行动中...
          </div>
        )}

        {battle.status === 'victory' && battle.loot && (
          <BattleLoot
            exp={battle.loot.exp}
            gold={battle.loot.gold}
            items={battle.loot.items}
            onClaim={handleClaimLoot}
          />
        )}

        {battle.status === 'victory' && !battle.loot && (
          <div className="text-center">
            <div className="text-2xl font-medium mb-4" style={{ color: '#4caf50' }}>胜利！</div>
            <button
              className="px-6 py-3 rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium uppercase tracking-wide"
              style={{ backgroundColor: '#1976d2', color: '#ffffff' }}
              onClick={handleVictory}
            >
              继续冒险
            </button>
          </div>
        )}

        {battle.status === 'defeat' && (
          <div className="text-center">
            <div className="text-2xl font-medium mb-4" style={{ color: '#d32f2f' }}>失败...</div>
            <button
              className="px-6 py-3 rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium uppercase tracking-wide"
              style={{ backgroundColor: '#1976d2', color: '#ffffff' }}
              onClick={handleDefeat}
            >
              返回
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const RARITY_COLOR: Record<string, string> = {
  orange: 'text-orange-500',
  purple: 'text-purple-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
  white: 'text-gray-500',
  gray: 'text-gray-400',
}

export default Battle

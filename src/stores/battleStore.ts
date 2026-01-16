import { create } from 'zustand'
import type { Monster } from './monsterStore'
import type { Skill } from './skillLibraryStore'

// 战斗状态
type BattleStatus = 'idle' | 'playerTurn' | 'enemyTurn' | 'victory' | 'defeat'

// 回合类型
type TurnType = 'player' | 'enemy'

// Buff/Debuff 效果
interface BuffEffect {
  type: 'attack' | 'defense'
  value: number // 增益值（百分比，如0.5表示+50%）
  duration: number // 剩余回合数
}

// 战斗中的 Buff 状态
interface BattleBuffs {
  attack: BuffEffect[]
  defense: BuffEffect[]
}

// 战斗日志
interface BattleLog {
  id: number
  message: string
  type: 'player' | 'enemy' | 'system' | 'critical' | 'heal' | 'buff'
}

// 技能效果结果
interface SkillResult {
  damage?: number
  healing?: number
  buff?: string
  message: string
}

// 战斗状态接口
interface BattleState {
  inBattle: boolean
  status: BattleStatus
  currentTurn: TurnType
  turnCount: number
  enemy: Monster | null
  playerHp: number
  enemyHp: number
  playerBuffs: BattleBuffs
  enemyBuffs: BattleBuffs
  logs: BattleLog[]

  // 开始战斗
  startBattle: (enemy: Monster, playerMaxHp: number) => void

  // 普通攻击
  playerAttack: (playerAttack: number, playerDefense: number) => void

  // 使用技能
  playerUseSkill: (
    skill: Skill,
    playerAttack: number,
    playerMaxHp: number,
    currentMp: number
  ) => SkillResult | null

  // 敌人回合
  enemyTurn: (playerDefense: number) => void

  // 结束当前回合
  endTurn: (playerDefense: number) => void

  // 计算总攻击力（包含 Buff）
  calculateTotalAttack: (baseAttack: number, buffs: BattleBuffs) => number

  // 计算总防御力（包含 Buff）
  calculateTotalDefense: (baseDefense: number, buffs: BattleBuffs) => number

  // 减少 Buff 持续时间
  reduceBuffDuration: (buffs: BattleBuffs) => BattleBuffs

  // 应用 Buff
  applyBuff: (buffs: BattleBuffs, type: 'attack' | 'defense', value: number, duration: number) => BattleBuffs

  // 添加日志
  addLog: (message: string, type: BattleLog['type']) => void

  // 结束战斗
  endBattle: () => void

  // 清空日志
  clearLogs: () => void
}

export const useBattleStore = create<BattleState>((set, get) => ({
  inBattle: false,
  status: 'idle',
  currentTurn: 'player',
  turnCount: 1,
  enemy: null,
  playerHp: 0,
  enemyHp: 0,
  playerBuffs: {
    attack: [],
    defense: [],
  },
  enemyBuffs: {
    attack: [],
    defense: [],
  },
  logs: [],

  startBattle: (enemy: Monster, playerMaxHp: number) => {
    set({
      inBattle: true,
      status: 'playerTurn',
      currentTurn: 'player',
      turnCount: 1,
      enemy,
      playerHp: playerMaxHp,
      enemyHp: enemy.hp,
      playerBuffs: { attack: [], defense: [] },
      enemyBuffs: { attack: [], defense: [] },
      logs: [
        {
          id: Date.now(),
          message: `遭遇 ${enemy.name}！战斗开始！`,
          type: 'system',
        },
      ],
    })
  },

  calculateTotalAttack: (baseAttack: number, buffs: BattleBuffs) => {
    let totalAttack = baseAttack
    buffs.attack.forEach((buff) => {
      totalAttack = Math.floor(totalAttack * (1 + buff.value))
    })
    return totalAttack
  },

  calculateTotalDefense: (baseDefense: number, buffs: BattleBuffs) => {
    let totalDefense = baseDefense
    buffs.defense.forEach((buff) => {
      totalDefense = Math.floor(totalDefense * (1 + buff.value))
    })
    return totalDefense
  },

  applyBuff: (buffs: BattleBuffs, type: 'attack' | 'defense', value: number, duration: number) => {
    return {
      ...buffs,
      [type]: [...buffs[type], { type, value, duration }],
    }
  },

  reduceBuffDuration: (buffs: BattleBuffs) => {
    const newBuffs: BattleBuffs = { attack: [], defense: [] }

    Object.keys(buffs).forEach((key) => {
      const type = key as 'attack' | 'defense'
      newBuffs[type] = buffs[type]
        .map((buff) => ({
          ...buff,
          duration: buff.duration - 1,
        }))
        .filter((buff) => buff.duration > 0)
    })

    return newBuffs
  },

  playerAttack: (playerAttack: number, _playerDefense: number) => {
    const state = get()
    if (!state.enemy || state.status !== 'playerTurn') return

    const totalAttack = get().calculateTotalAttack(playerAttack, state.playerBuffs)

    // 计算伤害
    const damage = Math.max(1, totalAttack - state.enemy.defense + Math.floor(Math.random() * 10) - 5)
    const newEnemyHp = Math.max(0, state.enemyHp - damage)

    // 暴击判定
    const isCritical = Math.random() < 0.1
    const finalDamage = isCritical ? damage * 2 : damage

    const logType: BattleLog['type'] = isCritical ? 'critical' : 'player'

    set({
      enemyHp: newEnemyHp,
      logs: [
        ...state.logs,
        {
          id: Date.now(),
          message: `你对 ${state.enemy.name} 造成了 ${finalDamage} 点伤害！${isCritical ? ' [暴击!]' : ''}`,
          type: logType,
        },
      ],
    })

    // 检查胜利
    if (newEnemyHp <= 0) {
      set({
        status: 'victory',
        logs: [
          ...get().logs,
          {
            id: Date.now() + 1,
            message: `你击败了 ${state.enemy.name}！`,
            type: 'system',
          },
        ],
      })
    }
  },

  playerUseSkill: (
    skill: Skill,
    playerAttack: number,
    playerMaxHp: number,
    currentMp: number
  ) => {
    const state = get()
    if (!state.enemy || state.status !== 'playerTurn') return null

    // 检查法力值
    if (currentMp < skill.mpCost) {
      get().addLog('法力值不足！', 'system')
      return null
    }

    const result: SkillResult = { message: '' }

    // 根据技能类型执行效果
    switch (skill.type) {
      case 'attack': {
        const totalAttack = get().calculateTotalAttack(playerAttack, state.playerBuffs)
        const baseDamage = Math.floor(totalAttack * (skill.damageMultiplier || 1))
        const damage = Math.max(1, baseDamage - state.enemy.defense + Math.floor(Math.random() * 10) - 5)
        const newEnemyHp = Math.max(0, state.enemyHp - damage)

        result.damage = damage
        result.message = `你使用 ${skill.name} 对 ${state.enemy.name} 造成了 ${damage} 点伤害！`

        set({
          enemyHp: newEnemyHp,
          logs: [...state.logs, { id: Date.now(), message: result.message, type: 'player' }],
        })

        // 检查胜利
        if (newEnemyHp <= 0) {
          set({
            status: 'victory',
            logs: [
              ...get().logs,
              {
                id: Date.now() + 1,
                message: `你击败了 ${state.enemy.name}！`,
                type: 'system',
              },
            ],
          })
        }
        break
      }

      case 'heal': {
        let healAmount = 0
        if (skill.healAmount) {
          healAmount = skill.healAmount
        } else if (skill.healPercent) {
          healAmount = Math.floor(playerMaxHp * skill.healPercent)
        }

        const newPlayerHp = Math.min(state.playerHp + healAmount, playerMaxHp)

        result.healing = healAmount
        result.message = `你使用 ${skill.name}，恢复了 ${healAmount} 点生命值！`

        set({
          playerHp: newPlayerHp,
          logs: [...state.logs, { id: Date.now(), message: result.message, type: 'heal' }],
        })
        break
      }

      case 'buff': {
        const newPlayerBuffs = { ...state.playerBuffs }

        if (skill.buffAttack) {
          newPlayerBuffs.attack = [
            ...newPlayerBuffs.attack,
            { type: 'attack', value: skill.buffAttack, duration: skill.buffDuration || 1 },
          ]
          result.buff = `攻击力提升 ${Math.floor(skill.buffAttack * 100)}%`
        }

        if (skill.buffDefense) {
          newPlayerBuffs.defense = [
            ...newPlayerBuffs.defense,
            { type: 'defense', value: skill.buffDefense, duration: skill.buffDuration || 1 },
          ]
          result.buff = result.buff
            ? `${result.buff}，防御力提升 ${Math.floor(skill.buffDefense * 100)}%`
            : `防御力提升 ${Math.floor(skill.buffDefense * 100)}%`
        }

        result.message = `你使用 ${skill.name}，${result.buff}！`

        set({
          playerBuffs: newPlayerBuffs,
          logs: [...state.logs, { id: Date.now(), message: result.message, type: 'buff' }],
        })
        break
      }
    }

    return result
  },

  enemyTurn: (playerDefense: number) => {
    const state = get()
    if (!state.enemy || state.status !== 'enemyTurn') return

    const totalDefense = get().calculateTotalDefense(playerDefense, state.playerBuffs)

    // 计算伤害
    const damage = Math.max(1, state.enemy.attack - totalDefense + Math.floor(Math.random() * 8) - 4)
    const newPlayerHp = Math.max(0, state.playerHp - damage)

    set({
      playerHp: newPlayerHp,
      logs: [
        ...state.logs,
        {
          id: Date.now(),
          message: `${state.enemy.name} 对你造成了 ${damage} 点伤害！`,
          type: 'enemy',
        },
      ],
    })

    // 检查失败
    if (newPlayerHp <= 0) {
      set({
        status: 'defeat',
        logs: [
          ...get().logs,
          {
            id: Date.now() + 1,
            message: '你被击败了...',
            type: 'system',
          },
        ],
      })
    } else {
      // 敌人回合结束，回到玩家回合
      set({
        status: 'playerTurn',
        currentTurn: 'player',
        turnCount: state.turnCount + 1,
      })
    }
  },

  endTurn: (playerDefense: number) => {
    const state = get()
    if (state.status !== 'playerTurn') return

    // 减少 Buff 持续时间
    const newPlayerBuffs = get().reduceBuffDuration(state.playerBuffs)

    set({
      playerBuffs: newPlayerBuffs,
      status: 'enemyTurn',
      currentTurn: 'enemy',
    })

    // 延迟执行敌人攻击
    setTimeout(() => {
      get().enemyTurn(playerDefense)
    }, 500)
  },

  addLog: (message: string, type: BattleLog['type']) => {
    set((state) => ({
      logs: [
        ...state.logs,
        {
          id: Date.now(),
          message,
          type,
        },
      ],
    }))
  },

  endBattle: () => {
    set({
      inBattle: false,
      status: 'idle',
      currentTurn: 'player',
      turnCount: 1,
      enemy: null,
      playerHp: 0,
      enemyHp: 0,
      playerBuffs: { attack: [], defense: [] },
      enemyBuffs: { attack: [], defense: [] },
    })
  },

  clearLogs: () => {
    set({ logs: [] })
  },
}))

import { useState } from 'react'
import type { Skill } from '../stores/skillLibraryStore'
import SkillList from './SkillList'

interface BattleActionProps {
  onAttack: () => void
  onUseSkill: (skill: Skill) => void
  onFlee: () => void
  disabled?: boolean
  isEnemyTurn?: boolean
}

type ActionType = 'attack' | 'skill' | 'flee'

function BattleAction({ onAttack, onUseSkill, onFlee, disabled, isEnemyTurn }: BattleActionProps) {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null)

  const handleActionClick = (action: ActionType) => {
    if (disabled || isEnemyTurn) return

    switch (action) {
      case 'attack':
        onAttack()
        break
      case 'flee':
        onFlee()
        break
      case 'skill':
        setSelectedAction('skill')
        break
    }
  }

  const handleSkillSelect = (skill: Skill) => {
    setSelectedAction(null)
    onUseSkill(skill)
  }

  if (selectedAction === 'skill') {
    return (
      <div className="p-4 rounded shadow-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <div className="flex justify-between items-center mb-3">
          <div className="text-lg font-medium" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
            选择技能
          </div>
          <button
            className="px-3 py-1 rounded text-sm"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)', color: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => setSelectedAction(null)}
          >
            返回
          </button>
        </div>
        <SkillList onUseSkill={handleSkillSelect} disabled={disabled || isEnemyTurn} />
      </div>
    )
  }

  return (
    <div className="flex gap-4 justify-center">
      <button
        className="px-6 py-3 rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium uppercase tracking-wide"
        style={{
          backgroundColor: disabled || isEnemyTurn ? '#9e9e9e' : '#f44336',
          color: '#ffffff',
          cursor: disabled || isEnemyTurn ? 'not-allowed' : 'pointer',
        }}
        onClick={() => handleActionClick('attack')}
        disabled={disabled || isEnemyTurn}
      >
        攻击
      </button>
      <button
        className="px-6 py-3 rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium uppercase tracking-wide"
        style={{
          backgroundColor: disabled || isEnemyTurn ? '#9e9e9e' : '#2196f3',
          color: '#ffffff',
          cursor: disabled || isEnemyTurn ? 'not-allowed' : 'pointer',
        }}
        onClick={() => handleActionClick('skill')}
        disabled={disabled || isEnemyTurn}
      >
        技能
      </button>
      <button
        className="px-6 py-3 rounded shadow-sm hover:shadow-md transition-all duration-200 font-medium uppercase tracking-wide"
        style={{
          backgroundColor: disabled || isEnemyTurn ? '#9e9e9e' : 'rgba(0, 0, 0, 0.38)',
          color: '#ffffff',
          cursor: disabled || isEnemyTurn ? 'not-allowed' : 'pointer',
        }}
        onClick={() => handleActionClick('flee')}
        disabled={disabled || isEnemyTurn}
      >
        逃跑
      </button>
    </div>
  )
}

export default BattleAction

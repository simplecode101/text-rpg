import { useState } from 'react'
import type { Skill } from '../stores/skillLibraryStore'
import SkillList from './SkillList'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

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
      <Card className="bg-black/2">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-lg font-medium text-neutral-700">
              选择技能
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSelectedAction(null)}
            >
              返回
            </Button>
          </div>
          <SkillList onUseSkill={handleSkillSelect} disabled={disabled || isEnemyTurn} />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex gap-4 justify-center">
      <Button
        size="lg"
        variant="destructive"
        onClick={() => handleActionClick('attack')}
        disabled={disabled || isEnemyTurn}
      >
        攻击
      </Button>
      <Button
        size="lg"
        onClick={() => handleActionClick('skill')}
        disabled={disabled || isEnemyTurn}
      >
        技能
      </Button>
      <Button
        size="lg"
        variant="secondary"
        onClick={() => handleActionClick('flee')}
        disabled={disabled || isEnemyTurn}
      >
        逃跑
      </Button>
    </div>
  )
}

export default BattleAction

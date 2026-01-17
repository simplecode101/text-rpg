import { useSkillStore } from '../stores/skillStore'
import { useSkillLibraryStore } from '../stores/skillLibraryStore'
import { usePlayerStore } from '../stores/playerStore'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import type { Skill } from '../stores/skillLibraryStore'

interface SkillListProps {
  onUseSkill: (skill: Skill) => void
  disabled?: boolean
}

function SkillList({ onUseSkill, disabled }: SkillListProps) {
  const skillStore = useSkillStore()
  const skillLibrary = useSkillLibraryStore()
  const player = usePlayerStore()

  const learnedSkills = skillStore.getLearnedSkills()

  const getSkillFromLibrary = (playerSkill: { id: string; learnedLevel: number; currentCooldown: number }) => {
    return skillLibrary.getSkillById(playerSkill.id)
  }

  const handleSkillClick = (playerSkill: { id: string; learnedLevel: number; currentCooldown: number }) => {
    const skill = getSkillFromLibrary(playerSkill)
    if (!skill) return

    // 检查冷却
    if (playerSkill.currentCooldown > 0) return

    // 检查法力值
    if (player.mp < skill.mpCost) return

    onUseSkill(skill)
  }

  const getSkillTypeColor = (type: string) => {
    switch (type) {
      case 'attack':
        return 'border-red-500'
      case 'heal':
        return 'border-green-500'
      case 'buff':
        return 'border-blue-500'
      case 'debuff':
        return 'border-purple-600'
      default:
        return 'border-gray-600'
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {learnedSkills.map((playerSkill) => {
        const skill = getSkillFromLibrary(playerSkill)
        if (!skill) return null

        const isOnCooldown = playerSkill.currentCooldown > 0
        const notEnoughMp = player.mp < skill.mpCost
        const isDisabled = isOnCooldown || notEnoughMp || disabled

        return (
          <Button
            key={skill.id}
            variant="outline"
            className={`h-auto p-3 justify-start text-left ${getSkillTypeColor(skill.type)} ${isDisabled ? 'opacity-50' : ''}`}
            onClick={() => handleSkillClick(playerSkill)}
            disabled={isDisabled}
          >
            <div className="w-full">
              <div className="flex justify-between items-start mb-1">
                <div className="text-sm font-medium text-neutral-700">
                  {skill.name}
                </div>
                {isOnCooldown && (
                  <Badge variant="secondary" className="bg-orange-500 text-white">
                    {playerSkill.currentCooldown}
                  </Badge>
                )}
              </div>
              <div className="text-xs mb-2 text-black/60">
                {skill.description}
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className={notEnoughMp ? 'text-red-500' : 'text-blue-500'}>
                  法力: {skill.mpCost}
                </div>
                {skill.cooldown > 0 && (
                  <div className="text-black/38">
                    冷却: {skill.cooldown}回合
                  </div>
                )}
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}

export default SkillList

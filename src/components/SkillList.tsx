import { useSkillStore } from '../stores/skillStore'
import { useSkillLibraryStore } from '../stores/skillLibraryStore'
import { usePlayerStore } from '../stores/playerStore'
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

  const getSkillButtonStyle = (playerSkill: { id: string; learnedLevel: number; currentCooldown: number }) => {
    const skill = getSkillFromLibrary(playerSkill)
    if (!skill) return { opacity: 0.5, cursor: 'not-allowed' }

    const isOnCooldown = playerSkill.currentCooldown > 0
    const notEnoughMp = player.mp < skill.mpCost

    if (isOnCooldown || notEnoughMp || disabled) {
      return { opacity: 0.5, cursor: 'not-allowed' as const }
    }

    return { opacity: 1, cursor: 'pointer' as const }
  }

  const getSkillTypeColor = (type: string) => {
    switch (type) {
      case 'attack':
        return '#f44336'
      case 'heal':
        return '#4caf50'
      case 'buff':
        return '#2196f3'
      case 'debuff':
        return '#9c27b0'
      default:
        return '#757575'
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {learnedSkills.map((playerSkill) => {
        const skill = getSkillFromLibrary(playerSkill)
        if (!skill) return null

        const isOnCooldown = playerSkill.currentCooldown > 0
        const notEnoughMp = player.mp < skill.mpCost

        return (
          <button
            key={skill.id}
            className="p-3 rounded shadow-sm hover:shadow-md transition-all duration-200 text-left disabled:cursor-not-allowed"
            style={{
              ...getSkillButtonStyle(playerSkill),
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              border: `1px solid ${getSkillTypeColor(skill.type)}`,
            }}
            onClick={() => handleSkillClick(playerSkill)}
            disabled={isOnCooldown || notEnoughMp || disabled}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="text-sm font-medium" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                {skill.name}
              </div>
              {isOnCooldown && (
                <div className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#ff9800', color: '#fff' }}>
                  {playerSkill.currentCooldown}
                </div>
              )}
            </div>
            <div className="text-xs mb-2" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
              {skill.description}
            </div>
            <div className="flex justify-between items-center text-xs">
              <div style={{ color: notEnoughMp ? '#f44336' : '#2196f3' }}>
                法力: {skill.mpCost}
              </div>
              {skill.cooldown > 0 && (
                <div style={{ color: 'rgba(0, 0, 0, 0.38)' }}>
                  冷却: {skill.cooldown}回合
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default SkillList

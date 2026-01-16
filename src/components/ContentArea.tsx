import Bag from './Bag'
import Cultivate from './Cultivate'
import Explore from './Explore'
import Battle from './Battle'
import Quest from './Quest'

interface ContentAreaProps {
  showBag: boolean
  onCloseBag: () => void
  showCultivate: boolean
  onCloseCultivate: () => void
  showExplore: boolean
  onCloseExplore: () => void
  showBattle: boolean
  battleMonsterId?: string
  onBattleEnd: () => void
  onBattle: (monsterId: string) => void
  showQuest: boolean
  onCloseQuest: () => void
}

function ContentArea({
  showBag,
  onCloseBag,
  showCultivate,
  onCloseCultivate,
  showExplore,
  onCloseExplore,
  showBattle,
  battleMonsterId,
  onBattleEnd,
  onBattle,
  showQuest,
  onCloseQuest,
}: ContentAreaProps) {
  return (
    <div className="flex-1 overflow-hidden">
      {showBattle ? (
        <Battle
          monsterId={battleMonsterId}
          onVictory={onBattleEnd}
          onDefeat={onBattleEnd}
          onFlee={onBattleEnd}
        />
      ) : showBag ? (
        <Bag onClose={onCloseBag} />
      ) : showCultivate ? (
        <Cultivate onClose={onCloseCultivate} />
      ) : showExplore ? (
        <Explore onClose={onCloseExplore} onBattle={onBattle} />
      ) : showQuest ? (
        <Quest onClose={onCloseQuest} />
      ) : (
        <div className="p-4 overflow-y-auto h-full">
          <p>游戏内容区域</p>
        </div>
      )}
    </div>
  )
}

export default ContentArea

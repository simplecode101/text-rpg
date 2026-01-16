import { useState } from 'react'
import TopBar from '../components/TopBar'
import ContentArea from '../components/ContentArea'
import BottomBar from '../components/BottomBar'

function Game() {
  const [showBag, setShowBag] = useState(false)
  const [showCultivate, setShowCultivate] = useState(false)
  const [showExplore, setShowExplore] = useState(false)
  const [showBattle, setShowBattle] = useState(false)
  const [showQuest, setShowQuest] = useState(false)
  const [battleMonsterId, setBattleMonsterId] = useState<string | undefined>()

  const closeAll = () => {
    setShowBag(false)
    setShowCultivate(false)
    setShowExplore(false)
    setShowBattle(false)
    setShowQuest(false)
    setBattleMonsterId(undefined)
  }

  const handleBattle = (monsterId: string) => {
    setBattleMonsterId(monsterId)
    setShowBattle(true)
  }

  const handleBattleEnd = () => {
    setShowBattle(false)
    setBattleMonsterId(undefined)
    setShowExplore(true)
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <ContentArea
        showBag={showBag}
        onCloseBag={closeAll}
        showCultivate={showCultivate}
        onCloseCultivate={closeAll}
        showExplore={showExplore}
        onCloseExplore={closeAll}
        showBattle={showBattle}
        battleMonsterId={battleMonsterId}
        onBattleEnd={handleBattleEnd}
        onBattle={handleBattle}
        showQuest={showQuest}
        onCloseQuest={closeAll}
      />
      <BottomBar
        onOpenBag={() => {
          closeAll()
          setShowBag(true)
        }}
        onOpenCultivate={() => {
          closeAll()
          setShowCultivate(true)
        }}
        onOpenExplore={() => {
          closeAll()
          setShowExplore(true)
        }}
        onOpenQuest={() => {
          closeAll()
          setShowQuest(true)
        }}
      />
    </div>
  )
}

export default Game

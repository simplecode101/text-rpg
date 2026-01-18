import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import ContentArea from '../components/ContentArea'
import Bag from '../components/Bag'
import Cultivate from '../components/Cultivate'
import Explore from '../components/Explore'
import Battle from '../components/Battle'
import Quest from '../components/Quest'
import { useItemLibraryStore } from '../stores/itemLibraryStore'
import { useBagStore } from '../stores/bagStore'
import { Button } from '../components/ui/button'
import { Package, Sparkles, Compass, ScrollText, LogOut } from 'lucide-react'

type ActivePanel = 'bag' | 'cultivate' | 'explore' | 'battle' | 'quest' | null

function Game() {
  const navigate = useNavigate()
  const itemLibrary = useItemLibraryStore()
  const bag = useBagStore()
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [battleMonsterId, setBattleMonsterId] = useState<string>()

  useEffect(() => {
    const initializeData = async () => {
      await itemLibrary.initializeFromCSV()
      await bag.initializeFromCSV()
    }
    initializeData()
  }, [])

  const handleBattle = (monsterId: string) => {
    setBattleMonsterId(monsterId)
    setActivePanel('battle')
  }

  const handleBattleEnd = () => {
    setBattleMonsterId(undefined)
    setActivePanel('explore')
  }

  const handleClose = () => {
    setActivePanel(null)
  }

  const renderContent = () => {
    switch (activePanel) {
      case 'battle':
        return (
          <Battle
            monsterId={battleMonsterId}
            onVictory={handleBattleEnd}
            onDefeat={handleBattleEnd}
            onFlee={handleBattleEnd}
          />
        )
      case 'bag':
        return <Bag />
      case 'cultivate':
        return <Cultivate />
      case 'explore':
        return <Explore onBattle={handleBattle} />
      case 'quest':
        return <Quest />
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col gap-3 w-full max-w-md">
              <Button
                size="lg"
                variant="outline"
                className="h-16 flex-row gap-3 text-base justify-center"
                onClick={() => setActivePanel('bag')}
              >
                <Package className="w-6 h-6" />
                背包
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 flex-row gap-3 text-base justify-center"
                onClick={() => setActivePanel('cultivate')}
              >
                <Sparkles className="w-6 h-6" />
                修炼
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 flex-row gap-3 text-base justify-center"
                onClick={() => setActivePanel('explore')}
              >
                <Compass className="w-6 h-6" />
                探索
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 flex-row gap-3 text-base justify-center"
                onClick={() => setActivePanel('quest')}
              >
                <ScrollText className="w-6 h-6" />
                任务
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="h-16 flex-row gap-3 text-base justify-center"
                onClick={() => navigate('/home')}
              >
                <LogOut className="w-6 h-6" />
                退出游戏
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar onClose={activePanel ? handleClose : undefined} />
      <ContentArea>{renderContent()}</ContentArea>
    </div>
  )
}

export default Game

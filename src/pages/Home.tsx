import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'

function Home() {
  const navigate = useNavigate()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 relative overflow-hidden">
      <h1 className="text-5xl font-bold text-center mb-4 text-gray-900 tracking-wider">
        欢迎来到文字RPG
      </h1>
      <p className="text-sm mb-8 text-gray-600">
        探索、战斗、成长，开启你的冒险之旅
      </p>
      <div className="flex flex-col gap-3 w-[80%] mx-auto">
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0"
          onClick={() => navigate('/game')}
        >
          开始游戏
        </Button>
        <Button size="lg" variant="ghost" className="border-0" onClick={() => setShowSettings(true)}>
          系统设置
        </Button>
        <Button
          size="lg"
          variant="destructive"
          className="border-0"
        >
          结束游戏
        </Button>
      </div>

      {/* 系统设置对话框 */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>系统设置</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="border-0">
              音量设置
            </Button>
            <Button variant="outline" className="border-0">
              画面设置
            </Button>
            <Button variant="outline" className="border-0">
              游戏设置
            </Button>
            <Button variant="outline" className="border-0" onClick={() => setShowSettings(false)}>
              返回
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Home

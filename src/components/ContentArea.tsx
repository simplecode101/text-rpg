interface ContentAreaProps {
  children: React.ReactNode
}

function ContentArea({ children }: ContentAreaProps) {
  return (
    <div className="flex-1 overflow-hidden">
      {children ?? (
        <div className="p-4 overflow-y-auto h-full">
          <p>游戏内容区域</p>
        </div>
      )}
    </div>
  )
}

export default ContentArea

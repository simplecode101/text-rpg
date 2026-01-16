import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {
  return (
    <div className="flex justify-center min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      <div className="w-[60%] bg-white shadow-md">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default App

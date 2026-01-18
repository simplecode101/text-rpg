import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {
  return (
    <div className="flex justify-center min-h-screen bg-gray-50 font-sans">
      <div className="w-full max-w-[768px] bg-white shadow-md mx-auto">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default App

import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {
  return (
    <div className="flex justify-center min-h-screen bg-gray-50 font-sans">
      <div className="w-[60%] bg-white shadow-md">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default App

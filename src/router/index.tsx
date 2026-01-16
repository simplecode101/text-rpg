import { createBrowserRouter, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Game from '../pages/Game'
import ItemEditor from '../pages/ItemEditor'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/game',
    element: <Game />,
  },
  {
    path: '/item-editor',
    element: <ItemEditor />,
  },
])

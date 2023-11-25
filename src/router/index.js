import { createBrowserRouter } from 'react-router-dom'
import AuthRoute from '@/components/AuthRoute'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import Rank from '@/pages/Rank'
import Forum from '@/pages/Forum'
import Books from '@/pages/Books'
import Home from '@/pages/Home'
import Register from '@/pages/Register'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthRoute><Layout /></AuthRoute>,
    children: [
      {
        index: true, // 设置为默认二级路由
        element: <Home />
      },
      {
        path: '/rank',
        element: <Rank />
      },
      {
        path: '/forum',
        element: <Forum />
      },
      {
        path: '/books',
        element: <Books />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
])

export default router
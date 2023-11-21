import { createBrowserRouter } from 'react-router-dom'
import { Button } from 'antd'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />
  },
  {
    path: '/login',
    element: <Login />
  }
])

export default router
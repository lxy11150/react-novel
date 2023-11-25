import React from 'react'
import { Card } from 'antd'
import { useLocation } from 'react-router-dom'
import logo from '@/assets/logo.png'

const LoginCard = ({ children }) => {
  const location = useLocation()

  return (
    <div className="login_register">
      <Card className='container'
        title={location.pathname === '/login' ? '密码登录' : '用户注册'}
      >
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        {children}
        <div className="square">
          <ul>
            <li>致</li>
            <li>力</li>
            <li>打</li>
            <li>造</li>
            <li>纯</li>
          </ul>
        </div>
        <div className="circle">
          <ul>
            <li>净</li>
            <li>小</li>
            <li>说</li>
            <li>书</li>
            <li>屋</li>
          </ul>
        </div>
        <div className="title">
          <ul>
            <li>集</li>
            <li>成</li>
            <li>书</li>
            <li>屋</li>
            <li>为</li>
            <li>您</li>
            <li>服</li>
            <li>务</li>
          </ul>
        </div>
      </Card >
    </div>
  )
}

export default LoginCard
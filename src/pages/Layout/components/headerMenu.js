import React, { useEffect, useState } from 'react'
import { BarChartOutlined, HomeOutlined, CommentOutlined, ReadOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
const items = [
  {
    label: '主页',
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: '排行',
    key: '/rank',
    icon: <BarChartOutlined />,
  },
  {
    label: '书吧',
    key: '/forum',
    icon: <CommentOutlined />,
  },
  {
    label: '书库',
    key: '/books',
    icon: <ReadOutlined />,
  },
];

const HeaderMenu = () => {
  const [current, setCurrent] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const onClick = (e) => {
    setCurrent(e.key)
    navigate(e.key)
  }

  useEffect(() => {
    setCurrent(location.pathname)
  }, [])

  return (
    <div className="header_menu">
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    </div>
  )
}

export default HeaderMenu
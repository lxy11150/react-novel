import React from 'react'
import { UserOutlined, PoweroffOutlined, ToolOutlined } from '@ant-design/icons'
import { Popover, Avatar, Card, message, Popconfirm } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearUserInfo } from '@/store/modules/user'

const UserInfo = ({ username }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const confirm = () => {
    dispatch(clearUserInfo())
    sessionStorage.clear()
    navigate('/login')
    message.success('你已退出登录');
  }

  const style = {
    display: 'block',
    padding: 12,
    fontSize: 16,
    fontWeight: 500
  }

  const icon = {
    marginRight: 20
  }

  const content = (
    <Card
      title={`你好，书友 ${username}`}
      style={{
        width: 240,
      }}
    >
      <Link
        style={style}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e2e2'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      ><UserOutlined style={icon} />个人中心</Link>
      <Link style={style}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e2e2'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      ><ToolOutlined style={icon} />账号设置</Link>
      <Popconfirm
        title="是否退出登录"
        description="你确定要退出登录吗?"
        onConfirm={confirm}
        okText="是"
        cancelText="否"
      >
        <Link style={style}
          onClick={(e) => e.preventDefault()}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e2e2'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        ><PoweroffOutlined style={icon} />退出登录</Link>
      </Popconfirm>
    </Card >
  )

  return (
    <div className="user_info">
      <Popover content={content} trigger="click">
        <Avatar size={48} icon={<UserOutlined />} className='avatar' />
      </Popover>
    </div>
  )
}

export default UserInfo
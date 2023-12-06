import React from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import LoginCard from '@/components/LoginCard'
import './index.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchLogin } from '@/store/modules/user'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onFinish = async (values) => {
    //触发异步action fentchLogin
    await dispatch(fetchLogin(JSON.stringify(values)))
    //1. 跳转到首页
    navigate('/')
    //2. 提示一下用户
    message.success('登录成功')
  }

  return (
    <div className="login">
      <LoginCard>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入你的姓名!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入你的密码!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item className='login_remeber_forgot'>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              忘记密码
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
            或者去 <a onClick={() => navigate('/register')}>注册</a>
          </Form.Item>
        </Form>
      </LoginCard>
    </div>
  )
}

export default Login
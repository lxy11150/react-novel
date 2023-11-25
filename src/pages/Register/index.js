import LoginCard from '@/components/LoginCard';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Result,
  message
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { registerAPI } from '@/apis/user';
import './index.scss'
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};


const Register = () => {
  const [form] = Form.useForm()
  const [isRegister, setIsRegister] = useState(false)
  const [timer, setTimer] = useState()
  const navigate = useNavigate()

  const onFinish = (values) => {
    registerAPI(JSON.stringify(values)).then(res => {
      if (res.data.code === 401) {
        message.warning(res.data.message)
      } else {
        setIsRegister(true)
      }
    }).catch(error => {
      message.error('服务器繁忙，请稍后重试')
    })
  }

  const handleGoLogin = () => {
    clearTimeout(timer)
    navigate('/login')
  }

  useEffect(() => {
    if (isRegister === true) {
      const newTimer = setTimeout(() => {
        navigate('/login')
      }, 5000);
      setTimer(newTimer)
    }
  }, [isRegister])

  return (
    <div className="register">
      <LoginCard>
        {isRegister === false
          ?
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            style={{
              maxWidth: 600,
            }}
            scrollToFirstError
          >
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                {
                  type: 'email',
                  message: '请输入你的邮箱！',
                },
                {
                  required: true,
                  message: '请输入正确的邮箱格式',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                {
                  required: true,
                  message: '请输入你的密码',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="确认密码"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: '请确认你的密码！',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="username"
              label="用户名"
              tooltip="你想要别人怎么称呼你？"
              rules={[
                {
                  required: true,
                  message: '请输入你的昵称！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="intro"
              label="个性描述"
              rules={[
                {
                  required: true,
                  message: '请简述你是怎样的一个人',
                },
              ]}
            >
              <Input.TextArea showCount maxLength={100} />
            </Form.Item>

            <Form.Item
              name="gender"
              label="性别"
              rules={[
                {
                  required: true,
                  message: '请选择你的性别!',
                },
              ]}
            >
              <Select placeholder="选择你的性别">
                <Option value={0}>男</Option>
                <Option value={1}>女</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('请接受我们的协议')),
                },
              ]}
              {...tailFormItemLayout}
            >
              <Checkbox>
                我已经阅读 <a href="">用户协议</a>
              </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                注册
              </Button>
              或者返回 <a onClick={() => navigate('/login')}>登录</a>
            </Form.Item>
          </Form>
          :
          <Result
            status="success"
            title="亲爱的书友，集成书屋欢迎您的加入^_^"
            subTitle={`系统将在${5}s后自动跳转登录界面`}
            extra={[
              <Button type="primary" key="console" onClick={handleGoLogin}>
                前往登录
              </Button>
            ]}
          />}
      </LoginCard>
    </div>
  )
}

export default Register
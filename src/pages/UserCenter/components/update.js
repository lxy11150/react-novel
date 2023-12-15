import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Select, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updatePasswordAPI, updateUserAPI } from '@/apis/user';
import { fetchUserInfo } from '@/store/modules/user';
import { removeToken } from '@/utils';

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

const tabListNoTitle = [
  {
    key: 'ordinary',
    label: '常规资料',
  },
  {
    key: 'password',
    label: '修改密码',
  },
];

const Update = () => {
  const [form] = Form.useForm()
  const [activeTabKey, setActiveTabKey] = useState('ordinary');
  const userInfo = useSelector(state => state.user.userInfo)
  const dispatch = useDispatch()

  const onTab2Change = (key) => {
    setActiveTabKey(key)
  }

  const onBasicFinish = async (values) => {
    console.log(values);
    await updateUserAPI({ ...values, id: userInfo.id }).then(
      res => {
        if (res.data.code === 200) {
          dispatch(fetchUserInfo())
          message.success('修改成功')
        } else {
          message.warning(res.data.message)
        }
      }
    )
  }

  const onPasswordFinish = async (values) => {
    console.log(values);
    await updatePasswordAPI({ ...values, id: userInfo.id }).then(
      res => {
        if (res.data.code === 200) {
          dispatch(fetchUserInfo())
          removeToken()
        } else {
          message.warning(res.data.message)
        }
      }
    )
  }

  useEffect(() => {
    // 设置默认值
    form.setFieldsValue({
      'email': userInfo.email,
      'username': userInfo.username,
      'intro': userInfo.intro,
      'gender': userInfo.gender,
    });
  }, [userInfo, form]);

  const contentListNoTitle = {
    ordinary: <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onBasicFinish}
      style={{
        maxWidth: 500,
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
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          保存修改
        </Button>
      </Form.Item>
    </Form>,
    password: <Form
      {...formItemLayout}
      name="register"
      onFinish={onPasswordFinish}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError
    >
      <Form.Item
        name="oldPassword"
        label="旧密码"
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
        name="newPassword"
        label="新密码"
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
        dependencies={['newPassword']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '请确认你的密码！',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          保存修改
        </Button>
      </Form.Item>
    </Form>,
  };

  return (
    <div className="update">
      <Card
        style={{
          width: '100%',
        }}
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey}
        onTabChange={onTab2Change}
        tabProps={{
          size: 'large',
        }}
      >
        {contentListNoTitle[activeTabKey]}
      </Card>
    </div>
  )
}

export default Update
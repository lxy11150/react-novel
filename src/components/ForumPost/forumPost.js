import React, { useState } from 'react'
import { Button, Form, Input, Popover } from 'antd'
import { MehOutlined } from '@ant-design/icons'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useForm } from "antd/es/form/Form";
import i18n from '@emoji-mart/data/i18n/zh.json'
import './forumPost.scss'

const ForumPost = ({ handlePost }) => {
  const [form] = useForm()
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleEmojiSelect = (emoji) => {
    // 获取当前 TextArea 的值
    const currentValue = form.getFieldValue('comment') ? form.getFieldValue('comment') : '';

    // 更新 TextArea 的值，将表情添加到当前值的末尾
    form.setFieldsValue({ 'comment': currentValue + emoji.native });
  };

  const onFinish = (values) => {
    handlePost(values)
    form.resetFields(); // 清空表单值
  };

  return (
    <div className="forum_post">
      <Form
        form={form}
        name="form"
        className="form"
        onFinish={onFinish}
      >
        <Form.Item name='comment' >
          <Input.TextArea
            placeholder="与其赞同别人的话语，不如自己畅所欲言"
            style={{ width: 650 }}
            rows={4}
          />
        </Form.Item>
        <Form.Item>
          <Popover
            content={<Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              i18n={i18n}
            />}
            trigger="click"
            open={open}
            placement="bottomLeft" // 设置气泡的显示位置
            onOpenChange={handleOpenChange}
          >
            <MehOutlined />
          </Popover>
          <Button type="primary" htmlType="submit">
            发送
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ForumPost
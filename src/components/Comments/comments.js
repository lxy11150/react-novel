import React from "react";
import { Avatar } from 'antd'
import { UserOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";
import './comments.scss'

const Comments = ({ comments }) => {
  return (
    <div className="comments_list_item">
      <div className="item_img">
        <Avatar size={48} icon={<UserOutlined />} className='avatar' />
      </div>
      <div className="item_info ellipsis">
        <div className="item_info_user">
          用户{comments?.username}
        </div>
        <div className="item_info_comments">
          {comments?.content}
        </div>
        <div className="item_info_from ellipsis">
          <i>章评来自：</i>
          <Link to={`/chapter/1/0`}>{comments?.title}</Link>
        </div>
        <div className="item_info_other">
          <div className="other_time">
            {comments?.time}
          </div>
          <div className="other_icon">
            <div className="icon_like">
              <LikeOutlined style={{ paddingRight: 8 }} />
              <span>{comments?.likes}</span>
            </div>
            <div className="icon_dislike">
              <DislikeOutlined style={{ paddingRight: 8 }} />
              <span>{comments?.dislikes}</span>
            </div>
            <span>回复</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comments
import React from "react";
import { Card, Avatar, Button } from 'antd';
import { UserOutlined, MessageOutlined, ReadOutlined, ShareAltOutlined, LikeOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const UserHome = ({ total, active, shelf, recommend }) => {
  return (
    <div className="user_home">
      <Card>
        <div className="user_info">
          <Avatar size={90} icon={<UserOutlined />} />
          <div className="user_detail">
            <h3>书友lxy</h3>
            <ul>
              <li>
                <span className="text">获赞</span>
                <span className="count">{total?.likesTotal}</span>
              </li>
              <li className="divider"></li>
              <li>
                <span className="text">发表评论</span>
                <span className="count">{total?.commentTotal}</span>
              </li>
              <li className="divider"></li>
              <li>
                <span className="text">书架收藏</span>
                <span className="count">{total?.shelfTotal}</span>
              </li>
              <li className="divider"></li>
              <li>
                <span className="text">点赞</span>
                <span className="count">{total?.praiseTotal}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="user_intro">
          <span>简介：</span>
          <span>暂时没有简介</span>
        </div>
      </Card>
      <div className="aggregate_data">
        <div className="aggregate_data_item">
          <div className="aggregate_item_header">
            <MessageOutlined />
            <h4>我的动态</h4>
          </div>
          <div className="aggregate_item_content">
            <span className="count">{active?.total}</span>
            <span className="text">本周发帖</span>
          </div>
          <div className="aggregate_item_bottom">
            <div className="item_bottom_comment">
              <span className="count">{active?.commentCount}</span>
              <span className="text">发帖</span>
            </div>
            <div className="aggregate_divider"></div>
            <div className="item_bottom_reply">
              <span className="count">{active?.replyCount}</span>
              <span className="text">回复</span>
            </div>
          </div>
          <Button>
            <Link to={'/userCenter/active'}>查看详情</Link>
          </Button>
        </div>
        <div className="aggregate_data_item aggregate_data_item--blue">
          <div className="aggregate_item_header">
            <ReadOutlined />
            <h4>我的书架</h4>
          </div>
          <div className="aggregate_item_content">
            <span className="count">{shelf?.total}</span>
            <span className="text">本周收藏</span>
          </div>
          <div className="aggregate_item_bottom">
            <div className="item_bottom_comment">
              <span className="count">{shelf?.male}</span>
              <span className="text">男生</span>
            </div>
            <div className="aggregate_divider"></div>
            <div className="item_bottom_reply">
              <span className="count">{shelf?.female}</span>
              <span className="text">女生</span>
            </div>
          </div>
          <Button>
            <Link to={'/userCenter/shelf?key=shelf'}>查看详情</Link>
          </Button>
        </div>
        <div className="aggregate_data_item aggregate_data_item--red">
          <div className="aggregate_item_header">
            <ShareAltOutlined />
            <h4>我的推荐</h4>
          </div>
          <div className="aggregate_item_content">
            <span className="count">{recommend?.total}</span>
            <span className="text">本周推荐</span>
          </div>
          <div className="aggregate_item_bottom">
            <div className="item_bottom_comment">
              <span className="count">{recommend?.male}</span>
              <span className="text">男生</span>
            </div>
            <div className="aggregate_divider"></div>
            <div className="item_bottom_reply">
              <span className="count">{recommend?.female}</span>
              <span className="text">女生</span>
            </div>
          </div>
          <Button >查看详情</Button>
        </div>
        <div className="aggregate_data_item aggregate_data_item--green">
          <div className="aggregate_item_header">
            <LikeOutlined />
            <h4>我的点赞</h4>
          </div>
          <div className="aggregate_item_content">
            <span className="count">0</span>
            <span className="text">本周赞况</span>
          </div>
          <div className="aggregate_item_bottom">
            <div className="item_bottom_comment">
              <span className="count">0</span>
              <span className="text">点赞</span>
            </div>
            <div className="aggregate_divider"></div>
            <div className="item_bottom_reply">
              <span className="count">0</span>
              <span className="text">获赞</span>
            </div>
          </div>
          <Button >查看详情</Button>
        </div>
      </div>
    </div>
  )
}

export default UserHome
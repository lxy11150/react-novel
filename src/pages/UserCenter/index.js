import React, { useEffect, useState } from 'react'
import './index.scss'
import { Menu, message } from 'antd';
import UserHome from './components/userHome';
import MyShelf from './components/myShelf';
import Update from './components/update';
import { useNavigate, useParams } from 'react-router-dom';
import MyComment from './components/myComment';
import MyPraise from './components/myPraise';
import { getMyActiveAPI, getMyRecommendAPI, getMyShelfAPI, getTotalAPI } from '@/apis/total';
import { useSelector } from 'react-redux';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('个人中心', 'home'),
  getItem('我的书架', 'shelf'),
  getItem('我的动态', 'active'),
  getItem('我的点赞', 'like'),
  getItem('修改资料', 'update'),
];

const UserCenter = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [total, setTotal] = useState()
  const [active, setActive] = useState()
  const [shelf, setShelf] = useState()
  const [recommend, setRecommend] = useState()
  const userInfo = useSelector(state => state.user.userInfo)

  const onClick = (e) => {
    navigate(`/userCenter/${e.key}`)
  };

  const getTotal = async () => {
    await getTotalAPI({ userId: userInfo.id }).then(
      res => {
        if (res.data.code === 200) {
          setTotal(res.data.data)
        } else {
          message.warning(res.data.message)
        }
      }
    )
  }

  const getActive = async () => {
    await getMyActiveAPI({ userId: userInfo.id }).then(
      res => {
        if (res.data.code === 200) {
          setActive(res.data.data)
        } else {
          message.warning(res.data.message)
        }
      }
    )
  }

  const getShelf = async () => {
    await getMyShelfAPI({ userId: userInfo.id }).then(
      res => {
        if (res.data.code === 200) {
          setShelf(res.data.data)
        } else {
          message.warning(res.data.message)
        }
      }
    )
  }

  const getRecommend = async () => {
    await getMyRecommendAPI({ userId: userInfo.id }).then(
      res => {
        console.log(res.data);
        if (res.data.code === 200) {
          setRecommend(res.data.data)
        } else {
          message.warning(res.data.message)
        }
      }
    )
  }

  const render = {
    home: <UserHome
      total={total}
      active={active}
      shelf={shelf}
      recommend={recommend}
    />,
    shelf: <MyShelf />,
    update: <Update />,
    active: <MyComment />,
    like: <MyPraise />
  }
  useEffect(() => {
    userInfo.id && getTotal()
    userInfo.id && getActive()
    userInfo.id && getShelf()
    userInfo.id && getRecommend()
  }, [userInfo.id])

  return (
    <div className="user_center">
      <div className="user_center_nav">
        <Menu
          onClick={onClick}
          defaultSelectedKeys={[params.key]}
          defaultOpenKeys={[params.key]}
          mode="inline"
          items={items}
        />
      </div>
      <div className="user_center_content">
        {render[params.key]}
      </div>
    </div>
  )
}

export default UserCenter
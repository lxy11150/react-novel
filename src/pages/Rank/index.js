import React, { useEffect, useState } from 'react'
import { FireOutlined } from '@ant-design/icons'
import { Menu, Pagination, ConfigProvider } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN';
import likes from '@/assets/likes.png'
import click from '@/assets/click.png'
import collect from '@/assets/collect.png'
import recommend from '@/assets/recommend.png'
import finish from '@/assets/finish.png'
import platform from '@/assets/platform.png'
import RankList from '@/components/RankList/ranList'
import { useNavigate, useSearchParams } from 'react-router-dom'
import RankInfo from './components/RankInfo'
import ImgHead from './components/ImgHead';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRankList } from '@/store/modules/rank';
import './index.scss'

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
  getItem('最受欢迎榜', 'likes'),
  getItem('点击榜', 'click'),
  getItem('收藏榜', 'collect'),
  getItem('推荐榜', 'recommend'),
  getItem('完结榜', 'finish'),
  getItem('书屋收录完全榜', 'platform'),
];


const imgs = [likes, click, collect, recommend, finish, platform]

const text = {
  likes: '人气',
  click: '点击',
  collect: '收藏',
  recommend: '推荐'
}

const Rank = () => {
  const navigate = useNavigate()
  const [nav, setNav] = useState()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const rankList = useSelector(state => state.rank.rankList)
  const keys = Object.keys(rankList)[0]; //单个排名的key值
  const total = 20

  const onClick = (e) => {
    navigate(`/rank?nav=${e.key}`)
    dispatch(fetchRankList({ nav: e.key }))
  };

  const handleDefault = async () => {
    await dispatch(fetchRankList({ nav: 'default' }))
    navigate(`/rank?nav=default`)
  }

  const handlePage = (page, pageSize) => {
    console.log(page);
  }

  useEffect(() => {
    setNav(searchParams.get('nav'))
  }, [searchParams])

  useEffect(() => {
    const key = searchParams.get('nav')
    dispatch(fetchRankList({ nav: key ? key : 'default' }))
  }, [])

  return (
    <div className="rank">
      <div className="rank_nav">
        <div className="rank_nav_scan">
          <FireOutlined />
          <h3 onClick={handleDefault}>榜单总览</h3>
        </div>
        <div className="line"></div>
        <div className="rank_nav_list">
          <div className="list_title">
            作品榜单
          </div>
          <div className="list_info">
            <Menu
              onClick={onClick}
              style={{
                width: 200,
              }}
              defaultSelectedKeys={searchParams.get('nav') !== 'default' ? [searchParams.get('nav')] : ['']}
              defaultOpenKeys={searchParams.get('nav') !== 'default' ? [searchParams.get('nav')] : ['']}
              mode="inline"
              items={items}
            />
          </div>
        </div>
      </div>
      {(!nav || nav === 'default')
        ?
        <div className="rank_content_default">
          {Object.keys(rankList)?.map((item, index) => (
            <RankList rank={rankList[item]} key={index} img={imgs[index]} />
          ))}
        </div>
        :
        <div className='rank_content'>
          <div className="rank_content_head" >
            <ImgHead nav={nav} />
          </div>
          <div className="rank_content_body">
            {rankList[keys]?.map((item, index) => (
              <RankInfo item={item} index={index} text={text[keys]} key={index} />
            ))}
          </div>
          <ConfigProvider locale={zh_CN}>
            <Pagination
              total={total}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条`}
              className='pagination'
              onChange={handlePage}
            />
          </ConfigProvider>
        </div>
      }
    </div>
  )
}

export default Rank
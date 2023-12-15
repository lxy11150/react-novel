import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import news from '@/assets/new.png'
import hot from '@/assets/hot.png'
import _ from 'lodash'
import BookBox from '@/components/BookBox/bookBox';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNovelRandom } from '@/store/modules/novel';
import { useNavigate } from 'react-router-dom';
import RankNum from '@/components/RankNum';
import { fetchRankList } from '@/store/modules/rank';
import './index.scss'

const Home = () => {
  const [trending, setTrending] = useState([
    {
      content: "2022年9月1日",
      url: "http://localhost:3001/",
      submitTime: "2023-12-08 8:00",
      tag: "new"
    },
    {
      content: "2022年9月1日 新福利",
      url: "http://localhost:3001/",
      submitTime: "2023-11-01 8:00",
      tag: "new"
    },
    {
      content: "2022年9月1日 新福利上线",
      url: "http://localhost:3001/",
      submitTime: "2023-12-01 8:00",
      tag: "new"
    },
    {
      content: "2022年9月1日 新福利上线",
      url: "http://localhost:3001/",
      submitTime: "2023-12-01 8:00",
      tag: "hot"
    },
    {
      content: "2022年9月1日 新福利上线",
      url: "http://localhost:3001/",
      submitTime: "2023-12-01 8:00",
      tag: "hot"
    },
    {
      content: "2022年9月1日 新福利上线",
      url: "http://localhost:3001/",
      submitTime: "2023-12-01 8:00",
      tag: "hot"
    },
    {
      content: "2022年9月1日 新福利上线",
      url: "http://localhost:3001/",
      submitTime: "2023-12-01 8:00",
      tag: "hot"
    },
    {
      content: "2022年9月1日 新福利上线",
      url: "http://localhost:3001/",
      submitTime: "2023-12-01 8:00",
      tag: "hot"
    },
  ])
  const [box, setBox] = useState(-1)
  const dispatch = useDispatch()
  const novelRandom = useSelector(state => state.novel.novelRandom)
  const novelInfo = useSelector(state => state.rank.rankList)
  const navigate = useNavigate()

  const handleBox = (index) => {
    setBox(index)
  }

  const handlMore = () => {
    navigate('/rank')
    window.scrollTo(0, 100)
  }

  useEffect(() => {
    setTrending(_.orderBy(trending, 'submitTime'))
    dispatch(fetchRankList({ nav: 'likes' }))
  }, [])

  //获取小说列表信息
  useEffect(() => {
    dispatch(fetchNovelRandom())
  }, [dispatch])

  return (
    <div className="home">
      <div className="home_carousel">
        <Carousel effect="fade" autoplay className='carousel'>
          <div>
            <a href="https://www.zongheng.com/detail/1171191" target='_blank' className='bc1'></a>
          </div>
          <div>
            <a href="https://huayu.zongheng.com/book/1235701.html" target='_blank' className='bc2'></a>
          </div>
          <div>
            <a href="https://www.zongheng.com/detail/1230106" target='_blank' className='bc3'></a>
          </div>
          <div>
            <a href="https://huayu.zongheng.com/book/1276270.html" target='_blank' className='bc4'></a>
          </div>
        </Carousel>
        <div className="site_dynamic">
          <h1 className='site_dynamic_title'>
            站点动态
          </h1>
          <ul>
            {trending.map((item, index) => (
              <li key={index}>
                <span>{index + 1}</span>
                <a href={item.url} target='_blank' className='trendings'>{item.content}</a>
                <img src={item.tag === 'new' ? news : hot} alt="new" />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="editor_recommend">
        {novelRandom?.slice(0, 4).map(item => (
          <BookBox item={item} key={item.id} />
        ))}
      </div>
      <div className="books_rank">
        <div className="rank_top">
          <h1>热门榜</h1>
        </div>
        <div className="rank_info">
          {novelInfo.likes?.map((item, index) => (
            <div className='rank_item' key={index} onMouseEnter={() => { handleBox(index) }}>
              <RankNum index={index} />
              {box === index ? <BookBox item={item} /> :
                <div className='rank_display'>
                  <div className="rank_title ellipsis">
                    <a href="#">{item.book}</a>
                  </div>
                  <div className="rank_author ellipsis">
                    <span>{item.author}</span>
                  </div>
                </div>}
            </div>
          ))}
        </div>
        <div className="more_rank" onClick={handlMore}>
          查看更多
        </div>
      </div>
    </div >
  )
}

export default Home
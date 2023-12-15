import React, { useState, useEffect, useRef } from 'react'
import { Breadcrumb, message } from 'antd';
import { Link, useParams } from 'react-router-dom';
import BookInfo from './components/bookInfo';
import DetailContent from './components/detailContent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNovelInfo } from '@/store/modules/novel';
import { fetchChapterInfo, fetchChapterList } from '@/store/modules/chapter';
import RankList from '@/components/RankList/ranList';
import img from '@/assets/likes.png'
import { fetchRankList } from '@/store/modules/rank';
import './index.scss'
import classNames from 'classnames';
import { addShelfAPI, existShelfAPI } from '@/apis/shelf';
import { AddRecommendAPI, existRecommendAPI } from '@/apis/recommend';

const Detail = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [isExist, setIsExist] = useState(false)
  const [isRecommend, setIsRecommend] = useState(false)
  const dispatch = useDispatch()
  const novelInfo = useSelector(state => state.novel.novelInfo)
  const rankList = useSelector(state => state.rank.rankList)
  const chapterList = useSelector(state => state.chapter.chapterList)
  const chapterInfo = useSelector(state => state.chapter.chapterInfo.chapter?.content)
  const userInfo = useSelector(state => state.user.userInfo)
  const param = useParams()
  const ref = useRef()

  const item = [
    {
      title: <Link to={'/'}>主页</Link>,
    },
    {
      title: <Link to={'/rank'}>{novelInfo.novel?.type}</Link>
    },
    {
      title: novelInfo.novel?.book,
    },
  ]

  const handleScroll = () => {
    const offset = 550;
    const scrollY = window.scrollY

    if (scrollY > offset) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  const handleShelf = async () => {
    await addShelfAPI({
      userId: userInfo.id,
      novelId: param.id
    }).then(
      setIsExist(true)
    )
  }

  const handleRecommend = async () => {
    await AddRecommendAPI({ userId: userInfo.id, novelId: param.id }).then(
      res => {
        if (res.data.code === 200) {
          console.log(res.data);
          message.success(res.data.message)
          setIsRecommend(true)
        } else {
          message.warning(res.data.message)
        }
      }
    )
  }

  const exist = async () => {
    await existShelfAPI({
      userId: userInfo.id,
      novelId: param.id
    }).then(
      res => setIsExist(res.data)
    )
  }

  const existRecommend = async () => {
    await existRecommendAPI({
      userId: userInfo.id,
      novelId: param.id
    }).then(
      res => {
        setIsRecommend(res.data.data)
      }
    )
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchNovelInfo({ id: param.id }))
    dispatch(fetchChapterList({ id: param.id }))
    dispatch(fetchChapterInfo({ novelId: param.id, id: 0 }))
    dispatch(fetchRankList({ nav: 'likes' }))
  }, [dispatch])

  useEffect(() => {
    userInfo.id && exist()
    userInfo.id && existRecommend()
  }, [userInfo.id])

  return (
    <div className="detail">
      <div className="datail_top">
        <div className="breadcrumb">
          <Breadcrumb items={item} />
        </div>
        <div className="detail_top_content">
          <BookInfo
            novelInfo={novelInfo}
            chapter={chapterList.slice(-1)[0]}
            index={chapterList.length - 1}
            id={param.id}
            handleShelf={handleShelf}
            handleRecommend={handleRecommend}
            isExist={userInfo.id ? isExist : true}
            isRecommend={userInfo.id ? isRecommend : true}
          />
        </div>
      </div>
      <div className="detail_content">
        <div className="content_left">
          <DetailContent
            chapterList={chapterList}
            profile={novelInfo.novel?.profiles}
            chapterInfo={chapterInfo}
            id={param.id}
          />
        </div>
        <div className={classNames("content_right", { fixed: isFixed })} ref={ref}>
          <RankList rank={rankList?.likes} img={img} />
        </div>
      </div>
    </div>
  )
}

export default Detail
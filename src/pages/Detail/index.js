import React, { useEffect } from 'react'
import { Breadcrumb } from 'antd';
import { Link, useParams } from 'react-router-dom';
import BookInfo from './components/bookInfo';
import DetailContent from './components/detailContent';
import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import { fetchNovelInfo } from '@/store/modules/novel';
import { fetchChapterInfo, fetchChapterList } from '@/store/modules/chapter';
import RankList from '@/components/RankList/ranList';
import img from '@/assets/likes.png'
import { fetchRankList } from '@/store/modules/rank';

const Detail = () => {
  const dispatch = useDispatch()
  const novelInfo = useSelector(state => state.novel.novelInfo)
  const rankList = useSelector(state => state.rank.rankList)
  const chapterList = useSelector(state => state.chapter.chapterList)
  const chapterInfo = useSelector(state => state.chapter.chapterInfo.chapter?.content)
  const param = useParams()

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

  useEffect(() => {
    dispatch(fetchNovelInfo({ id: param.id }))
    dispatch(fetchChapterList({ id: param.id }))
    dispatch(fetchChapterInfo({ novelId: param.id, id: 0 }))
    dispatch(fetchRankList({ nav: 'likes' }))
  }, [dispatch])

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
        <div className="content_right">
          <RankList rank={rankList?.likes} img={img} />
        </div>
      </div>
    </div>
  )
}

export default Detail
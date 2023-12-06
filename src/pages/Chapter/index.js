import React, { useEffect } from 'react'
import { Breadcrumb, Card, Space, Button, message } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './index.scss'
import ChapterTitle from './components/chapterTitle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChapterInfo } from '@/store/modules/chapter';
import RichText from '@/components/RichText';

const item = [
  {
    title: <Link to={'/'}>主页</Link>,
  },
  {
    title: <Link to={'/rank'}>玄幻</Link>
  },
  {
    title: <Link to={'/detail/1'}>我有一剑</Link>,
  },
  {
    title: '第一章'
  }
]

const Chapter = () => {
  const dispatch = useDispatch()
  const chapterInfo = useSelector(state => state.chapter.chapterInfo)
  const navigate = useNavigate()
  const params = useParams()

  const preChapter = async () => {
    if (parseInt(params.id, 10) - 1 === -1) {
      message.warning('已经是第一章了')
    } else {
      const id = parseInt(params.id, 10) - 1
      await dispatch(fetchChapterInfo({ novelId: params.novelId, id: id }))
      navigate(`/chapter/${params.novelId}/${id}`)
      window.scrollTo(0, 100);
    }
  }

  const nextChapter = async () => {
    if (parseInt(params.id, 10) + 1 === -1) {
      message.warning('已经是第一章了')
    } else {
      const id = parseInt(params.id, 10) + 1
      await dispatch(fetchChapterInfo({ novelId: params.novelId, id: id }))
      navigate(`/chapter/${params.novelId}/${id}`)
      window.scrollTo(0, 100);
    }
  }

  const handleContents = async () => {
    sessionStorage.setItem('detail', 'contents')
    navigate(`/detail/${params.novelId}`)
    window.scrollTo(0, 100); // 导航后滚动到页面顶部
  }

  useEffect(() => {
    dispatch(fetchChapterInfo({ novelId: params.novelId, id: params.id }))
  }, [])

  return (
    <div className="chapter">
      <Breadcrumb items={item} className='breadcrumb' />
      <Card
        title={<ChapterTitle chapterInfo={chapterInfo} />}
        bordered={false}
        className='chapter_content'
      >
        <div className="chapter_paragraph">
          <RichText richTextContent={chapterInfo.chapter?.content} />
        </div>
      </Card>
      <Space.Compact block className='nav_btns'>
        <Button onClick={preChapter}>上一章</Button>
        <Button onClick={handleContents}>目录</Button>
        <Button onClick={nextChapter}>下一章</Button>
      </Space.Compact>
    </div>
  )
}

export default Chapter
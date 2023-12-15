import React, { useEffect } from 'react'
import { Breadcrumb, Card, Space, Button, message } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ChapterTitle from './components/chapterTitle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChapterInfo } from '@/store/modules/chapter';
import RichText from '@/components/RichText';
import './index.scss'
import Guidebar from './components/guidebar';
import { updateAPI } from '@/apis/shelf';
import { addLogAPI } from '@/apis/log';

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
  const userInfo = useSelector(state => state.user.userInfo)
  const navigate = useNavigate()
  const params = useParams()

  const updateShelf = async (id) => {
    await updateAPI({
      chapterId: id,
      novelId: params.novelId,
      userId: userInfo.id
    }).then(
      res => {
        console.log(res.data);
      }
    )
  }

  const addLog = async (id) => {
    await addLogAPI({
      chapterId: id,
      novelId: params.novelId,
      userId: userInfo.id
    }).then(
      res => {
        console.log(res.data);
      }
    )
  }

  const preChapter = async () => {
    if (parseInt(params.id, 10) - 1 === -1) {
      message.warning('已经是第一章了')
    } else {
      const id = parseInt(params.id, 10) - 1
      await dispatch(fetchChapterInfo({ novelId: params.novelId, id: id }))
      navigate(`/chapter/${params.novelId}/${id}`)
      window.scrollTo(0, 100);
      updateShelf(id)
      addLog(id)
    }
  }

  const nextChapter = async () => {
    if (parseInt(params.id, 10) + 1 === -1) {
      message.warning('已经是最后一章了')
    } else {
      const id = parseInt(params.id, 10) + 1
      await dispatch(fetchChapterInfo({ novelId: params.novelId, id: id }))
      navigate(`/chapter/${params.novelId}/${id}`)
      window.scrollTo(0, 100);
      updateShelf(id)
      addLog(id)
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

  useEffect(() => {
    updateShelf(params.id)
    addLog(params.id)
  }, [userInfo.id])

  return (
    <div className="chapter">
      <Guidebar chapterInfo={chapterInfo} />
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
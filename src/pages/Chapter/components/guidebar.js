import React, { useEffect, useState } from "react";
import { UnorderedListOutlined, BookOutlined, CommentOutlined, DownOutlined } from '@ant-design/icons'
import { Modal, Button, Drawer, message } from 'antd'
import { useDispatch, useSelector } from "react-redux";
import { fetchChapterList } from "@/store/modules/chapter";
import { useNavigate, useParams } from "react-router-dom";
import Contents from "@/components/Contents/contents";
import BookDisplay from "./bookDisplay";
import { fetchNovelInfo } from "@/store/modules/novel";
import ForumPost from "@/components/ForumPost/forumPost";
import Comments from "@/components/Comments/comments";
import { getCommentAPI, postCommentAPI } from "@/apis/comment";
import { fetchComments, setComments } from "@/store/modules/comment";

const Guidebar = ({ chapterInfo }) => {
  const [contents, setContents] = useState(false);
  const [drawer, setDrawer] = useState(false)
  const [size, setSize] = useState()
  const [page, setPage] = useState(1)
  const [isBottom, setIsBottom] = useState(false)
  const [isNull, setIsNull] = useState(false)
  const dispatch = useDispatch()
  const chapterList = useSelector(state => state.chapter.chapterList)
  const novelInfo = useSelector(state => state.novel.novelInfo)
  const userId = useSelector(state => state.user.userInfo.id)
  const comments = useSelector(state => state.comment.comments)
  const params = useParams()
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate(`/detail/${params.novelId}`)
    window.scrollTo(0, 100)
  }

  const showLargeDrawer = () => {
    setSize('large')
    setDrawer(true)
    dispatch(fetchComments({ chapterId: chapterInfo.chapter?.id, page: page }))
  }

  const handlePost = async (values) => {
    if (values.comment && values.comment !== '') {
      values['novelId'] = params.novelId
      values['chapterId'] = chapterInfo.chapter?.id
      values['userId'] = userId
      await postCommentAPI(values)
      dispatch(fetchComments({ chapterId: chapterInfo.chapter?.id }))
      setIsNull(false)
    } else {
      message.warning("请先输入内容！")
    }
  }

  const handleMore = async () => {
    if ((page + 1) * 4 <= comments.total) {
      setPage(page + 1)
      const res = await getCommentAPI({ chapterId: chapterInfo.chapter?.id, page: page })
      const data = [...comments.comment, ...res.data.data.comment]
      dispatch(setComments({ ...comments, comment: data }))
    } else {
      setIsBottom(true)
    }
  }

  useEffect(() => {
    dispatch(fetchChapterList({ id: params.novelId }))
    dispatch(fetchNovelInfo({ id: params.novelId }))
  }, [dispatch])

  useEffect(() => {
    if (comments.total === 0) {
      setIsNull(true)
    }
  }, [comments])

  return (
    <div className="guidebar">
      <Button onClick={() => setContents(true)}>
        <UnorderedListOutlined className='icon' />
        <span className='text'>目录</span>
      </Button>
      <Modal
        title={<BookDisplay item={novelInfo.novel} />}
        centered
        open={contents}
        onOk={() => setContents(false)}
        onCancel={() => setContents(false)}
        width={1000}
        className="modal"
      >
        <Contents chapterList={chapterList} id={params.novelId} />
      </Modal>
      <Button onClick={handleDetail} >
        <BookOutlined className='icon' />
        <span className='text'>详情</span>
      </Button>
      <Button onClick={showLargeDrawer} >
        <CommentOutlined className='icon' />
        <span className='text'>讨论</span>
      </Button>
      <Drawer
        title="章节评论"
        placement="right"
        size={size}
        onClose={() => setDrawer(false)}
        open={drawer}
      >
        <ForumPost handlePost={handlePost} />
        {isNull ? (<div className="comment_more">
          暂时还没有评论，快来抢占沙发~~
        </div>) : (
          <>
            <div className="comments_list">
              {comments.comment?.map((item, index) => (
                <Comments comments={item} key={index} />
              ))}
            </div>
            <div className="comment_more" onClick={handleMore}>
              {isBottom ? '已经到底了~~' : (<>查看更多< DownOutlined /></>)}
            </div>
          </>
        )}
      </Drawer>
    </div>
  )
}

export default Guidebar
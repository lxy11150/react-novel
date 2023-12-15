import React, { useEffect, useState } from "react";
import Comments from "@/components/Comments/comments";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllComments, setComments } from "@/store/modules/comment";
import { useParams } from "react-router-dom";
import { getAllCommentAPI } from "@/apis/comment";
import { DownOutlined } from '@ant-design/icons'

const Forum = () => {
  const [page, setPage] = useState(1)
  const [isBottom, setIsBottom] = useState(false)
  const [isNull, setIsNull] = useState(false)
  const comments = useSelector(state => state.comment.comments)
  const dispatch = useDispatch()
  const param = useParams()

  const handleMore = async () => {
    if ((page + 1) * 4 <= comments.total) {
      setPage(page + 1)
      const res = await getAllCommentAPI({ novelId: param.id, page: page })
      const data = [...comments.comment, ...res.data.data.comment]
      dispatch(setComments({ ...comments, comment: data }))
    } else {
      setIsBottom(true)
    }
  }

  useEffect(() => {
    if (comments?.total === 0) {
      setIsNull(true)
    }
  }, [comments])

  useEffect(() => {
    dispatch(fetchAllComments({ novelId: param.id, page: page }))
  }, [])

  return (
    <div className="detail_forum">
      <div className="detail_forum_title">
        <span id="name">我有一剑</span>
        <span id="info">
          <i>全部帖子</i>
          <i>{comments?.total}</i>
        </span>
      </div>
      <div className="detail_forum_list">
        {isNull ? (<div className="comment_more">
          暂时还没有评论，快来抢占沙发~~
        </div>) : (
          <>
            <div className="comments_list">
              {comments && comments.comment?.map((item, index) => (
                <Comments comments={item} key={index} />
              ))}
            </div>
            <div className="comment_more" onClick={handleMore}>
              {isBottom ? '已经到底了~~' : (<>查看更多< DownOutlined /></>)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Forum
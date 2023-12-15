//与评论内容相关的状态管理

import { getAllCommentAPI, getCommentAPI } from "@/apis/comment"
import { createSlice } from "@reduxjs/toolkit"

const CommentStore = createSlice({
  name: 'comment',
  initialState: {
    comments: []
  },
  reducers: {
    setComments(state, action) {
      state.comments = action.payload
    }
  }
})

const fetchComments = (params) => {
  return async (dispatch) => {
    const res = await getCommentAPI(params)
    console.log(res.data);
    dispatch(setComments(res.data.data))
  }
}

const fetchAllComments = (params) => {
  return async (dispatch) => {
    const res = await getAllCommentAPI(params)
    console.log(res.data);
    dispatch(setComments(res.data.data))
  }
}

const { setComments } = CommentStore.actions

const commentReducer = CommentStore.reducer

export { setComments, fetchComments, fetchAllComments }

export default commentReducer
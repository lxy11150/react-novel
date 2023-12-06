//与小说章节内容相关的状态管理

import { chapterInfoAPI, chapterListAPI } from "@/apis/chapter"
import { createSlice } from "@reduxjs/toolkit"

const chapterStore = createSlice({
  name: 'chapter',
  initialState: {
    chapterInfo: {},
    chapterList: []
  },
  reducers: {
    setChapterInfo(state, action) {
      state.chapterInfo = action.payload
    },
    setChapterList(state, action) {
      state.chapterList = action.payload
    }
  }
})

const fetchChapterInfo = (params) => {
  return async (dispatch) => {
    const res = await chapterInfoAPI(params)
    console.log(res.data);
    dispatch(setChapterInfo(res.data.data))
  }
}

const fetchChapterList = (params) => {
  return async (dispatch) => {
    const res = await chapterListAPI(params)
    console.log(res.data);
    dispatch(setChapterList(res.data.data))
  }
}

const { setChapterInfo, setChapterList } = chapterStore.actions

const chapterReducer = chapterStore.reducer

export { setChapterInfo, setChapterList, fetchChapterInfo, fetchChapterList }

export default chapterReducer
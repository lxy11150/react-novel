// 和小说数据展示相关的状态管理

import { novelInfoAPI, novelPageAPI, novelRandomAPI } from "@/apis/novel"
import { createSlice } from "@reduxjs/toolkit"
import { message } from "antd"

const novelStore = createSlice({
  name: 'novel',
  initialState: {
    novelRandom: [],
    novelPage: [],
    pageTotal: 0,
    novelInfo: {} //小说的详细信息
  },
  reducers: {
    setNovelRandom(state, action) {
      state.novelRandom = action.payload
    },
    setnovelPage(state, action) {
      state.novelPage = action.payload
    },
    setpageTotal(state, action) {
      state.pageTotal = action.payload
    },
    setnovelInfo(state, action) {
      state.novelInfo = action.payload
    }
  }
})

const fetchNovelRandom = () => {
  return async (dispatch) => {
    const res = await novelRandomAPI()
    dispatch(setNovelRandom(res.data.data))
  }
}

const fetchNovelPage = (params) => {
  return async (dispatch) => {
    const res = await novelPageAPI(params)
    console.log(res.data);
    if (res.data.code === 200) {
      dispatch(setnovelPage(res.data.data.rows))
      dispatch(setpageTotal(res.data.data.total))
    } else {
      message.error('服务器繁忙，请稍后重试！')
    }
  }
}

const fetchNovelInfo = (params) => {
  return async (dispatch) => {
    const res = await novelInfoAPI(params)
    console.log(res.data);
    if (res.data.code === 200) {
      dispatch(setnovelInfo(res.data.data))
    } else {
      message.error('服务器繁忙，请稍后重试！')
    }
  }
}

const {
  setNovelRandom,
  setpageTotal,
  setnovelPage,
  setnovelInfo
} = novelStore.actions

const novelReducer = novelStore.reducer

export {
  setNovelRandom,
  setnovelPage,
  setpageTotal,
  setnovelInfo,
  fetchNovelRandom,
  fetchNovelPage,
  fetchNovelInfo
}

export default novelReducer
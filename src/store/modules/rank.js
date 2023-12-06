//小说排名相关的状态管理
import { novelRankAPI } from "@/apis/novel"
import { createSlice } from "@reduxjs/toolkit"

const rankStore = createSlice({
  name: 'rank',
  initialState: {
    rankList: {},
  },
  reducers: {
    setRankList(state, action) {
      state.rankList = action.payload
      console.log(state.rankList);
    }
  }
})

const fetchRankList = (params) => {
  return async (dispatch) => {
    const res = await novelRankAPI(params)
    console.log(res.data);
    dispatch(setRankList(res.data.data))
  }
}

const { setRankList } = rankStore.actions

const rankReducer = rankStore.reducer

export { setRankList, fetchRankList }

export default rankReducer
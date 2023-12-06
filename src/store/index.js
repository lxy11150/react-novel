import { configureStore } from "@reduxjs/toolkit"
//导入子模块reducer
import userReducer from "./modules/user"
import novelReducer from "./modules/novel"
import rankReducer from "./modules/rank"
import chapterReducer from "./modules/chapter"

const store = configureStore({
  reducer: {
    user: userReducer,
    novel: novelReducer,
    rank: rankReducer,
    chapter: chapterReducer
  }
})

export default store
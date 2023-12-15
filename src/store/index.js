import { configureStore } from "@reduxjs/toolkit"
//导入子模块reducer
import userReducer from "./modules/user"
import novelReducer from "./modules/novel"
import rankReducer from "./modules/rank"
import chapterReducer from "./modules/chapter"
import commentReducer from "./modules/comment"

const store = configureStore({
  reducer: {
    user: userReducer,
    novel: novelReducer,
    rank: rankReducer,
    chapter: chapterReducer,
    comment: commentReducer
  }
})

export default store
import { configureStore } from "@reduxjs/toolkit"
//导入子模块reducer
import userReducer from "./modules/user"

const store = configureStore({
  reducer: {
    user: userReducer
  }
})

export default store
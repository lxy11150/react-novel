//和用户相关的状态管理

import { createSlice } from "@reduxjs/toolkit"
import { loginAPI, userInfoAPI } from "@/apis/user"
import { getToken, setToken as _setToken, removeToken } from '@/utils'

const userStore = createSlice({
  name: 'user',
  //初始化state
  initialState: {
    token: getToken() || '',
    userInfo: {}
  },
  //修改状态的方法，同步方法，支持直接修改
  reducers: {
    setToken(state, action) {
      state.token = action.payload
      //token持久化
      _setToken(action.payload)
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload
    },
    clearUserInfo(state) {
      state.token = ''
      state.userInfo = {}
      removeToken()
    }
  }
})

//解构出来actionCreater函数
const { setToken, setUserInfo, clearUserInfo } = userStore.actions

//获取reducer
const userReducer = userStore.reducer

//异步方法，完成登录获取token
const fentchLogin = (loginForm) => {
  return async (dispatch) => {
    //1. 发送异步请求
    const res = await loginAPI(loginForm)
    //2. 提交同步action进行token的存入
    dispatch(setToken(res.data.data))
  }
}

//异步方法，完成登录获取个人用户信息
const fentchUserInfo = () => {
  return async (dispatch) => {
    //1. 发送异步请求
    const res = await userInfoAPI()
    //2. 提交同步action进行token的存入
    dispatch(setUserInfo(res.data.data))
  }
}

//以按需导出的方式导出actionCreater
export { fentchLogin, fentchUserInfo, clearUserInfo, setToken }

//以默认导出的方式导出reducer
export default userReducer
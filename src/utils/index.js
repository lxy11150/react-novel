//统一中转模块函数
//import {request} from "@/utils"

import { request } from "./request"
import { getToken, setToken, removeToken } from './token'
import { setSession, getSession, removeSession } from "./session"
import { barnerImagesData3 } from "./scenery"

export {
  request,
  getToken,
  setToken,
  removeToken,
  setSession,
  getSession,
  removeSession,
  barnerImagesData3
}
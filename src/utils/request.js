//axios封装处理
import axios from "axios"
import { getToken, removeToken } from "./token"
import router from "@/router"
//1. 根域名配置
//2. 超时时间
//3. 请求拦截器 / 响应拦截器

const request = axios.create({
  baseURL: 'http://localhost:3000/php',
  timeout: 5000
})

//请求拦截器
request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

//响应拦截器
axios.interceptors.response.use((response) => {
  //2xx 范围内的状态码都会触发该函数
  return response
}, (error) => {
  //超出2xx 范围内的状态码都会触发该函数

  // 监控401 token失效
  if (error.response.code === 401) {
    removeToken()
    router.navigate('/login')
    window.location.reload()
  }
  return Promise.reject(error)
})

export { request }
//用户相关的所有请求

import { request } from "@/utils";


//1. 注册请求
export function registerAPI(formData) {
  return request({
    url: 'register.php',
    method: 'POST',
    data: formData
  })
}

//2. 登录请求
export function loginAPI(formData) {
  return request({
    url: 'login.php',
    method: 'POST',
    data: formData
  })
}

//3. 获取用户个人信息
export function userInfoAPI() {
  return request({
    url: 'userProfile.php',
    method: 'GET'
  })
}
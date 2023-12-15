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

//4. 更新用户的基本信息
export function updateUserAPI(formData) {
  return request({
    url: 'user/update.php',
    method: 'PUT',
    data: formData
  })
}

//5. 修改用户的密码
export function updatePasswordAPI(formData) {
  return request({
    url: 'user/password.php',
    method: 'PUT',
    data: formData
  })
}
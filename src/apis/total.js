// 与用户总览数据相关的请求

import { request } from "@/utils"

//1. 获取用户总览数据的接口
export const getTotalAPI = (params) => {
  return request({
    url: 'total/getTotal.php',
    method: 'GET',
    params: params
  })
}

//2. 获取我的动态数据的接口
export const getMyActiveAPI = (params) => {
  return request({
    url: 'total/myActive.php',
    method: 'GET',
    params: params
  })
}

//3. 获取我的书架的接口
export const getMyShelfAPI = (params) => {
  return request({
    url: 'total/myShelf.php',
    method: 'GET',
    params: params
  })
}

//4. 获取我的推荐的接口
export const getMyRecommendAPI = (params) => {
  return request({
    url: 'total/myRecommend.php',
    method: 'GET',
    params: params
  })
}
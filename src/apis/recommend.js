// 与推荐相关的请求

import { request } from "@/utils"

//1. 添加推荐的接口
export const AddRecommendAPI = (data) => {
  return request({
    url: 'recommend/advise.php',
    method: 'POST',
    data: data
  })
}

//2. 判断小说是否存在的接口
export const existRecommendAPI = (params) => {
  return request({
    url: 'recommend/exist.php',
    method: 'GET',
    params: params
  })
}

//3. 查询我的推荐的数据的接口
export const myRecommendAPI = (params) => {
  return request({
    url: 'recommend/myRecommend.php',
    method: 'GET',
    params: params
  })
}
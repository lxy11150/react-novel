//小说展示相关的所有请求

import { request } from "@/utils";

//1. 请求随机小说数据
export const novelRandomAPI = () => {
  return request({
    url: 'novel/novelRandom.php',
    method: 'GET'
  })
}

//2. 分页查询小说列表
export const novelPageAPI = (params) => {
  return request({
    url: 'novel/novelPage.php',
    method: 'GET',
    params: params
  })
}

//3. 查询小说排名
export const novelRankAPI = (params) => {
  return request({
    url: 'novel/novelRank.php',
    method: 'GET',
    params: params
  })
}

//4. 根据小说的id返回小说信息
export const novelInfoAPI = (params) => {
  return request({
    url: 'novel/novelInfo.php',
    method: 'GET',
    params: params
  })
}
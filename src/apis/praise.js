// 与点赞相关的所有请求

import { request } from "@/utils"

//1. 查询获赞情况的接口
export const queryPraiseAPI = (params) => {
  return request({
    url: 'praise/query.php',
    method: 'GET',
    params: params
  })
}

//2. 取消点赞
export const deletePraiseAPI = (data) => {
  return request({
    url: 'praise/delete.php',
    method: 'DELETE',
    data: data
  })
}
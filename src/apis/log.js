//与日志有关的所有请求

import { request } from "@/utils"

//1. 添加阅读日志的接口
export const addLogAPI = (data) => {
  return request({
    url: 'log/add.php',
    method: 'POST',
    data: data
  })
}

//2. 查询阅读日志记录
export const findLogAPI = (params) => {
  return request({
    url: 'log/getById.php',
    method: 'GET',
    params: params
  })
}
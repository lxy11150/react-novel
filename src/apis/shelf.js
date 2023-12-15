//书架信息的相关请求

import { request } from "@/utils";

//1. 将小说加入书架
export const addShelfAPI = (data) => {
  return request({
    url: 'shelf/add.php',
    method: 'POST',
    data: data
  })
}

//2. 获取该小说是否加入书架的状态
export const existShelfAPI = (data) => {
  return request({
    url: 'shelf/exist.php',
    method: 'POST',
    data: data
  })
}

//3. 根据用户id获取书架情况
export const findByUserId = (params) => {
  return request({
    url: 'shelf/getById.php',
    method: 'GET',
    params: params
  })
}

//4. 更新用户现在读的小说进度
export const updateAPI = (data) => {
  return request({
    url: 'shelf/update.php',
    method: 'PUT',
    data: data
  })
}

//5. 删除书架信息
export const deleteAPI = (data) => {
  return request({
    url: 'shelf/delete.php',
    method: 'DELETE',
    data: data
  })
}
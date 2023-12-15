//与评论有关的所有请求
import { request } from "@/utils"

//1. 发送评论的接口
export const postCommentAPI = (formData) => {
  return request({
    url: 'comment/post.php',
    method: 'POST',
    data: formData
  })
}

//2. 获取该章节评论的接口
export const getCommentAPI = (params) => {
  return request({
    url: 'comment/getComment.php',
    method: 'GET',
    params: params
  })
}

//3. 获取改小说的所有评论的接口
export const getAllCommentAPI = (params) => {
  return request({
    url: 'comment/getAllComment.php',
    method: 'GET',
    params: params
  })
}

//4. 根据用户id获取评论的接口
export const getCommentByUserIdAPI = (params) => {
  return request({
    url: 'comment/findByUserId.php',
    method: 'GET',
    params: params
  })
}

//5. 根据用户id删除评论的接口
export const deleteCommentAPI = (data) => {
  return request({
    url: 'comment/deleteComment.php',
    method: 'DELETE',
    data: data
  })
}

//6. 根据用户id获取回帖信息的接口
export const getReplyByUserIdAPI = (params) => {
  return request({
    url: 'comment/findReply.php',
    method: 'GET',
    params: params
  })
}

//7. 根据用户id删除回帖的接口
export const deleteReplyAPI = (data) => {
  return request({
    url: 'comment/deleteReply.php',
    method: 'DELETE',
    data: data
  })
}
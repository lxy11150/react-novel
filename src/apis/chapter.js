//和小说章节相关的所有请求

import { request } from "@/utils";

//获取当前章节内容的接口
export const chapterInfoAPI = (params) => {
  return request({
    url: 'chapter/chapterInfo.php',
    method: 'GET',
    params: params
  })
}

//获取小说所有章节信息的接口
export const chapterListAPI = (params) => {
  return request({
    url: 'chapter/chapterList.php',
    method: 'GET',
    params: params
  })
}
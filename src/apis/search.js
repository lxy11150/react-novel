//Lucene检索的接口

import axios from "axios"

//1. 关键词检索请求
export function LuceneAPI(params) {
  return axios.get('http://localhost:8080/search', {
    params
  })
}
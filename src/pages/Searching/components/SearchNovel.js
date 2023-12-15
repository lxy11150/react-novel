import React from 'react'
import SearchBox from '@/components/SearchBox/search';

const SearchNovel = ({ count, keys, data }) => {
  return (
    <>
      <div className="search_novel" >
        <div className="search_tips">
          共搜索到
          <span id="dom_resnum">{count}</span>
          部与“
          <span id="queryword">{keys}</span>
          ”相关结果
        </div>
        <div className="search_list">
          {data?.map((item, index) => (
            <SearchBox item={item} key={index} />
          ))}
        </div>
        
      </div>
      <div className="search_other">

      </div>
    </>
  )
}

export default SearchNovel
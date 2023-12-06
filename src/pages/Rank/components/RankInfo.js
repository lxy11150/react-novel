import BookBox from '@/components/BookBox/bookBox'
import RankNum from '@/components/RankNum'
import React from 'react'

const RankInfo = ({ item, index, text }) => {

  return (
    <div className="rank_content_body_item">
      <RankNum index={index} />
      <BookBox item={item} />
      <div className="rank_item_btn">
        <div className="btn_top_text">
          <span>{item.data}</span>
          <em>{text}</em>
        </div>
        <div className="btn_read">
          书籍详情
        </div>
        <div className="add_shelf">
          加入书架
        </div>
      </div>
    </div>
  )
}

export default RankInfo
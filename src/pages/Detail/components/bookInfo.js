import CloudRainAnimation from '@/components/CloudRainAnimation'
import React from 'react'
import { Link } from 'react-router-dom'

const BookInfo = ({ novelInfo, chapter, index, id }) => {
  return (
    <div className="book_information">
      {/* 图片模块 */}
      <div className="book_info_image book_shadow">
        <div className="image_cover book_frame">
          <img src={novelInfo.novel?.url} alt="" className='animation-img' />
        </div>
        <div className="book_info_shadow global_radius"></div>
      </div>
      {/* 小说情况介绍 */}
      <div className="book_info_content">
        <div className="book_info_title">
          <span>{novelInfo.novel?.book}</span>
        </div>
        <div className="book_info_tags">
          <span className='publish'>{novelInfo.novel?.publish}</span>
          <span className='type'>{novelInfo.novel?.type}</span>
          <span className='author'>{novelInfo.novel?.author}</span>
        </div>
        <div className="book_info_num">
          <div className='num_item'>
            <span className='number'>{novelInfo.rank?.click}</span>
            <span className='total'>总点击数</span>
          </div>
          <div className='num_item'>
            <span className='number'>{novelInfo.rank?.recommend}</span>
            <span className='total'>总推荐数</span>
          </div>
          <div className='num_item'>
            <span className='number'>{novelInfo.rank?.likes}</span>
            <span className='total'>总点赞数</span>
          </div>
          <div className='num_item'>
            <span className='number'>{novelInfo.novel?.words.match(/\d+/)}</span>
            <span className='words'>万字数</span>
          </div>
        </div>
        <div className="book_info_chapter">
          <div className="chapter_name ellipsis">
            <span>最新章节：</span>
            <Link to={`/chapter/${id}/${index}`} target='_blank'>{chapter}</Link>
          </div>
        </div>
        <div className="book_info_btn">
          <div className="btn_read" onClick={() => window.open(`/chapter/${id}/0`, '_blank')}>
            立即阅读
          </div>
          <div className="add_shelf">
            加入书架
          </div>
        </div>
      </div>
    </div >
  )
}

export default BookInfo
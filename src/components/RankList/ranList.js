import React, { useState } from 'react'
import { RightOutlined } from '@ant-design/icons'
import './rankList.scss'
import RankNum from '../RankNum'

const RankList = ({ rank, img }) => {
  const [activate, setActivate] = useState(0)

  const handleActivate = (index) => {
    setActivate(index)
  }

  return (
    <div className="rank_list" style={{ backgroundImage: `url(${img})` }}>
      {rank?.map((item, index) => (
        <div className="rank_list_info" onMouseEnter={() => handleActivate(index)} key={index}>
          <RankNum index={index} />
          {index !== activate ? <div className="info_title global">
            <div className='title_text ellipsis'>
              <span>{item.book}</span>
            </div>
            <div className="title_default">
              {item.data}
            </div>
          </div> : <div className="info_box">
            <div className="box_title">
              <div className='ellipsis global'>
                <span onClick={() => window.open(`/detail/${item.id}`, '_blank')}>{item.book}</span>
              </div>
              <div className="title_content">
                <span>{item.author}</span>
                <div className="content_default">
                  <span>
                    <em>{item.words}</em>
                  </span>
                </div>
              </div>
            </div>
            <div className="box_img">
              <div className="img_container book_frame global_radius">
                <img src={item.url} alt={item.book} onClick={() => window.open(`/detail/${item.id}`, '_blank')} />
              </div>
            </div>
          </div>}
        </div>
      ))}
      <div className="rank_list_more global">
        <span>更多<RightOutlined /></span>
      </div>
    </div>
  )
}

export default RankList
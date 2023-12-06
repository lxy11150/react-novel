import React from "react";
import first from '@/assets/first.png'
import second from '@/assets/second.png'
import third from '@/assets/third.png'

const RankNum = ({ index }) => {
  return (
    <div className="info_num">
      {index < 3 ?
        <img src={index === 0 ? first : (index === 1 ? second : third)} alt="第一" />
        : <span className='num'>{index + 1}</span>}
    </div>
  )
}

export default RankNum
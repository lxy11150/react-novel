import React from "react"
import { Link } from "react-router-dom"

const Contents = ({ chapterList, id }) => {
  return (
    <div className="contents">
      <div className="chapter_list_title">
        <span className="chapter_name">正文</span>
        <span className="chapter_info">{`共${chapterList.length}章`}</span>
      </div>
      <div className="chapter_list">
        <ul>
          {chapterList?.map((item, index) => (
            <li key={index}>
              <Link to={`/chapter/${id}/${index}`} target='_blank'>{item}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div >
  )
}

export default Contents
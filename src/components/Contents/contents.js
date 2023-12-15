import React from "react"
import { Link, useNavigate } from "react-router-dom"
import './contents.scss'

const Contents = ({ chapterList, id, target }) => {
  const navigate = useNavigate()

  const handleReload = (index) => {
    if (target === '_blank') {
      window.open(`/chapter/${id}/${index}`, '_blank')
    } else {
      navigate(`/chapter/${id}/${index}`)
      window.location.reload()
      window.scrollTo(0, 100)
    }
  }

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
              <Link onClick={() => handleReload(index)}>{item}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div >
  )
}

export default Contents
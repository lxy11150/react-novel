import React from 'react'
import { RightOutlined } from '@ant-design/icons'
import RichText from '@/components/RichText'
import { Link } from 'react-router-dom'

const ArticleIntroduce = ({ chapter, profile, content, id }) => {
  return (
    <div className="article">
      <div className="article_introduction">
        {profile}
      </div>
      <div className="article_content">
        <div className="content_title">
          {chapter}
        </div>
        <div className="content_word">
          <RichText richTextContent={content} />
        </div>
        <div className="more_btn">
          <Link to={`/chapter/${id}/1`} target='_blank'>
            <span >继续阅读</span>
            <RightOutlined />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ArticleIntroduce
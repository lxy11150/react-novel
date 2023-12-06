import React from "react";

const ChapterTitle = ({ chapterInfo }) => {
  return (
    <div className="chapter_title">
      <h1>{chapterInfo.chapter?.title}</h1>
      <div className="chapter_info">
        <ul>
          <li>
            <span className="weight">作者：</span>
            <span className="gray">{chapterInfo.chapter?.author}</span>
          </li>
          <li>
            <span className="weight">字数：</span>
            <span className="gray">{chapterInfo.chapter?.words}</span>
          </li>
          <li>
            <span className="weight">书名：</span>
            <span className="gray">{chapterInfo.name}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ChapterTitle
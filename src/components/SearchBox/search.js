import React from 'react'
import './search.scss'
import { Link } from 'react-router-dom'
import RichText from '../RichText'

const SearchBox = ({ item }) => {
  return (
    <div className="search_box">
      <div className="imgbox">
        <Link to={`/detail/${item.id}`}>
          <div className="book_img">
            <div className="img_container book_frame global_radius">
              <img src={item.url} alt={item.book} />
            </div>
          </div>
        </Link>
      </div>
      <div className="infobox">
        <h3 className='book_name'>
          <Link to={`/detail/${item.id}`}>
            <RichText richTextContent={item.book} />
          </Link>
        </h3>
        <div className="search_info">
          <RichText richTextContent={item.author} />
          <em>|</em>
          <RichText richTextContent={item.type}></RichText>
          <em>|</em>
          <RichText richTextContent={item.publish} />
          <em>|</em>
          <RichText richTextContent={item.words}></RichText>
        </div>
        <div className="search_profile">
          <RichText richTextContent={item.profiles} />
        </div>
      </div>
      <div className="btnbox">
        <Link to={`/chapter/${item.id}/0`} className='read'>立即阅读</Link>
        <Link className='add_shelf'>加入书架</Link>
      </div>
    </div>
  )
}

export default SearchBox
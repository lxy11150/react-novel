import React from "react";
import { useNavigate } from "react-router-dom";
import { RightOutlined } from '@ant-design/icons'

const BookDisplay = ({ item }) => {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate(`/detail/${item?.id}`)
    window.scrollTo(0, 100);
  }
  return (
    <div className="book_display">
      <div className="book_img">
        <div className="img_container book_frame global_radius">
          <img src={item?.url} alt={item?.book} onClick={handleDetail} />
        </div>
      </div>
      <div className="display_info">
        <div className="display_book" onClick={handleDetail}>
          {item?.book}
          <RightOutlined />
        </div>
        <div className="display_author">
          {item?.author}
        </div>
      </div>
    </div>
  )
}

export default BookDisplay
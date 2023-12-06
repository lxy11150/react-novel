import { useNavigate } from 'react-router-dom'
import './bookBox.scss'

const BookBox = ({ item }) => {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate(`/detail/${item.id}`)
    window.scrollTo(0, 100);
  }

  return (
    <div className="book_box">
      <div className="book_img">
        <div className="img_container book_frame global_radius">
          <img src={item.url} alt={item.book} onClick={handleDetail} />
        </div>
      </div>
      <div className="book_info">
        <div className="info_title cursor ellipsis">
          <span onClick={handleDetail}>{item.book}</span>
        </div>
        <div className="info_keywords ellipsis">
          <span className='cursor'>{item.author}</span>
          <span>·</span>
          <span className='cursor'>{item.type}</span>
          <span>·</span>
          <span className='cursor_default'>{item.publish}</span>
          <span>·</span>
          <span className='cursor_default'>{item.words}</span>
        </div>
        <div className="info_profile two_line_ellipsis">{item.profiles}</div>
      </div>
    </div>
  )
}

export default BookBox
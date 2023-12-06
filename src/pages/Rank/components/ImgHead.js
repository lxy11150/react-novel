import likes from '@/assets/likes_head.png'
import finish from '@/assets/finish_head.png'
import collect from '@/assets/collect_head.png'
import click from '@/assets/click_head.png'
import platform from '@/assets/platform_head.png'
import recommend from '@/assets/recommend_head.png'

const img = {
  'likes': likes,
  'finish': finish,
  'collect': collect,
  'click': click,
  'platform': platform,
  'recommend': recommend
}

const ImgHead = ({ nav }) => {
  return (
    <img src={img[nav]} alt={nav} />
  )
}

export default ImgHead
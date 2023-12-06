import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import news from '@/assets/new.png'
import hot from '@/assets/hot.png'
import _ from 'lodash'
import BookBox from '@/components/BookBox/bookBox';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNovelRandom } from '@/store/modules/novel';
import './index.scss'
import { useNavigate } from 'react-router-dom';
import RankNum from '@/components/RankNum';
import { fetchRankList } from '@/store/modules/rank';

const rank = [
  {
    book: '我有一剑',
    author: '青鸾峰上',
    url: 'https://static.zongheng.com/upload/s_image/cover/17/29/172958f65419e178bce12b92529bbaa91698937334220.jpeg',
    type: '玄幻',
    profiles: '我有一剑，出鞘即无敌！',
    publish: '连载',
    words: '448万字'
  },
  {
    book: '踏星',
    author: '随散飘风',
    url: 'https://static.zongheng.com/upload/s_image/cover/28/37/2837cd5bb6d28b503003f5fc9f3116f41698936812338.jpeg',
    type: '科幻',
    profiles: '浩瀚宇宙，无尽种族！恢弘战技，十决横空！远古独姓，百强战榜！以我之名，脚踏星空！2200年的一天，当人类第一次登上海王星，看到的是一柄战刀和一具站立的尸体！！！已有完结老书《末日之无上王座》三百多万字，从未断更，人品保证！！',
    publish: '连载',
    words: '1459万字'
  },
  {
    book: '剑道第一仙',
    author: '萧瑾瑜',
    url: 'https://static.zongheng.com/upload/s_image/cover/d4/89/d489fc268136fed1dc6087a18b997e7f.jpeg',
    type: '玄幻',
    profiles: '我是万古人间一剑修，诸天之上第一仙。同名动画《剑道第一仙》已上映已有完本作品《符皇》《天骄战纪》公众号：xiaojinyu233',
    publish: '连载',
    words: '950万字'
  },
  {
    book: '剑来',
    author: '烽火戏诸侯',
    url: 'https://static.zongheng.com/upload/s_image/cover/30/93/309398098f69f213f12b55ccac40ffac1698936785435.jpeg',
    type: '仙侠',
    profiles: '大千世界，无奇不有。我陈平安，唯有一剑，可搬山，倒海，降妖，镇魔，敕神，摘星，断江，摧城，开天！我叫陈平安，平平安安的平安。我是一名剑客。',
    publish: '连载',
    words: '1171万字'
  },
  {
    book: '万相之王',
    author: '天蚕土豆',
    url: 'https://static.zongheng.com/upload/s_image/cover/d9/7a/d97ad7ce5ee055ec511d667bc5167cb1.jpeg',
    type: '玄幻',
    profiles: '天地间有万相，我李洛，终将成为那万相之王。',
    publish: '连载',
    words: '279万字'
  },
  {
    book: '太荒吞天诀',
    author: '铁马飞桥',
    url: 'https://static.zongheng.com/upload/s_image/cover/c8/d5/c8d545efb4fbbf14219b7f5f545a7b62.jpeg',
    type: '玄幻',
    profiles: '十大仙帝之一，因得重宝吞天神鼎，遭围攻惨死；携神鼎重生归来，吞四海，容八荒…一代邪神，踏天血洗仙界！关注微信公众号搜索：《铁马飞桥》点击关注，不定时有剧情方面的更新！公布一个群号：224382518',
    publish: '连载',
    words: '1009万字'
  },
  {
    book: '盖世人王',
    author: '一叶青天',
    url: 'https://static.zongheng.com/upload/s_image/cover/ce/fb/cefb563634302776ede2bfa4b6bfd67c1689928464759.jpeg',
    type: '仙侠',
    profiles: '少年钧天得神秘瓦罐，获上古起源传承，持逆天神剑，修无敌神通，带领人族部落，闯禁区，踏星坟，剑之所向，万族臣服！（《撼天》《盖世帝尊》《帝道独尊》《盖世人王》青天的第四部小说）千世界，无奇不有。我陈平安，唯有一剑，可搬山，倒海，降妖，镇魔，敕神，摘星，断江，摧城，开天！我叫陈平安，平平安安的平安。我是一名剑客。',
    publish: '连载',
    words: '597万字'
  },
  {
    book: '武夫',
    author: '平生未知寒',
    url: 'https://static.zongheng.com/upload/s_image/cover/64/09/640951670b623020e7848b8e2cfa41bf.jpeg',
    type: '玄幻',
    profiles: '人间万里，妖邪遍地。人命如草芥，众生似猪狗。“这个世道该变一变了。”那个少年站在渭水畔，开口笑道：“人间有妖，我有刀。“',
    publish: '连载',
    words: '283万字'
  }
]

const Home = () => {
  const [trending, setTrending] = useState([
    {
      content: "2022年9月1日",
      url: "http://localhost:3001/",
      submitTime: "2023-12-08 8:00",
      tag: "new"
    },
    {
      content: "2022年9月1日 新福利",
      url: "http://localhost:3001/",
      submitTime: "2023-11-01 8:00",
      tag: "new"
    },
    {
      content: "2022年9月1日 新福利上线",
      url: "http://localhost:3001/",
      submitTime: "2023-12-01 8:00",
      tag: "new"
    },
    {
      content: "2022年9月1日 新福利上线",
      url: "http://localhost:3001/",
      submitTime: "2023-12-01 8:00",
      tag: "hot"
    },
    {
      content: "2022年9月1日 新福利上线",
      url: "http://localhost:3001/",
      submitTime: "2023-12-01 8:00",
      tag: "hot"
    },
    {
      content: "2022年9月1日 新福利上线",
      url: "http://localhost:3001/",
      submitTime: "2023-12-01 8:00",
      tag: "hot"
    },
    {
      content: "2022年9月1日 新福利上线",
      url: "http://localhost:3001/",
      submitTime: "2023-12-01 8:00",
      tag: "hot"
    },
    {
      content: "2022年9月1日 新福利上线",
      url: "http://localhost:3001/",
      submitTime: "2023-12-01 8:00",
      tag: "hot"
    },
  ])
  const [box, setBox] = useState(-1)
  const dispatch = useDispatch()
  const novelRandom = useSelector(state => state.novel.novelRandom)
  const novelInfo = useSelector(state => state.rank.rankList)
  const navigate = useNavigate()

  const handleBox = (index) => {
    setBox(index)
  }

  const handlMore = () => {
    navigate('/rank')
  }

  useEffect(() => {
    setTrending(_.orderBy(trending, 'submitTime'))
    dispatch(fetchRankList({ nav: 'likes' }))
  }, [])

  //获取小说列表信息
  useEffect(() => {
    dispatch(fetchNovelRandom())
  }, [dispatch])

  return (
    <div className="home">
      <div className="home_carousel">
        <Carousel effect="fade" autoplay className='carousel'>
          <div>
            <a href="https://www.zongheng.com/detail/1171191" target='_blank' className='bc1'></a>
          </div>
          <div>
            <a href="https://huayu.zongheng.com/book/1235701.html" target='_blank' className='bc2'></a>
          </div>
          <div>
            <a href="https://www.zongheng.com/detail/1230106" target='_blank' className='bc3'></a>
          </div>
          <div>
            <a href="https://huayu.zongheng.com/book/1276270.html" target='_blank' className='bc4'></a>
          </div>
        </Carousel>
        <div className="site_dynamic">
          <h1 className='site_dynamic_title'>
            站点动态
          </h1>
          <ul>
            {trending.map((item, index) => (
              <li key={index}>
                <span>{index + 1}</span>
                <a href={item.url} target='_blank' className='trendings'>{item.content}</a>
                <img src={item.tag === 'new' ? news : hot} alt="new" />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="editor_recommend">
        {novelRandom?.slice(0, 4).map(item => (
          <BookBox item={item} key={item.id} />
        ))}
      </div>
      <div className="books_rank">
        <div className="rank_top">
          <h1>热门榜</h1>
        </div>
        <div className="rank_info">
          {novelInfo.likes?.map((item, index) => (
            <div className='rank_item' key={index} onMouseEnter={() => { handleBox(index) }}>
              <RankNum index={index} />
              {box === index ? <BookBox item={item} /> :
                <div className='rank_display'>
                  <div className="rank_title ellipsis">
                    <a href="#">{item.book}</a>
                  </div>
                  <div className="rank_author ellipsis">
                    <span>{item.author}</span>
                  </div>
                </div>}
            </div>
          ))}
        </div>
        <div className="more_rank" onClick={handlMore}>
          查看更多
        </div>
      </div>
    </div >
  )
}

export default Home
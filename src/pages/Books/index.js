import React, { useEffect, useState } from 'react';
import { Tabs, Pagination, ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import BookBox from '@/components/BookBox/bookBox';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNovelPage, setnovelPage } from '@/store/modules/novel';
import BookClass from './components/bookClass';
import { getSession, setSession } from '@/utils';
import _ from 'lodash'
import './index.scss'

const labels = {
  1: '热度最高',
  2: '字数最多',
  3: '总收藏',
  4: '收录完整'
}

//作品分类
const maleClass = [
  {
    title: '作品分类',
    className: 'book_class',
    data: ['全部', '玄幻', '仙侠', '科幻', '都市', '历史',
      '武侠', '奇幻', '游戏', '体育', '文集', 'N次元', '奇闻异事']
  },
  {
    title: '作品字数',
    className: 'book_words',
    data: ['全部', '300万以上', '100万以上', '50万以上', '30万以下',
      '30~50万', '50~100万', '100~300万']
  },
  {
    title: '作品状态',
    className: 'book_state',
    data: ['全部', '连载', '完结']
  }
]

const femaleClass = [
  {
    title: '作品分类',
    className: 'book_class',
    data: ['全部', '现代言情', '古代言情', '幻想言情', '游戏竞技', '衍生言情']
  },
  {
    title: '作品字数',
    className: 'book_words',
    data: ['全部', '300万以上', '100万以上', '50万以上', '30万以下',
      '30~50万', '50~100万', '100~300万']
  },
  {
    title: '作品状态',
    className: 'book_state',
    data: ['全部', '连载', '完结']
  }
]

const types = [
  {
    key: '0',
    label: '男生',
    children: <BookClass items={maleClass} />,
  },
  {
    key: '1',
    label: '女生',
    children: <BookClass items={femaleClass} />,
  },
  {
    key: '2',
    label: '其它',
    children: 'Content of Tab Pane 3',
  },
];


const Books = () => {
  const dispatch = useDispatch()
  const novelPage = useSelector(state => state.novel.novelPage)
  const total = useSelector(state => state.novel.pageTotal)
  const [book, setBook] = useState({})

  //创建了一个长度为 4 的数组，初始值用 null 填充。
  const items = new Array(4).fill(null).map((_, i) => {
    const id = String(i);
    return {
      label: labels[i],
      key: id,
      children: novelPage.map((item, index) => (
        <BookBox item={item} key={index} />
      )),
    };
  });

  //获取变化后页面书籍数据
  const handlePage = (page, pageSize) => {
    const value = { ...getSession('book'), page: page, pageSize: pageSize }
    setBook(value) //分页所必须的存储
    setSession('book', value)
    dispatch(fetchNovelPage(value))
  }

  //获取当前书籍适用人群
  const handleNav = (key) => {
    const value = { ...book, classification: key }
    setBook(value)
    setSession('book', value)
    dispatch(fetchNovelPage(value))
  }

  const onChange = (key) => {
    console.log(novelPage);
    switch (key) {
      case '1':
        dispatch(setnovelPage(_.orderBy(novelPage, 'id')))
        break
      case '2':
        console.log(1);
        const sortNovelList = _.orderBy(novelPage, (novel) => {
          // 将 words 转换为统一的单位，例如全部转换为字
          const words = novel.words.endsWith('万字') ? parseFloat(novel.words) * 10000 : parseFloat(novel.words);
          return words;
        }, ['desc']);
        dispatch(setnovelPage(sortNovelList))
        break
      case '3':
        dispatch(setnovelPage(_.orderBy(novelPage, 'collect')))
    }
  }

  useEffect(() => {
    const param = {
      page: 1,
      pageSize: 10,
      classification: 0,
      type: '',
      words: '',
      publish: ''
    }
    if (getSession('book')) {
      setBook(getSession('book'))
    } else {
      setBook(param)
      setSession('book', param)
    }
  }, [])

  return (
    <div className="books">
      <div className="books_nav">
        <Tabs activeKey={String(book.classification)} items={types} onChange={handleNav} />
      </div>
      <div className="nav_content">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        <ConfigProvider locale={zh_CN}>
          <Pagination
            total={total}
            current={book.page ? book.page : 1}
            pageSize={book.pageSize ? book.pageSize : 10}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
            className='pagination'
            onChange={handlePage}
          />
        </ConfigProvider>
      </div>
    </div>
  )
}

export default Books
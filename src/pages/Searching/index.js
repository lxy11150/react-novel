import React, { useState } from 'react'
import { Card, Pagination, ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import SearchNovel from './components/SearchNovel';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LuceneAPI } from '@/apis/search';
import { getSession, setSession } from '@/utils';
import _ from 'lodash'
import './index.scss'

const tabListNoTitle = [
  {
    key: 'default',
    label: '默认',
  },
  {
    key: 'words',
    label: '总字数',
  },
  {
    key: 'recommend',
    label: '总推荐',
  },
  {
    key: 'collect',
    label: '总收藏',
  },
  {
    key: 'click',
    label: '总点击',
  }
];

const Searching = () => {
  const [activeTabKey2, setActiveTabKey2] = useState('default');
  const [searchParams] = useSearchParams()
  const [searchs, setSearchs] = useState({})
  const [pageParams, setPageParams] = useState({})

  const onTab2Change = (key) => {
    setActiveTabKey2(key);
    const novelList = searchs.novelList
    let sortNovelList = []
    switch (key) {
      case 'default':
        const params = {
          queryString: searchParams.get('key'),
        }
        LuceneAPI(params).then(res => {
          setSearchs(res.data.data)
        }).catch(error => {
          console.log(error);
        })
        break
      case 'words':
        sortNovelList = _.orderBy(novelList, (novel) => {
          // 将 words 转换为统一的单位
          const words = novel.words.endsWith('万字') ? parseFloat(novel.words) * 10000 : parseFloat(novel.words);
          return words;
        }, ['desc']);
        break
      default:
        sortNovelList = _.orderBy(novelList, key, ['desc'])
    }
    setSearchs({ ...searchs, novelList: sortNovelList })
  };

  const handlePage = (page, pageSize) => {
    const value = {
      page,
      pageSize
    }
    setSession('search', value)
    setPageParams(value)
    LuceneAPI(value).then(res => {
      setSearchs(res.data.data)
    }).catch(error => {
      console.log(error);
    })
    window.scrollTo(0, 100)
  }

  useEffect(() => {
    const params = {
      queryString: searchParams.get('key'),
    }
    LuceneAPI(params).then(res => {
      console.log(res.data);
      setSearchs(res.data.data)
    }).catch(error => {
      console.log(error);
    })
  }, [searchParams.get('key')])

  useEffect(() => {
    if (!getSession('search')) {
      const value = {
        page: 1,
        pageSize: 10
      }
      setSession('search', value)
    }
  }, [])

  return (
    <div className="search">
      <Card
        style={{
          width: '100%',
        }}
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey2}
        onTabChange={onTab2Change}
        tabProps={{
          size: 'middle',
        }}
        className='search_card'
      >
        <SearchNovel
          count={searchs.count}
          keys={searchParams.get('key')}
          data={searchs.novelList}
        />
        <ConfigProvider locale={zh_CN}>
          <Pagination
            total={searchs.count}
            current={pageParams.page ? pageParams.page : 1}
            pageSize={pageParams.pageSize ? pageParams.pageSize : 10}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
            className='pagination'
            onChange={handlePage}
          />
        </ConfigProvider>
      </Card>
    </div>
  )
}

export default Searching
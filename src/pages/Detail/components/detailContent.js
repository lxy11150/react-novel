import React, { useState } from "react";
import { Card } from 'antd';
import ArticleIntroduce from "./articleIntroduce";
import Contents from "@/components/Contents/contents";
import { useEffect } from "react";
import Forum from "./forum";

const tabListNoTitle = [
  {
    key: 'article',
    label: '作品信息',
  },
  {
    key: 'contents',
    label: '目录',
  },
  {
    key: 'forum',
    label: '论坛',
  },
];

const DetailContent = ({ chapterList, profile, chapterInfo, id }) => {
  const [activeTabKey, setActiveTabKey] = useState('article');

  const contentListNoTitle = {
    article: <ArticleIntroduce
      chapter={chapterList[0]}
      profile={profile}
      content={chapterInfo}
      id={id}
    />,
    contents: <Contents chapterList={chapterList} id={id} target={'_blank'} />,
    forum: <Forum />,
  };

  const onTab2Change = (key) => {
    setActiveTabKey(key);
    sessionStorage.setItem('detail', key)
  };

  useEffect(() => {
    const key = sessionStorage.getItem('detail')
    if (key) {
      setActiveTabKey(key)
    } else {
      setActiveTabKey('article')
      sessionStorage.setItem('detail', 'article')
    }
  }, [])

  return (
    <Card
      style={{
        width: '100%',
      }}
      tabList={tabListNoTitle}
      activeTabKey={activeTabKey}
      onTabChange={onTab2Change}
      tabProps={{
        size: 'middle',
      }}
      className="datail_card"
    >
      {contentListNoTitle[activeTabKey]}
    </Card>
  )
}

export default DetailContent
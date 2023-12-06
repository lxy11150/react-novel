import React, { useState } from 'react'
import { Card } from 'antd';

const tabListNoTitle = [
  {
    key: 'article',
    label: 'article',
  },
  {
    key: 'app',
    label: 'app',
  },
  {
    key: 'project',
    label: 'project',
  },
];
const contentListNoTitle = {
  article: <p>article content</p>,
  app: <p>app content</p>,
  project: <p>project content</p>,
};

const Searching = () => {
  const [activeTabKey2, setActiveTabKey2] = useState('app');

  const onTab2Change = (key) => {
    setActiveTabKey2(key);
  };

  return (
    <div className="search">
      <Card
        style={{
          width: '100%',
        }}
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey2}
        tabBarExtraContent={<a href="#">More</a>}
        onTabChange={onTab2Change}
        tabProps={{
          size: 'middle',
        }}
        className='search_card'
      >
        {contentListNoTitle[activeTabKey2]}
      </Card>
    </div>
  )
}

export default Searching
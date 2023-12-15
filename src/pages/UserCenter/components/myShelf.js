import React, { useEffect, useState } from "react";
import { Card, Table, Button, message } from 'antd';
import { deleteAPI, findByUserId } from "@/apis/shelf";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isEmpty } from "lodash";
import { findLogAPI } from "@/apis/log";

const tabListNoTitle = [
  {
    key: 'article',
    label: '最近阅读',
  },
  {
    key: 'shelf',
    label: '我的书架',
  }
];

const columns = [
  {
    title: '类别',
    dataIndex: 'type',
  },
  {
    title: '书名',
    dataIndex: 'book',
    // ellipsis: true,
  },
  {
    title: '最新章节',
    dataIndex: 'chapter',
    // ellipsis: true,
  },
  {
    title: '作者',
    dataIndex: 'author',
    // ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'publish',
  },
  {
    title: '操作',
    dataIndex: 'operate'
  },
];

const MyShelf = () => {
  const [activeTabKey2, setActiveTabKey2] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [shelfData, setShelfData] = useState([])
  const [logRead, setLogRead] = useState()
  const userInfo = useSelector(state => state.user.userInfo)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleDelete = async () => {
    if (!isEmpty(selectedRowKeys)) {
      const keys = selectedRowKeys.map((item) => ({
        novelId: item,
        userId: userInfo.id
      }))
      await deleteAPI(keys).then(
        res => {
          message.success("成功删除")
          // 过滤 shelfData 数组
          const filteredShelfData = shelfData.filter(item => !selectedRowKeys.includes(item.key))
          setShelfData(filteredShelfData)
        }
      )
    } else {
      message.warning("暂未选择需要移除的小说")
    }
  }

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onTab2Change = (key) => {
    navigate(`/userCenter/shelf?key=${key}`)
    setActiveTabKey2(key);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: '选择奇数行',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: '选择偶数行',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const handleButtonClick = (id, chapterId) => {
    navigate(`/chapter/${id}/${chapterId}`)
  }

  const getLogRead = async () => {
    await findLogAPI({ userId: userInfo.id }).then(
      res => {
        // 使用 map 函数为每个元素添加 operate 属性
        const shelfWithOperate = res.data.data?.map(item => ({
          ...item,
          operate: (
            <Button key={item.id} onClick={() => handleButtonClick(item.id, item.chapterId)}>
              继续阅读
            </Button>
          ),
        }));
        setLogRead(shelfWithOperate);
      }
    )
  }

  const getShelf = async () => {
    await findByUserId({ userId: userInfo.id }).then(
      res => {
        // 使用 map 函数为每个元素添加 operate 属性
        const shelfWithOperate = res.data.data?.map(item => ({
          ...item,
          operate: (
            <Button key={item.id} onClick={() => handleButtonClick(item.id, item.chapterId)}>
              继续阅读
            </Button>
          ),
        }));
        setShelfData(shelfWithOperate);
      }
    )
  }

  useEffect(() => {
    userInfo.id && getLogRead()
    userInfo.id && getShelf()
  }, [userInfo.id])

  useEffect(() => {
    setActiveTabKey2(searchParams.get('key'))
  }, [])

  return (
    <div className="myshelf">
      <Button className="delete" onClick={handleDelete}>删除</Button>
      <Card
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey2}
        onTabChange={onTab2Change}
        tabProps={{
          size: 'large',
        }}
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={activeTabKey2 === 'article' ? logRead : shelfData} />
      </Card>
    </div>
  )
}

export default MyShelf
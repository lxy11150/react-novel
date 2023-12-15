import React, { useEffect, useState } from 'react';
import { Card, Table, Button, message } from 'antd';
import { useSelector } from 'react-redux';
import { isEmpty } from "lodash";
import { deletePraiseAPI, queryPraiseAPI } from '@/apis/praise';

const tabListNoTitle = [
  {
    key: 'book',
    label: '我赞过的小说',
  },
  {
    key: 'comment',
    label: '我赞过的评论',
  },
  {
    key: 'reply',
    label: '我赞过的回帖'
  }
];

const columns = [
  {
    title: '小说名称',
    dataIndex: 'book',
    ellipsis: true,
  },
  {
    title: '总获赞',
    dataIndex: 'likes',
  },
  {
    title: '总点击',
    dataIndex: 'click',
  },
  {
    title: '总收藏',
    dataIndex: 'collect',
  },
  {
    title: '总推荐数',
    dataIndex: 'recommend',
  },
  {
    title: '评论数',
    dataIndex: 'total',
  },
  {
    title: '操作',
    dataIndex: 'operate',
  },
];

const commentColumns = [
  {
    title: '发表人',
    dataIndex: 'username',
  },
  {
    title: '内容',
    dataIndex: 'content',
    ellipsis: true,
  },
  {
    title: '获赞',
    dataIndex: 'likes',
  },
  {
    title: '发表时间',
    dataIndex: 'time',
  },
  {
    title: '操作',
    dataIndex: 'operate',
  },
];

const MyPraise = () => {
  const [activeTabKey, setActiveTabKey] = useState('book');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [book, setBook] = useState([])
  const [comment, setComment] = useState([])
  const [reply, setReply] = useState([])
  const userInfo = useSelector(state => state.user.userInfo)

  const onTabChange = (key) => {
    setActiveTabKey(key);

  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleDelete = async () => {
    if (activeTabKey === 'book') {
      await deletePraiseAPI({
        userId: userInfo.id,
        target: 1,
        targetIds: selectedRowKeys
      }).then(
        res => {
          res.data.code === 200
            ? message.success(res.data.message)
            : message.warning(res.data.message)
          const filteredBookData = book.filter(item => !selectedRowKeys.includes(item.key))
          setBook(filteredBookData)
        }
      )
    } else if (activeTabKey === 'comment') {
      await deletePraiseAPI({
        userId: userInfo.id,
        target: 2,
        targetId: selectedRowKeys
      }).then(
        res => {
          res.data.code === 200
            ? message.success(res.data.message)
            : message.warning(res.data.message)
          const filteredCommentData = comment.filter(item => !selectedRowKeys.includes(item.key))
          setComment(filteredCommentData)
        }
      )
    } else {
      await deletePraiseAPI({
        userId: userInfo.id,
        target: 3,
        targetId: selectedRowKeys
      }).then(
        res => {
          res.data.code === 200
            ? message.success(res.data.message)
            : message.warning(res.data.message)
          const filteredReplyData = reply.filter(item => !selectedRowKeys.includes(item.key))
          setReply(filteredReplyData)
        }
      )
    }
  }

  const handleButtonClick = (id) => {
    window.open(`/detail/${id}`, '_blank')
  }

  const queryPraiseBook = async () => {
    await queryPraiseAPI({ userId: userInfo.id, target: 1 }).then(
      res => {
        console.log(res.data);
        if (res.data.code === 200) {
          // 使用 map 函数为每个元素添加 operate 属性
          const bookWithOperate = res.data.data?.map(item => ({
            ...item,
            operate: (
              <Button key={item.id} onClick={() => handleButtonClick(item.id)}>
                查看详情
              </Button>
            ),
          }));
          setBook(bookWithOperate)
        }
      }
    )
  }

  const queryPraiseComment = async () => {
    await queryPraiseAPI({ userId: userInfo.id, target: 2 }).then(
      res => {
        if (res.data.code === 200) {
          // 使用 map 函数为每个元素添加 operate 属性
          const commentWithOperate = res.data.data?.map(item => ({
            ...item,
            operate: (
              <Button key={item.id} onClick={() => handleButtonClick(item.id)}>
                查看详情
              </Button>
            ),
          }));
          setComment(commentWithOperate)
        }
      }
    )
  }

  const queryPraiseReply = async () => {
    await queryPraiseAPI({ userId: userInfo.id, target: 3 }).then(
      res => {
        if (res.data.code === 200) {
          // 使用 map 函数为每个元素添加 operate 属性
          const commentWithOperate = res.data.data?.map(item => ({
            ...item,
            operate: (
              <Button key={item.id} onClick={() => handleButtonClick(item.id)}>
                查看详情
              </Button>
            ),
          }));
          setReply(commentWithOperate)
        }
      }
    )
  }

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

  useEffect(() => {
    userInfo.id && queryPraiseBook()
    userInfo.id && queryPraiseComment()
    userInfo.id && queryPraiseReply()
  }, [userInfo.id])

  return (
    <div className='my_comment'>
      <Button
        className="delete"
        onClick={handleDelete}
      >
        取消点赞
      </Button>
      <Card
        style={{
          width: '100%',
        }}
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey}
        onTabChange={onTabChange}
        tabProps={{
          size: 'large',
        }}
      >
        <Table
          rowSelection={rowSelection}
          columns={activeTabKey === 'book' ? columns : commentColumns}
          dataSource={activeTabKey === 'book' ? book : (activeTabKey === 'comment' ? comment : reply)} />
      </Card>
    </div>
  );
};
export default MyPraise;
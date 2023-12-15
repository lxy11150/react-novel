import React, { useEffect, useState } from 'react';
import { Card, Table, Button, message } from 'antd';
import { deleteCommentAPI, deleteReplyAPI, getCommentByUserIdAPI, getReplyByUserIdAPI } from '@/apis/comment';
import { useSelector } from 'react-redux';
import { isEmpty } from "lodash";
import { myRecommendAPI } from '@/apis/recommend';
import { useNavigate } from 'react-router-dom';

const tabListNoTitle = [
  {
    key: 'comment',
    label: '我的发帖',
  },
  {
    key: 'reply',
    label: '我的回帖',
  },
  {
    key: 'recommend',
    label: '我的推荐'
  }
];

const columns = [
  {
    title: '内容',
    dataIndex: 'content',
    ellipsis: true,
    width: '20%'
  },
  {
    title: '获赞',
    dataIndex: 'likes',
    width: '7%'
  },
  {
    title: '评论小说',
    dataIndex: 'book',
    ellipsis: true,
    width: '13%'
  },
  {
    title: '评论章节',
    dataIndex: 'title',
    ellipsis: true,
    width: '20%'
  },
  {
    title: '发表时间',
    dataIndex: 'time',
    width: '20%'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: '20%'
  },
];

const replyColumns = [
  {
    title: '内容',
    dataIndex: 'content',
    ellipsis: true,
    width: '20%'
  },
  {
    title: '获赞',
    dataIndex: 'likes',
    width: '10%'
  },
  {
    title: '回帖内容',
    dataIndex: 'comment',
    ellipsis: true,
    width: '30%'
  },
  {
    title: '发表时间',
    dataIndex: 'time',
    width: '20%'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: '20%'
  },
];

const recommendColumns = [
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

const MyComment = () => {
  const [activeTabKey, setActiveTabKey] = useState('comment');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [comment, setComment] = useState([])
  const [reply, setReply] = useState([])
  const [recommend, setRecommend] = useState([])
  const userInfo = useSelector(state => state.user.userInfo)
  const navigate = useNavigate()

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleDelete = async () => {
    if (!isEmpty(selectedRowKeys)) {
      const keys = {
        commentIds: selectedRowKeys
      }
      await deleteCommentAPI(keys).then(
        res => {
          message.success("成功删除")
          const filteredCommentData = comment.filter(item => !selectedRowKeys.includes(item.key))
          setComment(filteredCommentData)
          const filterReplyData = reply.filter(item => !selectedRowKeys.includes(item.forum_id))
          setReply(filterReplyData)
        }
      )
    } else {
      message.warning("暂未选择需要移除的小说")
    }
  }

  const handleDeleteReply = async () => {
    if (!isEmpty(selectedRowKeys)) {
      const keys = {
        replyIds: selectedRowKeys
      }
      await deleteReplyAPI(keys).then(
        res => {
          message.success("成功删除")
          const filteredReplyData = reply.filter(item => !selectedRowKeys.includes(item.key))
          setReply(filteredReplyData)
        }
      )
    } else {
      message.warning("暂未选择需要移除的回帖")
    }
  }

  const handleButtonClick = (id, chapterId) => {

  }

  const findCommentByUserId = async () => {
    await getCommentByUserIdAPI({ userId: userInfo.id }).then(
      res => {
        if (res.data.code === 200) {
          // 使用 map 函数为每个元素添加 operate 属性
          const commentWithOperate = res.data.data?.map(item => ({
            ...item,
            operate: (
              <Button key={item.id} onClick={() => handleButtonClick(item.id, item.chapterId)}>
                查看详情
              </Button>
            ),
          }));
          setComment(commentWithOperate)
        } else {
          message.warning(res.data.message)
        }
      }
    )
  }

  const findReply = async () => {
    await getReplyByUserIdAPI({ userId: userInfo.id }).then(res => {
      if (res.data.code === 200) {
        // 使用 map 函数为每个元素添加 operate 属性
        const replyWithOperate = res.data.data?.map(item => ({
          ...item,
          operate: (
            <Button key={item.id} onClick={() => handleButtonClick(item.id, item.chapterId)}>
              查看详情
            </Button>
          ),
        }));
        setReply(replyWithOperate)
      } else {
        message.warning(res.data.message)
      }
    })
  }

  const findRecommend = async () => {
    await myRecommendAPI({ userId: userInfo.id }).then(res => {
      console.log(res.data);
      if (res.data.code === 200) {
        // 使用 map 函数为每个元素添加 operate 属性
        const RecommendWithOperate = res.data.data?.map(item => ({
          ...item,
          operate: (
            <Button key={item.id} onClick={() => navigate(`/detail/${item.id}`)}>
              查看详情
            </Button>
          ),
        }));
        setRecommend(RecommendWithOperate)
      } else {
        message.warning(res.data.message)
      }
    })
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
    userInfo.id && findCommentByUserId()
    userInfo.id && findReply()
    userInfo.id && findRecommend()
  }, [userInfo.id])

  return (
    <div className='my_comment'>
      <Button
        className="delete"
        onClick={activeTabKey === 'comment' ? handleDelete : handleDeleteReply}
      >
        删除
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
          columns={activeTabKey === 'comment' ? columns : (activeTabKey === 'reply' ? replyColumns : recommendColumns)}
          dataSource={activeTabKey === 'comment' ? comment : (activeTabKey === 'reply' ? reply : recommend)} />
      </Card>
    </div>
  );
};
export default MyComment;
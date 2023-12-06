import React, { useEffect, useState } from 'react';
import { Radio } from 'antd';
import { useDispatch } from 'react-redux';
import { fetchNovelPage } from '@/store/modules/novel';
import { getSession, setSession } from '@/utils';

//分类标签组件
const BookClass = ({ items }) => {
  const [data, setData] = useState(getSession('book'))
  const dispatch = useDispatch()
  const [activate, setActivate] = useState({
    0: String(data.type),
    1: String(data.words),
    2: String(data.publish)
  })

  const onChange = (e, index) => {
    let value = {}
    if (index === 0) {
      value = { ...data, type: e.target.value }
      setActivate({ ...activate, 0: String(e.target.value) })
    } else if (index === 1) {
      value = { ...data, words: e.target.value }
      setActivate({ ...activate, 1: String(e.target.value) })
    } else {
      value = { ...data, publish: e.target.value }
      setActivate({ ...activate, 2: String(e.target.value) })
    }
    setData(value)
    setSession('book', value)
  }

  useEffect(() => {
    dispatch(fetchNovelPage(data))
  }, [data])

  return (
    <>
      {items.map((item, index) => (
        <div className={item.className} key={index}>
          <div className="class_header">
            <h3>{item.title}</h3>
          </div>
          <div className="class_body">
            <Radio.Group onChange={(e) => onChange(e, index)} defaultValue={activate[index]}>
              {item.data?.map(data => (
                data === '全部'
                  ? <Radio.Button value="" key={data}>{data}</Radio.Button>
                  : <Radio.Button value={data} key={data}>{data}</Radio.Button>
              ))}
            </Radio.Group>
          </div>
        </div>
      ))}
    </>
  )
}

export default BookClass
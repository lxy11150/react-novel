import React, { useEffect, useState } from 'react';
import { Layout, Space, Input } from 'antd';
import logo from '@/assets/logo.png'
import HeaderMenu from './components/headerMenu';
import UserInfo from './components/userInfo';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '@/store/modules/user';
import Scenery from './components/scenery';
import classNames from 'classnames';
import './index.scss'

const { Header, Footer, Content } = Layout;
const { Search } = Input;

const Layouts = () => {
  const dispatch = useDispatch()
  const username = useSelector(state => state.user.userInfo.username)
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const navigate = useNavigate()

  const onSearch = (value) => {
    navigate(`/search?key=${value}`)
  }

  //触发用户个人信息action
  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const shouldFixHeader = scrollPosition > 70; // 根据实际需求调整滚动触发的位置

      setIsHeaderFixed(shouldFixHeader);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  return (
    <div className="layout">
      <Space
        direction="vertical"
        style={{
          width: '100%',
        }}
        size={[0, 48]}
      >
        <Layout>
          <Scenery />
          <Header className={classNames('header', { header_fixed: isHeaderFixed })}>
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <HeaderMenu />
            <Search
              placeholder="搜索书籍"
              onSearch={onSearch}
              style={{
                width: 200,
              }}
              className='header_search'
            />
            <UserInfo username={username} />
          </Header>
          <Content className='content'>
            <Outlet />
          </Content>
          {/* <Footer className='footer'>Footer</Footer> */}
        </Layout>
      </Space>
    </div>
  )
}

export default Layouts
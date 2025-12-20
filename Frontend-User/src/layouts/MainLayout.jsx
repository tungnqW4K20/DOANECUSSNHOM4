import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, theme, Typography } from 'antd';
import Sidebar from '../components/layout/Sidebar';
import AppHeader from '../components/layout/Header'; 
import logo from '../assets/logo.png';
const { Content, Footer, Sider } = Layout;
const {Title} = Typography;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value) } width={250}>
        <Link to="/">
          <div 
            style={{
              height: 64, // Chiều cao bằng Header
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 20px',
              cursor: 'pointer',
            }}
          >
            <img 
              src={logo} 
              alt="Logo" 
              style={{
                height: 35,
                width: 35,
                marginRight: collapsed ? 0 : 12, // Ẩn margin khi collapsed
                transition: 'margin-right 0.3s',
              }} 
            />
            {!collapsed && (
              <Title 
                level={4} 
                style={{ 
                  color: 'white', 
                  margin: 0, 
                  whiteSpace: 'nowrap', // Không xuống dòng
                  overflow: 'hidden', // Ẩn chữ thừa
                }}
              >
                SXXK
              </Title>
            )}
          </div>
        </Link>
        <Sidebar />
      </Sider>
      <Layout>
        <AppHeader /> {/* Sử dụng AppHeader mới */}
        <Content style={{ margin: '16px', overflow: 'initial' }}>
          <div style={{ padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Hệ Thống Quản Lý Sản Xuất Xuất Khẩu ©2025</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
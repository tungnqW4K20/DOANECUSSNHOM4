import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { AreaChartOutlined, TeamOutlined, DollarCircleOutlined, HddOutlined, EyeOutlined } from '@ant-design/icons';

const items = [
  { key: '1', icon: <AreaChartOutlined />, label: <Link to="/">Thống kê</Link> },
  { key: '2', icon: <TeamOutlined />, label: <Link to="/doanh-nghiep">Quản lý Doanh nghiệp</Link> },
  { key: '3', icon: <DollarCircleOutlined />, label: <Link to="/tien-te">Tiền tệ</Link> },
  { key: '4', icon: <HddOutlined />, label: <Link to="/don-vi-tinh-hq">Đơn vị tính HQ</Link> },
];

const Sidebar = () => <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />;

export default Sidebar;
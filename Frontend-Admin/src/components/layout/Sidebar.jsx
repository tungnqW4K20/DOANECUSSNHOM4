import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { AreaChartOutlined, TeamOutlined, DollarCircleOutlined, HddOutlined, EyeOutlined } from '@ant-design/icons';

const items = [
  { key: '1', icon: <AreaChartOutlined />, label: <Link to="/">Thống kê</Link> },
  { key: '2', icon: <TeamOutlined />, label: <Link to="/doanh-nghiep">Quản lý Doanh nghiệp</Link> },
  {
    key: 'sub1',
    icon: <EyeOutlined />,
    label: 'Theo dõi hoạt động',
    children: [
      { key: '3', label: <Link to="/theo-doi/to-khai">Tờ khai Hải quan</Link> },
      { key: '4', label: <Link to="/theo-doi/audit-log">Lịch sử hoạt động</Link> },
      { key: 'tk', label: <Link to="/theo-doi/thanh-khoan">Thanh khoản Hợp đồng</Link> },
    ],
  },
  {
    key: 'sub2',
    icon: <DollarCircleOutlined />,
    label: 'Quản lý chung',
    children: [
      { key: '5', label: <Link to="/tien-te">Tiền tệ</Link> },
      { key: '6', label: <Link to="/don-vi-tinh-hq">Đơn vị tính HQ</Link> },
    ],
  },
];

const Sidebar = () => <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />;

export default Sidebar;
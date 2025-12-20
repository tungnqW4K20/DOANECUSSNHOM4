import { Link, useLocation } from 'react-router-dom';
import { Menu, Tooltip } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  DollarOutlined,
  AppstoreOutlined,
  SettingOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Tổng quan',
    path: '/',
  },
  {
    key: '/doanh-nghiep',
    icon: <TeamOutlined />,
    label: 'Doanh nghiệp',
    path: '/doanh-nghiep',
  },
  {
    key: '/tien-te',
    icon: <DollarOutlined />,
    label: 'Tiền tệ',
    path: '/tien-te',
  },
  {
    key: '/don-vi-tinh-hq',
    icon: <AppstoreOutlined />,
    label: 'Đơn vị tính HQ',
    path: '/don-vi-tinh-hq',
  },
];

const Sidebar = ({ collapsed }) => {
  const location = useLocation();

  // Get current selected key based on pathname
  const getSelectedKey = () => {
    const path = location.pathname;
    const item = menuItems.find(item => item.path === path);
    return item ? [item.key] : ['/'];
  };

  const items = menuItems.map((item) => ({
    key: item.key,
    icon: collapsed ? (
      <Tooltip title={item.label} placement="right">
        <span style={{ fontSize: '18px' }}>{item.icon}</span>
      </Tooltip>
    ) : (
      <span style={{ fontSize: '16px' }}>{item.icon}</span>
    ),
    label: collapsed ? null : (
      <Link to={item.path} style={{ color: 'inherit' }}>
        <span className="sidebar-text-animate">{item.label}</span>
      </Link>
    ),
    onClick: collapsed ? () => window.location.href = item.path : undefined,
  }));

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={getSelectedKey()}
      items={items}
      style={{
        background: 'transparent',
        border: 'none',
      }}
    />
  );
};

export default Sidebar;

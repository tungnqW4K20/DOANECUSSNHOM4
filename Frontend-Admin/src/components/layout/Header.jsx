import { Layout, Avatar, Dropdown, Typography, message, Button, Tooltip } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from '../notification/NotificationCenter';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminUser');
    message.success({
      content: 'Đăng xuất thành công!',
      icon: <LogoutOutlined style={{ color: '#52c41a' }} />,
    });
    navigate('/login');
  };

  const handleGoToProfile = () => {
    navigate('/tai-khoan');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>
            {adminUser?.ten_admin || 'Admin'}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {adminUser?.email || 'admin@example.com'}
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'account',
      label: 'Tài khoản',
      icon: <UserOutlined />,
      onClick: handleGoToProfile,
    },
    {
      key: 'settings',
      label: 'Cài đặt',
      icon: <SettingOutlined />,
      onClick: () => navigate('/cai-dat'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Header
      style={{
        padding: '0 24px',
        background: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        height: 64,
      }}
    >
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Toggle Button */}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '18px',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            color: '#64748b',
            transition: 'all 0.3s ease',
          }}
          className="hover-lift"
        />

        {/* Breadcrumb or Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
            }}
          />
          <Text style={{ color: '#64748b', fontSize: '14px' }}>
            Xin chào, <span style={{ fontWeight: 600, color: '#1e293b' }}>{adminUser?.ten_admin || 'Admin'}</span>
          </Text>
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Help Button */}
        <Tooltip title="Trợ giúp">
          <Button
            type="text"
            icon={<QuestionCircleOutlined style={{ fontSize: '18px' }} />}
            style={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              color: '#64748b',
            }}
          />
        </Tooltip>

        {/* Notification Center */}
        <NotificationCenter />

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 24,
            background: '#e2e8f0',
            margin: '0 8px',
          }}
        />

        {/* User Dropdown */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
          overlayStyle={{ minWidth: 200 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: 'transparent',
            }}
            className="hover-lift"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Avatar
              size={38}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
              icon={<UserOutlined />}
            />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;

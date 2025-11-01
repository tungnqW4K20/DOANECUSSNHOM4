import React from 'react';
import { Layout, Avatar, Dropdown, Space, Typography, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
    const navigate = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));

    const handleLogout = () => {
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('adminUser');
        message.success('Đăng xuất thành công!');
        navigate('/login');
    };

    const menuItems = [
        { key: '1', label: 'Tài khoản', icon: <UserOutlined /> },
        { key: '2', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout },
    ];

    return (
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                        <Text strong>{adminUser ? adminUser.ten_admin : 'Admin'}</Text>
                    </Space>
                </a>
            </Dropdown>
        </Header>
    );
};

export default AppHeader;
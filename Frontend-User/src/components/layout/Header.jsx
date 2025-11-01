import React from 'react';
import { Layout, Avatar, Dropdown, Space, Typography, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth.service';


const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin user từ localStorage

    const handleLogout = () => {
        logout();
        alert('Đăng xuất thành công!');
        navigate('/login');
    };

    const menuItems = [
        {
            key: '1',
            label: 'Thông tin tài khoản',
            icon: <UserOutlined />,
        },
        {
            key: '2',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        <Avatar icon={<UserOutlined />} />
                        <Text strong>{user ? user.ten_dn : 'Doanh nghiệp'}</Text>
                    </Space>
                </a>
            </Dropdown>
        </Header>
    );
};

export default AppHeader;
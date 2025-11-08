import React from 'react';
import { Layout, Avatar, Dropdown, Space, Typography, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
    const navigate = useNavigate();

    // SỬA LỖI: Thêm bước kiểm tra an toàn trước khi parse JSON
    const userJSON = localStorage.getItem('user'); // 1. Lấy chuỗi JSON từ localStorage
    const user = userJSON ? JSON.parse(userJSON) : null; // 2. Chỉ parse nếu chuỗi đó tồn tại (không phải null)

    const handleLogout = () => {
        // Xóa thông tin đăng nhập
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        message.success('Đăng xuất thành công!');
        // SỬA LẠI ĐƯỜNG DẪN ĐĂNG XUẤT CHO ĐÚNG
        navigate('/auth/login');
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
                        {/* Kiểm tra `user` tồn tại trước khi truy cập `user.ten_dn` để tránh lỗi */}
                        <Text strong>{user ? user.ten_dn : 'Doanh nghiệp'}</Text>
                    </Space>
                </a>
            </Dropdown>
        </Header>
    );
};

export default AppHeader;
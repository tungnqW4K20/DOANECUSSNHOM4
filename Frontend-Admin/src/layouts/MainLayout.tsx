import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Space, Button, Typography } from 'antd';
import {
    HomeOutlined,
    AuditOutlined,
    DollarCircleOutlined,
    TeamOutlined,
    FileTextOutlined,
    FileSyncOutlined,
    FileDoneOutlined,
    SwapOutlined,
    LogoutOutlined,
    DownOutlined,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AppstoreOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import * as paths from '../utils/index';
import { useAuthStore } from '../store/authStore';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { key: paths.DASHBOARD_PATH, icon: <HomeOutlined />, label: 'Dashboard' },
        { key: paths.QL_COSO_DONVITINHHQ_PATH, icon: <AuditOutlined />, label: 'Đơn Vị Tỉnh HQ' },
        { key: paths.QL_TAICHINH_TIENTE_PATH, icon: <DollarCircleOutlined />, label: 'Tiền Tệ' },
        { key: paths.QL_COSO_HAIQUAN_PATH, icon: <AuditOutlined />, label: 'Hải Quan' },
        { key: paths.QL_COSO_DOANHNGHIEP_PATH, icon: <TeamOutlined />, label: 'Doanh Nghiệp' },
        { key: paths.QL_HANGHOA_SANPHAM_PATH, icon: <FileTextOutlined />, label: 'Sản Phẩm' },
        { key: paths.QL_HANGHOA_NGUYENPHULIEU_PATH, icon: <FileSyncOutlined />, label: 'Nguyên Phụ Liệu' },
        { key: paths.QL_HOPDONG_PATH, icon: <FileDoneOutlined />, label: 'Hợp Đồng' },
        { key: paths.QL_LOHANG_PATH, icon: <FileDoneOutlined />, label: 'Lô Hàng' },
        { key: paths.QL_TAICHINH_TYGIA_PATH, icon: <SwapOutlined />, label: 'Tỷ Giá' },
        { key: paths.QL_QUYDOIDONVIDN_PATH, icon: <SwapOutlined />, label: 'Quy Đổi Đơn Vị DN' },
        { key: paths.QL_HANGHOA_QUYDOIDONVISP_PATH, icon: <SwapOutlined />, label: 'Quy Đổi Đơn Vị SP' },
    ];

    const userMenu = (
        <Menu
            items={[
                { key: 'profile', label: 'Thông tin cá nhân' },
                {
                    key: 'logout',
                    label: <span style={{ color: '#ff4d4f' }}><LogoutOutlined /> Đăng xuất</span>,
                    onClick: () => {
                        logout();
                        navigate(paths.LOGIN_PATH);
                    },
                },
            ]}
        />
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                width={250}
                theme="dark"
                style={{ background: '#001529', height: '100vh', position: 'fixed', left: 0, zIndex: 1000 }}
            >
                <div
                    style={{
                        height: 64,
                        margin: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        gap: 12,
                    }}
                >
                    <AppstoreOutlined style={{ fontSize: 32, color: '#fff' }} />
                    <span
                        style={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 20,
                            display: collapsed ? 'none' : 'block',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        SAYEUEM
                    </span>
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    style={{ borderRight: 0 }}
                />
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
                <Header
                    style={{
                        background: '#fff',
                        padding: '0 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                        position: 'fixed',
                        top: 0,
                        left: collapsed ? 80 : 250,
                        right: 0,
                        zIndex: 999,
                        height: 64,
                        transition: 'left 0.2s',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: 18 }}
                        />
                        <Title level={4} style={{ margin: 0, color: '#1d39c4' }}>
                            Quản Lý Hệ Thống
                        </Title>
                    </div>

                    <Dropdown overlay={userMenu} trigger={['click']}>
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar style={{ backgroundColor: '#1d39c4' }} icon={<UserOutlined />} />
                            <span style={{ fontWeight: 500 }}>{user?.name || 'user1234'}</span>
                            <DownOutlined />
                        </Space>
                    </Dropdown>
                </Header>

                <Content
                    style={{
                        marginTop: 64, // ← Thay 80 thành 64
                        padding: 24,
                        background: '#ffffffff',
                        minHeight: 'calc(100vh - 64px)', // ← Cập nhật
                    }}
                >
                    <Outlet />
                </Content>

            </Layout>
        </Layout>
    );
};

export default MainLayout;
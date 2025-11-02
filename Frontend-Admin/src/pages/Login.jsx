import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            console.log('Thông tin đăng nhập Admin:', values);

            // Tạm thời dùng API login-haiquan cho admin
            const response = await axios.post('http://localhost:3000/api/auth/login-haiquan', {
                tai_khoan: values.email, // Dùng email làm tài khoản
                mat_khau: values.password
            });

            if (response.data.success) {
                const { token, refreshToken, HaiQuan: userInfo } = response.data.data;

                // Lưu token như admin
                localStorage.setItem('adminAuthToken', token);
                localStorage.setItem('adminRefreshToken', refreshToken);
                localStorage.setItem('adminUser', JSON.stringify({
                    ten_admin: userInfo.ten_hq, // Hiển thị tên hải quan
                    email: values.email,
                    role: 'admin'
                }));

                message.success('Đăng nhập thành công!');
                navigate('/'); // Chuyển hướng về dashboard
            } else {
                message.error(response.data.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title={<Title level={3} style={{ textAlign: 'center' }}>Trang Quản trị</Title>} style={{ width: 400, margin: 'auto' }}>
            <Form name="login" onFinish={onFinish} layout="vertical">
                <Form.Item name="email" label="Tài khoản" rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Tài khoản hải quan" />
                </Form.Item>
                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default Login;
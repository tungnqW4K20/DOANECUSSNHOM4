import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

// Tạo axios instance riêng cho login (không có interceptor)
const loginAxios = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            setLoginError(''); // Clear lỗi cũ

            // Dùng loginAxios thay vì axios để tránh interceptor
            const response = await loginAxios.post('/auth/login-haiquan', {
                tai_khoan: values.email,
                mat_khau: values.password
            });

            if (response.data.success) {
                const { token, refreshToken, HaiQuan: userInfo } = response.data.data;

                // Lưu token như admin
                localStorage.setItem('adminAuthToken', token);
                localStorage.setItem('adminRefreshToken', refreshToken);
                localStorage.setItem('adminUser', JSON.stringify({
                    ten_admin: userInfo.ten_hq,
                    email: values.email,
                    role: 'admin'
                }));

                message.success('Đăng nhập thành công!');
                navigate('/');
            } else {
                setLoginError(response.data.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            
            // Xử lý các loại lỗi cụ thể
            if (error.response) {
                // Server trả về response với status code lỗi
                const errorMsg = error.response.data?.message || 'Đăng nhập thất bại';
                setLoginError(errorMsg);
            } else if (error.request) {
                // Request được gửi nhưng không nhận được response
                setLoginError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
            } else {
                // Lỗi khác
                setLoginError('Có lỗi xảy ra: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        <Card title={<Title level={3} style={{ textAlign: 'center' }}>Trang Quản trị</Title>} style={{ width: 400, margin: 'auto' }}>
            <Spin spinning={loading} indicator={loadingIcon} tip="Đang xác thực...">
                <Form form={form} name="login" onFinish={onFinish} layout="vertical">
                    <Form.Item name="email" label="Tài khoản" rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Tài khoản hải quan" disabled={loading} />
                    </Form.Item>
                    <Form.Item 
                        name="password" 
                        label="Mật khẩu" 
                        rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" disabled={loading} />
                    </Form.Item>
                    {loginError && (
                        <div style={{ marginTop: -20, marginBottom: 16, color: '#ff4d4f', fontSize: 14 }}>
                            {loginError}
                        </div>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading} disabled={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Card>
    );
};

export default Login;
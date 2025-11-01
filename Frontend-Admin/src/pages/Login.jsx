import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Thông tin đăng nhập Admin:', values);
        // Logic gọi API đăng nhập Admin ở đây
        // Nếu thành công:
        message.success('Đăng nhập thành công!');
        localStorage.setItem('adminAuthToken', 'your_mock_admin_token'); // Giả lập token
        localStorage.setItem('adminUser', JSON.stringify({ ten_admin: 'Adminstrator', email: values.email }));
        
        navigate('/'); // Chuyển hướng về dashboard
    };

    return (
        <Card title={<Title level={3} style={{ textAlign: 'center' }}>Trang Quản trị</Title>} style={{ width: 400, margin: 'auto' }}>
            <Form name="login" onFinish={onFinish} layout="vertical">
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Đăng nhập</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default Login;
import React from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Thông tin đăng nhập:', values);
        // Logic gọi API đăng nhập ở đây
        // Nếu thành công:
        message.success('Đăng nhập thành công!');
        // Lưu token hoặc thông tin user vào localStorage/sessionStorage
        localStorage.setItem('authToken', 'your_mock_auth_token'); // Giả lập token
        localStorage.setItem('user', JSON.stringify({ ten_dn: 'Công ty TNHH May Mặc ABC', id_dn: 1 })); // Giả lập thông tin user

        navigate('/'); // Chuyển hướng về trang chủ
    };

    return (
        <Card title={<Title level={3} style={{ textAlign: 'center' }}>Đăng nhập hệ thống</Title>} style={{ width: 400, margin: 'auto' }}>
            <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
                <Form.Item name="ma_so_thue" label="Mã số thuế" rules={[{ required: true, message: 'Vui lòng nhập Mã số thuế!' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Mã số thuế" />
                </Form.Item>
                <Form.Item name="mat_khau" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>
                    <a style={{ float: 'right' }} href="">Quên mật khẩu?</a>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Đăng nhập</Button>
                </Form.Item>
                <div style={{ textAlign: 'center' }}>
                    Chưa có tài khoản? <Link to="/auth/register">Đăng ký ngay!</Link>
                </div>
            </Form>
        </Card>
    );
};

export default Login;
import React from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

// --- Giả lập API đăng nhập ---
const mockLoginAPI = (values) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (values.ma_so_thue === '0123' && values.mat_khau === '123') {
                resolve({
                    accessToken: 'your_real_auth_token_from_server',
                    user: { ten_dn: 'Công ty TNHH May Mặc ABC', id_dn: 1 }
                });
            } else {
                reject(new Error('Mã số thuế hoặc mật khẩu không chính xác!'));
            }
        }, 1000); // Giả lập độ trễ mạng
    });
};
// -----------------------------

const Login = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        // Sử dụng .then() và .catch() thay vì async/await
        mockLoginAPI(values)
            .then(response => {
                // XỬ LÝ KHI THÀNH CÔNG
                message.success('Đăng nhập thành công!');
                localStorage.setItem('authToken', response.accessToken);
                localStorage.setItem('user', JSON.stringify(response.user));
                navigate('/'); // Chuyển hướng
            })
            .catch(error => {
                // XỬ LÝ KHI THẤT BẠI
                message.error(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
            });
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
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Đăng nhập
                    </Button>
                </Form.Item>
                <div style={{ textAlign: 'center' }}>
                    Chưa có tài khoản? <Link to="/auth/register">Đăng ký ngay!</Link>
                </div>
            </Form>
        </Card>
    );
};

export default Login;
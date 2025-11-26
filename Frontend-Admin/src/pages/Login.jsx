import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { loginHaiQuan } from '../services/auth.service';

const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
  
  const onFinish = async (values) => {
    try {
      setLoading(true);
        console.log("values", values)
      // Gọi API đăng nhập hải quan (admin)
      const res = await loginHaiQuan({
        tai_khoan: values.email,
        mat_khau: values.password,
      });

      // Tùy BE trả về gì, ví dụ:
      const user = res?.data?.user || {
        ten_admin: 'Administrator',
        email: values.email,
      };

      // Lưu thông tin admin (tên key tùy bạn đặt)
      localStorage.setItem('adminUser', JSON.stringify(user));

      // Nếu muốn flag riêng cho admin:
      localStorage.setItem('isAdmin', 'true');

      message.success('Đăng nhập thành công!');
      navigate('/'); // Chuyển hướng về dashboard
    } catch (err) {
      console.error('Login admin error:', err);
      message.error(err?.message || 'Đăng nhập thất bại, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

    return (
        <Card title={<Title level={3} style={{ textAlign: 'center' }}>Trang Quản trị</Title>} style={{ width: 400, margin: 'auto' }}>
            <Form name="login" onFinish={onFinish} layout="vertical">
                <Form.Item name="email" label="Email">
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
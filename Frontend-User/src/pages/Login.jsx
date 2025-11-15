import React from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { loginBusiness } from '../services/auth.service';

const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        console.log('Thông tin đăng nhập:', values);

        try {
            const res = await loginBusiness({
                ma_so_thue: values.ma_so_thue,
                mat_khau: values.mat_khau,
            });
            console.log("Kết quả đăng nhập:", res);

            const doanhNghiep = res?.data?.DoanhNghiep;
            console.log(doanhNghiep);

            if (doanhNghiep?.token) localStorage.setItem('accessToken', doanhNghiep.token);
            if (doanhNghiep?.refreshToken) localStorage.setItem('refreshToken', doanhNghiep.refreshToken);
            localStorage.setItem('user', JSON.stringify(doanhNghiep));
            // message.success('Đăng nhập thành công!');
            alert('Đăng nhập thành công!');

            navigate('/');

        } catch (err) {
            console.error("Lỗi doanh nghiệp đăng nhập:", err);
            const msg = err?.message || err?.error || "Đăng nhập thất bại, vui lòng thử lại!";
            // message.error(msg);
            alert(msg);
        }
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
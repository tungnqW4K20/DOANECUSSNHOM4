import React from 'react';
import { Form, Input, Button, Card, Typography, Upload, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, HomeOutlined, PhoneOutlined, SolutionOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Thông tin đăng ký:', values);
        // Logic gọi API đăng ký ở đây
        message.success('Đăng ký tài khoản thành công! Vui lòng chờ quản trị viên duyệt.');
        navigate('/login'); // Chuyển hướng về trang đăng nhập sau khi đăng ký
    };

    return (
        <Card title={<Title level={3} style={{ textAlign: 'center' }}>Đăng ký Tài khoản Doanh nghiệp</Title>} style={{ width: 500, margin: 'auto' }}>
            <Form name="register" onFinish={onFinish} layout="vertical" scrollToFirstError>
                <Form.Item name="ten_dn" label="Tên doanh nghiệp" rules={[{ required: true, message: 'Vui lòng nhập tên doanh nghiệp!' }]}>
                    <Input prefix={<SolutionOutlined />} placeholder="Tên doanh nghiệp" />
                </Form.Item>
                <Form.Item name="ma_so_thue" label="Mã số thuế (dùng để đăng nhập)" rules={[{ required: true, message: 'Vui lòng nhập mã số thuế!' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Mã số thuế" />
                </Form.Item>
                <Form.Item name="email" label="Email liên hệ" rules={[{ type: 'email', message: 'Email không hợp lệ!' }, { required: true, message: 'Vui lòng nhập email!' }]}>
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item name="sdt" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                    <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                </Form.Item>
                <Form.Item name="dia_chi" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                    <Input prefix={<HomeOutlined />} placeholder="Địa chỉ" />
                </Form.Item>
                <Form.Item name="mat_khau" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]} hasFeedback>
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item name="confirm" label="Xác nhận mật khẩu" dependencies={['mat_khau']} hasFeedback rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('mat_khau') === value) { return Promise.resolve(); } return Promise.reject(new Error('Hai mật khẩu không khớp!')); } })]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
                </Form.Item>
                <Form.Item name="file_giay_phep" label="Giấy phép kinh doanh" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}>
                    <Upload name="logo" action="/upload.do" listType="picture" maxCount={1}>
                        <Button icon={<UploadOutlined />}>Tải lên</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Đăng ký</Button>
                </Form.Item>
                <div style={{ textAlign: 'center' }}>
                    Đã có tài khoản? <Link to="/auth/login">Đăng nhập ngay!</Link>
                </div>
            </Form>
        </Card>
    );
};

export default Register;
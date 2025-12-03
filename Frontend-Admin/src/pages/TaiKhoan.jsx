import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Row, Col, Typography, Divider, Avatar, Space } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const TaiKhoan = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Load thông tin user từ localStorage
  useEffect(() => {
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    setUserInfo(adminUser);
    
    // Set giá trị ban đầu cho form
    form.setFieldsValue({
      ten_hq: adminUser.ten_admin || '',
      email: adminUser.email || '',
      tai_khoan: adminUser.email || '', // Tạm dùng email làm tài khoản
    });
  }, [form]);

  // Xử lý cập nhật thông tin
  const handleUpdateInfo = async (values) => {
    try {
      setLoading(true);
      
      // TODO: Gọi API cập nhật thông tin
      // const response = await axios.put('/api/haiquan/profile', values);
      
      // Tạm thời chỉ update localStorage
      const updatedUser = {
        ...userInfo,
        ten_admin: values.ten_hq,
        email: values.email,
      };
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
      setUserInfo(updatedUser);
      
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      message.error('Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      
      if (values.mat_khau_moi !== values.xac_nhan_mat_khau) {
        message.error('Mật khẩu mới và xác nhận không khớp!');
        return;
      }

      // TODO: Gọi API đổi mật khẩu
      // const response = await axios.post('/api/haiquan/change-password', {
      //   mat_khau_cu: values.mat_khau_cu,
      //   mat_khau_moi: values.mat_khau_moi
      // });
      
      message.success('Đổi mật khẩu thành công!');
      form.resetFields(['mat_khau_cu', 'mat_khau_moi', 'xac_nhan_mat_khau']);
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      message.error('Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title level={3} style={{ marginBottom: 24 }}>Thông tin Tài khoản</Title>

      <Row gutter={[24, 24]}>
        {/* Card thông tin cá nhân */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                <span>Thông tin cá nhân</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            {/* Avatar và tên */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={100} 
                style={{ backgroundColor: '#1890ff', fontSize: 40 }} 
                icon={<UserOutlined />}
              />
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                {userInfo?.ten_admin || 'Admin'}
              </Title>
              <Text type="secondary">Quản trị viên Hải quan</Text>
            </div>

            <Divider />

            {/* Form thông tin */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateInfo}
            >
              <Form.Item
                name="ten_hq"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Nhập họ và tên"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="email@example.com"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="sdt"
                label="Số điện thoại"
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="0123456789"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="tai_khoan"
                label="Tài khoản"
              >
                <Input 
                  prefix={<UserOutlined />} 
                  disabled
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                  block
                >
                  Cập nhật thông tin
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Card đổi mật khẩu */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <LockOutlined />
                <span>Đổi mật khẩu</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Form
              layout="vertical"
              onFinish={handleChangePassword}
            >
              <Form.Item
                name="mat_khau_cu"
                label="Mật khẩu hiện tại"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Nhập mật khẩu hiện tại"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="mat_khau_moi"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Nhập mật khẩu mới"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="xac_nhan_mat_khau"
                label="Xác nhận mật khẩu mới"
                dependencies={['mat_khau_moi']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('mat_khau_moi') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Nhập lại mật khẩu mới"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<LockOutlined />}
                  loading={loading}
                  size="large"
                  block
                  danger
                >
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <div style={{ padding: '16px', background: '#fff7e6', borderRadius: '8px', border: '1px solid #ffd591' }}>
              <Text strong style={{ color: '#fa8c16' }}>⚠️ Lưu ý khi đổi mật khẩu:</Text>
              <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                <li><Text type="secondary">Mật khẩu phải có ít nhất 6 ký tự</Text></li>
                <li><Text type="secondary">Nên sử dụng kết hợp chữ, số và ký tự đặc biệt</Text></li>
                <li><Text type="secondary">Không chia sẻ mật khẩu với người khác</Text></li>
                <li><Text type="secondary">Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại</Text></li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TaiKhoan;

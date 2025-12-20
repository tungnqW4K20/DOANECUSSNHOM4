import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Row, Col, Typography, Divider, Avatar, Space, Progress } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, SaveOutlined, SafetyOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const TaiKhoan = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Load thông tin user từ localStorage
  useEffect(() => {
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    setUserInfo(adminUser);

    // Set giá trị ban đầu cho form
    form.setFieldsValue({
      ten_hq: adminUser.ten_admin || '',
      email: adminUser.email || '',
      tai_khoan: adminUser.email || '',
    });
  }, [form]);

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 30) return '#ff4d4f';
    if (strength < 60) return '#faad14';
    if (strength < 80) return '#1890ff';
    return '#52c41a';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 30) return 'Yếu';
    if (strength < 60) return 'Trung bình';
    if (strength < 80) return 'Khá';
    return 'Mạnh';
  };

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
      passwordForm.resetFields();
      setPasswordStrength(0);
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      message.error('Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <Title level={3} className="page-header-heading" style={{ marginBottom: 24 }}>
        👤 Thông tin Tài khoản
      </Title>

      <Row gutter={[24, 24]}>
        {/* Card thông tin cá nhân */}
        <Col xs={24} lg={12}>
          <Card
            className="content-card"
            style={{ height: '100%' }}
            bodyStyle={{ padding: 0 }}
          >
            {/* Gradient Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '40px 30px',
              textAlign: 'center',
              borderRadius: '12px 12px 0 0'
            }}>
              <Avatar
                size={100}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  border: '4px solid rgba(255, 255, 255, 0.5)',
                  marginBottom: '16px'
                }}
                icon={<UserOutlined style={{ fontSize: '48px' }} />}
              />
              <Title level={3} style={{ color: 'white', margin: '0 0 8px 0' }}>
                {userInfo?.ten_admin || 'Admin'}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                <SafetyOutlined /> Quản trị viên Hải quan
              </Text>
            </div>

            {/* Form thông tin */}
            <div style={{ padding: '30px' }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateInfo}
              >
                <Form.Item
                  name="ten_hq"
                  label={<span style={{ fontWeight: 500 }}>Họ và tên</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="Nhập họ và tên"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={<span style={{ fontWeight: 500 }}>Email</span>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="email@example.com"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="sdt"
                  label={<span style={{ fontWeight: 500 }}>Số điện thoại</span>}
                >
                  <Input
                    prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="0123456789"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="tai_khoan"
                  label={<span style={{ fontWeight: 500 }}>Tài khoản</span>}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                    disabled
                    size="large"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
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
            </div>
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
            className="content-card gradient-card"
            style={{ height: '100%' }}
          >
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
            >
              <Form.Item
                name="mat_khau_cu"
                label={<span style={{ fontWeight: 500 }}>Mật khẩu hiện tại</span>}
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Nhập mật khẩu hiện tại"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="mat_khau_moi"
                label={<span style={{ fontWeight: 500 }}>Mật khẩu mới</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Nhập mật khẩu mới"
                  size="large"
                  onChange={(e) => setPasswordStrength(calculatePasswordStrength(e.target.value))}
                />
              </Form.Item>

              {passwordStrength > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text type="secondary">Độ mạnh mật khẩu:</Text>
                    <Text strong style={{ color: getPasswordStrengthColor(passwordStrength) }}>
                      {getPasswordStrengthText(passwordStrength)}
                    </Text>
                  </div>
                  <Progress
                    percent={passwordStrength}
                    strokeColor={getPasswordStrengthColor(passwordStrength)}
                    showInfo={false}
                  />
                </div>
              )}

              <Form.Item
                name="xac_nhan_mat_khau"
                label={<span style={{ fontWeight: 500 }}>Xác nhận mật khẩu mới</span>}
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
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Nhập lại mật khẩu mới"
                  size="large"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 24 }}>
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

            <div style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%)',
              borderRadius: '8px',
              border: '1px solid #ffd591'
            }}>
              <Text strong style={{ color: '#fa8c16', display: 'block', marginBottom: 8 }}>
                ⚠️ Lưu ý khi đổi mật khẩu:
              </Text>
              <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                <li><Text type="secondary">Mật khẩu phải có ít nhất 6 ký tự</Text></li>
                <li><Text type="secondary">Nên sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</Text></li>
                <li><Text type="secondary">Không chia sẻ mật khẩu với người khác</Text></li>
                <li><Text type="secondary">Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại</Text></li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaiKhoan;

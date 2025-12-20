import { useState } from 'react';
import { Form, Input, Button, Typography, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post('http://localhost:3000/api/auth/login-haiquan', {
        tai_khoan: values.email,
        mat_khau: values.password,
      });

      if (response.data.success) {
        const { token, refreshToken, HaiQuan: userInfo } = response.data.data;

        localStorage.setItem('adminAuthToken', token);
        localStorage.setItem('adminRefreshToken', refreshToken);
        localStorage.setItem('adminUser', JSON.stringify({
          ten_admin: userInfo.ten_hq,
          email: values.email,
          role: 'admin',
        }));

        message.success({
          content: 'Đăng nhập thành công!',
          duration: 2,
        });

        setTimeout(() => navigate('/'), 500);
      } else {
        message.error(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Tài khoản hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div className="login-bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
        <div className="shape shape-4" />
      </div>

      {/* Login Card */}
      <div
        className="fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Top Gradient Bar */}
        <div
          style={{
            height: '6px',
            background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 50%, #06b6d4 100%)',
          }}
        />

        <div style={{ padding: '48px 40px 40px' }}>
          {/* Logo & Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 40px rgba(37, 99, 235, 0.4)',
                transform: 'rotate(-5deg)',
                transition: 'transform 0.3s ease',
              }}
              className="hover-scale"
            >
              <SafetyOutlined style={{ fontSize: '40px', color: 'white' }} />
            </div>

            <Title
              level={2}
              style={{
                margin: '0 0 8px 0',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                letterSpacing: '-0.5px',
              }}
            >
              SXXK Admin
            </Title>
            <Text style={{ color: '#64748b', fontSize: '15px' }}>
              Hệ thống Quản lý Xuất Nhập Khẩu
            </Text>
          </div>

          {/* Login Form */}
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập tài khoản!' },
                { min: 3, message: 'Tài khoản phải có ít nhất 3 ký tự!' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#94a3b8', fontSize: '18px' }} />}
                placeholder="Tài khoản"
                style={{
                  height: '52px',
                  borderRadius: '14px',
                  fontSize: '15px',
                  border: '2px solid #e2e8f0',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#94a3b8', fontSize: '18px' }} />}
                placeholder="Mật khẩu"
                style={{
                  height: '52px',
                  borderRadius: '14px',
                  fontSize: '15px',
                  border: '2px solid #e2e8f0',
                }}
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Checkbox style={{ color: '#64748b' }}>Ghi nhớ đăng nhập</Checkbox>
                <a
                  href="#"
                  style={{ color: '#2563eb', fontWeight: 500, fontSize: '14px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    message.info('Vui lòng liên hệ quản trị viên để khôi phục mật khẩu');
                  }}
                >
                  Quên mật khẩu?
                </a>
              </div>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: '54px',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {loading ? 'Đang đăng nhập...' : (
                  <>
                    Đăng nhập
                    <ArrowRightOutlined />
                  </>
                )}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <Text style={{ color: '#94a3b8', fontSize: '13px' }}>
              © 2025 SXXK System. All rights reserved.
            </Text>
          </div>
        </div>
      </div>

      {/* Background Styles */}
      <style>{`
        .login-bg-shapes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        
        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .shape-1 {
          width: 400px;
          height: 400px;
          top: -100px;
          left: -100px;
          animation: float 8s ease-in-out infinite;
        }
        
        .shape-2 {
          width: 300px;
          height: 300px;
          bottom: -50px;
          right: -50px;
          animation: float 10s ease-in-out infinite reverse;
        }
        
        .shape-3 {
          width: 200px;
          height: 200px;
          top: 50%;
          left: 10%;
          animation: float 12s ease-in-out infinite;
        }
        
        .shape-4 {
          width: 150px;
          height: 150px;
          top: 20%;
          right: 15%;
          animation: float 9s ease-in-out infinite reverse;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;

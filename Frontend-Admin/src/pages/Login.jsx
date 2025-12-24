import { useState } from 'react';
import { Form, Input, Button, Typography, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, ArrowRightOutlined, GlobalOutlined, FileProtectOutlined, TeamOutlined } from '@ant-design/icons';
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
        message.success({ content: 'Đăng nhập thành công!', duration: 2 });
        setTimeout(() => navigate('/'), 500);
      } else {
        message.error(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Tài khoản hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <GlobalOutlined />, title: 'Quản lý Xuất Nhập Khẩu', desc: 'Theo dõi toàn bộ hoạt động XNK' },
    { icon: <FileProtectOutlined />, title: 'Báo cáo Chi tiết', desc: 'Thống kê theo thời gian thực' },
    { icon: <TeamOutlined />, title: 'Quản lý Doanh nghiệp', desc: 'Giám sát các doanh nghiệp' },
  ];

  return (
    <div className="login-wrapper" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', overflow: 'hidden' }}>
      {/* Left Side */}
      <div
        className="left-panel"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>

        <div className="particles">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '32px' }}>
            <div
              className="logo-icon"
              style={{
                width: '64px',
                height: '64px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <SafetyOutlined style={{ fontSize: '32px', color: 'white' }} />
            </div>
            <Title level={2} style={{ color: 'white', margin: 0, fontSize: '32px', fontWeight: 700 }}>
              SXXK Admin
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
              Hệ thống Quản lý Sản xuất Xuất khẩu
            </Text>
          </div>

          <div>
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '16px',
                  padding: '14px 18px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  {feature.icon}
                </div>
                <div>
                  <Text strong style={{ color: 'white', fontSize: '14px', display: 'block' }}>
                    {feature.title}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                    {feature.desc}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 80px',
          background: '#fff',
        }}
      >
        <div className="login-form-container" style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '28px' }}>
            <Title level={3} style={{ margin: '0 0 6px 0', color: '#1e293b', fontWeight: 700 }}>
              Đăng nhập
            </Title>
            <Text style={{ color: '#64748b', fontSize: '14px' }}>
              Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
            </Text>
          </div>

          <Form form={form} name="login" onFinish={onFinish} layout="vertical" requiredMark={false}>
            <Form.Item
              name="email"
              label={<span style={{ fontWeight: 500, color: '#374151', fontSize: '13px' }}>Tài khoản</span>}
              rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
              style={{ marginBottom: '16px' }}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                placeholder="Nhập tài khoản"
                className="login-input"
                style={{ height: '44px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 500, color: '#374151', fontSize: '13px' }}>Mật khẩu</span>}
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              style={{ marginBottom: '16px' }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                placeholder="Nhập mật khẩu"
                className="login-input"
                style={{ height: '44px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Checkbox style={{ color: '#64748b', fontSize: '13px' }}>Ghi nhớ</Checkbox>
                <a href="#" style={{ color: '#2563eb', fontWeight: 500, fontSize: '13px' }} onClick={(e) => { e.preventDefault(); message.info('Liên hệ quản trị viên'); }}>
                  Quên mật khẩu?
                </a>
              </div>
            </Form.Item>

            <Form.Item style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="login-btn"
                style={{
                  height: '46px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                }}
              >
                {loading ? 'Đang đăng nhập...' : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    Đăng nhập <ArrowRightOutlined />
                  </span>
                )}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <Text style={{ color: '#94a3b8', fontSize: '12px' }}>© 2025 SXXK System</Text>
          </div>
        </div>
      </div>

      <style>{`
        html, body, #root { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; }
        .login-wrapper { position: fixed; top: 0; left: 0; right: 0; bottom: 0; }
        .bg-shapes { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .shape { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.08); }
        .shape-1 { width: 400px; height: 400px; top: -100px; left: -100px; animation: float 8s ease-in-out infinite; }
        .shape-2 { width: 300px; height: 300px; bottom: -80px; right: -80px; animation: float 10s ease-in-out infinite reverse; }
        .shape-3 { width: 200px; height: 200px; top: 50%; left: 60%; animation: float 12s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .particles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .particle { position: absolute; width: 5px; height: 5px; background: rgba(255, 255, 255, 0.4); border-radius: 50%; animation: rise 18s infinite; }
        .particle-1 { left: 10%; animation-delay: 0s; } .particle-2 { left: 20%; animation-delay: 2s; }
        .particle-3 { left: 30%; animation-delay: 4s; } .particle-4 { left: 40%; animation-delay: 6s; }
        .particle-5 { left: 50%; animation-delay: 8s; } .particle-6 { left: 60%; animation-delay: 10s; }
        .particle-7 { left: 70%; animation-delay: 12s; } .particle-8 { left: 80%; animation-delay: 14s; }
        .particle-9 { left: 90%; animation-delay: 16s; } .particle-10 { left: 95%; animation-delay: 1s; }
        @keyframes rise { 0% { transform: translateY(100vh); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 0.5; } 100% { transform: translateY(-50px); opacity: 0; } }
        .logo-icon { animation: pulse 3s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .feature-item { animation: slideIn 0.5s ease-out backwards; transition: transform 0.3s ease; }
        .feature-item:hover { transform: translateX(8px); }
        .feature-item:nth-child(1) { animation-delay: 0.1s; }
        .feature-item:nth-child(2) { animation-delay: 0.2s; }
        .feature-item:nth-child(3) { animation-delay: 0.3s; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .login-form-container { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .login-input:focus, .login-input:hover { border-color: #2563eb !important; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important; }
        .login-btn { transition: all 0.3s ease !important; }
        .login-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(37, 99, 235, 0.4) !important; }
        @media (max-width: 900px) { .left-panel { display: none !important; } }
      `}</style>
    </div>
  );
};

export default Login;

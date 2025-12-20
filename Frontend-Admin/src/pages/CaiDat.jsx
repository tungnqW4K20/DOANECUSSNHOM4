import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Switch, Select, Button, Divider, Space, message, Radio } from 'antd';
import {
  Sun,
  Moon,
  Bell,
  Globe,
  Shield,
  Database,
  Zap,
  Eye,
  Save,
  RotateCcw,
  Minimize2,
  Sparkles,
  Clock,
  LogOut,
  HardDrive,
  Trash2,
} from 'lucide-react';

const { Title, Text } = Typography;
const { Option } = Select;

const CaiDat = () => {
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'vi',
    notifications: localStorage.getItem('notifications') !== 'false',
    autoSave: localStorage.getItem('autoSave') !== 'false',
    compactMode: localStorage.getItem('compactMode') === 'true',
    animationsEnabled: localStorage.getItem('animationsEnabled') !== 'false',
    dataRefreshInterval: localStorage.getItem('dataRefreshInterval') || '30',
    pageSize: localStorage.getItem('defaultPageSize') || '10',
  });

  useEffect(() => {
    // Apply theme
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.style.setProperty('--bg-color', '#0f172a');
      root.style.setProperty('--bg-white', '#1e293b');
      root.style.setProperty('--text-primary', '#f1f5f9');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--border-color', '#334155');
      document.body.style.background = '#0f172a';
    } else {
      root.style.setProperty('--bg-color', '#f1f5f9');
      root.style.setProperty('--bg-white', '#ffffff');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#64748b');
      root.style.setProperty('--border-color', '#e2e8f0');
      document.body.style.background = '#f1f5f9';
    }
  }, [settings.theme]);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(key, value);
    message.success('Đã lưu cài đặt');
  };

  const handleSaveAll = () => {
    Object.keys(settings).forEach(key => {
      localStorage.setItem(key, settings[key]);
    });
    message.success({
      content: 'Đã lưu tất cả cài đặt!',
      icon: <Save size={16} style={{ color: '#52c41a' }} />,
    });
  };

  const handleResetDefaults = () => {
    const defaults = {
      theme: 'light',
      language: 'vi',
      notifications: true,
      autoSave: true,
      compactMode: false,
      animationsEnabled: true,
      dataRefreshInterval: '30',
      pageSize: '10',
    };
    setSettings(defaults);
    Object.keys(defaults).forEach(key => {
      localStorage.setItem(key, defaults[key]);
    });
    message.info('Đã khôi phục cài đặt mặc định');
  };

  return (
    <div>
      {/* Header */}
      <div className="fade-in" style={{ marginBottom: '24px' }}>
        <Title level={3} className="page-header-heading" style={{ margin: 0 }}>
          Cài đặt hệ thống
        </Title>
        <Text style={{ color: '#64748b', marginTop: '8px', display: 'block' }}>
          Tùy chỉnh giao diện và hành vi của hệ thống
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {/* Giao diện */}
        <Col xs={24} lg={12}>
          <Card
            className="content-card gradient-card fade-in-up stagger-1"
            title={
              <Space>
                <Sun size={18} style={{ color: '#2563eb' }} />
                <span>Giao diện</span>
              </Space>
            }
          >
            {/* Theme */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text strong>Chế độ hiển thị</Text>
              </div>
              <Radio.Group
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                style={{ width: '100%' }}
                buttonStyle="solid"
              >
                <Radio.Button value="light" style={{ width: '50%', textAlign: 'center', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Space>
                    <Sun size={18} />
                    <span>Sáng</span>
                  </Space>
                </Radio.Button>
                <Radio.Button value="dark" style={{ width: '50%', textAlign: 'center', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Space>
                    <Moon size={18} />
                    <span>Tối</span>
                  </Space>
                </Radio.Button>
              </Radio.Group>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                Chọn chế độ sáng hoặc tối cho giao diện
              </Text>
            </div>

            <Divider />

            {/* Compact Mode */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <Text strong><Minimize2 size={14} style={{ marginRight: '6px' }} />Chế độ thu gọn</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Giảm khoảng cách giữa các phần tử
                </Text>
              </div>
              <Switch
                checked={settings.compactMode}
                onChange={(checked) => handleSettingChange('compactMode', checked)}
              />
            </div>

            {/* Animations */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong><Sparkles size={14} style={{ marginRight: '6px' }} />Hiệu ứng chuyển động</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Bật/tắt animation và transition
                </Text>
              </div>
              <Switch
                checked={settings.animationsEnabled}
                onChange={(checked) => handleSettingChange('animationsEnabled', checked)}
              />
            </div>
          </Card>
        </Col>

        {/* Ngôn ngữ & Khu vực */}
        <Col xs={24} lg={12}>
          <Card
            className="content-card gradient-card fade-in-up stagger-2"
            title={
              <Space>
                <Globe size={18} style={{ color: '#10b981' }} />
                <span>Ngôn ngữ & Khu vực</span>
              </Space>
            }
          >
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text strong>Ngôn ngữ hiển thị</Text>
              </div>
              <Select
                value={settings.language}
                onChange={(value) => handleSettingChange('language', value)}
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="vi">🇻🇳 Tiếng Việt</Option>
                <Option value="en">🇬🇧 English</Option>
                <Option value="zh">🇨🇳 中文</Option>
              </Select>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                Chọn ngôn ngữ hiển thị cho giao diện
              </Text>
            </div>

            <Divider />

            <div>
              <div style={{ marginBottom: '8px' }}>
                <Text strong>Số bản ghi mặc định</Text>
              </div>
              <Select
                value={settings.pageSize}
                onChange={(value) => handleSettingChange('pageSize', value)}
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="5">5 bản ghi/trang</Option>
                <Option value="10">10 bản ghi/trang</Option>
                <Option value="15">15 bản ghi/trang</Option>
                <Option value="50">50 bản ghi/trang</Option>
                <Option value="100">100 bản ghi/trang</Option>
              </Select>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                Số lượng bản ghi hiển thị mặc định trong bảng
              </Text>
            </div>
          </Card>
        </Col>

        {/* Thông báo */}
        <Col xs={24} lg={12}>
          <Card
            className="content-card gradient-card fade-in-up stagger-3"
            title={
              <Space>
                <Bell size={18} style={{ color: '#f59e0b' }} />
                <span>Thông báo</span>
              </Space>
            }
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <Text strong>Bật thông báo</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Hiển thị thông báo khi có sự kiện
                </Text>
              </div>
              <Switch
                checked={settings.notifications}
                onChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>

            <Divider />

            <div>
              <div style={{ marginBottom: '8px' }}>
                <Text strong><Clock size={14} style={{ marginRight: '6px' }} />Tần suất làm mới dữ liệu</Text>
              </div>
              <Select
                value={settings.dataRefreshInterval}
                onChange={(value) => handleSettingChange('dataRefreshInterval', value)}
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="10">10 giây</Option>
                <Option value="30">30 giây</Option>
                <Option value="60">1 phút</Option>
                <Option value="300">5 phút</Option>
                <Option value="0">Không tự động</Option>
              </Select>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                Thời gian tự động làm mới dữ liệu
              </Text>
            </div>
          </Card>
        </Col>

        {/* Hiệu suất */}
        <Col xs={24} lg={12}>
          <Card
            className="content-card gradient-card fade-in-up stagger-4"
            title={
              <Space>
                <Zap size={18} style={{ color: '#8b5cf6' }} />
                <span>Hiệu suất</span>
              </Space>
            }
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <Text strong>Tự động lưu</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Tự động lưu thay đổi khi chỉnh sửa
                </Text>
              </div>
              <Switch
                checked={settings.autoSave}
                onChange={(checked) => handleSettingChange('autoSave', checked)}
              />
            </div>

            <Divider />

            <div style={{ 
              background: '#f8fafc', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Bộ nhớ cache</Text>
                  <Text strong>~2.4 MB</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Dữ liệu local</Text>
                  <Text strong>~1.8 MB</Text>
                </div>
                <Button 
                  type="link" 
                  danger 
                  size="small" 
                  style={{ padding: 0 }}
                  icon={<Trash2 size={14} />}
                  onClick={() => {
                    localStorage.clear();
                    message.warning('Đã xóa cache và dữ liệu local');
                  }}
                >
                  Xóa cache và dữ liệu
                </Button>
              </Space>
            </div>
          </Card>
        </Col>

        {/* Bảo mật */}
        <Col xs={24}>
          <Card
            className="content-card gradient-card fade-in-up stagger-5"
            title={
              <Space>
                <Shield size={18} style={{ color: '#ef4444' }} />
                <span>Bảo mật & Quyền riêng tư</span>
              </Space>
            }
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div style={{ 
                  background: '#fef2f2', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #fecaca'
                }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong style={{ color: '#991b1b' }}>
                      <Shield size={16} style={{ marginRight: '8px' }} />
                      Phiên đăng nhập
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Tự động đăng xuất sau 30 phút không hoạt động
                    </Text>
                    <Button size="small" danger icon={<LogOut size={14} />}>
                      Đăng xuất tất cả thiết bị
                    </Button>
                  </Space>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ 
                  background: '#eff6ff', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #bfdbfe'
                }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong style={{ color: '#1e40af' }}>
                      <Database size={16} style={{ marginRight: '8px' }} />
                      Sao lưu dữ liệu
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Lần sao lưu cuối: Hôm nay, 10:30
                    </Text>
                    <Button size="small" type="primary" icon={<HardDrive size={14} />}>
                      Sao lưu ngay
                    </Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Card className="content-card fade-in-up stagger-6" style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Eye size={16} style={{ color: '#64748b' }} />
            <Text type="secondary">
              Các thay đổi được lưu tự động
            </Text>
          </Space>
          <Space>
            <Button icon={<RotateCcw size={16} />} onClick={handleResetDefaults}>
              Khôi phục mặc định
            </Button>
            <Button type="primary" icon={<Save size={16} />} onClick={handleSaveAll}>
              Lưu tất cả
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default CaiDat;

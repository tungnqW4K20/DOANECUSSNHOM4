import { useState, useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
  Avatar, 
  Tag, 
  Spin, 
  message,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Modal,
  Form,
  Input,
  Upload
} from 'antd';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Building2,
  Shield,
  Calendar,
  Edit,
  Camera,
  Save,
  X
} from 'lucide-react';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [businessInfo, setBusinessInfo] = useState(null);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      try {
        // Lấy thông tin từ localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setBusinessInfo(user);
        form.setFieldsValue(user);
      } catch {
        message.error('Không thể tải thông tin doanh nghiệp');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [form]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    form.setFieldsValue(businessInfo);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // Cập nhật localStorage
      const updatedInfo = { ...businessInfo, ...values };
      localStorage.setItem('user', JSON.stringify(updatedInfo));
      setBusinessInfo(updatedInfo);
      
      message.success('Cập nhật thông tin thành công!');
      setEditMode(false);
    } catch {
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'approved': { color: 'success', text: 'Đã duyệt' },
      'pending': { color: 'warning', text: 'Chờ duyệt' },
      'rejected': { color: 'error', text: 'Từ chối' },
      'active': { color: 'success', text: 'Hoạt động' },
    };
    return statusMap[status] || { color: 'default', text: status || 'Không xác định' };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  const statusInfo = getStatusColor(businessInfo?.status);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '40px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)'
        }} />
        
        <Row gutter={24} align="middle">
          <Col>
            <div style={{ position: 'relative' }}>
              <Avatar
                size={120}
                style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  border: '4px solid white',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
                icon={<Building2 size={60} />}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: 'white',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}>
                <Camera size={18} color="#667eea" />
              </div>
            </div>
          </Col>
          <Col flex={1}>
            <Title level={2} style={{ color: 'white', margin: 0, marginBottom: 8 }}>
              {businessInfo?.ten_dn || 'Tên doanh nghiệp'}
            </Title>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: 12 }}>
              <Tag 
                color={statusInfo.color} 
                style={{ 
                  fontSize: '14px', 
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: 'none'
                }}
              >
                <Shield size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                {statusInfo.text}
              </Tag>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                <FileText size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                MST: {businessInfo?.ma_so_thue || 'Chưa cập nhật'}
              </Text>
            </div>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
              Thành viên từ {new Date().getFullYear()}
            </Text>
          </Col>
          <Col>
            {!editMode ? (
              <Button
                type="primary"
                size="large"
                icon={<Edit size={18} />}
                onClick={handleEdit}
                style={{
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  borderRadius: '10px',
                  height: '44px',
                  padding: '0 24px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  size="large"
                  icon={<X size={18} />}
                  onClick={handleCancel}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    height: '44px',
                    padding: '0 20px'
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<Save size={18} />}
                  onClick={handleSave}
                  style={{
                    background: 'white',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: '10px',
                    height: '44px',
                    padding: '0 24px',
                    fontWeight: 600
                  }}
                >
                  Lưu
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </div>

      {/* Content Section */}
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="#667eea" />
                <span>Thông tin doanh nghiệp</span>
              </div>
            }
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              marginBottom: '24px'
            }}
          >
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span>
                        <Building2 size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                        Tên doanh nghiệp
                      </span>
                    }
                    name="ten_dn"
                    rules={[{ required: true, message: 'Vui lòng nhập tên doanh nghiệp' }]}
                  >
                    {editMode ? (
                      <Input size="large" placeholder="Nhập tên doanh nghiệp" />
                    ) : (
                      <div style={{ 
                        padding: '8px 12px', 
                        background: '#f8fafc', 
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}>
                        {businessInfo?.ten_dn || 'Chưa cập nhật'}
                      </div>
                    )}
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span>
                        <FileText size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                        Mã số thuế
                      </span>
                    }
                    name="ma_so_thue"
                    rules={[{ required: true, message: 'Vui lòng nhập mã số thuế' }]}
                  >
                    {editMode ? (
                      <Input size="large" placeholder="Nhập mã số thuế" disabled />
                    ) : (
                      <div style={{ 
                        padding: '8px 12px', 
                        background: '#f8fafc', 
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}>
                        {businessInfo?.ma_so_thue || 'Chưa cập nhật'}
                      </div>
                    )}
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span>
                        <Mail size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                        Email
                      </span>
                    }
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    {editMode ? (
                      <Input size="large" placeholder="Nhập email" />
                    ) : (
                      <div style={{ 
                        padding: '8px 12px', 
                        background: '#f8fafc', 
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}>
                        {businessInfo?.email || 'Chưa cập nhật'}
                      </div>
                    )}
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span>
                        <Phone size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                        Số điện thoại
                      </span>
                    }
                    name="sdt"
                  >
                    {editMode ? (
                      <Input size="large" placeholder="Nhập số điện thoại" />
                    ) : (
                      <div style={{ 
                        padding: '8px 12px', 
                        background: '#f8fafc', 
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}>
                        {businessInfo?.sdt || 'Chưa cập nhật'}
                      </div>
                    )}
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label={
                      <span>
                        <MapPin size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                        Địa chỉ
                      </span>
                    }
                    name="dia_chi"
                  >
                    {editMode ? (
                      <TextArea 
                        size="large" 
                        rows={3} 
                        placeholder="Nhập địa chỉ doanh nghiệp" 
                      />
                    ) : (
                      <div style={{ 
                        padding: '8px 12px', 
                        background: '#f8fafc', 
                        borderRadius: '8px',
                        fontSize: '15px',
                        minHeight: '80px'
                      }}>
                        {businessInfo?.dia_chi || 'Chưa cập nhật'}
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Status Card */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="#667eea" />
                <span>Trạng thái tài khoản</span>
              </div>
            }
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              marginBottom: '24px'
            }}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${
                  statusInfo.color === 'success' ? '#52c41a, #73d13d' :
                  statusInfo.color === 'warning' ? '#faad14, #ffc53d' :
                  '#ff4d4f, #ff7875'
                })`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}>
                <Shield size={40} color="white" />
              </div>
              <Title level={4} style={{ marginBottom: 8 }}>
                {statusInfo.text}
              </Title>
              <Text type="secondary">
                {statusInfo.color === 'success' 
                  ? 'Tài khoản đã được xác thực và hoạt động bình thường'
                  : statusInfo.color === 'warning'
                  ? 'Tài khoản đang chờ xét duyệt từ quản trị viên'
                  : 'Tài khoản đã bị từ chối hoặc tạm khóa'
                }
              </Text>
            </div>
          </Card>

          {/* Document Card */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#667eea" />
                <span>Giấy phép kinh doanh</span>
              </div>
            }
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            {businessInfo?.file_giay_phep ? (
              <div>
                <div style={{
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  <FileText size={48} color="#667eea" style={{ marginBottom: 8 }} />
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                    {businessInfo.file_giay_phep}
                  </Text>
                </div>
                <Button type="primary" block style={{ borderRadius: '8px' }}>
                  Xem giấy phép
                </Button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <FileText size={48} color="#d1d5db" style={{ marginBottom: 12 }} />
                <Text type="secondary">Chưa tải lên giấy phép</Text>
                {editMode && (
                  <Upload style={{ marginTop: 16 }}>
                    <Button type="dashed" block style={{ borderRadius: '8px' }}>
                      Tải lên giấy phép
                    </Button>
                  </Upload>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from 'react';
import { 
  Card, 
  Avatar, 
  Tag, 
  Spin, 
  Row,
  Col,
  Typography,
  Button,
  Form,
  Input,
  Upload,
  App
} from 'antd';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Building2,
  Shield,
  Edit,
  Camera,
  Save,
  X,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import profileService from '../../services/profile.service';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [businessInfo, setBusinessInfo] = useState(null);
  const { notification } = App.useApp();

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await profileService.getProfile();
      if (response.success) {
        setBusinessInfo(response.data);
        form.setFieldsValue(response.data);
      } else {
        notification.error({
          message: 'Lỗi tải dữ liệu',
          description: 'Không thể tải thông tin doanh nghiệp',
          placement: 'topRight'
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi kết nối',
        description: error.response?.data?.message || 'Không thể kết nối đến máy chủ',
        placement: 'topRight'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi component mount

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
      
      const response = await profileService.updateProfile(values);
      
      if (response.success) {
        setBusinessInfo(response.data);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Thông tin doanh nghiệp đã được cập nhật',
          placement: 'topRight'
        });
        setEditMode(false);
      } else {
        notification.error({
          message: 'Cập nhật thất bại',
          description: response.message || 'Không thể cập nhật thông tin',
          placement: 'topRight'
        });
      }
    } catch (error) {
      if (error.errorFields) {
        notification.warning({
          message: 'Thông tin chưa hợp lệ',
          description: 'Vui lòng kiểm tra lại các trường thông tin',
          placement: 'topRight'
        });
      } else {
        notification.error({
          message: 'Lỗi cập nhật',
          description: error.response?.data?.message || 'Không thể cập nhật thông tin',
          placement: 'topRight'
        });
      }
    }
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      'APPROVED': { 
        color: '#52c41a', 
        text: 'Đã duyệt',
        icon: <CheckCircle size={40} />,
        description: 'Tài khoản đã được xác thực và hoạt động bình thường'
      },
      'PENDING': { 
        color: '#faad14', 
        text: 'Chờ duyệt',
        icon: <Clock size={40} />,
        description: 'Tài khoản đang chờ xét duyệt từ quản trị viên'
      },
      'REJECTED': { 
        color: '#ff4d4f', 
        text: 'Từ chối',
        icon: <XCircle size={40} />,
        description: 'Tài khoản đã bị từ chối. Vui lòng liên hệ quản trị viên'
      },
      'ACTIVE': { 
        color: '#52c41a', 
        text: 'Hoạt động',
        icon: <CheckCircle size={40} />,
        description: 'Tài khoản đang hoạt động bình thường'
      },
    };
    return statusMap[status] || { 
      color: '#d9d9d9', 
      text: status || 'Không xác định',
      icon: <Shield size={40} />,
      description: 'Trạng thái không xác định'
    };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  const statusConfig = getStatusConfig(businessInfo?.status);

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
                style={{ 
                  fontSize: '14px', 
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: statusConfig.color,
                  color: 'white',
                  fontWeight: 600
                }}
              >
                {statusConfig.text}
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
                icon={<Edit size={18} color="white" />}
                onClick={handleEdit}
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  height: '44px',
                  padding: '0 24px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                }}
              >
                <span style={{ color: 'white' }}>Chỉnh sửa</span>
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
                    padding: '0 24px',
                    fontWeight: 600
                  }}
                >
                  <span style={{ color: 'white' }}>Hủy</span>
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<Save size={18} color="white" />}
                  onClick={handleSave}
                  style={{
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    height: '44px',
                    padding: '0 24px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  <span style={{ color: 'white' }}>Lưu</span>
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
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: statusConfig.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: `0 8px 24px ${statusConfig.color}40`,
                color: 'white'
              }}>
                {statusConfig.icon}
              </div>
              <Title level={4} style={{ marginBottom: 12, color: statusConfig.color }}>
                {statusConfig.text}
              </Title>
              <Text type="secondary" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                {statusConfig.description}
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

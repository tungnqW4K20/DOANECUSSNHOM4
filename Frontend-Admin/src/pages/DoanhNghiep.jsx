import { useState, useEffect } from 'react';
import {
  Table, Button, Space, Tag, Row, Col, Typography, Card,
  Input, Spin, Drawer, Descriptions, Modal, Form, Upload, Dropdown, Statistic, Empty
} from 'antd';
import {
  EyeOutlined, CheckCircleOutlined, CloseCircleOutlined,
  MoreOutlined, UploadOutlined, ReloadOutlined, InboxOutlined,
  SearchOutlined, TeamOutlined
} from '@ant-design/icons';
import { businessAdminAPI } from '../services/api.service';
import { showApproveSuccess, showRejectSuccess, showUploadSuccess, showLoadError, showUploadError, showInfo } from '../utils/notification.jsx';

const { Title, Text } = Typography;
const { Search } = Input;
const { Dragger } = Upload;

const DoanhNghiep = () => {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedDN, setSelectedDN] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadForm] = Form.useForm();
  const [selectedDNForAction, setSelectedDNForAction] = useState(null);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const response = await businessAdminAPI.getAll();
      const data = response.data;
      const businesses = data.data || data || [];
      setDataSource(businesses);
      setFilteredData(businesses);
    } catch (error) {
      console.error('Error loading businesses:', error);
      showLoadError('danh sách doanh nghiệp');
      setDataSource([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = dataSource.filter(
      (item) =>
        item.ten_dn?.toLowerCase().includes(value.toLowerCase()) ||
        item.ma_so_thue?.toLowerCase().includes(value.toLowerCase()) ||
        item.email?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const showDrawer = (record) => {
    setSelectedDN(record);
    setDrawerVisible(true);
  };

  const handleApprove = async (id_dn) => {
    try {
      await businessAdminAPI.approve(id_dn);
      showApproveSuccess('Doanh nghiệp');
      loadBusinesses();
    } catch {
      showLoadError('Không thể duyệt doanh nghiệp');
    }
  };

  const showRejectModal = (record) => {
    setSelectedDNForAction(record);
    setRejectModalVisible(true);
  };

  const handleReject = async () => {
    try {
      await businessAdminAPI.reject(selectedDNForAction.id_dn);
      showRejectSuccess(`Doanh nghiệp "${selectedDNForAction.ten_dn}"`);
      setRejectModalVisible(false);
      loadBusinesses();
    } catch {
      showLoadError('Không thể từ chối doanh nghiệp');
    }
  };

  const showUploadModal = (record) => {
    setSelectedDNForAction(record);
    setUploadModalVisible(true);
    uploadForm.resetFields();
  };

  const handleUpload = async (values) => {
    try {
      const file = values.file?.fileList?.[0]?.originFileObj;
      if (!file) {
        showInfo('Vui lòng chọn file', 'Bạn cần chọn một file để upload');
        return;
      }
      const response = await businessAdminAPI.uploadLicense(selectedDNForAction.id_dn, file);
      const fileUrl = response.data?.data?.imageUrl || response.data?.imageUrl;
      if (fileUrl) {
        setDataSource(dataSource.map(item =>
          item.id_dn === selectedDNForAction.id_dn ? { ...item, file_giay_phep: fileUrl } : item
        ));
        setFilteredData(filteredData.map(item =>
          item.id_dn === selectedDNForAction.id_dn ? { ...item, file_giay_phep: fileUrl } : item
        ));
      }
      showUploadSuccess('Giấy phép kinh doanh');
      setUploadModalVisible(false);
    } catch {
      showUploadError();
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 1: return <Tag color="success">Đã duyệt</Tag>;
      case 2: return <Tag color="error">Đã từ chối</Tag>;
      case 0: return <Tag color="warning">Chờ duyệt</Tag>;
      default: return <Tag color="default">{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Tên Doanh nghiệp',
      dataIndex: 'ten_dn',
      key: 'ten_dn',
      width: '26%',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '11px', flexShrink: 0,
          }}>
            {text?.substring(0, 2)}
          </div>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.ten_dn?.localeCompare(b.ten_dn),
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'ma_so_thue',
      key: 'ma_so_thue',
      width: '14%',
      render: (text) => <span style={{ color: '#475569', fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '22%',
      ellipsis: true,
      render: (text) => <span style={{ color: '#64748b' }}>{text || '—'}</span>,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'sdt',
      key: 'sdt',
      width: '14%',
      render: (text) => <span style={{ color: '#64748b' }}>{text || '—'}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      width: '12%',
      render: getStatusTag,
      filters: [
        { text: 'Chờ duyệt', value: 0 },
        { text: 'Đã duyệt', value: 1 },
        { text: 'Đã từ chối', value: 2 },
      ],
      onFilter: (value, record) => record.trang_thai === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '12%',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EyeOutlined />} onClick={() => showDrawer(record)} size="small" />
          <Dropdown menu={{
            items: [
              { key: 'approve', label: 'Duyệt', icon: <CheckCircleOutlined />, onClick: () => handleApprove(record.id_dn), disabled: record.trang_thai === 1 },
              { key: 'reject', label: 'Từ chối', icon: <CloseCircleOutlined />, onClick: () => showRejectModal(record), disabled: record.trang_thai === 2 },
              { key: 'upload', label: 'Upload GPKD', icon: <UploadOutlined />, onClick: () => showUploadModal(record) }
            ]
          }}>
            <Button icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const totalCount = dataSource.length;
  const approvedCount = dataSource.filter(item => item.trang_thai === 1).length;
  const pendingCount = dataSource.filter(item => item.trang_thai === 0).length;
  const rejectedCount = dataSource.filter(item => item.trang_thai === 2).length;

  return (
    <div>
      {/* Header */}
      <div className="fade-in" style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} className="page-header-heading" style={{ margin: 0 }}>
              Quản lý Doanh nghiệp
            </Title>
            <Text style={{ color: '#64748b', marginTop: '8px', display: 'block' }}>
              Quản lý và duyệt đăng ký doanh nghiệp xuất nhập khẩu
            </Text>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={loadBusinesses}>
              Làm mới
            </Button>
          </Col>
        </Row>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card hover-lift fade-in-up stagger-1" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: 'none' }}>
            <Statistic title={<span style={{ color: '#64748b' }}>Tổng doanh nghiệp</span>} value={totalCount} prefix={<TeamOutlined style={{ color: '#2563eb' }} />} valueStyle={{ color: '#2563eb', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card hover-lift fade-in-up stagger-2" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: 'none' }}>
            <Statistic title={<span style={{ color: '#64748b' }}>Đã duyệt</span>} value={approvedCount} prefix={<CheckCircleOutlined style={{ color: '#16a34a' }} />} valueStyle={{ color: '#16a34a', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card hover-lift fade-in-up stagger-3" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: 'none' }}>
            <Statistic title={<span style={{ color: '#64748b' }}>Chờ duyệt</span>} value={pendingCount} prefix={<TeamOutlined style={{ color: '#d97706' }} />} valueStyle={{ color: '#d97706', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card hover-lift fade-in-up stagger-4" style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)', border: 'none' }}>
            <Statistic title={<span style={{ color: '#64748b' }}>Đã từ chối</span>} value={rejectedCount} prefix={<CloseCircleOutlined style={{ color: '#dc2626' }} />} valueStyle={{ color: '#dc2626', fontWeight: 700 }} />
          </Card>
        </Col>
      </Row>

      {/* Search & Table */}
      <Card className="content-card gradient-card fade-in-up stagger-2">
        <div style={{ marginBottom: '20px' }}>
          <Search
            placeholder="Tìm kiếm theo tên, mã số thuế, email..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </div>

        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id_dn"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} doanh nghiệp`,
            }}
            locale={{
              emptyText: <Empty description={searchText ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu'} />,
            }}

          />
        </Spin>
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={<Space><TeamOutlined /><span>Thông tin chi tiết Doanh nghiệp</span></Space>}
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedDN && (
          <Descriptions column={1} labelStyle={{ fontWeight: 500 }}>
            <Descriptions.Item label="Tên DN">{selectedDN.ten_dn}</Descriptions.Item>
            <Descriptions.Item label="Mã số thuế">{selectedDN.ma_so_thue}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedDN.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedDN.sdt || '—'}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{selectedDN.dia_chi || '—'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{getStatusTag(selectedDN.trang_thai)}</Descriptions.Item>
            <Descriptions.Item label="Giấy phép KD">
              {selectedDN.file_giay_phep ? (
                <a
                  href={selectedDN.file_giay_phep.startsWith('http')
                    ? selectedDN.file_giay_phep
                    : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/uploads/${selectedDN.file_giay_phep}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2563eb' }}
                >
                  <UploadOutlined /> Xem giấy phép
                </a>
              ) : (
                <span style={{ color: '#94a3b8' }}>Chưa upload</span>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      {/* Reject Modal */}
      <Modal
        title="Từ chối doanh nghiệp"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleReject}
        okText="Từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn từ chối doanh nghiệp <strong>{selectedDNForAction?.ten_dn}</strong>?</p>
      </Modal>

      {/* Upload Modal */}
      <Modal
        title={<Space><UploadOutlined /><span>Upload Giấy phép kinh doanh</span></Space>}
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onOk={() => uploadForm.submit()}
        okText="Upload"
        cancelText="Hủy"
      >
        <Form form={uploadForm} layout="vertical" onFinish={handleUpload}>
          <Form.Item name="file" label="Chọn file" rules={[{ required: true, message: 'Vui lòng chọn file' }]}>
            <Dragger name="file" multiple={false} accept=".pdf,.jpg,.jpeg,.png" beforeUpload={() => false}>
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Click hoặc kéo thả file vào đây</p>
              <p className="ant-upload-hint">Hỗ trợ PDF, JPG, PNG. Tối đa 10MB</p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoanhNghiep;

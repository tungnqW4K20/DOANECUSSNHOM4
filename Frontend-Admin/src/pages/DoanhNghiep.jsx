import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Row, Col, Typography, Card, Input, Dropdown, Drawer, Descriptions, Modal, Form, Select, Upload, Spin, Popconfirm, Statistic } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, MoreOutlined, UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import { InboxOutlined } from '@ant-design/icons';
import 'dayjs';
import { businessAdminAPI } from '../services/api.service';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const DoanhNghiep = () => {
  // State management
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedDN, setSelectedDN] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadForm] = Form.useForm();
  const [rejectForm] = Form.useForm();
  const [selectedDNForAction, setSelectedDNForAction] = useState(null);

  // Load data from API
  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const response = await businessAdminAPI.getAll();
      const data = response.data;

      let businesses = data.data || data || [];

      // Lọc theo search text
      if (searchText) {
        businesses = businesses.filter(item =>
          item.ten_dn?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.ma_so_thue?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.email?.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      // Lọc theo status
      if (statusFilter) {
        businesses = businesses.filter(item => item.status?.toUpperCase() === statusFilter);
      }

      setDataSource(businesses);
      setPagination(prev => ({
        ...prev,
        total: businesses.length
      }));
    } catch (error) {
      console.error('Lỗi khi tải danh sách doanh nghiệp:', error);
      message.error('Không thể tải danh sách doanh nghiệp');
    } finally {
      setLoading(false);
    }
  };

  // Handle table change (pagination, sorting, filtering)
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  // Search handler
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Status filter handler
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Refresh data
  const handleRefresh = () => {
    loadBusinesses();
    message.success('Đã làm mới dữ liệu');
  };

  // Drawer handlers
  const showDrawer = (record) => {
    setSelectedDN(record);
    setDrawerVisible(true);
  };
  const closeDrawer = () => { setDrawerVisible(false); };

  // Approve business
  const handleApprove = async (id_dn) => {
    try {
      await businessAdminAPI.approve(id_dn);
      message.success('Duyệt doanh nghiệp thành công');
      loadBusinesses();
    } catch (error) {
      console.error('Lỗi khi duyệt doanh nghiệp:', error);
      message.error(error.response?.data?.message || 'Không thể duyệt doanh nghiệp');
    }
  };

  // Show reject modal
  const showRejectModal = (record) => {
    setSelectedDNForAction(record);
    setRejectModalVisible(true);
    rejectForm.resetFields();
  };

  // Reject business
  const handleReject = async () => {
    try {
      await businessAdminAPI.reject(selectedDNForAction.id_dn);
      message.success('Từ chối doanh nghiệp thành công');
      setRejectModalVisible(false);
      loadBusinesses();
    } catch (error) {
      console.error('Lỗi khi từ chối doanh nghiệp:', error);
      message.error(error.response?.data?.message || 'Không thể từ chối doanh nghiệp');
    }
  };

  // Show upload modal
  const showUploadModal = (record) => {
    setSelectedDNForAction(record);
    setUploadModalVisible(true);
    uploadForm.resetFields();
  };

  // Handle file upload
  const handleUpload = async (values) => {
    try {
      const file = values.file?.fileList?.[0]?.originFileObj;
      if (!file) {
        message.error('Vui lòng chọn file');
        return;
      }

      const response = await businessAdminAPI.uploadLicense(selectedDNForAction.id_dn, file);

      // Cập nhật file_giay_phep cho doanh nghiệp trong state
      const fileUrl = response.data?.data?.imageUrl || response.data?.imageUrl;
      if (fileUrl) {
        setDataSource(dataSource.map(item =>
          item.id_dn === selectedDNForAction.id_dn
            ? { ...item, file_giay_phep: fileUrl }
            : item
        ));
      }

      message.success('Upload giấy phép kinh doanh thành công');
      setUploadModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi upload file:', error);
      message.error(error.response?.data?.message || 'Không thể upload file');
    }
  };

  // Status tag renderer
  const getStatusTag = (status) => {
    switch (status) {
      case 1: return <Tag color="success">Đã duyệt</Tag>;
      case 2: return <Tag color="error">Đã từ chối</Tag>;
      case 0: return <Tag color="warning">Chờ duyệt</Tag>;
      default: return <Tag color="default">{status}</Tag>;
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Tên Doanh nghiệp',
      dataIndex: 'ten_dn',
      key: 'ten_dn',
      sorter: (a, b) => a.ten_dn.localeCompare(b.ten_dn),
    },
    { title: 'Mã số thuế', dataIndex: 'ma_so_thue', key: 'ma_so_thue' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'sdt', key: 'sdt' },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
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
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDrawer(record)}
            size="small"
          />
          <Dropdown menu={{
            items: [
              {
                key: 'approve',
                label: 'Duyệt',
                icon: <CheckCircleOutlined />,
                onClick: () => handleApprove(record.id_dn),
                disabled: record.trang_thai === 1
              },
              {
                key: 'reject',
                label: 'Từ chối',
                icon: <CloseCircleOutlined />,
                onClick: () => showRejectModal(record),
                disabled: record.trang_thai === 2
              },
              {
                key: 'upload',
                label: 'Upload GPKD',
                icon: <UploadOutlined />,
                onClick: () => showUploadModal(record)
              }
            ]
          }}>
            <Button icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Statistics
  const totalCount = dataSource.length;
  const approvedCount = dataSource.filter(item => item.trang_thai === 1).length;
  const pendingCount = dataSource.filter(item => item.trang_thai === 0).length;
  const rejectedCount = dataSource.filter(item => item.trang_thai === 2).length;

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={3} className="page-header-heading">Quản lý Doanh nghiệp</Title></Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Làm mới
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderLeft: '4px solid #1890ff', background: '#e6f7ff' }}>
            <Statistic title="Tổng số DN" value={totalCount} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderLeft: '4px solid #52c41a', background: '#f6ffed' }}>
            <Statistic title="Đã duyệt" value={approvedCount} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderLeft: '4px solid #faad14', background: '#fffbe6' }}>
            <Statistic title="Chờ duyệt" value={pendingCount} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderLeft: '4px solid #ff4d4f', background: '#fff1f0' }}>
            <Statistic title="Đã từ chối" value={rejectedCount} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} className="content-card">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Space>
              <Search
                placeholder="Tìm kiếm doanh nghiệp..."
                style={{ width: 300 }}
                onSearch={handleSearch}
                onChange={(e) => !e.target.value && handleSearch('')}
              />
              <Select
                placeholder="Lọc theo trạng thái"
                style={{ width: 150 }}
                allowClear
                onChange={handleStatusFilter}
              >
                <Option value={0}>Chờ duyệt</Option>
                <Option value={1}>Đã duyệt</Option>
                <Option value={2}>Đã từ chối</Option>
              </Select>
            </Space>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id_dn"
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
          />
        </Spin>
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title="Thông tin chi tiết Doanh nghiệp"
        width={600}
        onClose={closeDrawer}
        open={drawerVisible}
      >
        {selectedDN && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên DN">{selectedDN.ten_dn}</Descriptions.Item>
            <Descriptions.Item label="Mã số thuế">{selectedDN.ma_so_thue}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedDN.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedDN.sdt}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{selectedDN.dia_chi}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{getStatusTag(selectedDN.status)}</Descriptions.Item>
            <Descriptions.Item label="Giấy phép KD">
              {selectedDN.file_giay_phep ? (
                <a
                  href={selectedDN.file_giay_phep.startsWith('http')
                    ? selectedDN.file_giay_phep
                    : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/uploads/${selectedDN.file_giay_phep}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1890ff' }}
                >
                  <UploadOutlined /> Xem giấy phép
                </a>
              ) : (
                <span style={{ color: '#999' }}>Chưa upload</span>
              )}
            </Descriptions.Item>
            {
              selectedDN.ly_do_tu_choi && (
                <Descriptions.Item label="Lý do từ chối">
                  <span style={{ color: '#cf1322' }}>{selectedDN.ly_do_tu_choi}</span>
                </Descriptions.Item>
              )
            }
          </Descriptions >
        )}
      </Drawer >

      {/* Reject Modal */}
      < Modal
        title="Từ chối doanh nghiệp"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleReject}
        okText="Từ chối"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn từ chối doanh nghiệp <strong>{selectedDNForAction?.ten_dn}</strong>?</p>
        <p style={{ color: '#ff4d4f', marginTop: 16 }}>
          ⚠️ Lưu ý: Backend hiện chưa hỗ trợ lưu lý do từ chối. Chức năng này sẽ được cập nhật sau.
        </p>
      </Modal >

      {/* Upload Modal */}
      < Modal
        title="Upload Giấy phép kinh doanh"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onOk={() => uploadForm.submit()}
        okText="Upload"
        cancelText="Hủy"
      >
        <Form
          form={uploadForm}
          layout="vertical"
          onFinish={handleUpload}
        >
          <Form.Item
            name="file"
            label="Chọn file"
            rules={[{ required: true, message: 'Vui lòng chọn file' }]}
          >
            <Dragger
              name="file"
              multiple={false}
              accept=".pdf,.jpg,.jpeg,.png"
              beforeUpload={() => false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click hoặc kéo thả file vào đây</p>
              <p className="ant-upload-hint">
                Chỉ hỗ trợ file PDF, JPG, PNG. Dung lượng tối đa 10MB
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal >
    </>
  );
};

export default DoanhNghiep;
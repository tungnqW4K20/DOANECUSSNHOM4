import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Tag, message, Row, Col, Typography, Card, Input, Dropdown, Drawer, Descriptions, Modal, Form, Select, Upload, Spin, Popconfirm, Statistic } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, MoreOutlined, UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import { InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { businessAdminAPI } from  '../services/api.service';

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
  const [rejectForm] = Form.useForm();
  const [uploadForm] = Form.useForm();
  const [selectedDNForAction, setSelectedDNForAction] = useState(null);

  // Load data from API
  const loadBusinesses = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const searchParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        trang_thai: statusFilter,
        ...params
      };

      const response = await businessAdminAPI.getAll(searchParams);
      const data = response.data;
      
      setDataSource(data.data || data);
      setPagination(prev => ({
        ...prev,
        total: data.total || (data.data ? data.data.length : 0)
      }));
    } catch (error) {
      console.error('Lỗi khi tải danh sách doanh nghiệp:', error);
      message.error('Không thể tải danh sách doanh nghiệp');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText, statusFilter]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  // Handle table change (pagination, sorting, filtering)
  const handleTableChange = (pagination) => {
    setPagination(pagination);
    loadBusinesses({ page: pagination.current, limit: pagination.pageSize });
  };

  // Search handler
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
    loadBusinesses({ search: value, page: 1 });
  };

  // Status filter handler
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
    loadBusinesses({ trang_thai: value, page: 1 });
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
      message.error('Không thể duyệt doanh nghiệp');
    }
  };

  // Show reject modal
  const showRejectModal = (record) => {
    setSelectedDNForAction(record);
    setRejectModalVisible(true);
    rejectForm.resetFields();
  };

  // Reject business
  const handleReject = async (values) => {
    try {
      await businessAdminAPI.reject(selectedDNForAction.id_dn, values.reason);
      message.success('Từ chối doanh nghiệp thành công');
      setRejectModalVisible(false);
      loadBusinesses();
    } catch (error) {
      console.error('Lỗi khi từ chối doanh nghiệp:', error);
      message.error('Không thể từ chối doanh nghiệp');
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

      await businessAdminAPI.uploadLicense(selectedDNForAction.id_dn, file);
      message.success('Upload giấy phép kinh doanh thành công');
      setUploadModalVisible(false);
      loadBusinesses();
    } catch (error) {
      console.error('Lỗi khi upload file:', error);
      message.error('Không thể upload file');
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
      title: 'Ngày đăng ký',
      dataIndex: 'ngay_tao',
      key: 'ngay_tao',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-',
      sorter: (a, b) => dayjs(a.ngay_tao).unix() - dayjs(b.ngay_tao).unix(),
    },
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
          <Card>
            <Statistic title="Tổng số DN" value={totalCount} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Đã duyệt" value={approvedCount} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Chờ duyệt" value={pendingCount} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Đã từ chối" value={rejectedCount} />
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
            <Descriptions.Item label="Trạng thái">{getStatusTag(selectedDN.trang_thai)}</Descriptions.Item>
            <Descriptions.Item label="Ngày đăng ký">
              {selectedDN.ngay_tao ? dayjs(selectedDN.ngay_tao).format('DD/MM/YYYY HH:mm') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Giấy phép KD">
              {selectedDN.file_giay_phep ? (
                <a href="#" target="_blank">{selectedDN.file_giay_phep}</a>
              ) : (
                <span style={{ color: '#999' }}>Chưa upload</span>
              )}
            </Descriptions.Item>
            {selectedDN.ly_do_tu_choi && (
              <Descriptions.Item label="Lý do từ chối">
                <span style={{ color: '#cf1322' }}>{selectedDN.ly_do_tu_choi}</span>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Drawer>

      {/* Reject Modal */}
      <Modal
        title="Từ chối doanh nghiệp"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={() => rejectForm.submit()}
        okText="Từ chối"
        cancelText="Hủy"
      >
        <Form
          form={rejectForm}
          layout="vertical"
          onFinish={handleReject}
        >
          <Form.Item
            name="reason"
            label="Lý do từ chối"
            rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập lý do từ chối..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Upload Modal */}
      <Modal
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
      </Modal>
    </>
  );
};

export default DoanhNghiep;
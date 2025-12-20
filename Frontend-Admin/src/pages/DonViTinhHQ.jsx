import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Row, Col, Typography, Card, Spin, Empty, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { unitAPI } from '../services/api.service';
import { showCreateSuccess, showUpdateSuccess, showDeleteSuccess, showLoadError, showSaveError, showDeleteError } from '../components/notification';

const { Title, Text } = Typography;
const { Search } = Input;

const DonViTinhHQ = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const loadUnits = async () => {
    try {
      setLoading(true);
      const response = await unitAPI.getAll();
      const data = response.data?.data || [];
      setDataSource(Array.isArray(data) ? data : []);
      setFilteredData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading units:', error);
      if (error.response?.status === 401) {
        showLoadError('Phiên đăng nhập đã hết hạn');
      } else {
        showLoadError('danh sách đơn vị tính');
      }
      setDataSource([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = dataSource.filter(
      (item) =>
        item.ten_dvt?.toLowerCase().includes(value.toLowerCase()) ||
        item.mo_ta?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({ ten_dvt: record.ten_dvt, mo_ta: record.mo_ta });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingRecord(null);
  };

  const handleDelete = async (record) => {
    try {
      await unitAPI.delete(record.id_dvt_hq);
      showDeleteSuccess(`Đơn vị tính "${record.ten_dvt}"`);
      loadUnits();
    } catch {
      showDeleteError('đơn vị tính');
    }
  };

  const onFinish = async (values) => {
    try {
      if (editingRecord) {
        await unitAPI.update(editingRecord.id_dvt_hq, values);
        console.log('Update success, calling notification...');
        showUpdateSuccess(`Đơn vị tính "${values.ten_dvt}"`);
      } else {
        await unitAPI.create(values);
        console.log('Create success, calling notification...');
        showCreateSuccess(`Đơn vị tính "${values.ten_dvt}"`);
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingRecord(null);
      loadUnits();
    } catch (error) {
      console.error('Error:', error);
      showSaveError('đơn vị tính');
    }
  };

  const columns = [
    {
      title: 'Tên Đơn vị tính',
      dataIndex: 'ten_dvt',
      key: 'ten_dvt',
      width: '25%',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '11px',
            }}
          >
            {text?.substring(0, 3)}
          </div>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.ten_dvt.localeCompare(b.ten_dvt),
    },
    {
      title: 'Mô tả',
      dataIndex: 'mo_ta',
      key: 'mo_ta',
      width: '55%',
      ellipsis: true,
      render: (text) => <span style={{ color: '#64748b' }}>{text || '—'}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '20%',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small">
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xóa đơn vị tính này?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="fade-in" style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} className="page-header-heading" style={{ margin: 0 }}>
              Quản lý Đơn vị tính Hải quan
            </Title>
            <Text style={{ color: '#64748b', marginTop: '8px', display: 'block' }}>
              Quản lý danh sách đơn vị tính theo chuẩn Hải quan
            </Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
                Làm mới
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
                Thêm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card className="stat-card stat-card-purple hover-lift fade-in-up stagger-1" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', border: 'none' }}>
            <Statistic
              title={<span style={{ color: '#64748b' }}>Tổng đơn vị tính</span>}
              value={dataSource.length}
              prefix={<AppstoreOutlined style={{ color: '#8b5cf6' }} />}
              valueStyle={{ color: '#8b5cf6', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search & Table */}
      <Card className="content-card gradient-card fade-in-up stagger-2">
        <div style={{ marginBottom: '20px' }}>
          <Search
            placeholder="Tìm kiếm theo tên hoặc mô tả..."
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
            rowKey="id_dvt_hq"
            scroll={{ y: 'calc(100vh - 450px)' }}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '50', '100', '1000', '10000'],
              onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize });
              },
            }}
            locale={{
              emptyText: <Empty description={searchText ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu'} />,
            }}
          />
        </Spin>
      </Card>

      {/* Modal */}
      <Modal
        title={
          <Space>
            <AppstoreOutlined />
            <span>{editingRecord ? 'Chỉnh sửa Đơn vị tính' : 'Thêm Đơn vị tính mới'}</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          <Form.Item
            name="ten_dvt"
            label="Tên đơn vị tính"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đơn vị tính!' },
              { max: 50, message: 'Tên đơn vị tính không được quá 50 ký tự!' },
            ]}
            tooltip="Tên đơn vị tính (có thể chứa chữ, số, khoảng trắng và ký tự đặc biệt)"
          >
            <Input
              placeholder="VD: Kilogram, Lít, Mét khối, Tấn"
              maxLength={50}
              prefix={<AppstoreOutlined style={{ color: '#94a3b8' }} />}
            />
          </Form.Item>

          <Form.Item name="mo_ta" label="Mô tả" rules={[{ max: 255, message: 'Mô tả không được quá 255 ký tự!' }]}>
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết về đơn vị tính..." showCount maxLength={255} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingRecord ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DonViTinhHQ;

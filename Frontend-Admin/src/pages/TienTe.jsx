import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Row, Col, Typography, Card, Spin, Empty, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DollarOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { currencyAPI } from '../services/api.service';
import { showCreateSuccess, showUpdateSuccess, showLoadError, showSaveError } from '../components/notification';

const { Title, Text } = Typography;
const { Search } = Input;

const TienTe = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
  
  // ✅ State phân trang backend
  const [pagination, setPagination] = useState({ 
    current: 1, 
    pageSize: 10,
    total: 0
  });

  // ✅ Hàm load với phân trang backend
  const loadCurrencies = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await currencyAPI.getAll({
        page,
        limit: pageSize,
        search: searchText
      });
      
      const data = response.data?.data || [];
      const paginationInfo = response.data?.pagination || {};
      
      setDataSource(data);
      setPagination({
        current: paginationInfo.page || 1,
        pageSize: paginationInfo.limit || 10,
        total: paginationInfo.total || 0
      });
    } catch (error) {
      console.error('Error loading currencies:', error);
      showLoadError('danh sách tiền tệ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrencies();
  }, []);

  // ✅ Handler khi search
  const handleSearch = (value) => {
    setSearchText(value);
    // Gọi lại API với search text mới, reset về trang 1
    setTimeout(() => {
      loadCurrencies(1, pagination.pageSize);
    }, 300); // Debounce 300ms
  };

  // ✅ Handler khi thay đổi trang
  const handleTableChange = (paginationConfig) => {
    loadCurrencies(paginationConfig.current, paginationConfig.pageSize);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // Backend chưa hỗ trợ xóa tiền tệ
  // const handleDelete = async (id_tt) => {
  //   try {
  //     await currencyAPI.delete(id_tt);
  //     showDeleteSuccess('Tiền tệ');
  //     loadCurrencies();
  //   } catch (error) {
  //     showDeleteError('tiền tệ');
  //   }
  // };

  const onFinish = async (values) => {
    try {
      if (editingRecord) {
        await currencyAPI.update(editingRecord.id_tt, values);
        showUpdateSuccess(`Tiền tệ "${values.ma_tt}"`);
      } else {
        await currencyAPI.create(values);
        showCreateSuccess(`Tiền tệ "${values.ma_tt}"`);
      }
      setIsModalOpen(false);
      // ✅ Reload lại trang hiện tại sau khi thêm/sửa
      loadCurrencies(pagination.current, pagination.pageSize);
    } catch (error) {
      showSaveError('tiền tệ');
    }
  };

  const columns = [
    {
      title: 'Mã tiền tệ',
      dataIndex: 'ma_tt',
      key: 'ma_tt',
      width: '25%',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            {text?.substring(0, 2)}
          </div>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.ma_tt.localeCompare(b.ma_tt),
    },
    {
      title: 'Tên tiền tệ',
      dataIndex: 'ten_tt',
      key: 'ten_tt',
      width: '55%',
      render: (text) => <span style={{ color: '#475569' }}>{text}</span>,
      sorter: (a, b) => a.ten_tt.localeCompare(b.ten_tt),
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
          {/* Backend chưa hỗ trợ xóa tiền tệ */}
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
              Quản lý Tiền tệ
            </Title>
            <Text style={{ color: '#64748b', marginTop: '8px', display: 'block' }}>
              Quản lý danh sách các loại tiền tệ trong hệ thống
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
          <Card className="stat-card stat-card-blue hover-lift fade-in-up stagger-1" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: 'none' }}>
            <Statistic
              title={<span style={{ color: '#64748b' }}>Tổng số tiền tệ</span>}
              value={pagination.total}
              prefix={<DollarOutlined style={{ color: '#2563eb' }} />}
              valueStyle={{ color: '#2563eb', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search & Table */}
      <Card className="content-card gradient-card fade-in-up stagger-2">
        <div style={{ marginBottom: '20px' }}>
          <Search
            placeholder="Tìm kiếm theo mã hoặc tên tiền tệ..."
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
            dataSource={dataSource}
            rowKey="id_tt"
            scroll={{ y: 'calc(100vh - 450px)' }}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng ${total} tiền tệ`,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
            }}
            onChange={handleTableChange}
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
            <DollarOutlined />
            <span>{editingRecord ? 'Chỉnh sửa tiền tệ' : 'Thêm tiền tệ mới'}</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={480}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          <Form.Item
            name="ma_tt"
            label="Mã tiền tệ"
            rules={[
              { required: true, message: 'Vui lòng nhập mã tiền tệ!' },
              { pattern: /^[A-Z]{3}$/, message: 'Mã tiền tệ phải là 3 chữ cái in hoa (VD: USD, VND)' },
            ]}
          >
            <Input placeholder="VD: USD, VND, EUR" maxLength={3} style={{ textTransform: 'uppercase' }} prefix={<DollarOutlined style={{ color: '#94a3b8' }} />} />
          </Form.Item>

          <Form.Item name="ten_tt" label="Tên tiền tệ" rules={[{ required: true, message: 'Vui lòng nhập tên tiền tệ!' }]}>
            <Input placeholder="VD: Đô la Mỹ, Việt Nam Đồng" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
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

export default TienTe;

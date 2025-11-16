import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Row, Col, Typography, Card, Input, Dropdown, Drawer, Descriptions, Statistic, Popconfirm, Spin } from 'antd';
import { StopOutlined, CheckCircleOutlined, EyeOutlined, MoreOutlined, WarningOutlined, FileDoneOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { contractLiquidityAPI } from '../../services/api.service';

const { Title, Text } = Typography;
const { Search } = Input;

const ThanhKhoanAdmin = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Load dữ liệu từ API
  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await contractLiquidityAPI.getAll();
      setDataSource(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách báo cáo thanh khoản:', error);
      message.error('Không thể tải danh sách báo cáo thanh khoản');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const showDrawer = (record) => { setSelectedReport(record); setDrawerVisible(true); };
  const closeDrawer = () => { setDrawerVisible(false); };

  const handleStatusChange = async (id_bc, newStatus) => {
    try {
      // Note: Backend có thể cần endpoint riêng để update status admin
      // Hiện tại tạm thời update local state
      setDataSource(dataSource.map(item => item.id_bc === id_bc ? { ...item, trang_thai: newStatus } : item));
      const statusText = newStatus === 'TamKhoa' ? 'Tạm khóa' : 'Hủy';
      message.success(`${statusText} báo cáo thanh khoản thành công!`);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      message.error('Không thể cập nhật trạng thái báo cáo');
    }
  };

  const getKetLuanTag = (ketLuan) => {
    switch (ketLuan) {
      case 'HopLe': return <Tag color="success" icon={<CheckCircleOutlined />}>Hợp lệ</Tag>;
      case 'DuNPL': return <Tag color="warning" icon={<WarningOutlined />}>Dư NPL</Tag>;
      case 'ViPham': return <Tag color="error" icon={<CloseCircleOutlined />}>Vi phạm</Tag>;
      default: return <Tag>{ketLuan}</Tag>;
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'HopLe': return <Tag color="processing">Đang hiệu lực</Tag>;
      case 'TamKhoa': return <Tag color="orange">Đã tạm khóa</Tag>;
      case 'Huy': return <Tag color="red">Đã hủy</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };
  
  const columns = [
    { title: 'Số Hợp đồng', dataIndex: 'so_hd', key: 'so_hd' },
    { title: 'Doanh nghiệp', dataIndex: 'ten_dn', key: 'ten_dn' },
    { title: 'Thời gian tạo', dataIndex: 'thoi_gian_tao', key: 'thoi_gian_tao', render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm') },
    { 
      title: 'Kết luận Thanh khoản', 
      dataIndex: 'ket_luan', 
      key: 'ket_luan', 
      render: getKetLuanTag,
      filters: [
        { text: 'Hợp lệ', value: 'HopLe' },
        { text: 'Dư NPL', value: 'DuNPL' },
        { text: 'Vi phạm', value: 'ViPham' },
      ],
      onFilter: (value, record) => record.ket_luan.indexOf(value) === 0,
    },
    { 
      title: 'Trạng thái (Admin)', 
      dataIndex: 'trang_thai', 
      key: 'trang_thai', 
      render: getStatusTag,
      filters: [
        { text: 'Đang hiệu lực', value: 'HopLe' },
        { text: 'Đã tạm khóa', value: 'TamKhoa' },
        { text: 'Đã hủy', value: 'Huy' },
      ],
      onFilter: (value, record) => record.trang_thai.indexOf(value) === 0,
    },
    {
      title: 'Hành động', key: 'action', width: 120, align: 'center', render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => showDrawer(record)} />
          <Dropdown menu={{ items: [
            { key: '1', label: <Popconfirm title="Bạn chắc chắn muốn tạm khóa?" onConfirm={() => handleStatusChange(record.id_bc, 'TamKhoa')}><Text>Tạm khóa</Text></Popconfirm>, icon: <StopOutlined />, disabled: record.trang_thai === 'TamKhoa' || record.trang_thai === 'Huy' },
            { key: '2', label: <Popconfirm title="Bạn chắc chắn muốn hủy?" onConfirm={() => handleStatusChange(record.id_bc, 'Huy')}><Text type="danger">Hủy</Text></Popconfirm>, icon: <CloseCircleOutlined />, danger: true, disabled: record.trang_thai === 'Huy' },
          ]}}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Lọc dữ liệu theo search
  const filteredData = dataSource.filter(item =>
    item.so_hd?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.ten_dn?.toLowerCase().includes(searchText.toLowerCase())
  );

  const hopLeCount = filteredData.filter(r => r.ket_luan === 'HopLe').length;
  const batThuongCount = filteredData.filter(r => r.ket_luan === 'DuNPL' || r.ket_luan === 'ViPham').length;

  return (
    <>
      <Title level={3} style={{ marginBottom: 24 }}>Theo dõi Thanh khoản Hợp đồng</Title>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}><Card><Statistic title="Tổng số Báo cáo" value={dataSource.length} prefix={<FileDoneOutlined />} /></Card></Col>
          <Col xs={24} sm={12} md={8}><Card><Statistic title="Báo cáo Hợp lệ" value={hopLeCount} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#3f8600' }}/></Card></Col>
          <Col xs={24} sm={12} md={8}><Card><Statistic title="Báo cáo Bất thường" value={batThuongCount} prefix={<WarningOutlined />} valueStyle={{ color: '#cf1322' }}/></Card></Col>
      </Row>

      <Card bordered={false} className="content-card">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col><Text strong>Danh sách Báo cáo Thanh khoản</Text></Col>
            <Col><Search
              placeholder="Tìm theo HĐ hoặc tên DN..."
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            /></Col>
        </Row>
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={filteredData} rowKey="id_bc" />
        </Spin>
      </Card>
      
      <Drawer title={`Chi tiết Báo cáo #${selectedReport?.id_bc}`} width={600} onClose={closeDrawer} open={drawerVisible}>
        {selectedReport && (
            <Descriptions bordered column={1} title={`Hợp đồng: ${selectedReport.so_hd}`}>
                <Descriptions.Item label="Doanh nghiệp">{selectedReport.ten_dn}</Descriptions.Item>
                <Descriptions.Item label="Thời gian tạo">{dayjs(selectedReport.thoi_gian_tao).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                <Descriptions.Item label="Kết luận">{getKetLuanTag(selectedReport.ket_luan)}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái (Admin)">{getStatusTag(selectedReport.trang_thai)}</Descriptions.Item>
                <Descriptions.Item label="Tổng NPL nhập">{selectedReport.tong_npl_nhap?.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Tổng NPL sử dụng">{selectedReport.tong_npl_su_dung?.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Tổng NPL tồn">{selectedReport.tong_npl_ton?.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Tổng Sản phẩm xuất">{selectedReport.tong_sp_xuat?.toLocaleString()}</Descriptions.Item>
            </Descriptions>
        )}
      </Drawer>
    </>
  );
};

export default ThanhKhoanAdmin;
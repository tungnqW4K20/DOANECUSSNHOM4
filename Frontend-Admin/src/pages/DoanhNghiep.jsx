import React, { useState } from 'react';
import { Table, Button, Space, Tag, message, Row, Col, Typography, Card, Input, Dropdown, Drawer, Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;

// Dữ liệu giả lập
const initialData = [
  { id_dn: 1, ten_dn: 'Công ty TNHH May Mặc ABC', ma_so_thue: '0312345678', email: 'contact@abc.com', sdt: '0909123456', dia_chi: '123 ABC, TP.HCM', file_giay_phep: 'gpkd_abc.pdf', trang_thai: 1, ngay_tao: '2025-01-10' },
  { id_dn: 2, ten_dn: 'Xí nghiệp Dệt Phong Phú', ma_so_thue: '0398765432', email: 'info@phongphu.vn', sdt: '0283123456', dia_chi: '456 XYZ, Bình Dương', file_giay_phep: 'gpkd_pp.pdf', trang_thai: 0, ngay_tao: '2025-03-20' },
  { id_dn: 3, ten_dn: 'Công ty Gỗ An Cường', ma_so_thue: '0311223344', email: 'support@ancuong.com', sdt: '0987654321', dia_chi: '789 LMN, Đồng Nai', file_giay_phep: 'gpkd_ac.pdf', trang_thai: 2, ngay_tao: '2025-02-15' },
];

const DoanhNghiep = () => {
  const [dataSource, setDataSource] = useState(initialData);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedDN, setSelectedDN] = useState(null);

  const showDrawer = (record) => { setSelectedDN(record); setDrawerVisible(true); };
  const closeDrawer = () => { setDrawerVisible(false); };

  const handleStatusChange = (id_dn, newStatus) => {
    setDataSource(dataSource.map(item => item.id_dn === id_dn ? { ...item, trang_thai: newStatus } : item));
    const statusText = newStatus === 1 ? 'Duyệt' : 'Từ chối';
    message.success(`${statusText} tài khoản thành công!`);
  };

  const getStatusTag = (status) => {
    if (status === 1) return <Tag color="success">Đã duyệt</Tag>;
    if (status === 2) return <Tag color="error">Đã từ chối</Tag>;
    return <Tag color="warning">Chờ duyệt</Tag>;
  };
  
  const columns = [
    { title: 'Tên Doanh nghiệp', dataIndex: 'ten_dn', key: 'ten_dn' },
    { title: 'Mã số thuế', dataIndex: 'ma_so_thue', key: 'ma_so_thue' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Ngày đăng ký', dataIndex: 'ngay_tao', key: 'ngay_tao', render: (text) => dayjs(text).format('DD/MM/YYYY') },
    { title: 'Trạng thái', dataIndex: 'trang_thai', key: 'trang_thai', render: getStatusTag },
    {
      title: 'Hành động', key: 'action', width: 120, align: 'center', render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => showDrawer(record)} />
          <Dropdown menu={{ items: [
            { key: '1', label: 'Duyệt', icon: <CheckCircleOutlined />, onClick: () => handleStatusChange(record.id_dn, 1), disabled: record.trang_thai === 1 },
            { key: '2', label: 'Từ chối', icon: <CloseCircleOutlined />, onClick: () => handleStatusChange(record.id_dn, 2), disabled: record.trang_thai === 2 }
          ]}}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={3} className="page-header-heading">Quản lý Doanh nghiệp</Title></Col>
        <Col><Search placeholder="Tìm kiếm doanh nghiệp..." style={{ width: 300 }} /></Col>
      </Row>

      <Card bordered={false} className="content-card">
        <Table columns={columns} dataSource={dataSource} rowKey="id_dn" />
      </Card>
      
      <Drawer title="Thông tin chi tiết Doanh nghiệp" width={600} onClose={closeDrawer} open={drawerVisible}>
        {selectedDN && (
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Tên DN">{selectedDN.ten_dn}</Descriptions.Item>
                <Descriptions.Item label="Mã số thuế">{selectedDN.ma_so_thue}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedDN.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{selectedDN.sdt}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{selectedDN.dia_chi}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">{getStatusTag(selectedDN.trang_thai)}</Descriptions.Item>
                <Descriptions.Item label="Ngày đăng ký">{dayjs(selectedDN.ngay_tao).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                <Descriptions.Item label="Giấy phép KD"><a href="#">{selectedDN.file_giay_phep}</a></Descriptions.Item>
            </Descriptions>
        )}
      </Drawer>
    </>
  );
};

export default DoanhNghiep;
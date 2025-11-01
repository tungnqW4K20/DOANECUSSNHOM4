import React, { useState } from 'react';
import { Table, Tag, Row, Col, Typography, Card, Input } from 'antd';
import dayjs from 'dayjs';
const { Title } = Typography;
const { Search } = Input;
// Dữ liệu giả lập
const initialData = [
{ id: 1, so_tk: '105987XXXXXX', ten_dn: 'Công ty TNHH May Mặc ABC', ngay_tk: '2025-04-10', tong_tri_gia: 150000, loai_tk: 'Nhập', trang_thai: 'Thông quan' },
{ id: 2, so_tk: '301234YYYYYY', ten_dn: 'Xí nghiệp Dệt Phong Phú', ngay_tk: '2025-04-12', tong_tri_gia: 250000, loai_tk: 'Xuất', trang_thai: 'Chờ duyệt' },
];
const ToKhai = () => {
const [dataSource] = useState(initialData);
const getStatusTag = (status) => {
if (status === 'Thông quan') return <Tag color="success">{status}</Tag>;
if (status === 'Chờ duyệt') return <Tag color="processing">{status}</Tag>;
return <Tag color="default">{status}</Tag>;
};
const columns = [
{ title: 'Số Tờ khai', dataIndex: 'so_tk', key: 'so_tk' },
{ title: 'Doanh nghiệp', dataIndex: 'ten_dn', key: 'ten_dn' },
{ title: 'Ngày khai', dataIndex: 'ngay_tk', key: 'ngay_tk', render: (text) => dayjs(text).format('DD/MM/YYYY') },
{ title: 'Tổng trị giá', dataIndex: 'tong_tri_gia', key: 'tong_tri_gia', render: (val) => val.toLocaleString() },
{ title: 'Loại Tờ khai', dataIndex: 'loai_tk', key: 'loai_tk', render: (text) => <Tag color={text === 'Nhập' ? 'blue' : 'geekblue'}>{text}</Tag> },
{ title: 'Trạng thái', dataIndex: 'trang_thai', key: 'trang_thai', render: getStatusTag },
];
return (
<>
<Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
<Col><Title level={3} className="page-header-heading">Theo dõi Tờ khai Hải quan</Title></Col>
<Col><Search placeholder="Tìm theo số TK hoặc tên DN..." style={{ width: 300 }} /></Col>
</Row>
<Card bordered={false} className="content-card">
<Table columns={columns} dataSource={dataSource} rowKey="id" />
</Card>
</>
);
};
export default ToKhai;
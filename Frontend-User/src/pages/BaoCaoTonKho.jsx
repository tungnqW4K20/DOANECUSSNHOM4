import React, { useState } from 'react';
import { Table, Row, Col, Typography, Card, Input, Tabs, Select, Space } from 'antd';
// SỬA LỖI: Sửa lại tên gói thư viện ở đây
import { HddOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

// --- Dữ liệu giả lập (ĐÃ BỔ SUNG THÊM) ---
const khoList = [
    { id_kho: 1, ten_kho: 'Kho Nguyên liệu A' },
    { id_kho: 2, ten_kho: 'Kho Thành phẩm B' },
    { id_kho: 3, ten_kho: 'Kho Tổng hợp' },
];

const tonKhoNPLData = [
    { id: 1, id_kho: 1, ten_kho: 'Kho Nguyên liệu A', id_npl: 1, ten_npl: 'Vải Cotton 100%', so_luong_ton: 1500.50 },
    { id: 2, id_kho: 1, ten_kho: 'Kho Nguyên liệu A', id_npl: 2, ten_npl: 'Chỉ may Polyester', so_luong_ton: 80.20 },
    { id: 3, id_kho: 3, ten_kho: 'Kho Tổng hợp', id_npl: 1, ten_npl: 'Vải Cotton 100%', so_luong_ton: 200.00 },
    { id: 4, id_kho: 1, ten_kho: 'Kho Nguyên liệu A', id_npl: 3, ten_npl: 'Cúc áo nhựa 1cm', so_luong_ton: 10000 },
    { id: 5, id_kho: 3, ten_kho: 'Kho Tổng hợp', id_npl: 2, ten_npl: 'Chỉ may Polyester', so_luong_ton: 15.00 },
];

const tonKhoSPData = [
    { id: 1, id_kho: 2, ten_kho: 'Kho Thành phẩm B', id_sp: 1, ten_sp: 'Áo phông cổ tròn - Size M', so_luong_ton: 5200 },
    { id: 2, id_kho: 3, ten_kho: 'Kho Tổng hợp', id_sp: 1, ten_sp: 'Áo phông cổ tròn - Size M', so_luong_ton: 300 },
    { id: 3, id_kho: 2, ten_kho: 'Kho Thành phẩm B', id_sp: 2, ten_sp: 'Quần Jeans Nam - Size 32', so_luong_ton: 1950 },
    { id: 4, id_kho: 2, ten_kho: 'Kho Thành phẩm B', id_sp: 3, ten_sp: 'Váy công sở - Đỏ', so_luong_ton: 850 },
    { id: 5, id_kho: 3, ten_kho: 'Kho Tổng hợp', id_sp: 2, ten_sp: 'Quần Jeans Nam - Size 32', so_luong_ton: 150 },
    { id: 6, id_kho: 2, ten_kho: 'Kho Thành phẩm B', id_sp: 1, ten_sp: 'Áo phông cổ tròn - Size L', so_luong_ton: 3400 },
];
// -----------------------

const BaoCaoTonKho = () => {
    const [selectedKho, setSelectedKho] = useState(null);
    const [searchText, setSearchText] = useState('');

    const handleKhoChange = (value) => {
        setSelectedKho(value);
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };
    
    const filterData = (data, text, kho) => {
        return data.filter(item => {
            const matchKho = kho ? item.id_kho === kho : true;
            const matchText = text ? (item.ten_npl || item.ten_sp).toLowerCase().includes(text) : true;
            return matchKho && matchText;
        });
    };

    const filteredNPL = filterData(tonKhoNPLData, searchText, selectedKho);
    const filteredSP = filterData(tonKhoSPData, searchText, selectedKho);

    const nplColumns = [
        { title: 'Tên Nguyên phụ liệu', dataIndex: 'ten_npl', key: 'ten_npl' },
        { title: 'Tên Kho', dataIndex: 'ten_kho', key: 'ten_kho', filters: khoList.map(k => ({text: k.ten_kho, value: k.ten_kho})), onFilter: (value, record) => record.ten_kho.indexOf(value) === 0 },
        { title: 'Số lượng Tồn', dataIndex: 'so_luong_ton', key: 'so_luong_ton', align: 'right', sorter: (a, b) => a.so_luong_ton - b.so_luong_ton, render: (val) => val.toLocaleString() },
    ];

    const spColumns = [
        { title: 'Tên Sản phẩm', dataIndex: 'ten_sp', key: 'ten_sp' },
        { title: 'Tên Kho', dataIndex: 'ten_kho', key: 'ten_kho', filters: khoList.map(k => ({text: k.ten_kho, value: k.ten_kho})), onFilter: (value, record) => record.ten_kho.indexOf(value) === 0 },
        { title: 'Số lượng Tồn', dataIndex: 'so_luong_ton', key: 'so_luong_ton', align: 'right', sorter: (a, b) => a.so_luong_ton - b.so_luong_ton, render: (val) => val.toLocaleString() },
    ];

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={3} className="page-header-heading"><HddOutlined /> Báo cáo Tồn kho</Title>
                </Col>
                <Col>
                    <Space>
                        <Select
                            placeholder="Lọc theo kho"
                            style={{ width: 200 }}
                            allowClear
                            onChange={handleKhoChange}
                            value={selectedKho}
                        >
                            {khoList.map(kho => <Option key={kho.id_kho} value={kho.id_kho}>{kho.ten_kho}</Option>)}
                        </Select>
                        <Search 
                            placeholder="Tìm kiếm hàng hóa..." 
                            style={{ width: 300 }} 
                            onChange={handleSearch}
                            allowClear
                        />
                    </Space>
                </Col>
            </Row>
            
            <Card bordered={false} className="content-card">
                <Tabs defaultActiveKey="1">
                    <TabPane tab={`Tồn kho Nguyên phụ liệu (${filteredNPL.length})`} key="1">
                        <Table columns={nplColumns} dataSource={filteredNPL} rowKey="id" />
                    </TabPane>
                    <TabPane tab={`Tồn kho Thành phẩm (${filteredSP.length})`} key="2">
                        <Table columns={spColumns} dataSource={filteredSP} rowKey="id" />
                    </TabPane>
                </Tabs>
            </Card>
        </>
    );
};

export default BaoCaoTonKho;
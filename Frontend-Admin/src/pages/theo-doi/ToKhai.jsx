import React, { useState, useEffect } from 'react';
import { Table, Tag, Row, Col, Typography, Card, Input, Spin, message } from 'antd';
import dayjs from 'dayjs';
import { customsDeclarationAPI, businessAPI } from '../../services/api.service';

const { Title } = Typography;
const { Search } = Input;

const ToKhai = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Load dữ liệu từ API
    const loadDeclarations = async () => {
        try {
            setLoading(true);
            const [importRes, exportRes] = await Promise.all([
                customsDeclarationAPI.getImportDeclarations(),
                customsDeclarationAPI.getExportDeclarations()
            ]);

            const importData = (importRes.data?.data || importRes.data || []).map(item => ({
                ...item,
                loai_tk: 'Nhập',
                key: `import-${item.id_tkn || item.id}`
            }));

            const exportData = (exportRes.data?.data || exportRes.data || []).map(item => ({
                ...item,
                loai_tk: 'Xuất',
                key: `export-${item.id_tkx || item.id}`
            }));

            setDataSource([...importData, ...exportData]);
        } catch (error) {
            console.error('Lỗi khi tải danh sách tờ khai:', error);
            message.error('Không thể tải danh sách tờ khai');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDeclarations();
    }, []);

    // Lọc dữ liệu theo search
    const filteredData = dataSource.filter(item =>
        item.so_tk?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ten_dn?.toLowerCase().includes(searchText.toLowerCase())
    );
    const getStatusTag = (status) => {
        if (status === 'Thông quan' || status === 'Đã thông quan') return <Tag color="success">{status}</Tag>;
        if (status === 'Chờ duyệt' || status === 'Đang xử lý') return <Tag color="processing">{status}</Tag>;
        if (status === 'Từ chối' || status === 'Không thông quan') return <Tag color="error">{status}</Tag>;
        return <Tag color="default">{status || 'Chưa xác định'}</Tag>;
    };
    const columns = [
        { title: 'Số Tờ khai', dataIndex: 'so_tk', key: 'so_tk' },
        { title: 'Doanh nghiệp', dataIndex: 'ten_dn', key: 'ten_dn' },
        { title: 'Ngày khai', dataIndex: 'ngay_tk', key: 'ngay_tk', render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-' },
        { title: 'Tổng trị giá', dataIndex: 'tong_tri_gia', key: 'tong_tri_gia', render: (val) => val ? val.toLocaleString() + ' VND' : '0 VND' },
        { title: 'Loại Tờ khai', dataIndex: 'loai_tk', key: 'loai_tk', render: (text) => <Tag color={text === 'Nhập' ? 'blue' : 'geekblue'}>{text}</Tag> },
        { title: 'Trạng thái', dataIndex: 'trang_thai', key: 'trang_thai', render: getStatusTag },
    ];
    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col><Title level={3} className="page-header-heading">Theo dõi Tờ khai Hải quan</Title></Col>
                <Col><Search
                    placeholder="Tìm theo số TK hoặc tên DN..."
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                /></Col>
            </Row>
            <Card bordered={false} className="content-card">
                <Spin spinning={loading}>
                    <Table columns={columns} dataSource={filteredData} rowKey="key" />
                </Spin>
            </Card>
        </>
    );
};
export default ToKhai;
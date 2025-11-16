import React, { useState, useEffect } from 'react';
import { Table, Tag, Row, Col, Typography, Card, Input, Spin, message } from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;

// Note: Backend chưa có API cho audit log, cần tạo thêm
// Tạm thời sử dụng dữ liệu giả lập

const AuditLog = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Load dữ liệu audit log (tạm thời dùng mock data)
    const loadAuditLogs = async () => {
        try {
            setLoading(true);
            // TODO: Thay thế bằng API call thực tế khi backend có sẵn
            // const response = await auditLogAPI.getAll();
            // setDataSource(response.data?.data || response.data || []);

            // Tạm thời dùng mock data
            const mockData = [
                { id: 1, ten_dn: 'Công ty TNHH May Mặc ABC', bang_lien_quan: 'HopDong', hanh_dong: 'INSERT', noi_dung: 'Tạo mới hợp đồng HD-2025-001', thoi_gian: '2025-04-15 10:30:00'},
                { id: 2, ten_dn: 'Xí nghiệp Dệt Phong Phú', bang_lien_quan: 'LOGIN', hanh_dong: 'LOGIN', noi_dung: 'Đăng nhập thành công từ IP 127.0.0.1', thoi_gian: '2025-04-15 09:00:00'},
            ];
            setDataSource(mockData);
        } catch (error) {
            console.error('Lỗi khi tải audit log:', error);
            message.error('Không thể tải lịch sử hoạt động');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuditLogs();
    }, []);

    // Lọc dữ liệu theo search
    const filteredData = dataSource.filter(item =>
        item.ten_dn?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.noi_dung?.toLowerCase().includes(searchText.toLowerCase())
    );

    const getActionTag = (action) => {
        if (action === 'INSERT') return <Tag color="success">{action}</Tag>;
        if (action === 'UPDATE') return <Tag color="blue">{action}</Tag>;
        if (action === 'DELETE') return <Tag color="error">{action}</Tag>;
        return <Tag color="default">{action}</Tag>;
    };

    const columns = [
        { title: 'Thời gian', dataIndex: 'thoi_gian', key: 'thoi_gian', render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm:ss'), width: 180},
        { title: 'Doanh nghiệp', dataIndex: 'ten_dn', key: 'ten_dn' },
        { title: 'Hành động', dataIndex: 'hanh_dong', key: 'hanh_dong', render: getActionTag, width: 120 },
        { title: 'Đối tượng', dataIndex: 'bang_lien_quan', key: 'bang_lien_quan', width: 150 },
        { title: 'Nội dung', dataIndex: 'noi_dung', key: 'noi_dung' },
    ];

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col><Title level={3} className="page-header-heading">Lịch sử hoạt động</Title></Col>
                <Col><Search
                    placeholder="Tìm theo tên DN hoặc nội dung..."
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                /></Col>
            </Row>
            <Card bordered={false} className="content-card">
                <Spin spinning={loading}>
                    <Table columns={columns} dataSource={filteredData} rowKey="id" />
                </Spin>
            </Card>
        </>
    );
};

export default AuditLog;
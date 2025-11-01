import React from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag } from 'antd';
import { FileDoneOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import dayjs from 'dayjs';

const { Title } = Typography;

// --- Dữ liệu giả lập ---
// Dữ liệu này trong thực tế sẽ được fetch từ API
const initialHopDong = [
  { id_hd: 1, so_hd: 'HD-2025-001', ngay_ky: '2025-01-15' },
  { id_hd: 2, so_hd: 'HD-2025-002', ngay_ky: '2025-02-10' },
  { id_hd: 3, so_hd: 'HD-2025-003', ngay_ky: '2025-03-01' },
  { id_hd: 4, so_hd: 'HD-2025-004', ngay_ky: '2025-03-20' },
  { id_hd: 5, so_hd: 'HD-2025-005', ngay_ky: '2025-04-05' },
];

const initialThanhKhoan = [
  { id_bc: 1, id_hd: 1, ket_luan: 'HopLe' },
  { id_bc: 2, id_hd: 2, ket_luan: 'ViPham' },
  { id_bc: 3, id_hd: 3, ket_luan: 'HopLe' },
  { id_bc: 4, id_hd: 4, ket_luan: 'DuNPL' },
  // Hợp đồng 5 chưa có báo cáo thanh khoản
];
// -----------------------

const TongQuan = () => {
    // Tính toán các số liệu thống kê
    const totalHopDong = initialHopDong.length;
    const hopLeCount = initialThanhKhoan.filter(tk => tk.ket_luan === 'HopLe').length;
    const viPhamCount = initialThanhKhoan.filter(tk => tk.ket_luan === 'ViPham' || tk.ket_luan === 'DuNPL').length;
    const chuaThanhKhoanCount = totalHopDong - initialThanhKhoan.length;

    // Dữ liệu cho biểu đồ tròn
    const pieChartData = [
        { name: 'Hợp lệ', value: hopLeCount },
        { name: 'Vi phạm / Bất thường', value: viPhamCount },
        { name: 'Chưa thanh khoản', value: chuaThanhKhoanCount },
    ];
    const COLORS = ['#00C49F', '#FF8042', '#FFBB28']; // Green, Orange, Yellow

    // Helper function để lấy trạng thái thanh khoản cho bảng
    const getThanhKhoanStatus = (id_hd) => {
        const report = initialThanhKhoan.find(tk => tk.id_hd === id_hd);
        if (!report) {
            return <Tag color="gold">Chưa thanh khoản</Tag>;
        }
        switch (report.ket_luan) {
            case 'HopLe': return <Tag color="success">Hợp lệ</Tag>;
            case 'ViPham': return <Tag color="error">Vi phạm</Tag>;
            case 'DuNPL': return <Tag color="warning">Dư NPL</Tag>;
            default: return <Tag>{report.ket_luan}</Tag>;
        }
    };

    const columns = [
        { title: 'Số Hợp đồng', dataIndex: 'so_hd', key: 'so_hd' },
        { title: 'Ngày ký', dataIndex: 'ngay_ky', key: 'ngay_ky', render: (text) => dayjs(text).format('DD/MM/YYYY') },
        { title: 'Trạng thái Thanh khoản', key: 'status', render: (_, record) => getThanhKhoanStatus(record.id_hd) },
    ];

    return (
        <>
            <Title level={3} style={{ marginBottom: 24 }}>Tổng quan</Title>
            <Row gutter={[24, 24]}>
                {/* Các thẻ thống kê */}
                <Col xs={24} sm={12} md={8}>
                    <Card><Statistic title="Tổng số Hợp đồng" value={totalHopDong} prefix={<FileDoneOutlined />} /></Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card><Statistic title="Thanh khoản Hợp lệ" value={hopLeCount} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#3f8600' }}/></Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card><Statistic title="Hợp đồng Vi phạm / Bất thường" value={viPhamCount} prefix={<WarningOutlined />} valueStyle={{ color: '#cf1322' }}/></Card>
                </Col>
                
                {/* Biểu đồ và Bảng */}
                <Col xs={24} lg={10}>
                    <Card title="Tỷ lệ Thanh khoản Hợp đồng" bordered={false} className="content-card" style={{ height: '100%' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius={110} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} lg={14}>
                    <Card title="Các Hợp đồng gần đây" bordered={false} className="content-card" style={{ height: '100%' }}>
                        <Table 
                            columns={columns} 
                            dataSource={initialHopDong} 
                            rowKey="id_hd"
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default TongQuan;
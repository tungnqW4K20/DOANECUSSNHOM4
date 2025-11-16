import { useState, useEffect } from 'react';
import {
    Table, Tag, Row, Col, Typography, Card, Input, Spin, message, Button,
    Space, Modal, Form, Select, DatePicker, InputNumber, Dropdown, Popconfirm,
    Statistic, Divider, Tooltip, Badge
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, MoreOutlined,
    ReloadOutlined, FilterOutlined, FileTextOutlined, ExportOutlined,
    ImportOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { customsDeclarationAPI } from '../../services/api.service';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ToKhai = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

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
                key: `import-${item.id_tkn || item.id}`,
                id: item.id_tkn || item.id
            }));

            const exportData = (exportRes.data?.data || exportRes.data || []).map(item => ({
                ...item,
                loai_tk: 'Xuất',
                key: `export-${item.id_tkx || item.id}`,
                id: item.id_tkx || item.id
            }));

            const allData = [...importData, ...exportData];
            setDataSource(allData);
            setPagination(prev => ({ ...prev, total: allData.length }));
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

    // Lọc dữ liệu
    const filteredData = dataSource.filter(item => {
        const matchSearch = item.so_tk?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.ten_dn?.toLowerCase().includes(searchText.toLowerCase());
        const matchType = filterType === 'all' || item.loai_tk === filterType;
        const matchStatus = filterStatus === 'all' || item.trang_thai === filterStatus;
        return matchSearch && matchType && matchStatus;
    });

    // Thống kê
    const stats = {
        total: dataSource.length,
        import: dataSource.filter(i => i.loai_tk === 'Nhập').length,
        export: dataSource.filter(i => i.loai_tk === 'Xuất').length,
        approved: dataSource.filter(i => i.trang_thai === 'Thông quan' || i.trang_thai === 'Đã thông quan').length,
        pending: dataSource.filter(i => i.trang_thai === 'Chờ duyệt' || i.trang_thai === 'Đang xử lý').length,
        rejected: dataSource.filter(i => i.trang_thai === 'Từ chối' || i.trang_thai === 'Không thông quan').length,
    };

    const getStatusTag = (status) => {
        const statusMap = {
            'Thông quan': { color: 'success', icon: <CheckCircleOutlined /> },
            'Đã thông quan': { color: 'success', icon: <CheckCircleOutlined /> },
            'Chờ duyệt': { color: 'processing', icon: <ClockCircleOutlined /> },
            'Đang xử lý': { color: 'processing', icon: <ClockCircleOutlined /> },
            'Từ chối': { color: 'error', icon: <CloseCircleOutlined /> },
            'Không thông quan': { color: 'error', icon: <CloseCircleOutlined /> },
        };
        const config = statusMap[status] || { color: 'default', icon: null };
        return <Tag color={config.color} icon={config.icon}>{status || 'Chưa xác định'}</Tag>;
    };

    // Xử lý thêm/sửa
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = {
                ...values,
                ngay_tk: values.ngay_tk ? values.ngay_tk.format('YYYY-MM-DD') : null,
            };

            if (editingRecord) {
                // Cập nhật
                const isImport = editingRecord.loai_tk === 'Nhập';
                if (isImport) {
                    await customsDeclarationAPI.updateImportDeclaration(editingRecord.id, formData);
                } else {
                    await customsDeclarationAPI.updateExportDeclaration(editingRecord.id, formData);
                }
                message.success('Cập nhật tờ khai thành công');
            } else {
                // Thêm mới
                const isImport = values.loai_tk === 'Nhập';
                if (isImport) {
                    await customsDeclarationAPI.createImportDeclaration(formData);
                } else {
                    await customsDeclarationAPI.createExportDeclaration(formData);
                }
                message.success('Thêm tờ khai thành công');
            }

            setModalVisible(false);
            form.resetFields();
            setEditingRecord(null);
            loadDeclarations();
        } catch (error) {
            console.error('Lỗi:', error);
            message.error(error.response?.data?.error || 'Có lỗi xảy ra');
        }
    };

    // Xử lý xóa
    const handleDelete = async (record) => {
        try {
            const isImport = record.loai_tk === 'Nhập';
            if (isImport) {
                await customsDeclarationAPI.deleteImportDeclaration(record.id);
            } else {
                await customsDeclarationAPI.deleteExportDeclaration(record.id);
            }
            message.success('Xóa tờ khai thành công');
            loadDeclarations();
        } catch (error) {
            console.error('Lỗi:', error);
            message.error(error.response?.data?.error || 'Không thể xóa tờ khai');
        }
    };

    // Mở modal thêm/sửa
    const openModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            form.setFieldsValue({
                ...record,
                ngay_tk: record.ngay_tk ? dayjs(record.ngay_tk) : null,
            });
        } else {
            setEditingRecord(null);
            form.resetFields();
        }
        setModalVisible(true);
    };

    // Xem chi tiết
    const viewDetail = async (record) => {
        try {
            setLoading(true);
            const isImport = record.loai_tk === 'Nhập';
            const res = isImport
                ? await customsDeclarationAPI.getImportDeclarationById(record.id)
                : await customsDeclarationAPI.getExportDeclarationById(record.id);
            setSelectedRecord(res.data?.data || res.data);
            setDetailModalVisible(true);
        } catch {
            message.error('Không thể tải chi tiết tờ khai');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Số Tờ khai',
            dataIndex: 'so_tk',
            key: 'so_tk',
            width: 150,
            fixed: 'left',
            render: (text) => <Text strong copyable>{text}</Text>
        },
        {
            title: 'Loại',
            dataIndex: 'loai_tk',
            key: 'loai_tk',
            width: 100,
            render: (text) => (
                <Tag color={text === 'Nhập' ? 'blue' : 'cyan'} icon={text === 'Nhập' ? <ImportOutlined /> : <ExportOutlined />}>
                    {text}
                </Tag>
            )
        },
        {
            title: 'Doanh nghiệp',
            dataIndex: 'ten_dn',
            key: 'ten_dn',
            width: 200,
            ellipsis: { showTitle: false },
            render: (text) => <Tooltip title={text}>{text || '-'}</Tooltip>
        },
        {
            title: 'Ngày khai',
            dataIndex: 'ngay_tk',
            key: 'ngay_tk',
            width: 120,
            sorter: (a, b) => new Date(a.ngay_tk) - new Date(b.ngay_tk),
            render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-'
        },
        {
            title: 'Tổng trị giá',
            dataIndex: 'tong_tri_gia',
            key: 'tong_tri_gia',
            width: 150,
            align: 'right',
            sorter: (a, b) => (a.tong_tri_gia || 0) - (b.tong_tri_gia || 0),
            render: (val) => <Text strong>{val ? val.toLocaleString('vi-VN') + ' VND' : '0 VND'}</Text>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            width: 150,
            render: getStatusTag
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => viewDetail(record)} />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openModal(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="Xác nhận xóa?"
                        description="Bạn có chắc muốn xóa tờ khai này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Tooltip title="Xóa">
                            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={3} style={{ margin: 0 }}>
                        <FileTextOutlined /> Quản lý Tờ khai Hải quan
                    </Title>
                </Col>
                <Col>
                    <Space>
                        <Button icon={<ReloadOutlined />} onClick={loadDeclarations}>Làm mới</Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                            Thêm tờ khai
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic title="Tổng số" value={stats.total} prefix={<FileTextOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic title="Nhập khẩu" value={stats.import} valueStyle={{ color: '#1890ff' }} prefix={<ImportOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic title="Xuất khẩu" value={stats.export} valueStyle={{ color: '#13c2c2' }} prefix={<ExportOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic title="Thông quan" value={stats.approved} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic title="Chờ duyệt" value={stats.pending} valueStyle={{ color: '#faad14' }} prefix={<ClockCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic title="Từ chối" value={stats.rejected} valueStyle={{ color: '#ff4d4f' }} prefix={<CloseCircleOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col flex="auto">
                        <Search
                            placeholder="Tìm kiếm theo số tờ khai hoặc tên doanh nghiệp..."
                            allowClear
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col>
                        <Select
                            placeholder="Loại tờ khai"
                            style={{ width: 150 }}
                            value={filterType}
                            onChange={setFilterType}
                        >
                            <Option value="all">Tất cả loại</Option>
                            <Option value="Nhập">Nhập khẩu</Option>
                            <Option value="Xuất">Xuất khẩu</Option>
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            placeholder="Trạng thái"
                            style={{ width: 150 }}
                            value={filterStatus}
                            onChange={setFilterStatus}
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="Thông quan">Thông quan</Option>
                            <Option value="Đã thông quan">Đã thông quan</Option>
                            <Option value="Chờ duyệt">Chờ duyệt</Option>
                            <Option value="Đang xử lý">Đang xử lý</Option>
                            <Option value="Từ chối">Từ chối</Option>
                            <Option value="Không thông quan">Không thông quan</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="key"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} tờ khai`,
                        onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize })
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Modal Thêm/Sửa */}
            <Modal
                title={editingRecord ? 'Chỉnh sửa tờ khai' : 'Thêm tờ khai mới'}
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                    setEditingRecord(null);
                }}
                width={700}
                okText={editingRecord ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="loai_tk" label="Loại tờ khai" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
                                <Select placeholder="Chọn loại" disabled={!!editingRecord}>
                                    <Option value="Nhập">Nhập khẩu</Option>
                                    <Option value="Xuất">Xuất khẩu</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="so_tk" label="Số tờ khai" rules={[{ required: true, message: 'Vui lòng nhập số tờ khai' }]}>
                                <Input placeholder="VD: TK2024001" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="ngay_tk" label="Ngày khai" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="tong_tri_gia" label="Tổng trị giá (VND)">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    placeholder="0"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="trang_thai" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
                        <Select placeholder="Chọn trạng thái">
                            <Option value="Chờ duyệt">Chờ duyệt</Option>
                            <Option value="Đang xử lý">Đang xử lý</Option>
                            <Option value="Thông quan">Thông quan</Option>
                            <Option value="Đã thông quan">Đã thông quan</Option>
                            <Option value="Từ chối">Từ chối</Option>
                            <Option value="Không thông quan">Không thông quan</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="id_lh" label="ID Lô hàng" rules={[{ required: true, message: 'Vui lòng nhập ID lô hàng' }]}>
                        <InputNumber style={{ width: '100%' }} placeholder="Nhập ID lô hàng" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Chi tiết */}
            <Modal
                title="Chi tiết tờ khai"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>Đóng</Button>
                ]}
                width={800}
            >
                {selectedRecord && (
                    <div>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text strong>Số tờ khai:</Text>
                                <div><Text copyable>{selectedRecord.so_tk}</Text></div>
                            </Col>
                            <Col span={12}>
                                <Text strong>Loại:</Text>
                                <div>{selectedRecord.loai_tk}</div>
                            </Col>
                            <Col span={12}>
                                <Text strong>Ngày khai:</Text>
                                <div>{selectedRecord.ngay_tk ? dayjs(selectedRecord.ngay_tk).format('DD/MM/YYYY') : '-'}</div>
                            </Col>
                            <Col span={12}>
                                <Text strong>Trạng thái:</Text>
                                <div>{getStatusTag(selectedRecord.trang_thai)}</div>
                            </Col>
                            <Col span={24}>
                                <Text strong>Tổng trị giá:</Text>
                                <div><Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                                    {selectedRecord.tong_tri_gia ? selectedRecord.tong_tri_gia.toLocaleString('vi-VN') + ' VND' : '0 VND'}
                                </Text></div>
                            </Col>
                            <Col span={24}>
                                <Divider />
                                <Text strong>Thông tin lô hàng:</Text>
                                <div style={{ marginTop: 8 }}>
                                    <Text>ID Lô hàng: {selectedRecord.id_lh || '-'}</Text>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ToKhai;
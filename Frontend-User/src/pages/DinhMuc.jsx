import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Select,
    InputNumber,
    Space,
    message,
    Typography,
    Row,
    Col,
    Card,
    Spin,
    Input,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SaveOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { getAllSanPham } from '../services/sanpham.service';
import { getAllNguyenPhuLieu } from '../services/nguyenphulieu.service';
import {
    getAllDinhMuc,
    getDinhMucBySanPham,
    createDinhMuc,
    deleteDinhMuc,
} from '../services/dinhmuc.service';

const { Option } = Select;
const { Title, Text } = Typography;

const DinhMuc = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [dinhMucDetails, setDinhMucDetails] = useState([]);
    const [allDinhMuc, setAllDinhMuc] = useState([]);
    const [spList, setSpList] = useState([]);
    const [nplList, setNplList] = useState([]);

    // ===================== FETCH DATA =====================
    const fetchAll = async () => {
        try {
            setLoading(true);
            const [spRes, nplRes, dmRes] = await Promise.all([
                getAllSanPham(),
                getAllNguyenPhuLieu(),
                getAllDinhMuc(),
            ]);
            setSpList(spRes.data || []);
            setNplList(nplRes.data || []);

            // Gom nhóm định mức theo sản phẩm
            const grouped = Object.values(
                (dmRes.data || []).reduce((acc, item) => {
                    const id_sp = item.id_sp;
                    if (!acc[id_sp]) {
                        acc[id_sp] = {
                            id_sp,
                            ten_sp: item.sanPham?.ten_sp || '',
                            dinh_muc_chi_tiet: [],
                        };
                    }
                    acc[id_sp].dinh_muc_chi_tiet.push({
                        id_dm: item.id_dm,
                        id_npl: item.id_npl,
                        ten_npl: item.nguyenPhuLieu?.ten_npl,
                        so_luong: item.so_luong,
                        ghi_chu: item.ghi_chu,
                    });
                    return acc;
                }, {})
            );
            setAllDinhMuc(grouped);
        } catch (err) {
            message.error(err.message || 'Lỗi tải dữ liệu!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // ===================== MODAL =====================
    const handleOpenModal = async (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
        form.resetFields();

        if (product) {
            setLoadingModal(true);
            try {
                const res = await getDinhMucBySanPham(product.id_sp);
                const details = (res.data || []).map((dm) => ({
                    key: dm.id_dm || Date.now() + Math.random(),
                    id_dm: dm.id_dm,
                    id_npl: dm.id_npl,
                    so_luong: dm.so_luong,
                    ghi_chu: dm.ghi_chu || '',
                }));
                setDinhMucDetails(details);
                form.setFieldsValue({ id_sp: product.id_sp });
            } catch (err) {
                message.error('Lỗi tải định mức chi tiết!');
            } finally {
                setLoadingModal(false);
            }
        } else {
            setDinhMucDetails([]);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setDinhMucDetails([]);
        setEditingProduct(null);
        form.resetFields();
    };

    const handleAddRow = () => {
        const newRow = { key: Date.now(), id_npl: null, so_luong: 1, ghi_chu: '' };
        setDinhMucDetails([...dinhMucDetails, newRow]);
    };

    const handleRemoveRow = (key) => {
        setDinhMucDetails(dinhMucDetails.filter((item) => item.key !== key));
    };

    const handleRowChange = (key, field, value) => {
        setDinhMucDetails((prev) =>
            prev.map((item) => (item.key === key ? { ...item, [field]: value } : item))
        );
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (dinhMucDetails.length === 0) {
                message.error('Phải có ít nhất một nguyên phụ liệu!');
                return;
            }

            const payload = {
                id_sp: values.id_sp,
                dinh_muc_chi_tiet: dinhMucDetails.map((item) => ({
                    id_nguyen_lieu: item.id_npl,
                    so_luong: item.so_luong,
                    ghi_chu: item.ghi_chu || '',
                })),
            };

            if (editingProduct) {
                // 🔥 Lấy toàn bộ định mức cũ và xóa từng dòng theo id_dm
                const resOld = await getDinhMucBySanPham(values.id_sp);
                const oldDetails = resOld.data || [];
                for (const item of oldDetails) {
                    await deleteDinhMuc(item.id_dm);
                }
            }

            await createDinhMuc(payload);
            message.success('Lưu định mức thành công!');
            handleCloseModal();
            fetchAll();
        } catch (err) {
            message.error(err.message || 'Lỗi khi lưu định mức');
        }
    };

    // ===================== TABLE COLUMNS =====================
    const columnsMain = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten_sp',
        },
        {
            title: 'Số NPL trong định mức',
            align: 'center',
            render: (_, record) => record.dinh_muc_chi_tiet.length,
        },
        {
            title: 'Hành động',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>
                        Xem / Sửa
                    </Button>
                </Space>
            ),
        },
    ];

    const columnsModal = [
        {
            title: 'Nguyên phụ liệu',
            dataIndex: 'id_npl',
            render: (_, record) => (
                <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn NPL"
                    value={record.id_npl}
                    onChange={(val) => handleRowChange(record.key, 'id_npl', val)}
                >
                    {nplList.map((npl) => (
                        <Option key={npl.id_npl} value={npl.id_npl}>
                            {npl.ten_npl}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'so_luong',
            width: 150,
            render: (_, record) => (
                <InputNumber
                    min={0.01}
                    step="0.01"
                    style={{ width: '100%' }}
                    value={record.so_luong}
                    onChange={(val) => handleRowChange(record.key, 'so_luong', val)}
                />
            ),
        },
        {
            title: 'Hành động',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleRemoveRow(record.key)}
                />
            ),
        },
    ];

    // ===================== RENDER =====================
    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={3}>Quản lý Định mức Sản phẩm</Title>
                </Col>
                <Col>
                    <Space>
                        <Button icon={<ReloadOutlined />} onClick={fetchAll}>
                            Tải lại
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleOpenModal()}
                        >
                            Khai báo Định mức
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Card bordered={false}>
                <Spin spinning={loading}>
                    <Table columns={columnsMain} dataSource={allDinhMuc} rowKey="id_sp" />
                </Spin>
            </Card>

            <Modal
                title={
                    editingProduct
                        ? `Định mức cho sản phẩm: ${editingProduct.ten_sp}`
                        : 'Khai báo Định mức mới'
                }
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={850}
            >
                <Spin spinning={loadingModal}>
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="id_sp"
                            label="Sản phẩm"
                            rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
                        >
                            <Select placeholder="Chọn sản phẩm" disabled={!!editingProduct}>
                                {spList.map((sp) => (
                                    <Option key={sp.id_sp} value={sp.id_sp}>
                                        {sp.ten_sp}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Text strong>Danh sách Nguyên phụ liệu cấu thành:</Text>
                        <Table
                            columns={columnsModal}
                            dataSource={dinhMucDetails}
                            pagination={false}
                            rowKey="key"
                            bordered
                            size="small"
                            style={{ margin: '16px 0' }}
                        />
                        <Button
                            onClick={handleAddRow}
                            type="dashed"
                            icon={<PlusOutlined />}
                            style={{ width: '100%' }}
                        >
                            Thêm Nguyên phụ liệu
                        </Button>

                        <div style={{ marginTop: 24, textAlign: 'right' }}>
                            <Space>
                                <Button onClick={handleCloseModal}>Hủy</Button>
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={handleSave}
                                >
                                    Lưu Định mức
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
};

export default DinhMuc;

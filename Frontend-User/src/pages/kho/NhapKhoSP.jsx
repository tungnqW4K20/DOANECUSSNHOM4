import React, { useState, useEffect } from "react";
import {
    Form,
    Select,
    DatePicker,
    Button,
    Table,
    InputNumber,
    Upload,
    Typography,
    Popconfirm,
    Row,
    Col,
    Card,
    Space,
    Drawer, 
    Descriptions,
} from "antd";
import {
    UploadOutlined,
    SaveOutlined,
    PlusOutlined,
    DeleteOutlined,
    EyeOutlined,
    EditOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { uploadSingleFile } from "../../services/upload.service";
import { getAllKho } from "../../services/kho.service";
import { getAllSanPham } from "../../services/sanpham.service";
import { 
    getAllNhapKhoSP,
    createNhapKhoSP, 
    updateNhapKhoSP,
    deleteNhapKhoSP 
} from "../../services/nhapkhosp.service";
import {
    showCreateSuccess,
    showUpdateSuccess,
    showDeleteSuccess,
    showLoadError,
    showSaveError,
    showUploadSuccess,
    showUploadError,
    showError,
} from "../../components/notification";

const { Option } = Select;
const { Title } = Typography;

const NhapKhoSP = () => {
    const [form] = Form.useForm();

    const [khoList, setKhoList] = useState([]);
    const [spList, setSpList] = useState([]); // must be array
    const [chiTietNhap, setChiTietNhap] = useState([]);

    const [fileUrl, setFileUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [lichSuPhieu, setLichSuPhieu] = useState([]);
    const [loadingLichSu, setLoadingLichSu] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedPhieu, setSelectedPhieu] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);

    const fetchLichSu = async () => {
        setLoadingLichSu(true);
        try {
            const response = await getAllNhapKhoSP();
            const data = response?.data || response || [];
            setLichSuPhieu(data);
        } catch {
            showLoadError('lịch sử phiếu nhập SP');
        } finally {
            setLoadingLichSu(false);
        }
    };

    useEffect(() => {
        fetchLichSu();
        
        const fetchData = async () => {
            try {
                const [resKho, resSP] = await Promise.all([getAllKho(), getAllSanPham()]);

                // resKho may be { success, data } or data array — handle both
                const khoArr = Array.isArray(resKho) ? resKho : (resKho?.data || resKho || []);
                const spArr = Array.isArray(resSP) ? resSP : (resSP?.data || resSP || []);

                setKhoList(khoArr);
                setSpList(spArr);
            } catch {
                showLoadError('danh sách kho hoặc sản phẩm');
            }
        };

        fetchData();
    }, []);

    /* bảng chi tiết */
    const handleAddRow = () => {
        setChiTietNhap(prev => [...prev, { key: Date.now(), id_sp: null, so_luong: 1 }]);
    };

    const handleRemoveRow = (key) => {
        setChiTietNhap(prev => prev.filter(item => item.key !== key));
    };

    const handleRowChange = (key, field, value) => {
        setChiTietNhap(prev => prev.map(item => item.key === key ? { ...item, [field]: value } : item));
    };

    /* upload file */
    const handleUpload = async ({ file, onSuccess, onError }) => {
        try {
            setUploading(true);
            const res = await uploadSingleFile(file);
            if (res?.data?.imageUrl) {
                setFileUrl(res.data.imageUrl);
                showUploadSuccess(file.name);
                if (onSuccess) onSuccess(res.data, file);
            } else {
                showUploadError();
                if (onError) onError(new Error("Không có URL file"));
            }
        } catch (err) {
            showUploadError();
            if (onError) onError(err);
        } finally {
            setUploading(false);
        }
    };

    const showDrawer = (record) => {
        setSelectedPhieu(record);
        setIsDrawerOpen(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            id_kho: record.kho?.id_kho,
            ngay_nhap: dayjs(record.ngay_nhap),
        });
        // Backend trả về chiTiets, không phải chiTietNhapKhoSPs
        const chiTiets = record.chiTiets || [];
        setChiTietNhap(chiTiets.map((item, index) => ({
            key: item.id_ct || index,
            id_sp: item.sanPham?.id_sp,
            so_luong: item.so_luong,
        })));
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id_nhap) => {
        try {
            await deleteNhapKhoSP(id_nhap);
            showDeleteSuccess('Phiếu nhập SP');
            fetchLichSu(); // Tải lại danh sách
        } catch {
            showSaveError('phiếu nhập SP');
        }
    };
    
    const cancelEdit = () => {
        setEditingRecord(null);
        form.resetFields();
        setChiTietNhap([]);
        setFileUrl(null);
    };

    const onFinish = async (values) => {
        if (!chiTietNhap.length) {
            showError("Vui lòng thêm ít nhất một sản phẩm!", "Không có sản phẩm nào được chọn");
            return;
        }

        // Validate chi tiết
        for (const item of chiTietNhap) {
            if (!item.id_sp) {
                showError("Vui lòng chọn sản phẩm cho tất cả dòng!", "Có dòng chưa chọn sản phẩm");
                return;
            }
            if (!item.so_luong || item.so_luong <= 0) {
                showError("Số lượng phải lớn hơn 0!", "Kiểm tra lại số lượng nhập");
                return;
            }
        }

        const payload = {
            id_kho: values.id_kho,
            ngay_nhap: values.ngay_nhap
                ? dayjs(values.ngay_nhap).format("YYYY-MM-DD")
                : null,
            file_phieu: fileUrl || null,
            chi_tiets: chiTietNhap.map(item => ({
                id_sp: item.id_sp,
                so_luong: item.so_luong
            }))
        };

        try {
            setSubmitting(true);

            if (editingRecord) {
                // Chế độ Cập nhật
                await updateNhapKhoSP(editingRecord.id_nhap, payload);
                showUpdateSuccess('Phiếu nhập SP');
            } else {
                // Chế độ Tạo mới
                await createNhapKhoSP(payload);
                showCreateSuccess('Phiếu nhập SP');
            }
            
            cancelEdit(); // Reset form và trạng thái
            fetchLichSu(); // Tải lại lịch sử

        } catch {
            showSaveError('phiếu nhập SP');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "id_sp",
            render: (_, record) => (
                <Select
                    placeholder="Chọn sản phẩm"
                    style={{ width: "100%" }}
                    value={record.id_sp}
                    onChange={(val) => handleRowChange(record.key, "id_sp", val)}
                >
                    {(Array.isArray(spList) ? spList : []).map(sp => (
                        <Option key={sp.id_sp} value={sp.id_sp}>{sp.ten_sp}</Option>
                    ))}
                </Select>
            )
        },
        {
            title: "Số lượng nhập",
            dataIndex: "so_luong",
            render: (_, record) => (
                <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    value={record.so_luong}
                    onChange={(val) => handleRowChange(record.key, "so_luong", val)}
                />
            )
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleRemoveRow(record.key)}>
                    <Button icon={<DeleteOutlined />} danger />
                </Popconfirm>
            )
        }
    ];

    const lichSuColumns = [
        { title: 'Số phiếu', dataIndex: 'so_phieu', render: (text, record) => text || `PNKSP-${record.id_nhap}` },
        { title: 'Ngày nhập', dataIndex: 'ngay_nhap', render: (text) => dayjs(text).format('DD/MM/YYYY') },
        { title: 'Kho nhận', dataIndex: ['kho', 'ten_kho'] },
        { title: 'Hành động', key: 'action', width: 220, align: 'center', render: (_, record) => (
            <Space>
                <Button size="small" icon={<EyeOutlined />} onClick={() => showDrawer(record)}>Xem</Button>
                <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                <Popconfirm title="Bạn có chắc muốn xóa phiếu này?" onConfirm={() => handleDelete(record.id_nhap)}>
                    <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                </Popconfirm>
            </Space>
        )},
    ];
    
    const chiTietColumns = [
        { title: 'Tên sản phẩm', dataIndex: ['sanPham', 'ten_sp'] },
        { title: 'Số lượng nhập', dataIndex: 'so_luong', align: 'right' },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card bordered={false}>
                <Title level={3}>{editingRecord ? `Chỉnh sửa Phiếu Nhập kho SP #${editingRecord.so_phieu || `PNKSP-${editingRecord.id_nhap}`}` : 'Tạo Phiếu Nhập Kho Sản Phẩm (Thành phẩm)'}</Title>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="Kho nhận hàng" name="id_kho" rules={[{ required: true, message: "Chọn kho!" }]}>
                                <Select placeholder="Chọn kho">{khoList.map(k => (<Option key={k.id_kho} value={k.id_kho}>{k.ten_kho}</Option>))}</Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Ngày nhập kho" name="ngay_nhap" rules={[{ required: true, message: "Chọn ngày!" }]}>
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="File phiếu nhập (nếu có)">
                        <Upload customRequest={handleUpload} maxCount={1} showUploadList={!!fileUrl}>
                            <Button icon={<UploadOutlined />} loading={uploading}>Tải lên</Button>
                        </Upload>
                    </Form.Item>
                    <Title level={4}>Chi tiết Sản Phẩm Nhập Kho</Title>
                    <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddRow} style={{ marginBottom: 16 }}>Thêm Sản phẩm</Button>
                    <Table columns={columns} dataSource={chiTietNhap} pagination={false} rowKey="key" bordered />
                    <Form.Item style={{ marginTop: 24 }}>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting}>
                                {editingRecord ? 'Cập nhật Phiếu nhập' : 'Lưu Phiếu nhập'}
                            </Button>
                            {editingRecord && (
                                <Button icon={<CloseCircleOutlined />} onClick={cancelEdit}>Hủy sửa</Button>
                            )}
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            <Card title="Lịch sử Phiếu Nhập kho SP" bordered={false}>
                <Table columns={lichSuColumns} dataSource={lichSuPhieu} rowKey="id_nhap" loading={loadingLichSu} />
            </Card>

            <Drawer title={`Chi tiết Phiếu nhập: ${selectedPhieu?.so_phieu || `PNKSP-${selectedPhieu?.id_nhap}`}`} width={600} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                {selectedPhieu && <>
                    <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
                        <Descriptions.Item label="Ngày nhập">{dayjs(selectedPhieu.ngay_nhap).format('DD/MM/YYYY')}</Descriptions.Item>
                        <Descriptions.Item label="Kho nhận">{selectedPhieu.kho?.ten_kho}</Descriptions.Item>
                    </Descriptions>
                    <Title level={5}>Danh sách sản phẩm đã nhập</Title>
                    <Table columns={chiTietColumns} dataSource={selectedPhieu.chiTiets || []} rowKey="id_ct" pagination={false} size="small" bordered />
                </>}
            </Drawer>
        </Space>
    );
};

export default NhapKhoSP;



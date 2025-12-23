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
    Row,
    Col,
    Card,
    Drawer,
    Space,
    Descriptions,
    Popconfirm,
} from "antd";
import { UploadOutlined, CheckCircleOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { uploadSingleFile } from "../../services/upload.service";
import { getAllHoaDonNhap, getHoaDonNhapById } from "../../services/hoadonnhap.service";
import { getAllKho } from "../../services/kho.service";
import { getAllNhapKhoNPL, createNhapKhoNPL, addChiTietNhapKhoNPL } from "../../services/nhapkhonpl.service";
import { 
    showCreateSuccess, 
    showDeleteSuccess, 
    showLoadError, 
    showSaveError,
    showUploadSuccess,
    showUploadError,
    showWarning
} from "../../components/notification";

const { Option } = Select;
const { Title } = Typography;

const NhapKhoNPL = () => {
    const [form] = Form.useForm();

    // Dữ liệu
    const [hoaDonNhapList, setHoaDonNhapList] = useState([]);
    const [chiTietNhap, setChiTietNhap] = useState([]);
    const [khoList, setKhoList] = useState([]);

    // Upload file
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
            const data = await getAllNhapKhoNPL();
            setLichSuPhieu(data || []);
        } catch (err) {
            showLoadError('lịch sử phiếu nhập NPL');
        } finally {
            setLoadingLichSu(false);
        }
    };

    /* ============================================================
       🟢 LẤY DỮ LIỆU BAN ĐẦU
    ============================================================ */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resHDN, resKho] = await Promise.all([
                    getAllHoaDonNhap(),
                    getAllKho(),
                ]);
                setHoaDonNhapList(resHDN || []);
                setKhoList(resKho || []);
            } catch (err) {
                console.error(err);
                showLoadError('dữ liệu hóa đơn nhập và kho');
            }
        };
        fetchData();
        fetchLichSu(); // Gọi lấy lịch sử phiếu nhập
    }, []);

    /* ============================================================
       🟢 KHI CHỌN HÓA ĐƠN NHẬP
    ============================================================ */
    const handleHoaDonChange = async (id_hd_nhap) => {
        try {
            const res = await getHoaDonNhapById(id_hd_nhap);
            console.log("Chi tiết HĐN:", res);

            const chiTiet = (res?.chiTiets || []).map((item, index) => ({
                key: index + 1,
                id_npl: item.nguyenPhuLieu.id_npl,
                ten_npl: item.nguyenPhuLieu.ten_npl,
                so_luong_hd: item.so_luong,
                so_luong_nhap: item.so_luong, // mặc định bằng số lượng theo HĐ
            }));
            setChiTietNhap(chiTiet);
        } catch (err) {
            console.error(err);
            showLoadError('chi tiết hóa đơn');
        }
    };

    /* ============================================================
       🟢 THAY ĐỔI SỐ LƯỢNG
    ============================================================ */
    const handleSoLuongChange = (key, value) => {
        setChiTietNhap((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, so_luong_nhap: value } : item
            )
        );
    };

    /* ============================================================
       🟢 UPLOAD FILE (giống LoHang)
    ============================================================ */
    const handleUpload = async ({ file, onSuccess, onError }) => {
        try {
            setUploading(true);
            const res = await uploadSingleFile(file);
            if (res?.data?.imageUrl) {
                setFileUrl(res.data.imageUrl);
                showUploadSuccess(file.name);
                onSuccess(res.data, file);
            } else {
                showUploadError();
                onError(new Error("Không có URL file!"));
            }
        } catch (err) {
            console.error(err);
            showUploadError();
            onError(err);
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            id_hd_nhap: record.hoaDonNhap.id_hd_nhap,
            id_kho: record.kho.id_kho,
            ngay_nhap: dayjs(record.ngay_nhap),
        });
        setChiTietNhap(record.chiTietNhapKhoNPLs.map(item => ({
            key: item.id_ct,
            id_npl: item.nguyenPhuLieu.id_npl,
            ten_npl: item.nguyenPhuLieu.ten_npl,
            so_luong_hd: item.so_luong, // Giả sử SL hóa đơn bằng SL nhập
            so_luong_nhap: item.so_luong,
        })));
        window.scrollTo(0, 0); // Cuộn lên đầu trang
    };

    const handleDelete = () => {
        // Logic gọi API xóa
        showDeleteSuccess('Phiếu nhập NPL');
        // fetchLichSu();
    };

    const cancelEdit = () => {
        setEditingRecord(null);
        form.resetFields();
        setChiTietNhap([]);
    };

    /* ============================================================
       🟢 SUBMIT FORM — TẠO PHIẾU NHẬP KHO
    ============================================================ */
    const onFinish = async (values) => {
        console.log("values-----------------", values)
            console.log("values----------------- 🟢 Chi tiết NPL:", chiTietNhap);

        if (!chiTietNhap.length) {
            showWarning('Vui lòng chọn hóa đơn nhập', 'Cần có chi tiết NPL để tạo phiếu nhập kho');
            return;
        }

        const payloadPhieu = {
            id_hd_nhap: values.id_hd_nhap,
            id_kho: values.id_kho,
            ngay_nhap: values.ngay_nhap
                ? dayjs(values.ngay_nhap).format("YYYY-MM-DD")
                : null,
            file_phieu: fileUrl || null,
            chi_tiets: chiTietNhap
        };

        console.log("📦 Dữ liệu gửi đi:", payloadPhieu);

        try {
            setSubmitting(true);

            // 1️⃣ Tạo phiếu nhập NPL
            const resPhieu = await createNhapKhoNPL(payloadPhieu);
            if (!resPhieu?.success || !resPhieu?.data?.id_nhap) {
                showSaveError('phiếu nhập NPL');
                return;
            }

            const id_nhap = resPhieu.data.id_nhap;
            console.log("✅ Đã tạo phiếu nhập:", id_nhap);

            // 2️⃣ Thêm chi tiết phiếu nhập NPL
            const promises = chiTietNhap.map((item) =>
                addChiTietNhapKhoNPL(id_nhap, {
                    id_nhap: id_nhap,
                    id_npl: item.id_npl,
                    so_luong: item.so_luong_nhap,

                })
            );

            const results = await Promise.all(promises);
            const allSuccess = results.every((r) => r?.success);

            if (allSuccess) {
                showCreateSuccess('Phiếu nhập NPL');
                form.resetFields();
                setChiTietNhap([]);
                setFileUrl(null);
            } else {
                showWarning('Tạo phiếu nhập thành công', 'Nhưng có một số chi tiết bị lỗi');
            }
        } catch (err) {
            console.error(err);
            showSaveError('phiếu nhập kho NPL');
        } finally {
            setSubmitting(false);
        }
    };

    const showDrawer = (record) => { setSelectedPhieu(record); setIsDrawerOpen(true); };

    /* ============================================================
       🟢 CỘT BẢNG CHI TIẾT
    ============================================================ */
    const columns = [
        { title: "Tên Nguyên phụ liệu", dataIndex: "ten_npl", key: "ten_npl" },
        {
            title: "Số lượng theo HĐ",
            dataIndex: "so_luong_hd",
            key: "so_luong_hd",
        },
        {
            title: "Số lượng thực nhập",
            dataIndex: "so_luong_nhap",
            key: "so_luong_nhap",
            render: (text, record) => (
                <InputNumber
                    min={0}
                    defaultValue={text}
                    onChange={(val) => handleSoLuongChange(record.key, val)}
                />
            ),
        },
    ];

    const lichSuColumns = [
        { title: 'Số phiếu', dataIndex: 'so_phieu', render: (text, record) => text || `PNKNPL-${record.id_nhap}` },
        { title: 'Ngày nhập', dataIndex: 'ngay_nhap', render: (text) => dayjs(text).format('DD/MM/YYYY') },
        { title: 'Kho nhận', dataIndex: ['kho', 'ten_kho'] },
        { title: 'Hóa đơn liên quan', dataIndex: ['hoaDonNhap', 'so_hd'] },
        { title: 'Hành động', key: 'action', render: (_, record) => (
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
        { title: 'Tên Nguyên phụ liệu', dataIndex: ['nguyenPhuLieu', 'ten_npl'] },
        { title: 'Số lượng nhập', dataIndex: 'so_luong', align: 'right' },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card bordered={false}>
                <Title level={3} style={{ marginBottom: 24 }}>
                    {editingRecord ? `Chỉnh sửa Phiếu Nhập kho NPL #${editingRecord.so_phieu}` : 'Tạo Phiếu Nhập Kho Nguyên Phụ Liệu'}
                </Title>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    {/* Hóa đơn nhập */}
                    <Form.Item
                        label="Hóa đơn nhập liên quan"
                        name="id_hd_nhap"
                        rules={[{ required: true, message: "Chọn hóa đơn nhập!" }]}
                    >
                        <Select
                            placeholder="Tìm và chọn số hóa đơn nhập"
                            onChange={handleHoaDonChange}
                            showSearch
                        >
                            {hoaDonNhapList.map((hd) => (
                                <Option key={hd.id_hd_nhap} value={hd.id_hd_nhap}>
                                    {`${hd.so_hd} - Ngày ${hd.ngay_hd}`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Kho */}
                    <Form.Item
                        label="Kho nhận hàng"
                        name="id_kho"
                        rules={[{ required: true, message: "Chọn kho nhận hàng!" }]}
                    >
                        <Select placeholder="Chọn kho">
                            {khoList.map((k) => (
                                <Option key={k.id_kho} value={k.id_kho}>
                                    {k.ten_kho}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Ngày nhập */}
                    <Form.Item
                        label="Ngày nhập kho"
                        name="ngay_nhap"
                        rules={[{ required: true, message: "Chọn ngày nhập kho!" }]}
                    >
                        <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                    </Form.Item>

                    {/* Upload file */}
                    <Form.Item label="File phiếu nhập (nếu có)">
                        <Upload
                            customRequest={handleUpload}
                            maxCount={1}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />} loading={uploading}>
                                Tải lên file
                            </Button>
                        </Upload>

                        {fileUrl && (
                            <div style={{ marginTop: 8 }}>
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                    Xem file đã tải lên
                                </a>
                            </div>
                        )}
                    </Form.Item>

                    {/* Bảng chi tiết */}
                    <Title level={4}>Chi tiết Nguyên Phụ Liệu Nhập Kho</Title>
                    <Table
                        columns={columns}
                        dataSource={chiTietNhap}
                        pagination={false}
                        rowKey="key"
                        bordered
                    />

                    <Form.Item style={{ marginTop: 24 }}>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />} loading={submitting}>
                                {editingRecord ? 'Cập nhật Phiếu nhập' : 'Xác nhận Nhập kho'}
                            </Button>
                            {editingRecord && (
                                <Button icon={<CloseCircleOutlined />} onClick={cancelEdit}>Hủy sửa</Button>
                            )}
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
            <Card title="Lịch sử Phiếu Nhập kho NPL" bordered={false}>
                <Table columns={lichSuColumns} dataSource={lichSuPhieu} rowKey="id_nhap" loading={loadingLichSu} />
            </Card>

            <Drawer title={`Chi tiết Phiếu nhập: ${selectedPhieu?.so_phieu}`} width={600} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                {selectedPhieu && <>
                    <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
                        <Descriptions.Item label="Ngày nhập">{dayjs(selectedPhieu.ngay_nhap).format('DD/MM/YYYY')}</Descriptions.Item>
                        <Descriptions.Item label="Kho nhận">{selectedPhieu.kho.ten_kho}</Descriptions.Item>
                        <Descriptions.Item label="Hóa đơn">{selectedPhieu.hoaDonNhap.so_hd}</Descriptions.Item>
                    </Descriptions>
                    <Title level={5}>Danh sách NPL đã nhập</Title>
                    <Table columns={chiTietColumns} dataSource={selectedPhieu.chiTietNhapKhoNPLs} rowKey="id_ct" pagination={false} size="small" bordered />
                </>}
            </Drawer>
        </Space>
    );
};

export default NhapKhoNPL;

import React, { useState, useEffect } from "react";
import {
    Form,
    Select,
    DatePicker,
    Button,
    Table,
    InputNumber,
    Upload,
    message,
    Typography,
    Row,
    Col,
    Card,
} from "antd";
import { UploadOutlined, CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { uploadSingleFile } from "../../services/upload.service";
import { getAllHoaDonNhap, getHoaDonNhapById } from "../../services/hoadonnhap.service";
import { getAllKho } from "../../services/kho.service";
import { createNhapKhoNPL, addChiTietNhapKhoNPL } from "../../services/nhapkhonpl.service"; // ✅ thêm import service mới

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
                message.error("Không thể tải dữ liệu!");
            }
        };
        fetchData();
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
            message.error("Không thể tải chi tiết hóa đơn!");
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
                message.success("Tải file thành công!");
                onSuccess(res.data, file);
            } else {
                message.error("Không nhận được URL file từ server!");
                onError(new Error("Không có URL file!"));
            }
        } catch (err) {
            console.error(err);
            message.error("Lỗi khi tải file!");
            onError(err);
        } finally {
            setUploading(false);
        }
    };

    /* ============================================================
       🟢 SUBMIT FORM — TẠO PHIẾU NHẬP KHO
    ============================================================ */
    const onFinish = async (values) => {
        if (!chiTietNhap.length) {
            message.warning("Vui lòng chọn hóa đơn nhập và nhập chi tiết NPL!");
            return;
        }

        const payloadPhieu = {
            id_hd_nhap: values.id_hd_nhap,
            id_kho: values.id_kho,
            ngay_nhap: values.ngay_nhap
                ? dayjs(values.ngay_nhap).format("YYYY-MM-DD")
                : null,
            file_phieu: fileUrl || null,
        };

        console.log("📦 Dữ liệu gửi đi:", payloadPhieu);

        try {
            setSubmitting(true);

            // 1️⃣ Tạo phiếu nhập NPL
            const resPhieu = await createNhapKhoNPL(payloadPhieu);
            if (!resPhieu?.success || !resPhieu?.data?.id_nhap) {
                message.error(resPhieu?.message || "Không tạo được phiếu nhập!");
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
                message.success("Tạo phiếu nhập và chi tiết thành công!");
                form.resetFields();
                setChiTietNhap([]);
                setFileUrl(null);
            } else {
                message.warning("Tạo phiếu nhập thành công nhưng có chi tiết bị lỗi!");
            }
        } catch (err) {
            console.error(err);
            message.error("Lỗi khi tạo phiếu nhập kho!");
        } finally {
            setSubmitting(false);
        }
    };

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

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={3}>Tạo Phiếu Nhập Kho Nguyên Phụ Liệu</Title>
                </Col>
            </Row>

            <Card bordered={false}>
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
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<CheckCircleOutlined />}
                            loading={submitting}
                        >
                            Xác nhận Nhập kho
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default NhapKhoNPL;

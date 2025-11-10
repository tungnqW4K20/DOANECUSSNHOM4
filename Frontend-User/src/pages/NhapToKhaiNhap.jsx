import React, { useState, useEffect } from "react";
import {
    Steps, Button, Form, Select, DatePicker, Input, Upload, Table, message,
    InputNumber, Card, Typography, Row, Col, Space
} from "antd";
import {
    UploadOutlined, PlusOutlined, DeleteOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

// 🧩 Import API services
import { getAllHopDong } from "../services/hopdong.service";
import { getAllNguyenPhuLieu } from "../services/nguyenphulieu.service";
import { getAllTienTe } from "../services/tiente.service";
import { uploadSingleFile } from "../services/upload.service";
import { createToKhaiNhap } from "../services/tokhainhap.service";
import { createLoHang } from "../services/lohang.service";
import { createHoaDonNhap } from "../services/hoadonnhap.service";
import { createVanDonNhap } from "../services/vandonnhap.service";

const { Step } = Steps;
const { Option } = Select;
const { Title } = Typography;

const NhapToKhaiNhap = () => {
    const [current, setCurrent] = useState(0);
    const [formLoHang] = Form.useForm();
    const [formHoaDonVanDon] = Form.useForm();
    const [formToKhai] = Form.useForm();

    const [hopDongList, setHopDongList] = useState([]);
    const [nplList, setNplList] = useState([]);
    const [tienTeList, setTienTeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [chiTietHoaDon, setChiTietHoaDon] = useState([
        { key: 1, id_npl: null, so_luong: 0, don_gia: 0, tri_gia: 0 }
    ]);
    const [tongTienHoaDon, setTongTienHoaDon] = useState(0);

    // ✅ File URLs
    const [fileLoHang, setFileLoHang] = useState(null);
    const [fileHoaDon, setFileHoaDon] = useState(null);
    const [fileVanDon, setFileVanDon] = useState(null);
    const [fileToKhai, setFileToKhai] = useState(null);

    /* ============================================================
       🟢 LẤY DỮ LIỆU BAN ĐẦU
    ============================================================ */
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [resHD, resNPL, resTT] = await Promise.all([
                    getAllHopDong(),
                    getAllNguyenPhuLieu(),
                    getAllTienTe(),
                ]);
                setHopDongList(resHD.data || []);
                setNplList(resNPL.data || []);
                setTienTeList(resTT.data || []);
            } catch (err) {
                message.error("Không thể tải dữ liệu ban đầu!");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    /* ============================================================
       🟢 XỬ LÝ UPLOAD FILE
       (giữ nguyên như bạn đã làm)
    ============================================================ */
    const handleUpload = async ({ file, onSuccess, onError }, type) => {
        try {
            setUploading(true);
            const res = await uploadSingleFile(file);
            if (res?.data?.imageUrl) {
                message.success("Tải file thành công!");
                switch (type) {
                    case "lohang":
                        setFileLoHang(res.data.imageUrl);
                        break;
                    case "hoadon":
                        setFileHoaDon(res.data.imageUrl);
                        break;
                    case "vandon":
                        setFileVanDon(res.data.imageUrl);
                        break;
                    case "tokhai":
                        setFileToKhai(res.data.imageUrl);
                        break;
                    default:
                        break;
                }
                if (onSuccess) onSuccess(res.data, file);
            } else {
                message.error("Không có URL file từ server!");
                if (onError) onError(new Error("Không có URL!"));
            }
        } catch (err) {
            console.error(err);
            message.error("Lỗi khi upload!");
            if (onError) onError(err);
        } finally {
            setUploading(false);
        }
    };

    /* ============================================================
       🟢 XỬ LÝ FORM
    ============================================================ */
    useEffect(() => {
        const total = chiTietHoaDon.reduce((sum, item) => sum + (item.tri_gia || 0), 0);
        setTongTienHoaDon(total);
        formHoaDonVanDon.setFieldsValue({ tong_tien: total });
    }, [chiTietHoaDon, formHoaDonVanDon]);

    const next = async () => {
        try {
            if (current === 0) await formLoHang.validateFields();
            if (current === 1) await formHoaDonVanDon.validateFields();
            setCurrent((c) => c + 1);
        } catch {
            message.warning("Vui lòng điền đủ thông tin trước khi tiếp tục!");
        }
    };

    const prev = () => setCurrent((c) => c - 1);

    const handleAddRow = () =>
        setChiTietHoaDon([
            ...chiTietHoaDon,
            { key: Date.now(), id_npl: null, so_luong: 0, don_gia: 0, tri_gia: 0 },
        ]);

    const handleRemoveRow = (key) =>
        setChiTietHoaDon(chiTietHoaDon.filter((item) => item.key !== key));

    const handleChiTietChange = (key, field, value) => {
        const newData = [...chiTietHoaDon];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
            const item = { ...newData[index] };
            item[field] = value;
            if (field === "so_luong" || field === "don_gia") {
                item.tri_gia = (item.so_luong || 0) * (item.don_gia || 0);
            }
            newData.splice(index, 1, item);
            setChiTietHoaDon(newData);
        }
    };

    const onFinish = async () => {
        try {
            // validate cuối cùng (bắt buộc phần toKhai)
            await formToKhai.validateFields();

            // Lấy dữ liệu từ 3 form (do các form không unmount, giá trị vẫn có)
            const loHangForm = formLoHang.getFieldsValue();
            const hoaDonForm = formHoaDonVanDon.getFieldsValue();
            const toKhaiForm = formToKhai.getFieldsValue();

            // --- 1) Tạo Lô hàng (bắt buộc để có id_lh)
            const payloadLoHang = {
                id_hd: loHangForm.id_hd, // now should be defined
                // nếu bạn muốn gửi id_lh do người nhập thì giữ id_lh, else omit
                // id_lh: loHangForm.id_lh || undefined,
                ngay_dong_goi: loHangForm.ngay_dong_goi ? loHangForm.ngay_dong_goi.format("YYYY-MM-DD") : null,
                ngay_xuat_cang: loHangForm.ngay_xuat_cang ? loHangForm.ngay_xuat_cang.format("YYYY-MM-DD") : null,
                cang_xuat: loHangForm.cang_xuat || null,
                cang_nhap: loHangForm.cang_nhap || null,
                file_chung_tu: fileLoHang || null,
            };

            // debug: in ra payloadLoHang để kiểm tra trước khi gửi
            console.log("payloadLoHang:", payloadLoHang);

            const resLoHang = await createLoHang(payloadLoHang);
            const createdLoHang = resLoHang?.data || resLoHang;
            const id_lh = createdLoHang?.id_lh || createdLoHang?.data?.id_lh;
            if (!id_lh) throw new Error("Không lấy được id_lh sau khi tạo lô hàng");

            // --- 2) Tạo Hóa đơn nhập (và chi tiết)
            const chiTiet = chiTietHoaDon.map((ct) => ({
                id_npl: ct.id_npl,
                so_luong: ct.so_luong,
                don_gia: ct.don_gia,
                tri_gia: ct.tri_gia,
            }));
            const tong_tri_gia = chiTiet.reduce((s, i) => s + (i.tri_gia || 0), 0);

            const payloadHoaDon = {
                id_lh,
                so_hd: hoaDonForm.so_hd,
                ngay_hd: hoaDonForm.ngay_hd ? hoaDonForm.ngay_hd.format("YYYY-MM-DD") : null,
                id_tt: hoaDonForm.id_tt,
                tong_tien: tong_tri_gia,
                file_hoa_don: fileHoaDon || null,
                chi_tiets: chiTiet,
            };

            await createHoaDonNhap(payloadHoaDon);

            // --- 3)  Tạo Vận đơn
            const payloadVanDon = {
                id_lh,
                so_vd: hoaDonForm.so_vd || null,
                ngay_phat_hanh: hoaDonForm.ngay_phat_hanh ? hoaDonForm.ngay_phat_hanh.format("YYYY-MM-DD") : null,
                cang_xuat: hoaDonForm.vd_cang_xuat || null,
                cang_nhap: hoaDonForm.vd_cang_nhap || null,
                file_van_don: fileVanDon || null,
            };


            if (payloadVanDon.so_vd || payloadVanDon.file_van_don) {
                await createVanDonNhap(payloadVanDon);
            }

            // --- 4) Tạo Tờ khai nhập (payload phẳng theo BE đòi hỏi)
            const payloadToKhai = {
                id_lh,
                so_tk: toKhaiForm.so_to_khai,
                ngay_tk: toKhaiForm.ngay_dk ? toKhaiForm.ngay_dk.format("YYYY-MM-DD") : null,
                tong_tri_gia,
                id_tt: hoaDonForm.id_tt,
                file_to_khai: fileToKhai || null,
                // trang_thai: "Chờ duyệt"  // mặc định BE đã set rồi,
            };

            await createToKhaiNhap(payloadToKhai);

            message.success("Nộp tờ khai nhập khẩu thành công!");

            // Reset state/forms
            setCurrent(0);
            formLoHang.resetFields();
            formHoaDonVanDon.resetFields();
            formToKhai.resetFields();
            setFileLoHang(null);
            setFileHoaDon(null);
            setFileVanDon(null);
            setFileToKhai(null);
            setChiTietHoaDon([{ key: 1, id_npl: null, so_luong: 0, don_gia: 0, tri_gia: 0 }]);
        } catch (err) {
            console.error("onFinish error:", err);
            message.error(err?.message || "Không thể nộp tờ khai!");
        }
    };

    /* ============================================================
       🟢 CỘT CHI TIẾT HÓA ĐƠN
    ============================================================ */
    const columnsChiTiet = [
        {
            title: "Nguyên phụ liệu",
            dataIndex: "id_npl",
            render: (_, record) => (
                <Select
                    style={{ width: 200 }}
                    onChange={(val) => handleChiTietChange(record.key, "id_npl", val)}
                    placeholder="Chọn NPL"
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
            title: "Số lượng",
            dataIndex: "so_luong",
            render: (_, record) => (
                <InputNumber
                    min={0}
                    onChange={(val) => handleChiTietChange(record.key, "so_luong", val)}
                />
            ),
        },
        {
            title: "Đơn giá",
            dataIndex: "don_gia",
            render: (_, record) => (
                <InputNumber
                    min={0}
                    onChange={(val) => handleChiTietChange(record.key, "don_gia", val)}
                />
            ),
        },
        { title: "Trị giá", dataIndex: "tri_gia", render: (text) => text?.toLocaleString() },
        {
            title: "Hành động",
            render: (_, record) => (
                <Button icon={<DeleteOutlined />} danger onClick={() => handleRemoveRow(record.key)} />
            ),
        },
    ];

    /* ============================================================
       🟢 GIAO DIỆN 3 BƯỚC (render tất cả forms nhưng chỉ hiển thị step hiện tại)
    ============================================================ */
    const steps = [
        {
            title: "1. Thông tin Lô hàng",
            content: (
                <div style={{ display: current === 0 ? "block" : "none" }}>
                    <Form form={formLoHang} layout="vertical" preserve={true}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item label="Hợp đồng liên quan" name="id_hd" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn hợp đồng">
                                        {hopDongList.map((hd) => (
                                            <Option key={hd.id_hd} value={hd.id_hd}>
                                                {hd.so_hd}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Ngày đóng gói" name="ngay_dong_goi">
                                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Ngày xuất cảng" name="ngay_xuat_cang">
                                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Cảng xuất" name="cang_xuat">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Cảng nhập" name="cang_nhap">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="File chứng từ lô hàng">
                                    <Upload
                                        customRequest={(options) => handleUpload(options, "lohang")}
                                        maxCount={1}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />} loading={uploading}>
                                            Tải lên file
                                        </Button>
                                    </Upload>
                                    {fileLoHang && (
                                        <div style={{ marginTop: 8 }}>
                                            <a href={fileLoHang} target="_blank" rel="noopener noreferrer">
                                                Xem file đã tải lên
                                            </a>
                                        </div>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            ),
        },
        {
            title: "2. Hóa đơn & Vận đơn",
            content: (
                <div style={{ display: current === 1 ? "block" : "none" }}>
                    <Form form={formHoaDonVanDon} layout="vertical" preserve={true}>
                        <Row gutter={24}>
                            {/* ====== HÓA ĐƠN ====== */}
                            <Col span={12}>
                                <Form.Item label="Số hóa đơn" name="so_hd" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Ngày hóa đơn" name="ngay_hd" rules={[{ required: true }]}>
                                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Loại tiền tệ" name="id_tt" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn tiền tệ">
                                        {tienTeList.map((tt) => (
                                            <Option key={tt.id_tt} value={tt.id_tt}>
                                                {tt.ten_tt}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Tổng tiền (tự động)">
                                    <InputNumber
                                        disabled
                                        value={tongTienHoaDon}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item label="Chi tiết hóa đơn">
                                    <Button
                                        type="dashed"
                                        onClick={handleAddRow}
                                        icon={<PlusOutlined />}
                                        style={{ marginBottom: 10 }}
                                    >
                                        Thêm dòng
                                    </Button>
                                    <Table
                                        columns={columnsChiTiet}
                                        dataSource={chiTietHoaDon}
                                        pagination={false}
                                        rowKey="key"
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="File hóa đơn">
                                    <Upload
                                        customRequest={(options) => handleUpload(options, "hoadon")}
                                        maxCount={1}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />} loading={uploading}>
                                            Tải lên file
                                        </Button>
                                    </Upload>
                                    {fileHoaDon && (
                                        <div style={{ marginTop: 8 }}>
                                            <a href={fileHoaDon} target="_blank" rel="noopener noreferrer">
                                                Xem file đã tải lên
                                            </a>
                                        </div>
                                    )}
                                </Form.Item>
                            </Col>

                            {/* ====== VẬN ĐƠN ====== */}
                            <Col span={12}>
                                <Form.Item label="Số vận đơn" name="so_vd">
                                    <Input placeholder="Nhập số vận đơn" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Ngày phát hành" name="ngay_phat_hanh">
                                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Cảng xuất (trên vận đơn)" name="vd_cang_xuat">
                                    <Input placeholder="Nhập cảng xuất trên vận đơn" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Cảng nhập (trên vận đơn)" name="vd_cang_nhap">
                                    <Input placeholder="Nhập cảng nhập trên vận đơn" />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item label="File vận đơn">
                                    <Upload
                                        customRequest={(options) => handleUpload(options, "vandon")}
                                        maxCount={1}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />} loading={uploading}>
                                            Tải lên file
                                        </Button>
                                    </Upload>
                                    {fileVanDon && (
                                        <div style={{ marginTop: 8 }}>
                                            <a href={fileVanDon} target="_blank" rel="noopener noreferrer">
                                                Xem file đã tải lên
                                            </a>
                                        </div>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            ),
        },
        {
            title: "3. Tờ khai nhập khẩu",
            content: (
                <div style={{ display: current === 2 ? "block" : "none" }}>
                    <Form form={formToKhai} layout="vertical" preserve={true}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="Số tờ khai" name="so_to_khai" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Ngày đăng ký tờ khai" name="ngay_dk" rules={[{ required: true }]}>
                                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="File tờ khai">
                                    <Upload
                                        customRequest={(options) => handleUpload(options, "tokhai")}
                                        maxCount={1}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />} loading={uploading}>
                                            Tải lên file
                                        </Button>
                                    </Upload>
                                    {fileToKhai && (
                                        <div style={{ marginTop: 8 }}>
                                            <a href={fileToKhai} target="_blank" rel="noopener noreferrer">
                                                Xem file đã tải lên
                                            </a>
                                        </div>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            ),
        },
    ];

    return (
        <>
            <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
                Khai báo Tờ khai Nhập khẩu
            </Title>
            <Card loading={loading}>
                <Steps current={current} style={{ maxWidth: 900, margin: "0 auto 24px auto" }}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>

                {/* Render tất cả contents (forms) — mỗi content tự ẩn/hiện */}
                <div className="steps-content">
                    {steps.map((item, idx) => (
                        <div key={idx}>{item.content}</div>
                    ))}
                </div>

                <div style={{ marginTop: 24, textAlign: "center" }}>
                    <Space>
                        {current > 0 && <Button onClick={prev}>Quay lại</Button>}
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={next}>
                                Tiếp theo
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={onFinish}>
                                Hoàn tất & Nộp tờ khai
                            </Button>
                        )}
                    </Space>
                </div>
            </Card>
        </>
    );
};

export default NhapToKhaiNhap;

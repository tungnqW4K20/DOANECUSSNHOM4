// ✅ Phiên bản cuối cùng: gọi API thật, giấy phép có thể null, dùng notification system

import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Upload } from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    HomeOutlined,
    PhoneOutlined,
    SolutionOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { registerBusiness } from "../../services/auth.service"; // ✅ Dùng API thật
import { uploadSingleFile } from "../../services/upload.service"; // ✅ Dùng API thật
import { showSuccess, showError, showUploadSuccess, showUploadError } from "../../components/notification";

const { Title } = Typography;

const Register = () => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState(null); // ✅ Lưu URL file upload

    // ✅ Hàm upload file giấy phép kinh doanh
    const handleUpload = async ({ file, onSuccess, onError }) => {
        try {
            setUploading(true);
            const res = await uploadSingleFile(file, "fileUpload"); // ✅ Gọi API backend thật
            console.log("Kết quả upload:", res);

            // ✅ BE trả về data.imageUrl -> dùng URL đó
            if (res?.data?.imageUrl) {
                setFileUrl(res.data.imageUrl);
                showUploadSuccess(file.name);
                onSuccess(res.data, file); // báo cho Ant Design biết upload xong
            } else {
                showError('Upload thất bại', 'Máy chủ không trả về URL file!');
                onError(new Error("Không có URL file!")); // báo lỗi nếu không có URL
            }
        } catch (err) {
            console.error("Lỗi upload:", err);
            showUploadError();
            onError(err); // báo lỗi cho Upload biết
        } finally {
            setUploading(false);
        }
    };

    // ✅ Hàm xử lý khi nhấn "Đăng ký"
    const onFinish = async (values) => {
        try {
            console.log("Thông tin đăng ký:", values);

            // ❌ Bỏ bắt buộc giấy phép (có thể null)
            const payload = {
                ten_dn: values.ten_dn,
                ma_so_thue: values.ma_so_thue,
                email: values.email,
                sdt: values.sdt,
                dia_chi: values.dia_chi,
                mat_khau: values.mat_khau,
                file_giay_phep: fileUrl || null, // ✅ Cho phép null
            };

            const res = await registerBusiness(payload);
            console.log("Kết quả đăng ký:", res);

            // ✅ BE trả về success: true
            if (res?.success) {
                showSuccess('Đăng ký thành công', 'Vui lòng đăng nhập để tiếp tục');
                navigate("/auth/login");
            } else {
                showError('Đăng ký thất bại', res?.message || 'Đăng ký không thành công!');
            }
        } catch (err) {
            console.error("Lỗi đăng ký:", err);
            showError('Đăng ký thất bại', err?.message || 'Lỗi khi đăng ký tài khoản!');
        }
    };

    return (
        <Card
            title={
                <Title level={3} style={{ textAlign: "center" }}>
                    Đăng ký Tài khoản Doanh nghiệp
                </Title>
            }
            style={{ width: 500, margin: "auto" }}
        >
            <Form name="register" onFinish={onFinish} layout="vertical" scrollToFirstError>
                {/* --- Thông tin doanh nghiệp --- */}
                <Form.Item
                    name="ten_dn"
                    label="Tên doanh nghiệp"
                    rules={[{ required: true, message: "Vui lòng nhập tên doanh nghiệp!" }]}
                >
                    <Input prefix={<SolutionOutlined />} placeholder="Tên doanh nghiệp" />
                </Form.Item>

                <Form.Item
                    name="ma_so_thue"
                    label="Mã số thuế (dùng để đăng nhập)"
                    rules={[{ required: true, message: "Vui lòng nhập mã số thuế!" }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Mã số thuế" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email liên hệ"
                    rules={[
                        { type: "email", message: "Email không hợp lệ!" },
                        { required: true, message: "Vui lòng nhập email!" },
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="sdt"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                >
                    <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                </Form.Item>

                <Form.Item
                    name="dia_chi"
                    label="Địa chỉ"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                >
                    <Input prefix={<HomeOutlined />} placeholder="Địa chỉ" />
                </Form.Item>

                {/* --- Mật khẩu --- */}
                <Form.Item
                    name="mat_khau"
                    label="Mật khẩu"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    hasFeedback
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Xác nhận mật khẩu"
                    dependencies={["mat_khau"]}
                    hasFeedback
                    rules={[
                        { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("mat_khau") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Hai mật khẩu không khớp!"));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
                </Form.Item>

                {/* --- Upload giấy phép (có thể bỏ trống) --- */}
                <Form.Item label="Giấy phép kinh doanh (có thể bỏ trống)">
                    <Upload
                        customRequest={handleUpload} // ✅ Upload file bằng API thật
                        maxCount={1}
                        showUploadList={{
                            showRemoveIcon: false,
                        }}
                    >
                        <Button icon={<UploadOutlined />} loading={uploading}>
                            Tải lên
                        </Button>
                    </Upload>

                    {fileUrl && (
                        <div style={{ marginTop: 8 }}>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                Xem giấy phép đã tải
                            </a>
                        </div>
                    )}
                </Form.Item>

                {/* --- Nút đăng ký --- */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                        Đăng ký
                    </Button>
                </Form.Item>

                {/* --- Liên kết đăng nhập --- */}
                <div style={{ textAlign: "center" }}>
                    Đã có tài khoản? <Link to="/auth/login">Đăng nhập ngay!</Link>
                </div>
            </Form>
        </Card>
    );
};

export default Register;

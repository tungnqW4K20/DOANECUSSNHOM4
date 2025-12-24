import { useState } from "react";
import { Form, Input, Button, Typography, Upload } from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    HomeOutlined,
    PhoneOutlined,
    SolutionOutlined,
    UploadOutlined,
    ArrowRightOutlined,
    ShopOutlined,
    SafetyCertificateOutlined,
    FileProtectOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { registerBusiness } from "../../services/auth.service";
import { uploadSingleFile } from "../../services/upload.service";
import { showSuccess, showError, showUploadSuccess, showUploadError } from "../../components/notification";

const { Title, Text } = Typography;

const Register = () => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [form] = Form.useForm();

    const handleUpload = async ({ file, onSuccess, onError }) => {
        try {
            setUploading(true);
            const res = await uploadSingleFile(file, "fileUpload");
            if (res?.data?.imageUrl) {
                setFileUrl(res.data.imageUrl);
                showUploadSuccess(file.name);
                onSuccess(res.data, file);
            } else {
                showError('Upload thất bại', 'Máy chủ không trả về URL file!');
                onError(new Error("Không có URL file!"));
            }
        } catch (err) {
            showUploadError();
            onError(err);
        } finally {
            setUploading(false);
        }
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const payload = {
                ten_dn: values.ten_dn,
                ma_so_thue: values.ma_so_thue,
                email: values.email,
                sdt: values.sdt,
                dia_chi: values.dia_chi,
                mat_khau: values.mat_khau,
                file_giay_phep: fileUrl || null,
            };

            const res = await registerBusiness(payload);
            if (res?.success) {
                showSuccess('Đăng ký thành công', 'Vui lòng đăng nhập để tiếp tục');
                navigate("/auth/login");
            } else {
                showError('Đăng ký thất bại', res?.message || 'Đăng ký không thành công!');
            }
        } catch (err) {
            showError('Đăng ký thất bại', err?.message || 'Lỗi khi đăng ký tài khoản!');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: <SafetyCertificateOutlined />, title: 'Bảo mật cao', desc: 'Thông tin được mã hóa an toàn' },
        { icon: <FileProtectOutlined />, title: 'Quản lý dễ dàng', desc: 'Giao diện thân thiện, dễ sử dụng' },
        { icon: <CheckCircleOutlined />, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ hỗ trợ luôn sẵn sàng' },
    ];

    return (
        <div className="login-wrapper" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', overflow: 'hidden' }}>
            {/* Left Side */}
            <div
                className="left-panel"
                style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '40px 80px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div className="bg-shapes">
                    <div className="shape shape-1" />
                    <div className="shape shape-2" />
                    <div className="shape shape-3" />
                </div>

                <div className="particles">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className={`particle particle-${i + 1}`} />
                    ))}
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '32px' }}>
                        <div
                            className="logo-icon"
                            style={{
                                width: '64px',
                                height: '64px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '20px',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <ShopOutlined style={{ fontSize: '32px', color: 'white' }} />
                        </div>
                        <Title level={2} style={{ color: 'white', margin: 0, fontSize: '32px', fontWeight: 700 }}>
                            Đăng ký Doanh nghiệp
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
                            Tham gia hệ thống Quản lý Sản xuất Xuất khẩu
                        </Text>
                    </div>

                    <div>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-item"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    marginBottom: '16px',
                                    padding: '14px 18px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px',
                                        color: 'white',
                                        flexShrink: 0,
                                    }}
                                >
                                    {feature.icon}
                                </div>
                                <div>
                                    <Text strong style={{ color: 'white', fontSize: '14px', display: 'block' }}>
                                        {feature.title}
                                    </Text>
                                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                                        {feature.desc}
                                    </Text>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px 60px',
                    background: '#fff',
                    overflowY: 'auto',
                }}
            >
                <div className="login-form-container" style={{ width: '100%', maxWidth: '420px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <Title level={3} style={{ margin: '0 0 6px 0', color: '#1e293b', fontWeight: 700 }}>
                            Tạo tài khoản mới
                        </Title>
                        <Text style={{ color: '#64748b', fontSize: '14px' }}>
                            Điền thông tin để đăng ký tài khoản doanh nghiệp
                        </Text>
                    </div>

                    <Form form={form} name="register" onFinish={onFinish} layout="vertical" requiredMark={false} size="middle">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Form.Item
                                name="ten_dn"
                                label={<span style={{ fontWeight: 500, color: '#374151', fontSize: '12px' }}>Tên doanh nghiệp</span>}
                                rules={[{ required: true, message: "Vui lòng nhập!" }]}
                                style={{ marginBottom: '12px' }}
                            >
                                <Input prefix={<SolutionOutlined style={{ color: '#94a3b8' }} />} placeholder="Tên doanh nghiệp" className="login-input" style={{ height: '38px', borderRadius: '8px', border: '1.5px solid #e2e8f0' }} />
                            </Form.Item>

                            <Form.Item
                                name="ma_so_thue"
                                label={<span style={{ fontWeight: 500, color: '#374151', fontSize: '12px' }}>Mã số thuế</span>}
                                rules={[{ required: true, message: "Vui lòng nhập!" }]}
                                style={{ marginBottom: '12px' }}
                            >
                                <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="Mã số thuế" className="login-input" style={{ height: '38px', borderRadius: '8px', border: '1.5px solid #e2e8f0' }} />
                            </Form.Item>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Form.Item
                                name="email"
                                label={<span style={{ fontWeight: 500, color: '#374151', fontSize: '12px' }}>Email</span>}
                                rules={[{ type: "email", message: "Email không hợp lệ!" }, { required: true, message: "Vui lòng nhập!" }]}
                                style={{ marginBottom: '12px' }}
                            >
                                <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="Email" className="login-input" style={{ height: '38px', borderRadius: '8px', border: '1.5px solid #e2e8f0' }} />
                            </Form.Item>

                            <Form.Item
                                name="sdt"
                                label={<span style={{ fontWeight: 500, color: '#374151', fontSize: '12px' }}>Số điện thoại</span>}
                                rules={[{ required: true, message: "Vui lòng nhập!" }]}
                                style={{ marginBottom: '12px' }}
                            >
                                <Input prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} placeholder="Số điện thoại" className="login-input" style={{ height: '38px', borderRadius: '8px', border: '1.5px solid #e2e8f0' }} />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="dia_chi"
                            label={<span style={{ fontWeight: 500, color: '#374151', fontSize: '12px' }}>Địa chỉ</span>}
                            rules={[{ required: true, message: "Vui lòng nhập!" }]}
                            style={{ marginBottom: '12px' }}
                        >
                            <Input prefix={<HomeOutlined style={{ color: '#94a3b8' }} />} placeholder="Địa chỉ" className="login-input" style={{ height: '38px', borderRadius: '8px', border: '1.5px solid #e2e8f0' }} />
                        </Form.Item>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Form.Item
                                name="mat_khau"
                                label={<span style={{ fontWeight: 500, color: '#374151', fontSize: '12px' }}>Mật khẩu</span>}
                                rules={[{ required: true, message: "Vui lòng nhập!" }]}
                                style={{ marginBottom: '12px' }}
                            >
                                <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="Mật khẩu" className="login-input" style={{ height: '38px', borderRadius: '8px', border: '1.5px solid #e2e8f0' }} />
                            </Form.Item>

                            <Form.Item
                                name="confirm"
                                label={<span style={{ fontWeight: 500, color: '#374151', fontSize: '12px' }}>Xác nhận mật khẩu</span>}
                                dependencies={["mat_khau"]}
                                rules={[
                                    { required: true, message: "Vui lòng nhập!" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("mat_khau") === value) return Promise.resolve();
                                            return Promise.reject(new Error("Mật khẩu không khớp!"));
                                        },
                                    }),
                                ]}
                                style={{ marginBottom: '12px' }}
                            >
                                <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="Xác nhận" className="login-input" style={{ height: '38px', borderRadius: '8px', border: '1.5px solid #e2e8f0' }} />
                            </Form.Item>
                        </div>

                        <Form.Item label={<span style={{ fontWeight: 500, color: '#374151', fontSize: '12px' }}>Giấy phép kinh doanh (tùy chọn)</span>} style={{ marginBottom: '16px' }}>
                            <Upload customRequest={handleUpload} maxCount={1} showUploadList={{ showRemoveIcon: false }}>
                                <Button icon={<UploadOutlined />} loading={uploading} size="small">Tải lên</Button>
                            </Upload>
                            {fileUrl && (
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#2563eb' }}>
                                    Xem file đã tải
                                </a>
                            )}
                        </Form.Item>

                        <Form.Item style={{ marginBottom: '12px' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                className="login-btn"
                                style={{
                                    height: '42px',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                                    border: 'none',
                                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                                }}
                            >
                                {loading ? 'Đang xử lý...' : (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        Đăng ký <ArrowRightOutlined />
                                    </span>
                                )}
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            <Text style={{ color: '#64748b', fontSize: '13px' }}>
                                Đã có tài khoản?{' '}
                                <Link to="/auth/login" style={{ color: '#2563eb', fontWeight: 600 }}>
                                    Đăng nhập ngay!
                                </Link>
                            </Text>
                        </div>
                    </Form>
                </div>
            </div>

            <style>{`
                html, body, #root { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; }
                .login-wrapper { position: fixed; top: 0; left: 0; right: 0; bottom: 0; }
                .bg-shapes { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
                .shape { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.08); }
                .shape-1 { width: 400px; height: 400px; top: -100px; left: -100px; animation: float 8s ease-in-out infinite; }
                .shape-2 { width: 300px; height: 300px; bottom: -80px; right: -80px; animation: float 10s ease-in-out infinite reverse; }
                .shape-3 { width: 200px; height: 200px; top: 50%; left: 60%; animation: float 12s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                .particles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
                .particle { position: absolute; width: 5px; height: 5px; background: rgba(255, 255, 255, 0.4); border-radius: 50%; animation: rise 18s infinite; }
                .particle-1 { left: 10%; animation-delay: 0s; } .particle-2 { left: 20%; animation-delay: 2s; }
                .particle-3 { left: 30%; animation-delay: 4s; } .particle-4 { left: 40%; animation-delay: 6s; }
                .particle-5 { left: 50%; animation-delay: 8s; } .particle-6 { left: 60%; animation-delay: 10s; }
                .particle-7 { left: 70%; animation-delay: 12s; } .particle-8 { left: 80%; animation-delay: 14s; }
                .particle-9 { left: 90%; animation-delay: 16s; } .particle-10 { left: 95%; animation-delay: 1s; }
                @keyframes rise { 0% { transform: translateY(100vh); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 0.5; } 100% { transform: translateY(-50px); opacity: 0; } }
                .logo-icon { animation: pulse 3s ease-in-out infinite; }
                @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                .feature-item { animation: slideIn 0.5s ease-out backwards; transition: transform 0.3s ease; }
                .feature-item:hover { transform: translateX(8px); }
                .feature-item:nth-child(1) { animation-delay: 0.1s; }
                .feature-item:nth-child(2) { animation-delay: 0.2s; }
                .feature-item:nth-child(3) { animation-delay: 0.3s; }
                @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
                .login-form-container { animation: fadeIn 0.5s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                .login-input:focus, .login-input:hover { border-color: #2563eb !important; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important; }
                .login-btn { transition: all 0.3s ease !important; }
                .login-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(37, 99, 235, 0.4) !important; }
                @media (max-width: 900px) { .left-panel { display: none !important; } }
            `}</style>
        </div>
    );
};

export default Register;

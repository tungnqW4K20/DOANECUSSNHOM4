import React, { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Input, Select, DatePicker, Space, Popconfirm,
  Row, Col, Typography, Card, Upload, Tooltip
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, FileOutlined, UploadOutlined, EyeOutlined, SearchOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

import {
  getAllLoHang, createLoHang, updateLoHang, deleteLoHang
} from "../../services/lohang.service";
import { getAllHopDong } from "../../services/hopdong.service";
import { uploadSingleFile } from "../../services/upload.service";
import {
  showCreateSuccess,
  showUpdateSuccess,
  showDeleteSuccess,
  showLoadError,
  showSaveError,
  showUploadSuccess,
  showUploadError
} from "../../components/notification";

const { Option } = Select;
const { Title } = Typography;
const { Search } = Input;

const LoHang = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [hopDongs, setHopDongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // ✅ Thêm mới state cho upload
  const [fileUrl, setFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ============================================================
     🟢 LẤY DỮ LIỆU BAN ĐẦU
  ============================================================ */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resLH, resHD] = await Promise.all([getAllLoHang(), getAllHopDong()]);
      setDataSource(resLH.data || []);
      setHopDongs(resHD.data || []);
    } catch (err) {
      showLoadError('danh sách lô hàng');
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     🟢 MỞ MODAL
  ============================================================ */
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setFileUrl(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFileUrl(record.file_chung_tu || null);
    form.setFieldsValue({
      ...record,
      ngay_dong_goi: record.ngay_dong_goi ? dayjs(record.ngay_dong_goi) : null,
      ngay_xuat_cang: record.ngay_xuat_cang ? dayjs(record.ngay_xuat_cang) : null,
    });
    setIsModalOpen(true);
  };

  /* ============================================================
     🟢 XÓA LÔ HÀNG
  ============================================================ */
  const handleDelete = async (id_lh) => {
    try {
      await deleteLoHang(id_lh);
      showDeleteSuccess('Lô hàng');
      fetchData();
    } catch (err) {
      showSaveError('lô hàng');
    }
  };

  /* ============================================================
     🟢 UPLOAD FILE (theo mẫu HopDong)
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

  /* ============================================================
     🟢 SUBMIT FORM
  ============================================================ */
  const onFinish = async (values) => {
    const payload = {
      ...values,
      ngay_dong_goi: values.ngay_dong_goi ? values.ngay_dong_goi.format("YYYY-MM-DD") : null,
      ngay_xuat_cang: values.ngay_xuat_cang ? values.ngay_xuat_cang.format("YYYY-MM-DD") : null,
      file_chung_tu: fileUrl || null,
    };

    try {
      if (editingRecord) {
        await updateLoHang(editingRecord.id_lh, payload);
        showUpdateSuccess('Lô hàng');
      } else {
        await createLoHang(payload);
        showCreateSuccess('Lô hàng');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showSaveError('lô hàng');
    }
  };

  /* ============================================================
     🟢 CỘT BẢNG
  ============================================================ */
  const columns = [
    {
      title: "Số hợp đồng",
      dataIndex: "id_hd",
      key: "id_hd",
      render: (id_hd) => hopDongs.find((hd) => hd.id_hd === id_hd)?.so_hd || "N/A",
    },
    { title: "Số lô hàng", dataIndex: "id_lh", key: "id_lh" },
    { title: "Ngày đóng gói", dataIndex: "ngay_dong_goi", key: "ngay_dong_goi" },
    { title: "Ngày xuất cảng", dataIndex: "ngay_xuat_cang", key: "ngay_xuat_cang" },
    { title: "Cảng xuất", dataIndex: "cang_xuat", key: "cang_xuat" },
    { title: "Cảng nhập", dataIndex: "cang_nhap", key: "cang_nhap" },
    {
      title: "Chứng từ",
      dataIndex: "file_chung_tu",
      key: "file_chung_tu",
      align: "center",
      render: (file) =>
        file ? (
          <Tooltip title="Xem chứng từ">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => window.open(file, "_blank")}
            />
          </Tooltip>
        ) : (
          "-"
        ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 180,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa lô hàng này?"
            onConfirm={() => handleDelete(record.id_lh)}
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16 }}>
        <h2 className="page-header-heading" style={{ margin: 0 }}>Quản lý Lô hàng</h2>
        <div style={{ display: 'flex', gap: 12, flex: 1, justifyContent: 'flex-end' }}>
          <Input
            placeholder="Tìm theo số lô hàng, cảng..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm mới
          </Button>
        </div>
      </div>

      <Card bordered={false}>
        <Table columns={columns} dataSource={dataSource} rowKey="id_lh" loading={loading} />
      </Card>

      <Modal
        title={editingRecord ? "Chỉnh sửa Lô hàng" : "Thêm mới Lô hàng"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="id_hd"
                label="Hợp đồng liên quan"
                rules={[{ required: true, message: "Chọn hợp đồng!" }]}
              >
                <Select placeholder="Chọn hợp đồng">
                  {hopDongs.map((hd) => (
                    <Option key={hd.id_hd} value={hd.id_hd}>
                      {hd.so_hd}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="id_lh"
                label="Số lô hàng"
                rules={[{ required: true, message: "Nhập số lô hàng!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ngay_dong_goi" label="Ngày đóng gói">
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ngay_xuat_cang" label="Ngày xuất cảng">
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="cang_xuat" label="Cảng xuất">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cang_nhap" label="Cảng nhập">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* ✅ Upload file thật + xem trước */}
          <Form.Item label="File chứng từ">
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

          <Form.Item>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default LoHang;

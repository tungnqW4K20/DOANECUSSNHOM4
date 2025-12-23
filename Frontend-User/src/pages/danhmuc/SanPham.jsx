import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

// 🧩 Import services
import {
  getAllSanPham,
  createSanPham,
  updateSanPham,
  deleteSanPham,
} from "../../services/sanpham.service";
import { getAllDonViTinhHQ } from "../../services/donvitinhHaiQuan.service";

// 🔔 Import notification helpers
import {
  showCreateSuccess,
  showUpdateSuccess,
  showDeleteSuccess,
  showLoadError,
  showSaveError,
} from "../../components/notification";

const { Option } = Select;

const SanPham = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dvtHqList, setDvtHqList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  /* ============================================================
     🟢 FETCH DỮ LIỆU BAN ĐẦU
  ============================================================ */
  const fetchData = async () => {
    setLoading(true);
    try {
      const [spRes, dvtRes] = await Promise.all([getAllSanPham(), getAllDonViTinhHQ()]);
      if (spRes?.success && dvtRes?.success) {
        const list = spRes.data.map((sp) => ({
          ...sp,
          ten_dvt: sp?.donViTinhHQ?.ten_dvt || "—",
        }));
        setDataSource(list);
        setFilteredData(list);
        setDvtHqList(dvtRes.data);
      } else {
        showLoadError("danh sách sản phẩm");
      }
    } catch (err) {
      showLoadError("danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ============================================================
     🟢 XỬ LÝ CRUD
  ============================================================ */
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ten_sp: record.ten_sp,
      mo_ta: record.mo_ta,
      id_dvt_hq: record.id_dvt_hq,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id_sp) => {
    try {
      await deleteSanPham(id_sp);
      showDeleteSuccess("Sản phẩm");
      fetchData();
    } catch (err) {
      showSaveError("sản phẩm");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    try {
      if (editingRecord) {
        await updateSanPham(editingRecord.id_sp, values);
        showUpdateSuccess("Sản phẩm");
      } else {
        await createSanPham(values);
        showCreateSuccess("Sản phẩm");
      }
      setIsModalVisible(false);
      fetchData();
    } catch (err) {
      showSaveError("sản phẩm");
    }
  };

  /* ============================================================
     🟢 TÌM KIẾM
  ============================================================ */
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = dataSource.filter(
      (item) =>
        item.ten_sp.toLowerCase().includes(value) ||
        (item.mo_ta || "").toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  /* ============================================================
     🟢 CỘT TABLE
  ============================================================ */
  const columns = [
    { title: "Mã SP", dataIndex: "id_sp", key: "id_sp", sorter: (a, b) => a.id_sp - b.id_sp },
    { title: "Tên sản phẩm", dataIndex: "ten_sp", key: "ten_sp" },
    { title: "Mô tả", dataIndex: "mo_ta", key: "mo_ta" },
    { title: "Đơn vị tính HQ", dataIndex: "ten_dvt", key: "ten_dvt" },
    {
      title: "Hành động",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id_sp)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ============================================================
     🟢 GIAO DIỆN
  ============================================================ */
  return (
    <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16 }}>
                <h2 className="page-header-heading" style={{ margin: 0 }}>Quản lý Sản phẩm</h2>
                <div style={{ display: 'flex', gap: 12, flex: 1, justifyContent: 'flex-end' }}>
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        prefix={<SearchOutlined />}
                        onChange={handleSearch}
                        style={{ width: 300 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm mới
                    </Button>
                </div>
            </div>

      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredData} rowKey="id_sp" />
      </Spin>

      <Modal
        title={editingRecord ? "Chỉnh sửa Sản phẩm" : "Thêm mới Sản phẩm"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="ten_sp"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="mo_ta" label="Mô tả">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="id_dvt_hq"
            label="Đơn vị tính Hải quan"
            rules={[{ required: true, message: "Vui lòng chọn đơn vị tính!" }]}
          >
            <Select placeholder="Chọn đơn vị tính">
              {dvtHqList.map((dvt) => (
                <Option key={dvt.id_dvt_hq} value={dvt.id_dvt_hq}>
                  {dvt.ten_dvt}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SanPham;

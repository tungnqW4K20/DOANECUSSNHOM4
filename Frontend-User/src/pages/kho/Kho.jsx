import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Row,
  Col,
  Typography,
  Card,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import khoService from "../../services/kho.service"; // ✅ import service
import { showCreateSuccess, showUpdateSuccess, showDeleteSuccess, showLoadError, showSaveError } from "../../components/notification";

const { Title } = Typography;
const { Search } = Input;

const Kho = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState("");

  const userData = JSON.parse(localStorage.getItem('user'));
  const LOGGED_IN_DN_ID = userData?.id_dn;

  // =============================
  // 📦 Lấy danh sách kho từ BE
  // =============================
  const fetchKho = async () => {
    try {
      setLoading(true);
      const res = await khoService.getAllKho();
      // getAllKho trả về { data: [...] }
      const khoData = res?.data || [];
      setDataSource(khoData);
      setFilteredData(khoData);
    } catch (err) {
      showLoadError('danh sách kho');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKho();
  }, []);

  // =============================
  // 🔍 Tìm kiếm
  // =============================
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredData(dataSource);
    } else {
      const lowerValue = value.toLowerCase();
      const filtered = dataSource.filter(
        (item) =>
          item.ten_kho.toLowerCase().includes(lowerValue) ||
          (item.dia_chi && item.dia_chi.toLowerCase().includes(lowerValue))
      );
      setFilteredData(filtered);
    }
  };

  // =============================
  // 🟢 Thêm / sửa kho
  // =============================
  const onFinish = async (values) => {
    try {
      setLoading(true);
      if (editingRecord) {
        await khoService.updateKho(editingRecord.id_kho, values);
        showUpdateSuccess('Kho');
      } else {
        await khoService.createKho({
          id_dn: LOGGED_IN_DN_ID,
          ...values,
        });
        showCreateSuccess('Kho');
      }
      setIsModalOpen(false);
      await fetchKho(); // reload danh sách
    } catch (err) {
      console.error("❌ Lỗi:", err);
      showSaveError('kho');
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔴 Xóa kho
  // =============================
  const handleDelete = async (id_kho) => {
    try {
      setLoading(true);
      await khoService.deleteKho(id_kho);
      showDeleteSuccess('Kho');
      await fetchKho();
    } catch (err) {
      showSaveError('kho');
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ✏️ Sửa và thêm
  // =============================
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // =============================
  // 🔍 Cột bảng
  // =============================
  const columns = [
    {
      title: "Tên kho",
      dataIndex: "ten_kho",
      key: "ten_kho",
      sorter: (a, b) => a.ten_kho.localeCompare(b.ten_kho),
    },
    { title: "Địa chỉ", dataIndex: "dia_chi", key: "dia_chi" },
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
            title="Bạn có chắc muốn xóa kho này?"
            onConfirm={() => handleDelete(record.id_kho)}
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
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} className="page-header-heading">
            Quản lý Kho
          </Title>
        </Col>
        <Col>
          <Space>
            <Search
              placeholder="Tìm kiếm kho..."
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={handleSearch}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Thêm kho mới
            </Button>
          </Space>
        </Col>
      </Row>

      <Card variant="borderless" className="content-card">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id_kho"
          loading={loading}
          pagination={{ pageSize: 5, showSizeChanger: false }}
        />
      </Card>

      <Modal
        title={editingRecord ? "Chỉnh sửa Kho" : "Thêm Kho mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="ten_kho"
            label="Tên kho"
            rules={[{ required: true, message: "Vui lòng nhập tên kho!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dia_chi"
            label="Địa chỉ kho"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ kho!" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Lưu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Kho;

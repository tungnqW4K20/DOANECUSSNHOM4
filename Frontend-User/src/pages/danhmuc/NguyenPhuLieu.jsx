import React, { useEffect, useState } from "react";
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
import {
  getAllNguyenPhuLieu,
  getNguyenPhuLieuById,
  createNguyenPhuLieu,
  updateNguyenPhuLieu,
  deleteNguyenPhuLieu,
} from "../../services/nguyenphulieu.service";
import { getAllDonViTinhHQ } from "../../services/donvitinhHaiQuan.service";
import {
  showCreateSuccess,
  showUpdateSuccess,
  showDeleteSuccess,
  showLoadError,
  showSaveError,
} from "../../components/notification";

const { Option } = Select;

const NguyenPhuLieu = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [dvtHqList, setDvtHqList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState("");

  /* ============================================================
     🟢 FETCH DỮ LIỆU BAN ĐẦU
  ============================================================ */
  useEffect(() => {
    fetchData();
    fetchDvtHq();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllNguyenPhuLieu();
      console.log(res);

      if (res.success) {
        setDataSource(res.data);
      } else {
        showLoadError("danh sách nguyên phụ liệu");
      }
    } catch (err) {
      showLoadError("danh sách nguyên phụ liệu");
    } finally {
      setLoading(false);
    }
  };

  const fetchDvtHq = async () => {
    try {
      const res = await getAllDonViTinhHQ();
      if (res.success) setDvtHqList(res.data);
    } catch (err) {
      showLoadError("danh sách đơn vị tính HQ");
    }
  };

  /* ============================================================
     🟢 THÊM / SỬA / XÓA
  ============================================================ */
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = async (record) => {
    try {
      const res = await getNguyenPhuLieuById(record.id_npl);
      if (res.success) {
        setEditingRecord(record);
        form.setFieldsValue(res.data);
        setIsModalVisible(true);
      }
    } catch (err) {
      showLoadError("chi tiết nguyên phụ liệu");
    }
  };

  const handleDelete = async (id_npl) => {
    try {
      const res = await deleteNguyenPhuLieu(id_npl);
      if (res.success) {
        showDeleteSuccess("Nguyên phụ liệu");
        fetchData();
      }
    } catch (err) {
      showSaveError("nguyên phụ liệu");
    }
  };

  const onFinish = async (values) => {
    try {
      if (editingRecord) {
        const res = await updateNguyenPhuLieu(editingRecord.id_npl, values);
        if (res.success) {
          showUpdateSuccess("Nguyên phụ liệu");
          fetchData();
        }
      } else {
        const res = await createNguyenPhuLieu(values);
        if (res.success) {
          showCreateSuccess("Nguyên phụ liệu");
          fetchData();
        }
      }
      setIsModalVisible(false);
    } catch (err) {
      showSaveError("nguyên phụ liệu");
    }
  };

  /* ============================================================
     🟢 CỘT TABLE + LỌC
  ============================================================ */
  const filteredData = dataSource.filter((item) =>
    item.ten_npl?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Mã NPL",
      dataIndex: "id_npl",
      key: "id_npl",
      sorter: (a, b) => a.id_npl - b.id_npl,
      width: 100,
    },
    {
      title: "Tên nguyên phụ liệu",
      dataIndex: "ten_npl",
      key: "ten_npl",
    },
    {
      title: "Mô tả",
      dataIndex: "mo_ta",
      key: "mo_ta",
    },
    {
      title: "Đơn vị tính HQ",
      dataIndex: "id_dvt_hq",
      key: "id_dvt_hq",
      render: (id) =>
        dvtHqList.find((d) => d.id_dvt_hq === id)?.ten_dvt || "—",
    },
    {
      title: "Doanh nghiệp",
      key: "ten_dn",
      render: (_, record) => record.doanhNghiep?.ten_dn || "—",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="default"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id_npl)}
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
        <h2 className="page-header-heading" style={{ margin: 0 }}>Quản lý Nguyên Phụ Liệu</h2>
        <div style={{ display: 'flex', gap: 12, flex: 1, justifyContent: 'flex-end' }}>
          <Input
            placeholder="Tìm kiếm theo tên..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm mới
          </Button>
        </div>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id_npl"
          pagination={{ pageSize: 8 }}
        />
      </Spin>

      <Modal
        title={editingRecord ? "Chỉnh sửa NPL" : "Thêm mới NPL"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="ten_npl"
            label="Tên nguyên phụ liệu"
            rules={[{ required: true, message: "Vui lòng nhập tên nguyên phụ liệu" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="mo_ta" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="id_dvt_hq"
            label="Đơn vị tính Hải quan"
            rules={[{ required: true, message: "Vui lòng chọn đơn vị tính" }]}
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
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NguyenPhuLieu;

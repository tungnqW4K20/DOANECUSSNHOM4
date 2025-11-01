import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

// Dữ liệu giả lập - Trong thực tế bạn sẽ fetch từ API
const initialData = [
  { id_sp: 1, ten_sp: 'Áo phông cổ tròn', mo_ta: 'Vải cotton 100%', id_dvt_hq: 1, ten_dvt: 'Cái' },
  { id_sp: 2, ten_sp: 'Quần Jeans Nam', mo_ta: 'Vải bò co giãn', id_dvt_hq: 1, ten_dvt: 'Cái' },
  { id_sp: 3, ten_sp: 'Váy công sở', mo_ta: 'Vải lụa', id_dvt_hq: 1, ten_dvt: 'Cái' },
];

// Giả lập danh sách đơn vị tính hải quan
const dvtHqList = [
    { id_dvt_hq: 1, ten_dvt: 'Cái' },
    { id_dvt_hq: 2, ten_dvt: 'Bộ' },
    { id_dvt_hq: 3, ten_dvt: 'KGM' },
]

const SanPham = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id_sp) => {
    // Logic gọi API xóa
    setDataSource(dataSource.filter(item => item.id_sp !== id_sp));
    setFilteredData(filteredData.filter(item => item.id_sp !== id_sp));
    message.success('Xóa sản phẩm thành công!');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    if (editingRecord) {
      // Logic gọi API cập nhật
      const updatedData = dataSource.map(item =>
        item.id_sp === editingRecord.id_sp ? { ...editingRecord, ...values } : item
      );
      setDataSource(updatedData);
      setFilteredData(updatedData);
      message.success('Cập nhật sản phẩm thành công!');
    } else {
      // Logic gọi API thêm mới
      const newRecord = {
        id_sp: Math.max(...dataSource.map(item => item.id_sp)) + 1, // id tạm
        ...values,
        ten_dvt: dvtHqList.find(dvt => dvt.id_dvt_hq === values.id_dvt_hq)?.ten_dvt || ''
      };
      setDataSource([...dataSource, newRecord]);
      setFilteredData([...dataSource, newRecord]);
      message.success('Thêm sản phẩm thành công!');
    }
    setIsModalVisible(false);
  };

  const handleSearch = (e) => {
      const value = e.target.value.toLowerCase();
      const filtered = dataSource.filter(item => 
        item.ten_sp.toLowerCase().includes(value) ||
        item.mo_ta.toLowerCase().includes(value)
      );
      setFilteredData(filtered);
  }

  const columns = [
    { title: 'Mã SP', dataIndex: 'id_sp', key: 'id_sp', sorter: (a, b) => a.id_sp - b.id_sp },
    { title: 'Tên sản phẩm', dataIndex: 'ten_sp', key: 'ten_sp' },
    { title: 'Mô tả', dataIndex: 'mo_ta', key: 'mo_ta' },
    { title: 'Đơn vị tính HQ', dataIndex: 'ten_dvt', key: 'ten_dvt' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id_sp)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Sản phẩm</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mới
        </Button>
        <Input 
            placeholder="Tìm kiếm sản phẩm..." 
            prefix={<SearchOutlined />}
            onChange={handleSearch}
            style={{ width: 300 }}
        />
      </Space>
      <Table columns={columns} dataSource={filteredData} rowKey="id_sp" />

      <Modal
        title={editingRecord ? 'Chỉnh sửa Sản phẩm' : 'Thêm mới Sản phẩm'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="ten_sp"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mo_ta"
            label="Mô tả"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="id_dvt_hq"
            label="Đơn vị tính Hải quan"
            rules={[{ required: true, message: 'Vui lòng chọn đơn vị tính!' }]}
          >
            <Select placeholder="Chọn đơn vị tính">
                {dvtHqList.map(dvt => (
                    <Option key={dvt.id_dvt_hq} value={dvt.id_dvt_hq}>{dvt.ten_dvt}</Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SanPham;
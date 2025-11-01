import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

// Dữ liệu giả lập
const dvtHqList = [{ id_dvt_hq: 1, ten_dvt: 'KGM' }, { id_dvt_hq: 2, ten_dvt: 'M' }, { id_dvt_hq: 3, ten_dvt: 'Cái' }];
const initialData = [
  { id_npl: 1, ten_npl: 'Vải Cotton 100%', mo_ta: 'Vải dệt từ sợi bông tự nhiên', id_dvt_hq: 2 },
  { id_npl: 2, ten_npl: 'Chỉ may Polyester', mo_ta: 'Chỉ bền, dai, màu trắng', id_dvt_hq: 1 },
  { id_npl: 3, ten_npl: 'Cúc áo nhựa', mo_ta: 'Đường kính 1cm', id_dvt_hq: 3 },
];

const NguyenPhuLieu = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState(initialData);
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

  const handleDelete = (id_npl) => {
    setDataSource(dataSource.filter(item => item.id_npl !== id_npl));
    message.success('Xóa nguyên phụ liệu thành công!');
  };

  const onFinish = (values) => {
    if (editingRecord) {
      setDataSource(dataSource.map(item =>
        item.id_npl === editingRecord.id_npl ? { ...editingRecord, ...values } : item
      ));
      message.success('Cập nhật thành công!');
    } else {
      const newRecord = {
        id_npl: Math.max(...dataSource.map(item => item.id_npl), 0) + 1,
        ...values,
      };
      setDataSource([...dataSource, newRecord]);
      message.success('Thêm mới thành công!');
    }
    setIsModalVisible(false);
  };
  
  const columns = [
    { title: 'Mã NPL', dataIndex: 'id_npl', key: 'id_npl', sorter: (a, b) => a.id_npl - b.id_npl },
    { title: 'Tên nguyên phụ liệu', dataIndex: 'ten_npl', key: 'ten_npl' },
    { title: 'Mô tả', dataIndex: 'mo_ta', key: 'mo_ta' },
    { title: 'Đơn vị tính HQ', dataIndex: 'id_dvt_hq', key: 'id_dvt_hq', render: (id) => dvtHqList.find(d => d.id_dvt_hq === id)?.ten_dvt },
    {
      title: 'Hành động', key: 'action', render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id_npl)}>
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Nguyên Phụ Liệu</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm mới</Button>
        <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} style={{ width: 300 }} />
      </Space>
      <Table columns={columns} dataSource={dataSource} rowKey="id_npl" />

      <Modal title={editingRecord ? 'Chỉnh sửa NPL' : 'Thêm mới NPL'} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="ten_npl" label="Tên nguyên phụ liệu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="mo_ta" label="Mô tả"><Input.TextArea /></Form.Item>
          <Form.Item name="id_dvt_hq" label="Đơn vị tính Hải quan" rules={[{ required: true }]}>
            <Select placeholder="Chọn đơn vị tính">
                {dvtHqList.map(dvt => <Option key={dvt.id_dvt_hq} value={dvt.id_dvt_hq}>{dvt.ten_dvt}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Lưu</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setIsModalVisible(false)}>Hủy</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NguyenPhuLieu;
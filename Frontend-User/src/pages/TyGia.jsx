import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, Space, Popconfirm, message, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

// Dữ liệu giả lập
const tienTeList = [ { id_tt: 1, ma_tt: 'USD', ten_tt: 'Đô la Mỹ' }, { id_tt: 2, ma_tt: 'JPY', ten_tt: 'Yên Nhật' }];
const initialData = [
  { id_tg: 1, id_tt: 1, ngay: '2025-10-20', ty_gia: 25400.50 },
  { id_tg: 2, id_tt: 2, ngay: '2025-10-20', ty_gia: 168.25 },
  { id_tg: 3, id_tt: 1, ngay: '2025-10-19', ty_gia: 25380.00 },
];

const TyGia = () => {
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
    form.setFieldsValue({ ...record, ngay: dayjs(record.ngay) });
    setIsModalVisible(true);
  };

  const handleDelete = (id_tg) => {
    setDataSource(dataSource.filter(item => item.id_tg !== id_tg));
    message.success('Xóa tỷ giá thành công!');
  };

  const onFinish = (values) => {
     const formattedValues = { ...values, ngay: values.ngay.format('YYYY-MM-DD') };
    if (editingRecord) {
      setDataSource(dataSource.map(item => item.id_tg === editingRecord.id_tg ? { ...editingRecord, ...formattedValues } : item ));
      message.success('Cập nhật thành công!');
    } else {
      const newRecord = { id_tg: Math.max(...dataSource.map(item => item.id_tg), 0) + 1, ...formattedValues };
      setDataSource([...dataSource, newRecord]);
      message.success('Thêm mới thành công!');
    }
    setIsModalVisible(false);
  };
  
  const columns = [
    { title: 'Tên tiền tệ', dataIndex: 'id_tt', key: 'id_tt', render: (id) => tienTeList.find(t => t.id_tt === id)?.ten_tt },
    { title: 'Ngày hiệu lực', dataIndex: 'ngay', key: 'ngay', sorter: (a, b) => dayjs(a.ngay).unix() - dayjs(b.ngay).unix() },
    { title: 'Tỷ giá (sang VND)', dataIndex: 'ty_gia', key: 'ty_gia', render: (val) => val.toLocaleString() },
    {
      title: 'Hành động', key: 'action', render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id_tg)}>
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Tỷ giá</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm mới</Button>
      <Table columns={columns} dataSource={dataSource} rowKey="id_tg" />

      <Modal title={editingRecord ? 'Chỉnh sửa Tỷ giá' : 'Thêm mới Tỷ giá'} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="id_tt" label="Tiền tệ" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại tiền tệ">
                {tienTeList.map(tt => <Option key={tt.id_tt} value={tt.id_tt}>{tt.ten_tt} ({tt.ma_tt})</Option>)}
            </Select>
          </Form.Item>
           <Form.Item name="ngay" label="Ngày hiệu lực" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="ty_gia" label="Tỷ giá" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} step="0.01" />
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

export default TyGia;
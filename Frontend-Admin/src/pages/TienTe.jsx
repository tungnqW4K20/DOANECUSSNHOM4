import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Row, Col, Typography, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Dữ liệu giả lập
const initialData = [
  { id_tt: 1, ma_tt: 'USD', ten_tt: 'Đô la Mỹ' },
  { id_tt: 2, ma_tt: 'VND', ten_tt: 'Việt Nam Đồng' },
  { id_tt: 3, ma_tt: 'JPY', ten_tt: 'Yên Nhật' },
];

const TienTe = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); setIsModalOpen(true); };
  const handleEdit = (record) => { setEditingRecord(record); form.setFieldsValue(record); setIsModalOpen(true); };
  const handleDelete = (id_tt) => { setDataSource(dataSource.filter(item => item.id_tt !== id_tt)); message.success('Xóa thành công!'); };

  const onFinish = (values) => {
    if (editingRecord) {
      setDataSource(dataSource.map(item => item.id_tt === editingRecord.id_tt ? { ...editingRecord, ...values } : item));
      message.success('Cập nhật thành công!');
    } else {
      setDataSource([...dataSource, { id_tt: Date.now(), ...values }]);
      message.success('Thêm mới thành công!');
    }
    setIsModalOpen(false);
  };

  const columns = [
    { title: 'Mã tiền tệ', dataIndex: 'ma_tt', key: 'ma_tt' },
    { title: 'Tên tiền tệ', dataIndex: 'ten_tt', key: 'ten_tt' },
    {
      title: 'Hành động', key: 'action', width: 180, align: 'center', render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id_tt)}>
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={3} className="page-header-heading">Quản lý Tiền tệ</Title></Col>
        <Col><Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm mới</Button></Col>
      </Row>

      <Card bordered={false} className="content-card">
        <Table columns={columns} dataSource={dataSource} rowKey="id_tt" />
      </Card>
      
      <Modal title={editingRecord ? 'Chỉnh sửa' : 'Thêm mới'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="ma_tt" label="Mã tiền tệ (VD: USD)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ten_tt" label="Tên đầy đủ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TienTe;
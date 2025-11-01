import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Row, Col, Typography, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

// Giả lập ID của doanh nghiệp đang đăng nhập.
const LOGGED_IN_DN_ID = 1; 

// Dữ liệu giả lập
const initialData = [
  { id_kho: 1, id_dn: 1, ten_kho: 'Kho Nguyên liệu A', dia_chi: 'Lô A1, KCN Tân Bình, TP.HCM' },
  { id_kho: 2, id_dn: 1, ten_kho: 'Kho Thành phẩm B', dia_chi: 'Lô B2, KCN Sóng Thần, Bình Dương' },
];

const Kho = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); setIsModalOpen(true); };
  const handleEdit = (record) => { setEditingRecord(record); form.setFieldsValue(record); setIsModalOpen(true); };
  const handleDelete = (id_kho) => { setDataSource(dataSource.filter(item => item.id_kho !== id_kho)); message.success('Xóa kho thành công!'); };

  const onFinish = (values) => {
    if (editingRecord) {
      setDataSource(dataSource.map(item => item.id_kho === editingRecord.id_kho ? { ...editingRecord, ...values } : item));
      message.success('Cập nhật thông tin kho thành công!');
    } else {
      const newRecord = {
        id_kho: Math.max(...dataSource.map(item => item.id_kho), 0) + 1,
        id_dn: LOGGED_IN_DN_ID, // Gán id doanh nghiệp đang đăng nhập
        ...values,
      };
      setDataSource([...dataSource, newRecord]);
      message.success('Thêm kho mới thành công!');
    }
    setIsModalOpen(false);
  };

  const columns = [
    { title: 'Tên kho', dataIndex: 'ten_kho', key: 'ten_kho', sorter: (a, b) => a.ten_kho.localeCompare(b.ten_kho) },
    { title: 'Địa chỉ', dataIndex: 'dia_chi', key: 'dia_chi' },
    {
      title: 'Hành động', key: 'action', width: 180, align: 'center', render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa kho này?" onConfirm={() => handleDelete(record.id_kho)}>
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} className="page-header-heading">Quản lý Kho</Title>
        </Col>
        <Col>
          <Space>
            <Search placeholder="Tìm kiếm kho..." style={{ width: 300 }} />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm kho mới</Button>
          </Space>
        </Col>
      </Row>
      
      <Card bordered={false} className="content-card">
        <Table columns={columns} dataSource={dataSource} rowKey="id_kho" />
      </Card>

      <Modal title={editingRecord ? 'Chỉnh sửa Kho' : 'Thêm Kho mới'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="ten_kho" label="Tên kho" rules={[{ required: true, message: 'Vui lòng nhập tên kho!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dia_chi" label="Địa chỉ kho" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ kho!' }]}>
            <Input.TextArea />
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

export default Kho;
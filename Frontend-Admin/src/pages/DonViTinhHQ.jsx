import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Row, Col, Typography, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Dữ liệu giả lập
const initialData = [
  { id_dvt_hq: 1, ten_dvt: 'KGM', mo_ta: 'Kilogram' },
  { id_dvt_hq: 2, ten_dvt: 'M', mo_ta: 'Mét' },
  { id_dvt_hq: 3, ten_dvt: 'Cái', mo_ta: 'Đơn vị sản phẩm đếm được' },
  { id_dvt_hq: 4, ten_dvt: 'L', mo_ta: 'Lít' },
];

const DonViTinhHQ = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

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

  const handleDelete = (id_dvt_hq) => {
    setDataSource(dataSource.filter(item => item.id_dvt_hq !== id_dvt_hq));
    message.success('Xóa đơn vị tính thành công!');
  };

  const onFinish = (values) => {
    if (editingRecord) {
      setDataSource(dataSource.map(item => item.id_dvt_hq === editingRecord.id_dvt_hq ? { ...editingRecord, ...values } : item));
      message.success('Cập nhật thành công!');
    } else {
      const newRecord = { 
        id_dvt_hq: Math.max(...dataSource.map(item => item.id_dvt_hq), 0) + 1, 
        ...values 
      };
      setDataSource([...dataSource, newRecord]);
      message.success('Thêm mới thành công!');
    }
    setIsModalOpen(false);
  };

  const columns = [
    { 
      title: 'Tên Đơn vị tính (Mã)', 
      dataIndex: 'ten_dvt', 
      key: 'ten_dvt',
      sorter: (a, b) => a.ten_dvt.localeCompare(b.ten_dvt)
    },
    { 
      title: 'Mô tả', 
      dataIndex: 'mo_ta', 
      key: 'mo_ta' 
    },
    {
      title: 'Hành động', 
      key: 'action', 
      width: 180, 
      align: 'center', 
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id_dvt_hq)}>
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
          <Title level={3} className="page-header-heading">Quản lý Đơn vị tính Hải quan</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm mới
          </Button>
        </Col>
      </Row>

      <Card bordered={false} className="content-card">
        <Table columns={columns} dataSource={dataSource} rowKey="id_dvt_hq" />
      </Card>
      
      <Modal 
        title={editingRecord ? 'Chỉnh sửa Đơn vị tính' : 'Thêm mới Đơn vị tính'} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="ten_dvt" 
            label="Tên ĐVT (Mã, VD: KGM)" 
            rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị tính!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="mo_ta" 
            label="Mô tả"
          >
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

export default DonViTinhHQ;
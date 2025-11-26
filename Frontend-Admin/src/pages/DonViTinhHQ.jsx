import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Row, Col, Typography, Card, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { unitAPI } from '../services/api.service';

const { Title } = Typography;

const DonViTinhHQ = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Load dữ liệu từ API
  const loadUnits = async () => {
    try {
      setLoading(true);
      const response = await unitAPI.getAll();
      setDataSource(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn vị tính:', error);
      message.error('Không thể tải danh sách đơn vị tính');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

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

  const handleDelete = async (id_dvt_hq) => {
    try {
      await unitAPI.delete(id_dvt_hq);
      message.success('Xóa đơn vị tính thành công!');
      loadUnits(); // Reload data
    } catch (error) {
      console.error('Lỗi khi xóa đơn vị tính:', error);
      message.error('Không thể xóa đơn vị tính');
    }
  };

  const onFinish = async (values) => {
    try {
      if (editingRecord) {
        await unitAPI.update(editingRecord.id_dvt_hq, values);
        message.success('Cập nhật đơn vị tính thành công!');
      } else {
        await unitAPI.create(values);
        message.success('Thêm đơn vị tính mới thành công!');
      }
      setIsModalOpen(false);
      loadUnits(); // Reload data
    } catch (error) {
      console.error('Lỗi khi lưu đơn vị tính:', error);
      message.error('Không thể lưu đơn vị tính');
    }
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
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={dataSource} rowKey="id_dvt_hq" />
        </Spin>
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
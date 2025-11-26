import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Row, Col, Typography, Card, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { currencyAPI } from '../services/api.service';

const { Title } = Typography;

const TienTe = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Load dữ liệu từ API
  const loadCurrencies = async () => {
    try {
      setLoading(true);
      const response = await currencyAPI.getAll();
      setDataSource(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tiền tệ:', error);
      message.error('Không thể tải danh sách tiền tệ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrencies();
  }, []);

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); setIsModalOpen(true); };
  const handleEdit = (record) => { setEditingRecord(record); form.setFieldsValue(record); setIsModalOpen(true); };

  const handleDelete = async (id_tt) => {
    try {
      await currencyAPI.delete(id_tt);
      message.success('Xóa tiền tệ thành công!');
      loadCurrencies(); // Reload data
    } catch (error) {
      console.error('Lỗi khi xóa tiền tệ:', error);
      message.error('Không thể xóa tiền tệ');
    }
  };

  const onFinish = async (values) => {
    try {
      if (editingRecord) {
        await currencyAPI.update(editingRecord.id_tt, values);
        message.success('Cập nhật tiền tệ thành công!');
      } else {
        await currencyAPI.create(values);
        message.success('Thêm tiền tệ mới thành công!');
      }
      setIsModalOpen(false);
      loadCurrencies(); // Reload data
    } catch (error) {
      console.error('Lỗi khi lưu tiền tệ:', error);
      message.error('Không thể lưu tiền tệ');
    }
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
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={dataSource} rowKey="id_tt" />
        </Spin>
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
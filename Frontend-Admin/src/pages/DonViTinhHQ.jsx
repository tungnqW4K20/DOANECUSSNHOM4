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

  // Load dữ liệu từ Backend API
  const loadUnits = async () => {
    try {
      setLoading(true);
      console.log('🔄 Đang gọi API:', `${import.meta.env.VITE_API_BASE_URL}/don-vi-tinh-hai-quan`);
      
      // Kiểm tra admin token
      const adminToken = localStorage.getItem('adminAuthToken');
      console.log('🔑 Admin Token:', adminToken ? 'Có token' : 'Không có token');
      
      const response = await unitAPI.getAll();
      console.log('✅ API Response:', response.data);
      
      // Backend trả về: { success: true, data: [...] }
      const data = response.data?.data || [];
      console.log('📊 Data to set:', data);
      
      setDataSource(Array.isArray(data) ? data : []);
      if (data.length > 0) {
        message.success(`Đã tải ${data.length} đơn vị tính thành công`);
      } else {
        message.info('Chưa có đơn vị tính nào trong hệ thống');
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      
      let errorMessage = 'Không thể tải danh sách đơn vị tính';
      
      if (error.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền truy cập chức năng này.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      }
      
      message.error(errorMessage);
      setDataSource([]);
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
    form.setFieldsValue({
      ten_dvt: record.ten_dvt,
      mo_ta: record.mo_ta
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingRecord(null);
  };

  const handleDelete = async (id_dvt_hq) => {
    try {
      console.log('🗑️ Đang xóa đơn vị tính:', id_dvt_hq);
      
      await unitAPI.delete(id_dvt_hq);
      message.success('Xóa đơn vị tính thành công!');
      
      // Reload data sau khi xóa
      loadUnits();
    } catch (error) {
      console.error('❌ Lỗi khi xóa đơn vị tính:', error);
      console.error('❌ Error Response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Không thể xóa đơn vị tính';
      message.error(errorMessage);
    }
  };

  const onFinish = async (values) => {
    try {
      console.log('💾 Đang lưu đơn vị tính:', values);
      
      if (editingRecord) {
        // Cập nhật đơn vị tính
        await unitAPI.update(editingRecord.id_dvt_hq, values);
        message.success('Cập nhật đơn vị tính thành công!');
      } else {
        // Thêm đơn vị tính mới
        await unitAPI.create(values);
        message.success('Thêm đơn vị tính mới thành công!');
      }
      
      setIsModalOpen(false);
      form.resetFields();
      setEditingRecord(null);
      
      // Reload data sau khi thêm/sửa
      loadUnits();
    } catch (error) {
      console.error('❌ Lỗi khi lưu đơn vị tính:', error);
      console.error('❌ Error Response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          (editingRecord ? 'Không thể cập nhật đơn vị tính' : 'Không thể thêm đơn vị tính');
      message.error(errorMessage);
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
        onCancel={handleCancel} 
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="ten_dvt" 
            label="Tên ĐVT (Mã, VD: KGM)" 
            rules={[
              { required: true, message: 'Vui lòng nhập tên đơn vị tính!' },
              { max: 50, message: 'Tên đơn vị tính không được quá 50 ký tự!' }
            ]}
          >
            <Input placeholder="Ví dụ: KGM, LIT, M3..." />
          </Form.Item>
          <Form.Item 
            name="mo_ta" 
            label="Mô tả"
            rules={[
              { max: 255, message: 'Mô tả không được quá 255 ký tự!' }
            ]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Mô tả chi tiết về đơn vị tính..."
              showCount
              maxLength={255}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingRecord ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DonViTinhHQ;
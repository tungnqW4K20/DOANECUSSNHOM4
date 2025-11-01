import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, Popconfirm, message, InputNumber, Row, Col, Typography, Card, Upload, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title } = Typography;
const { Search } = Input;

// --- Dữ liệu giả lập ---
// Giả lập ID của doanh nghiệp đang đăng nhập.
const LOGGED_IN_DN_ID = 1;

const tienTeList = [ { id_tt: 1, ma_tt: 'USD', ten_tt: 'Đô la Mỹ' }, { id_tt: 2, ma_tt: 'VND', ten_tt: 'Việt Nam Đồng' }];
const initialData = [
  { id_hd: 1, id_dn: 1, so_hd: 'HD-2025-001', ngay_ky: '2025-01-15', ngay_hieu_luc: '2025-01-20', ngay_het_han: '2026-01-20', gia_tri: 50000, id_tt: 1, file_hop_dong: 'hd_001.pdf' },
  { id_hd: 2, id_dn: 1, so_hd: 'HD-2025-002', ngay_ky: '2025-02-10', ngay_hieu_luc: '2025-02-15', ngay_het_han: '2025-08-15', gia_tri: 120000, id_tt: 1, file_hop_dong: null },
];
// -----------------------

const HopDong = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Helper function to normalize file upload data for Form
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
        ...record,
        ngay_ky: dayjs(record.ngay_ky),
        ngay_hieu_luc: record.ngay_hieu_luc ? dayjs(record.ngay_hieu_luc) : null,
        ngay_het_han: record.ngay_het_han ? dayjs(record.ngay_het_han) : null,
        // Giả lập file đã có để hiển thị trong form
        file_hop_dong: record.file_hop_dong ? [{ uid: '-1', name: record.file_hop_dong, status: 'done' }] : [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id_hd) => {
    setDataSource(dataSource.filter(item => item.id_hd !== id_hd));
    message.success('Xóa hợp đồng thành công!');
  };

  const onFinish = (values) => {
    // Xử lý dữ liệu ngày tháng và file trước khi lưu
    const formattedValues = {
        ...values,
        ngay_ky: values.ngay_ky.format('YYYY-MM-DD'),
        ngay_hieu_luc: values.ngay_hieu_luc ? values.ngay_hieu_luc.format('YYYY-MM-DD') : null,
        ngay_het_han: values.ngay_het_han ? values.ngay_het_han.format('YYYY-MM-DD') : null,
        // Lấy tên file từ danh sách file đã upload (nếu có)
        file_hop_dong: values.file_hop_dong && values.file_hop_dong.length > 0 ? values.file_hop_dong[0].name : null,
    }

    if (editingRecord) {
      setDataSource(dataSource.map(item =>
        item.id_hd === editingRecord.id_hd ? { ...editingRecord, ...formattedValues } : item
      ));
      message.success('Cập nhật hợp đồng thành công!');
    } else {
      const newRecord = {
        id_hd: Math.max(...dataSource.map(item => item.id_hd), 0) + 1,
        id_dn: LOGGED_IN_DN_ID, // Gán id_dn của user đang đăng nhập
        ...formattedValues,
      };
      setDataSource([...dataSource, newRecord]);
      message.success('Thêm hợp đồng thành công!');
    }
    setIsModalOpen(false);
  };
  
  const columns = [
    { 
      title: 'Số Hợp đồng', 
      dataIndex: 'so_hd', 
      key: 'so_hd', 
      sorter: (a, b) => a.so_hd.localeCompare(b.so_hd),
      render: (text, record) => (
        <Space>
          {text}
          {record.file_hop_dong && (
            <Tooltip title={`File: ${record.file_hop_dong}`}>
              <FileOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          )}
        </Space>
      )
    },
    { title: 'Ngày ký', dataIndex: 'ngay_ky', key: 'ngay_ky' },
    { title: 'Ngày hiệu lực', dataIndex: 'ngay_hieu_luc', key: 'ngay_hieu_luc' },
    { title: 'Ngày hết hạn', dataIndex: 'ngay_het_han', key: 'ngay_het_han' },
    { title: 'Giá trị', dataIndex: 'gia_tri', key: 'gia_tri', align: 'right', render: (val) => val.toLocaleString() },
    { title: 'Tiền tệ', dataIndex: 'id_tt', key: 'id_tt', render: (id_tt) => tienTeList.find(t => t.id_tt === id_tt)?.ma_tt },
    {
      title: 'Hành động', key: 'action', width: 180, align: 'center', render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id_hd)} okText="Có" cancelText="Không">
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
          <Title level={3} className="page-header-heading">Quản lý Hợp đồng</Title>
        </Col>
        <Col>
          <Space>
            <Search placeholder="Tìm kiếm số hợp đồng..." style={{ width: 300 }} />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm mới</Button>
          </Space>
        </Col>
      </Row>

      <Card bordered={false} className="content-card">
        <Table columns={columns} dataSource={dataSource} rowKey="id_hd" />
      </Card>

      <Modal title={editingRecord ? 'Chỉnh sửa Hợp đồng' : 'Thêm mới Hợp đồng'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="so_hd" label="Số hợp đồng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="ngay_ky" label="Ngày ký" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/></Form.Item></Col>
            <Col span={8}><Form.Item name="ngay_hieu_luc" label="Ngày hiệu lực"><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/></Form.Item></Col>
            <Col span={8}><Form.Item name="ngay_het_han" label="Ngày hết hạn"><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="gia_tri" label="Giá trị hợp đồng">
                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="id_tt" label="Tiền tệ">
                <Select placeholder="Chọn loại tiền tệ">{tienTeList.map(tt => <Option key={tt.id_tt} value={tt.id_tt}>{tt.ten_tt} ({tt.ma_tt})</Option>)}</Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="file_hop_dong" label="File scan hợp đồng" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload name="file" action="/upload.do" listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Tải lên file</Button>
            </Upload>
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

export default HopDong;
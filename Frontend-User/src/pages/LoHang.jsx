import { React, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, Popconfirm, message, Row, Col, Typography, Card, Upload, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title } = Typography;
const { Search } = Input;

// --- Dữ liệu giả lập ---
const initialHopDong = [
    { id_hd: 1, so_hd: 'HD-2025-001' },
    { id_hd: 2, so_hd: 'HD-2025-002' },
];

// CẬP NHẬT: Thêm trường `so_lh` vào dữ liệu giả lập
const initialData = [
  { id_lh: 1, id_hd: 1, so_lh: 'LH-001', ngay_dong_goi: '2025-04-10', ngay_xuat_cang: '2025-04-12', cang_xuat: 'Cảng Cát Lái', cang_nhap: 'Cảng Singapore', file_chung_tu: 'chungtu_lh1.pdf' },
  { id_lh: 2, id_hd: 1, so_lh: 'LH-002', ngay_dong_goi: '2025-05-15', ngay_xuat_cang: '2025-05-18', cang_xuat: 'Cảng Cát Lái', cang_nhap: 'Cảng Tokyo', file_chung_tu: null },
  { id_lh: 3, id_hd: 2, so_lh: 'LH-003', ngay_dong_goi: '2025-06-01', ngay_xuat_cang: '2025-06-03', cang_xuat: 'Cảng Hải Phòng', cang_nhap: 'Cảng Busan', file_chung_tu: 'chungtu_lh3.pdf' },
];
// -----------------------

const LoHang = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const normFile = (e) => (Array.isArray(e) ? e : e && e.fileList);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
        ...record,
        ngay_dong_goi: record.ngay_dong_goi ? dayjs(record.ngay_dong_goi) : null,
        ngay_xuat_cang: record.ngay_xuat_cang ? dayjs(record.ngay_xuat_cang) : null,
        file_chung_tu: record.file_chung_tu ? [{ uid: '-1', name: record.file_chung_tu, status: 'done' }] : [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id_lh) => {
    // Cần kiểm tra ràng buộc xem lô hàng đã có vận đơn/hóa đơn chưa trước khi xóa
    setDataSource(dataSource.filter(item => item.id_lh !== id_lh));
    message.success('Xóa lô hàng thành công!');
  };

  const onFinish = (values) => {
    const formattedValues = {
        ...values,
        ngay_dong_goi: values.ngay_dong_goi ? values.ngay_dong_goi.format('YYYY-MM-DD') : null,
        ngay_xuat_cang: values.ngay_xuat_cang ? values.ngay_xuat_cang.format('YYYY-MM-DD') : null,
        file_chung_tu: values.file_chung_tu && values.file_chung_tu.length > 0 ? values.file_chung_tu[0].name : null,
    };

    if (editingRecord) {
      setDataSource(dataSource.map(item =>
        item.id_lh === editingRecord.id_lh ? { ...editingRecord, ...formattedValues } : item
      ));
      message.success('Cập nhật lô hàng thành công!');
    } else {
      const newRecord = {
        id_lh: Math.max(...dataSource.map(item => item.id_lh), 0) + 1,
        ...formattedValues,
      };
      setDataSource([...dataSource, newRecord]);
      message.success('Thêm lô hàng mới thành công!');
    }
    setIsModalOpen(false);
  };
  
  const columns = [
    { 
      title: 'Số Hợp đồng', 
      dataIndex: 'id_hd', 
      key: 'id_hd', 
      render: (id_hd) => initialHopDong.find(hd => hd.id_hd === id_hd)?.so_hd || 'N/A'
    },
    // CẬP NHẬT: Thêm cột Số lô hàng
    {
      title: 'Số Lô hàng',
      dataIndex: 'so_lh',
      key: 'so_lh',
    },
    { title: 'Ngày đóng gói', dataIndex: 'ngay_dong_goi', key: 'ngay_dong_goi' },
    { title: 'Ngày xuất cảng', dataIndex: 'ngay_xuat_cang', key: 'ngay_xuat_cang' },
    { title: 'Cảng xuất', dataIndex: 'cang_xuat', key: 'cang_xuat' },
    { title: 'Cảng nhập', dataIndex: 'cang_nhap', key: 'cang_nhap' },
    {
      title: 'Chứng từ',
      dataIndex: 'file_chung_tu',
      key: 'file_chung_tu',
      align: 'center',
      render: (file) => file ? <Tooltip title={file}><FileOutlined style={{ color: '#1890ff', fontSize: 18 }} /></Tooltip> : null
    },
    {
      title: 'Hành động', key: 'action', width: 180, align: 'center', render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa lô hàng này?" onConfirm={() => handleDelete(record.id_lh)}>
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
          <Title level={3} className="page-header-heading">Quản lý Lô hàng</Title>
        </Col>
        <Col>
          <Space>
            <Search placeholder="Tìm theo số lô hàng, cảng..." style={{ width: 300 }} />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm mới</Button>
          </Space>
        </Col>
      </Row>

      <Card bordered={false} className="content-card">
        <Table columns={columns} dataSource={dataSource} rowKey="id_lh" />
      </Card>

      <Modal title={editingRecord ? 'Chỉnh sửa Lô hàng' : 'Thêm mới Lô hàng'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="id_hd" label="Hợp đồng liên quan" rules={[{ required: true }]}>
                 <Select placeholder="Chọn hợp đồng">{initialHopDong.map(hd => <Option key={hd.id_hd} value={hd.id_hd}>{hd.so_hd}</Option>)}</Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              CẬP NHẬT: Thêm Form Item cho Số lô hàng
              <Form.Item name="so_lh" label="Số lô hàng" rules={[{ required: true, message: 'Vui lòng nhập số lô hàng!'}]}>
                 <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="ngay_dong_goi" label="Ngày đóng gói"><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/></Form.Item></Col>
            <Col span={12}><Form.Item name="ngay_xuat_cang" label="Ngày xuất cảng"><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="cang_xuat" label="Cảng xuất"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="cang_nhap" label="Cảng nhập"><Input /></Form.Item></Col>
          </Row>
          <Form.Item name="file_chung_tu" label="File chứng từ" valuePropName="fileList" getValueFromEvent={normFile}>
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

export default LoHang;
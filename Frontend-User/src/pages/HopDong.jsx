import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, DatePicker, Space, Popconfirm,
  message, InputNumber, Row, Col, Typography, Card, Upload, Tooltip
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// ✅ Import service thật
import { getAllHopDong, createHopDong, updateHopDong, deleteHopDong } from '../services/hopdong.service';
import { getAllTienTe } from '../services/tiente.service';
import { uploadSingleFile } from '../services/upload.service';

const { Option } = Select;
const { Title } = Typography;
const { Search } = Input;

const LOGGED_IN_DN_ID = localStorage.getItem('id_dn') || 1; // ✅ Lấy id doanh nghiệp đăng nhập (tạm giả định)

const HopDong = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [tienTeList, setTienTeList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [fileUrl, setFileUrl] = useState(null); // ✅ URL file thật
  const [uploading, setUploading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // ✅ Lấy danh sách hợp đồng từ BE
  const fetchHopDong = async () => {
    try {
      const res = await getAllHopDong();
      if (res?.success) setDataSource(res.data);
      else message.error(res?.message || 'Không thể tải danh sách hợp đồng!');
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi tải hợp đồng!');
    }
  };

  // ✅ Lấy danh sách tiền tệ từ BE
  const fetchTienTe = async () => {
    try {
      const res = await getAllTienTe();
      if (res?.success) setTienTeList(res.data);
      else message.error('Không thể tải danh sách tiền tệ!');
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi tải tiền tệ!');
    }
  };

  useEffect(() => {
    fetchHopDong();
    fetchTienTe();
  }, []);

  // ✅ Upload file thật
  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);
      const res = await uploadSingleFile(file);
      if (res?.data?.imageUrl) {
        setFileUrl(res.data.imageUrl);
        message.success('Tải file thành công!');
        onSuccess(res.data, file);
      } else {
        message.error('Không nhận được URL file từ server!');
        onError(new Error('Không có URL file!'));
      }
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi tải file!');
      onError(err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Mở modal thêm/sửa
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setFileUrl(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFileUrl(record.file_hop_dong || null);
    form.setFieldsValue({
      ...record,
      ngay_ky: record.ngay_ky ? dayjs(record.ngay_ky) : null,
      ngay_hieu_luc: record.ngay_hieu_luc ? dayjs(record.ngay_hieu_luc) : null,
      ngay_het_han: record.ngay_het_han ? dayjs(record.ngay_het_han) : null,
    });
    setIsModalOpen(true);
  };

  // ✅ Xóa hợp đồng
  const handleDelete = async (id_hd) => {
    try {
      const res = await deleteHopDong(id_hd);
      if (res?.success) {
        message.success('Xóa hợp đồng thành công!');
        fetchHopDong();
      } else {
        message.error(res?.message || 'Xóa thất bại!');
      }
    } catch (err) {
      console.error(err);
      message.error('Không thể xóa hợp đồng!');
    }
  };

  // ✅ Submit form (Thêm / Sửa)
  const onFinish = async (values) => {
    const payload = {
      ...values,
      id_dn: LOGGED_IN_DN_ID,
      ngay_ky: values.ngay_ky ? values.ngay_ky.format('YYYY-MM-DD') : null,
      ngay_hieu_luc: values.ngay_hieu_luc ? values.ngay_hieu_luc.format('YYYY-MM-DD') : null,
      ngay_het_han: values.ngay_het_han ? values.ngay_het_han.format('YYYY-MM-DD') : null,
      file_hop_dong: fileUrl || null,
    };

    try {
      let res;
      if (editingRecord) res = await updateHopDong(editingRecord.id_hd, payload);
      else res = await createHopDong(payload);

      if (res?.success) {
        message.success(editingRecord ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        fetchHopDong();
        setIsModalOpen(false);
      } else {
        message.error(res?.message || 'Thao tác thất bại!');
      }
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi lưu hợp đồng!');
    }
  };

  // ✅ Lọc theo số hợp đồng
  const filteredData = dataSource.filter(item =>
    item.so_hd?.toLowerCase().includes(searchText.toLowerCase())
  );

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
            <Tooltip title="Xem file hợp đồng">
              <a href={record.file_hop_dong} target="_blank" rel="noopener noreferrer">
                <FileOutlined style={{ color: '#1890ff' }} />
              </a>
            </Tooltip>
          )}
        </Space>
      )
    },
    { title: 'Ngày ký', dataIndex: 'ngay_ky', key: 'ngay_ky' },
    { title: 'Ngày hiệu lực', dataIndex: 'ngay_hieu_luc', key: 'ngay_hieu_luc' },
    { title: 'Ngày hết hạn', dataIndex: 'ngay_het_han', key: 'ngay_het_han' },
    { title: 'Giá trị', dataIndex: 'gia_tri', key: 'gia_tri', align: 'right', render: (val) => val?.toLocaleString() },
    {
      title: 'Tiền tệ', dataIndex: 'id_tt', key: 'id_tt',
      render: (id_tt) => tienTeList.find(t => t.id_tt === id_tt)?.ma_tt || '—'
    },
    {
      title: 'Hành động', key: 'action', width: 180, align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id_hd)}
            okText="Có"
            cancelText="Không"
          >
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
            <Search
              placeholder="Tìm kiếm số hợp đồng..."
              style={{ width: 300 }}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm mới
            </Button>
          </Space>
        </Col>
      </Row>

      <Card bordered={false} className="content-card">
        <Table columns={columns} dataSource={filteredData} rowKey="id_hd" />
      </Card>

      <Modal
        title={editingRecord ? 'Chỉnh sửa Hợp đồng' : 'Thêm mới Hợp đồng'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="so_hd" label="Số hợp đồng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="ngay_ky" label="Ngày ký" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /></Form.Item></Col>
            <Col span={8}><Form.Item name="ngay_hieu_luc" label="Ngày hiệu lực"><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /></Form.Item></Col>
            <Col span={8}><Form.Item name="ngay_het_han" label="Ngày hết hạn"><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="gia_tri" label="Giá trị hợp đồng">
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="id_tt" label="Tiền tệ">
                <Select placeholder="Chọn loại tiền tệ">
                  {tienTeList.map(tt => (
                    <Option key={tt.id_tt} value={tt.id_tt}>
                      {tt.ten_tt} ({tt.ma_tt})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* ✅ Upload file thật + xem trước */}
          <Form.Item label="File scan hợp đồng">
            <Upload
              customRequest={handleUpload}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>Tải lên file</Button>
            </Upload>

            {fileUrl && (
              <div style={{ marginTop: 8 }}>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  Xem file đã tải lên
                </a>
              </div>
            )}
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

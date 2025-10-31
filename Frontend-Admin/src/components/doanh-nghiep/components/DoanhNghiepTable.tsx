// src/features/doanh-nghiep/components/DoanhNghiepTable.tsx
import { Table, Button, Tag, Space, Input, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { GetDoanhNghiep_DTO } from '../../../model/DoanhNghiep_DTO';

interface Props {
  data: GetDoanhNghiep_DTO[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onSearch: (value: string) => void;
  onEdit: (record: GetDoanhNghiep_DTO) => void;
  onDelete: (id: number) => void;
}

const DoanhNghiepTable = ({
  data,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
}: Props) => {
  const [searchText, setSearchText] = useState('');

  const columns = [
    { title: 'ID', dataIndex: 'id_dn', key: 'id_dn', width: 80 },
    {
      title: 'Tên Doanh Nghiệp',
      dataIndex: 'ten_dn',
      key: 'ten_dn',
      render: (text: string) => <strong>{text}</strong>,
    },
    { title: 'Mã Số Thuế', dataIndex: 'ma_so_thue', key: 'ma_so_thue' },
    { title: 'Địa Chỉ', dataIndex: 'dia_chi', key: 'dia_chi' },
    {
      title: 'Trạng Thái',
      key: 'trang_thai',
      render: (_: any, record: GetDoanhNghiep_DTO) => (
        <Tag color={record.file_giay_phep ? 'green' : 'orange'}>
          {record.file_giay_phep ? 'Hoạt Động' : 'Chờ Duyệt'}
        </Tag>
      ),
    },
    {
      title: 'File Giấy Phép',
      key: 'file',
      render: (_: any, record: GetDoanhNghiep_DTO) =>
        record.file_giay_phep ? (
          <a href={record.file_giay_phep} target="_blank" rel="noopener noreferrer">
            <EyeOutlined /> Xem file
          </a>
        ) : (
          <span style={{ color: '#999' }}>Chưa có</span>
        ),
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 120,
      render: (_: any, record: GetDoanhNghiep_DTO) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm
            title="Xóa doanh nghiệp này?"
            onConfirm={() => onDelete(record.id_dn)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Input
        placeholder="Tìm kiếm tên hoặc mã số thuế..."
        prefix={<SearchOutlined />}
        style={{ marginBottom: 16, width: 300 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onPressEnter={() => onSearch(searchText)}
      />
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id_dn"
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: onPageChange,
          showSizeChanger: false,
        }}
      />
    </>
  );
};

export default DoanhNghiepTable;
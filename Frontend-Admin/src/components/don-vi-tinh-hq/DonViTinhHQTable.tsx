// src/features/don-vi-tinh-hq/components/DonViTinhHQTable.tsx
import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { GetDonViTinhHQ_DTO } from '../../model/DonViTinh_DTO';

interface Props {
  data: GetDonViTinhHQ_DTO[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (record: GetDonViTinhHQ_DTO) => void;
  onDelete: (id: number) => void;
}

const DonViTinhHQTable = ({
  data,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onEdit,
  onDelete,
}: Props) => {
  const columns = [
    { title: 'ID', dataIndex: 'id_dvt_hq', key: 'id_dvt_hq', width: 80 },
    {
      title: 'Tên Đơn Vị',
      dataIndex: 'ten_dvt',
      key: 'ten_dvt',
      render: (text: string) => <strong>{text}</strong>,
    },
    { title: 'Mô Tả', dataIndex: 'mo_ta', key: 'mo_ta' },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 120,
      render: (_: any, record: GetDonViTinhHQ_DTO) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm
            title="Xóa đơn vị này?"
            onConfirm={() => onDelete(record.id_dvt_hq)}
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
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id_dvt_hq"
      loading={loading}
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: onPageChange,
        showSizeChanger: false,
      }}
    />
  );
};

export default DonViTinhHQTable;
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { GetTienTe_DTO } from '../../model/TienTe_DTO';

interface Props {
  data: GetTienTe_DTO[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (record: GetTienTe_DTO) => void;
  onDelete: (id: number) => void;
}

const TienTeTable = ({
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
    { title: 'ID', dataIndex: 'id_tt', key: 'id_tt', width: 80 },
    {
      title: 'Mã Tiền Tệ',
      dataIndex: 'ma_tt',
      key: 'ma_tt',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Tên Tiền Tệ',
      dataIndex: 'ten_tt',
      key: 'ten_tt',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 120,
      render: (_: any, record: GetTienTe_DTO) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm
            title="Xóa tiền tệ này?"
            onConfirm={() => onDelete(record.id_tt)}
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
      rowKey="id_tt"
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

export default TienTeTable;
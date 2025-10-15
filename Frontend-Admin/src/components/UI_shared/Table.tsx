import { Button, Space, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';

interface ColumnProps<T> {
  columnType: ColumnType<T>[];
  openModal: (record: T) => void;
  handleDelete: (record: T) => void;
  addCustomer?: (record: T) => void;
  Tile1?: string;
  icon1?: React.ReactNode;
  showdetail?: (record: T) => void;
  Tile2?: string;
  icon2?: React.ReactNode;
}

const createColumns = <T,>({
  columnType,
  openModal,
  handleDelete,
  addCustomer,
  Tile1,
  icon1,
  showdetail,
  Tile2,
  icon2,
}: ColumnProps<T>): ColumnType<T>[] => {
  // 🔹 Tính toán số lượng nút hành động có hiển thị
  const actionCount =
    (addCustomer ? 1 : 0) +
    (showdetail ? 1 : 0) +
    2; // Edit + Delete luôn có

  // 🔹 Quy định độ rộng mỗi nút
  const actionWidth = 50 * actionCount; // mỗi nút 50px

  return [
    ...columnType,
    {
      title: 'Tác vụ',
      key: 'action',
      width: `${actionWidth}px`,
      fixed: 'right',
      render: (_: any, record: T) => (
        <Space size="middle">
          {showdetail && (
            <Tooltip title={Tile2 ?? 'Xem chi tiết'}>
              <Button
                type="primary"
                shape="circle"
                icon={icon2 ?? <UserAddOutlined />}
                className="bg-blue-500"
                onClick={() => showdetail(record)}
              />
            </Tooltip>
          )}

          {addCustomer && (
            <Tooltip title={Tile1 ?? 'Thêm khách hàng'}>
              <Button
                type="primary"
                shape="circle"
                icon={icon1 ?? <UserAddOutlined />}
                className="bg-purple-600"
                onClick={() => addCustomer(record)}
              />
            </Tooltip>
          )}

          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              className="bg-green-500"
              onClick={() => openModal(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button
                shape="circle"
                icon={<DeleteOutlined />}
                style={{ backgroundColor: 'red', color: 'white' }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
};

export const COLUMNS = <T,>(props: ColumnProps<T>) => createColumns(props);

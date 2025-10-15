import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const DinhMucSanPham_Colum: ColumnType[] = [
  {
    title: 'STT',
    key: 'stt',
    width: '80px',
    align: 'center',
    render: (_text, _record, index) => (
      <span>{index !== undefined ? index + 1 : ''}</span>
    ),
  },
  {
    title: 'Mã định mức',
    dataIndex: 'id_dm',
    key: 'id_dm',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Sản phẩm',
    dataIndex: 'id_sp',
    key: 'id_sp',
    width: '200px',
    align: 'center',
  },
  {
    title: 'Nguyên phụ liệu',
    dataIndex: 'id_npl',
    key: 'id_npl',
    width: '200px',
    align: 'center',
  },
  {
    title: 'Số lượng NPL cần',
    dataIndex: 'so_luong',
    key: 'so_luong',
    width: '200px',
    align: 'center',
    render: (value: number) => (
      <span>{value ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'Không có'}</span>
    ),
  },
];

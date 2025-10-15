import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const TyGia_Colum: ColumnType[] = [
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
    title: 'Mã tỷ giá',
    dataIndex: 'id_tg',
    key: 'id_tg',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Mã tiền tệ',
    dataIndex: 'id_tt',
    key: 'id_tt',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Ngày hiệu lực tỷ giá',
    dataIndex: 'ngay',
    key: 'ngay',
    width: '200px',
    align: 'center',
    render: (date: string) => (
      <span>{date ? new Date(date).toLocaleDateString() : 'Không có'}</span>
    ),
  },
  {
    title: 'Tỷ giá quy đổi sang VND',
    dataIndex: 'ty_gia',
    key: 'ty_gia',
    width: '200px',
    align: 'center',
    render: (value: number) => (
      <span>{value ? value.toLocaleString() : 'Không có'} ₫</span>
    ),
  },
];

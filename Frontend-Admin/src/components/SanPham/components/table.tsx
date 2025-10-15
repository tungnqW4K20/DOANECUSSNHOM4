import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const SanPham_Colum: ColumnType[] = [
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
    title: 'Mã sản phẩm',
    dataIndex: 'id_sp',
    key: 'id_sp',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'ten_sp',
    key: 'ten_sp',
    width: '250px',
  },
  {
    title: 'Mô tả',
    dataIndex: 'mo_ta',
    key: 'mo_ta',
    width: '300px',
    render: (text: string) => <span>{text ? text : 'Không có'}</span>,
  },
  {
    title: 'Đơn vị tính chuẩn hải quan',
    dataIndex: 'id_dvt_hq',
    key: 'id_dvt_hq',
    width: '220px',
    align: 'center',
  },
];

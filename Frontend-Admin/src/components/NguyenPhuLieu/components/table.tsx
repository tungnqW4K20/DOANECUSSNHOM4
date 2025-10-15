import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const NguyenPhuLieu_Colum: ColumnType[] = [
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
    title: 'Mã nguyên phụ liệu',
    dataIndex: 'id_npl',
    key: 'id_npl',
    width: '180px',
    align: 'center',
  },
  {
    title: 'Tên nguyên phụ liệu',
    dataIndex: 'ten_npl',
    key: 'ten_npl',
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

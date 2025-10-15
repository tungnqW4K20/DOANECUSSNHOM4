import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const VanDonXuat_Colum: ColumnType[] = [
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
    title: 'Mã vận đơn xuất',
    dataIndex: 'id_vd',
    key: 'id_vd',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Thuộc lô hàng',
    dataIndex: 'id_lh',
    key: 'id_lh',
    width: '200px',
    align: 'center',
  },
  {
    title: 'Số vận đơn',
    dataIndex: 'so_vd',
    key: 'so_vd',
    width: '200px',
  },
  {
    title: 'Ngày phát hành',
    dataIndex: 'ngay_phat_hanh',
    key: 'ngay_phat_hanh',
    width: '180px',
    align: 'center',
    render: (date: string) => (
      <span>{date ? new Date(date).toLocaleDateString() : 'Không có'}</span>
    ),
  },
  {
    title: 'Cảng xuất',
    dataIndex: 'cang_xuat',
    key: 'cang_xuat',
    width: '200px',
    render: (text: string) => <span>{text ? text : 'Không có'}</span>,
  },
  {
    title: 'Cảng nhập',
    dataIndex: 'cang_nhap',
    key: 'cang_nhap',
    width: '200px',
    render: (text: string) => <span>{text ? text : 'Không có'}</span>,
  },
  {
    title: 'File scan vận đơn',
    dataIndex: 'file_van_don',
    key: 'file_van_don',
    width: '250px',
    render: (text: string) =>
      text ? (
        <a href={text} target="_blank" rel="noopener noreferrer">
          Xem file
        </a>
      ) : (
        <span>Không có</span>
      ),
  },
];

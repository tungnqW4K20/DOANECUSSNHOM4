import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const LoHang_Colum: ColumnType[] = [
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
    title: 'Mã lô hàng',
    dataIndex: 'id_lh',
    key: 'id_lh',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Hợp đồng liên quan',
    dataIndex: 'id_hd',
    key: 'id_hd',
    width: '200px',
    align: 'center',
  },
  {
    title: 'Ngày đóng gói',
    dataIndex: 'ngay_dong_goi',
    key: 'ngay_dong_goi',
    width: '180px',
    align: 'center',
    render: (date: string) => (
      <span>{date ? new Date(date).toLocaleDateString() : 'Không có'}</span>
    ),
  },
  {
    title: 'Ngày xuất cảng',
    dataIndex: 'ngay_xuat_cang',
    key: 'ngay_xuat_cang',
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
    title: 'File chứng từ lô hàng',
    dataIndex: 'file_chung_tu',
    key: 'file_chung_tu',
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

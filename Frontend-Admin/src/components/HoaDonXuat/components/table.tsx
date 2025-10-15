import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const HoaDonXuat_Colum: ColumnType[] = [
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
    title: 'Mã hóa đơn xuất',
    dataIndex: 'id_hd_xuat',
    key: 'id_hd_xuat',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Liên kết lô hàng',
    dataIndex: 'id_lh',
    key: 'id_lh',
    width: '200px',
    align: 'center',
  },
  {
    title: 'Số hóa đơn',
    dataIndex: 'so_hd',
    key: 'so_hd',
    width: '200px',
  },
  {
    title: 'Ngày hóa đơn',
    dataIndex: 'ngay_hd',
    key: 'ngay_hd',
    width: '180px',
    align: 'center',
    render: (date: string) => (
      <span>{date ? new Date(date).toLocaleDateString() : 'Không có'}</span>
    ),
  },
  {
    title: 'Tiền tệ',
    dataIndex: 'id_tt',
    key: 'id_tt',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Tổng trị giá',
    dataIndex: 'tong_tien',
    key: 'tong_tien',
    width: '200px',
    align: 'center',
    render: (value: number) => (
      <span>{value ? value.toLocaleString() : 'Không có'} ₫</span>
    ),
  },
  {
    title: 'File scan hóa đơn',
    dataIndex: 'file_hoa_don',
    key: 'file_hoa_don',
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

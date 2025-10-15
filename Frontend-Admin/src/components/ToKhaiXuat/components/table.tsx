import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const ToKhaiXuat_Colum: ColumnType[] = [
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
    title: 'Mã tờ khai xuất',
    dataIndex: 'id_tkx',
    key: 'id_tkx',
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
    title: 'Số tờ khai',
    dataIndex: 'so_tk',
    key: 'so_tk',
    width: '200px',
  },
  {
    title: 'Ngày tờ khai',
    dataIndex: 'ngay_tk',
    key: 'ngay_tk',
    width: '180px',
    align: 'center',
    render: (date: string) => (
      <span>{date ? new Date(date).toLocaleDateString() : 'Không có'}</span>
    ),
  },
  {
    title: 'Tổng trị giá',
    dataIndex: 'tong_tri_gia',
    key: 'tong_tri_gia',
    width: '200px',
    align: 'center',
    render: (value: number) => (
      <span>{value ? value.toLocaleString() : 'Không có'} ₫</span>
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
    title: 'File scan tờ khai',
    dataIndex: 'file_to_khai',
    key: 'file_to_khai',
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
  {
    title: 'Trạng thái tờ khai',
    dataIndex: 'trang_thai',
    key: 'trang_thai',
    width: '180px',
    align: 'center',
    render: (status: string) => {
      let color = 'default';
      switch (status) {
        case 'Chờ duyệt':
          color = 'orange';
          break;
        case 'Thông quan':
          color = 'green';
          break;
        case 'Kiểm tra hồ sơ':
          color = 'blue';
          break;
        case 'Kiểm tra thực tế':
          color = 'purple';
          break;
        case 'Tịch thu':
          color = 'red';
          break;
      }
      return <Tag color={color}>{status}</Tag>;
    },
  },
];

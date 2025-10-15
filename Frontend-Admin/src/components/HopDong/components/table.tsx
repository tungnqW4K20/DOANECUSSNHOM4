import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const HopDong_Colum: ColumnType[] = [
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
    title: 'Mã hợp đồng',
    dataIndex: 'id_hd',
    key: 'id_hd',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Doanh nghiệp ký hợp đồng',
    dataIndex: 'id_dn',
    key: 'id_dn',
    width: '200px',
    align: 'center',
  },
  {
    title: 'Số hợp đồng',
    dataIndex: 'so_hd',
    key: 'so_hd',
    width: '200px',
  },
  {
    title: 'Ngày ký hợp đồng',
    dataIndex: 'ngay_ky',
    key: 'ngay_ky',
    width: '180px',
    align: 'center',
    render: (date: string) => (
      <span>{date ? new Date(date).toLocaleDateString() : 'Không có'}</span>
    ),
  },
  {
    title: 'Ngày hiệu lực',
    dataIndex: 'ngay_hieu_luc',
    key: 'ngay_hieu_luc',
    width: '180px',
    align: 'center',
    render: (date: string) => (
      <span>{date ? new Date(date).toLocaleDateString() : 'Không có'}</span>
    ),
  },
  {
    title: 'Ngày hết hạn',
    dataIndex: 'ngay_het_han',
    key: 'ngay_het_han',
    width: '180px',
    align: 'center',
    render: (date: string) => (
      <span>{date ? new Date(date).toLocaleDateString() : 'Không có'}</span>
    ),
  },
  {
    title: 'Giá trị hợp đồng',
    dataIndex: 'gia_tri',
    key: 'gia_tri',
    width: '200px',
    align: 'center',
    render: (value: number) => (
      <span>{value ? value.toLocaleString() : 'Không có'} ₫</span>
    ),
  },
  {
    title: 'Tiền tệ sử dụng',
    dataIndex: 'id_tt',
    key: 'id_tt',
    width: '150px',
    align: 'center',
  },
  {
    title: 'File scan hợp đồng',
    dataIndex: 'file_hop_dong',
    key: 'file_hop_dong',
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

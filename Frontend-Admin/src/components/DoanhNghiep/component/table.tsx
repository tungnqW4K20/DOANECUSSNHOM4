import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const DoanhNghiep_Colum: ColumnType[] = [
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
    title: 'Mã doanh nghiệp',
    dataIndex: 'id_dn',
    key: 'id_dn',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Tên doanh nghiệp',
    dataIndex: 'ten_dn',
    key: 'ten_dn',
    width: '250px',
  },
  {
    title: 'Mã số thuế (dùng làm tên đăng nhập)',
    dataIndex: 'ma_so_thue',
    key: 'ma_so_thue',
    width: '250px',
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'dia_chi',
    key: 'dia_chi',
    width: '250px',
    render: (text: string) => <span>{text ? text : 'Không có'}</span>,
  },
  {
    title: 'Email liên hệ',
    dataIndex: 'email',
    key: 'email',
    width: '200px',
    render: (text: string) => <span>{text ? text : 'Không có'}</span>,
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'sdt',
    key: 'sdt',
    width: '150px',
    align: 'center',
    render: (text: string) => <span>{text ? text : 'Không có'}</span>,
  },
  {
    title: 'Mật khẩu đăng nhập (hash)',
    dataIndex: 'mat_khau',
    key: 'mat_khau',
    width: '250px',
    render: () => <span>••••••••</span>,
  },
  {
    title: 'Đường dẫn file giấy phép kinh doanh',
    dataIndex: 'file_giay_phep',
    key: 'file_giay_phep',
    width: '300px',
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

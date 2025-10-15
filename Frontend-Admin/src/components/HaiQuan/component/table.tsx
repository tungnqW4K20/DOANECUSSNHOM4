import { ColumnType } from '../../UI_shared/ColumType';

export const HaiQuan_Colum: ColumnType[] = [
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
    title: 'Mã cán bộ hải quan',
    dataIndex: 'id_hq',
    key: 'id_hq',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Tên cán bộ/đơn vị hải quan',
    dataIndex: 'ten_hq',
    key: 'ten_hq',
    width: '250px',
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
    title: 'Tên đăng nhập hệ thống',
    dataIndex: 'tai_khoan',
    key: 'tai_khoan',
    width: '200px',
  },
  {
    title: 'Mật khẩu đăng nhập (hash)',
    dataIndex: 'mat_khau',
    key: 'mat_khau',
    width: '250px',
    render: () => <span>••••••••</span>,
  },
];

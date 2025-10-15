import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const QuyDoiDonViDN_Colum: ColumnType[] = [
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
    title: 'Mã quy đổi DN',
    dataIndex: 'id_qd',
    key: 'id_qd',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Doanh nghiệp',
    dataIndex: 'id_dn',
    key: 'id_dn',
    width: '200px',
    align: 'center',
  },
  {
    title: 'Nguyên phụ liệu hoặc sản phẩm',
    dataIndex: 'id_mat_hang',
    key: 'id_mat_hang',
    width: '250px',
    align: 'center',
  },
  {
    title: 'Tên đơn vị DN sử dụng',
    dataIndex: 'ten_dvt_dn',
    key: 'ten_dvt_dn',
    width: '200px',
  },
  {
    title: 'Đơn vị HQ chuẩn',
    dataIndex: 'id_dvt_hq',
    key: 'id_dvt_hq',
    width: '200px',
    align: 'center',
  },
  {
    title: 'Hệ số quy đổi sang đơn vị HQ',
    dataIndex: 'he_so',
    key: 'he_so',
    width: '220px',
    align: 'center',
    render: (value: number) => (
      <span>{value ? value.toLocaleString(undefined, { maximumFractionDigits: 6 }) : 'Không có'}</span>
    ),
  },
];

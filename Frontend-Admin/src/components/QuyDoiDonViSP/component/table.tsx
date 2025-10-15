import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const QuyDoiDonViSP_Colum: ColumnType[] = [
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
    title: 'Mã quy đổi SP',
    dataIndex: 'id_qd',
    key: 'id_qd',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Mã sản phẩm',
    dataIndex: 'id_sp',
    key: 'id_sp',
    width: '200px',
    align: 'center',
  },
  {
    title: 'Tên đơn vị tính sản phẩm',
    dataIndex: 'ten_dvt_sp',
    key: 'ten_dvt_sp',
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

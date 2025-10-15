import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const TienTe_Colum: ColumnType[] = [
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
    title: 'Mã tiền tệ',
    dataIndex: 'id_tt',
    key: 'id_tt',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Mã tiền tệ (USD, VND...)',
    dataIndex: 'ma_tt',
    key: 'ma_tt',
    width: '200px',
    align: 'center',
  },
  {
    title: 'Tên tiền tệ',
    dataIndex: 'ten_tt',
    key: 'ten_tt',
    width: '200px',
  },
];

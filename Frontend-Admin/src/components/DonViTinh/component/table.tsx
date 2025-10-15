import { Tag } from 'antd';
import { ColumnType } from '../../UI_shared/ColumType';

export const DonViTinhHQ_Colum: ColumnType[] = [
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
    title: 'Mã đơn vị tính HQ',
    dataIndex: 'id_dvt_hq',
    key: 'id_dvt_hq',
    width: '150px',
    align: 'center',
  },
  {
    title: 'Tên đơn vị tính',
    dataIndex: 'ten_dvt',
    key: 'ten_dvt',
    width: '200px',
  },
  {
    title: 'Mô tả',
    dataIndex: 'mo_ta',
    key: 'mo_ta',
    width: '250px',
    render: (text: string) => <span>{text ? text : 'Không có'}</span>,
  },
];

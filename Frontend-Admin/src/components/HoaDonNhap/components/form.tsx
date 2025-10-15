'use client';

import { Form, Input, InputNumber, Button, Table, Space, Select, Col, Row } from 'antd';
import { useState, useEffect } from 'react';
import { AddHoaDonNhap_DTO, UpHoaDonNhap_DTO } from '@/models/HoaDonNhap.model';
import { RULES_FORM } from '@/utils/validator';
import { ColumnsType } from 'antd/es/table';

interface Props {
  formdata: any;
  isEditing: boolean;
}

interface ChiTietItem {
  id_ct?: number;
  id_npl?: number;
  so_luong?: number;
  don_gia?: number;
  tri_gia?: number;
}

export const HoaDonNhap_Form = ({ formdata, isEditing }: Props) => {
  const [chiTiet, setChiTiet] = useState<ChiTietItem[]>([]);

  useEffect(() => {
    if (isEditing) {
      // mock lấy chi tiết theo master
      setChiTiet(
        chiTiet.length === 0
          ? [
            { id_ct: 1, id_npl: 1, so_luong: 10, don_gia: 100000, tri_gia: 1000000 },
            { id_ct: 2, id_npl: 2, so_luong: 20, don_gia: 200000, tri_gia: 4000000 },
          ]
          : chiTiet
      );
    } else {
      setChiTiet([]);
    }
  }, [isEditing]);

  const addRow = () => {
    setChiTiet([...chiTiet, { id_npl: undefined, so_luong: 0, don_gia: 0, tri_gia: 0 }]);
  };

  const deleteRow = (index: number) => {
    const newData = [...chiTiet];
    newData.splice(index, 1);
    setChiTiet(newData);
  };

  // 2️⃣ Hàm updateRow có type đầy đủ
const updateRow = (index: number, key: keyof ChiTietItem, value: number | undefined) => {
  const newData = [...chiTiet];
  (newData[index][key] as number | undefined) = value;

  if (key === 'so_luong' || key === 'don_gia') {
    const so_luong = newData[index].so_luong || 0;
    const don_gia = newData[index].don_gia || 0;
    newData[index].tri_gia = so_luong * don_gia;
  }

  setChiTiet(newData);
};

  const columns: ColumnsType<ChiTietItem> = [
  {
    title: 'Nguyên phụ liệu',
    dataIndex: 'id_npl',
    render: (v: number | undefined, _r: ChiTietItem, i: number) => (
      <InputNumber value={v} min={0} onChange={(val:any) => updateRow(i, 'id_npl', val)} />
    ),
  },
  {
    title: 'Số lượng',
    dataIndex: 'so_luong',
    render: (v: number | undefined, _r: ChiTietItem, i: number) => (
      <InputNumber value={v} min={0} onChange={(val:any) => updateRow(i, 'so_luong', val)} />
    ),
  },
  {
    title: 'Đơn giá',
    dataIndex: 'don_gia',
    render: (v: number | undefined, _r: ChiTietItem, i: number) => (
      <InputNumber value={v} min={0} onChange={(val:any) => updateRow(i, 'don_gia', val)} />
    ),
  },
  {
    title: 'Trị giá',
    dataIndex: 'tri_gia',
    render: (v?: number) => (v ? v.toLocaleString() : ''),
  },
  {
    title: 'Thao tác',
    render: (_: any, __: ChiTietItem, i: number) => (
      <Button danger onClick={() => deleteRow(i)}>
        Xóa
      </Button>
    ),
  },
];

  return (
    <>
      <Form
        form={formdata}
        layout="vertical"
        initialValues={{ ngay_hd: new Date().toISOString().split('T')[0] }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="id_lh" label="Lô hàng" rules={RULES_FORM.required}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="so_hd" label="Số hóa đơn" rules={RULES_FORM.required}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="ngay_hd" label="Ngày hóa đơn" rules={RULES_FORM.required}>
              <Input type="date" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="id_tt" label="Tiền tệ" rules={RULES_FORM.required}>
              <Select
                options={[
                  { value: 1, label: 'VND' },
                  { value: 2, label: 'USD' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="file_hoa_don"
              label="File scan hóa đơn"
              rules={RULES_FORM.required}
            >
              <Input type="file" />
            </Form.Item>
          </Col>
        </Row>
      </Form>


      <div style={{ marginTop: 20 }}>
        <Space style={{ marginBottom: 10 }}>
          <Button type="dashed" onClick={addRow}>+ Thêm chi tiết</Button>
        </Space>
        <Table columns={columns} dataSource={chiTiet} rowKey={(record) => record.id_ct || Math.random()} pagination={false} />
      </div>
    </>
  );
};

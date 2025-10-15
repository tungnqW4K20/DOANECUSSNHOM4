'use client';

import { Form, Input, InputNumber, Button, Table, Space, Select, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import { AddHoaDonXuat_DTO, UpHoaDonXuat_DTO } from '@/models/HoaDonXuat.model';
import { RULES_FORM } from '@/utils/validator';
import { ColumnsType } from 'antd/es/table';

interface Props {
  formdata: any;
  isEditing: boolean;
}

interface ChiTietItem {
  id_ct?: number;
  id_sp?: number;
  so_luong?: number;
  don_gia?: number;
  tri_gia?: number;
}

export const HoaDonXuat_Form = ({ formdata, isEditing }: Props) => {
  const [chiTiet, setChiTiet] = useState<ChiTietItem[]>([]);

  useEffect(() => {
    if (isEditing) {
      setChiTiet(
        chiTiet.length === 0
          ? [
            { id_ct: 1, id_sp: 1, so_luong: 10, don_gia: 100000, tri_gia: 1000000 },
            { id_ct: 2, id_sp: 2, so_luong: 30, don_gia: 200000, tri_gia: 6000000 },
          ]
          : chiTiet
      );
    } else {
      setChiTiet([]);
    }
  }, [isEditing]);

  // ➕ Thêm dòng mới
const addRow = () =>
  setChiTiet([...chiTiet, { id_sp: undefined, so_luong: 0, don_gia: 0, tri_gia: 0 }]);

// ❌ Xóa dòng
const deleteRow = (index: number) => {
  const newData = [...chiTiet];
  newData.splice(index, 1);
  setChiTiet(newData);
};

// ✏️ Cập nhật dòng
const updateRow = (index: number, key: keyof ChiTietItem, value: number | undefined) => {
  const newData = [...chiTiet];
  newData[index][key] = value;

  if (key === 'so_luong' || key === 'don_gia') {
    const so_luong = newData[index].so_luong || 0;
    const don_gia = newData[index].don_gia || 0;
    newData[index].tri_gia = so_luong * don_gia;
  }

  setChiTiet(newData);
};

// 🧩 Cột bảng (Columns)
const columns: ColumnsType<ChiTietItem> = [
  {
    title: 'Sản phẩm',
    dataIndex: 'id_sp',
    render: (v: number | undefined, _r: ChiTietItem, i: number) => (
      <InputNumber
        value={v}
        min={0}
        style={{ width: '100%' }}
        onChange={(val) => updateRow(i, 'id_sp', val ?? 0)}
      />
    ),
  },
  {
    title: 'Số lượng',
    dataIndex: 'so_luong',
    render: (v: number | undefined, _r: ChiTietItem, i: number) => (
      <InputNumber
        value={v}
        min={0}
        style={{ width: '100%' }}
        onChange={(val) => updateRow(i, 'so_luong', val ?? 0)}
      />
    ),
  },
  {
    title: 'Đơn giá',
    dataIndex: 'don_gia',
    render: (v: number | undefined, _r: ChiTietItem, i: number) => (
      <InputNumber
        value={v}
        min={0}
        style={{ width: '100%' }}
        onChange={(val) => updateRow(i, 'don_gia', val ?? 0)}
      />
    ),
  },
  {
    title: 'Trị giá',
    dataIndex: 'tri_gia',
    render: (v?: number) => (v ? v.toLocaleString() : '0'),
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
            <Form.Item name="file_hoa_don" label="File scan hóa đơn" rules={RULES_FORM.required}>
              <Input type="file" />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div style={{ marginTop: 20 }}>
        <Space style={{ marginBottom: 10 }}><Button type="dashed" onClick={addRow}>+ Thêm chi tiết</Button></Space>
        <Table columns={columns} dataSource={chiTiet} rowKey={(record) => record.id_ct || Math.random()} pagination={false} />
      </div>
    </>
  );
};

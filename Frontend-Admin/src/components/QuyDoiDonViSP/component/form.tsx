import { Form, InputNumber, Input, Select } from 'antd';
import React from 'react';

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const QuyDoiDonViSP_Form: React.FC<Props> = ({ formdata }) => {
  return (
    <Form
      layout="vertical"
      form={formdata}
      initialValues={{
        id_sp: undefined,
        ten_dvt_sp: '',
        id_dvt_hq: undefined,
        he_so: undefined,
      }}
      autoComplete="off"
    >
      <Form.Item
        label="Sản phẩm (ID)"
        name="id_sp"
        rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
      >
        <Select
          placeholder="Chọn sản phẩm"
          options={[
            { label: 'Áo phông', value: 101 },
            { label: 'Quần jeans', value: 102 },
            { label: 'Áo khoác', value: 103 },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Tên đơn vị tính sản phẩm"
        name="ten_dvt_sp"
        rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị tính' }]}
      >
        <Input placeholder="VD: Thùng, Hộp, Bịch..." />
      </Form.Item>

      <Form.Item
        label="Đơn vị HQ chuẩn (ID)"
        name="id_dvt_hq"
        rules={[{ required: true, message: 'Vui lòng chọn đơn vị HQ' }]}
      >
        <Select
          placeholder="Chọn đơn vị HQ"
          options={[
            { label: 'Cái', value: 1 },
            { label: 'Kg', value: 2 },
            { label: 'Mét', value: 3 },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Hệ số quy đổi sang đơn vị HQ"
        name="he_so"
        rules={[{ required: true, message: 'Vui lòng nhập hệ số' }]}
      >
        <InputNumber style={{ width: '100%' }} min={0} step={0.000001} />
      </Form.Item>
    </Form>
  );
};

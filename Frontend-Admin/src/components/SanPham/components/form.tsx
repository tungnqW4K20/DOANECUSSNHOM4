import { Form, Input, InputNumber } from 'antd';
import React from 'react';

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const SanPham_Form: React.FC<Props> = ({ formdata }) => {
  return (
    <Form
      layout="vertical"
      form={formdata}
      initialValues={{
        ten_sp: '',
        mo_ta: '',
        id_dvt_hq: undefined,
      }}
    >
      <Form.Item
        label="Tên sản phẩm"
        name="ten_sp"
        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
      >
        <Input placeholder="Nhập tên sản phẩm" />
      </Form.Item>

      <Form.Item label="Mô tả" name="mo_ta">
        <Input.TextArea rows={3} placeholder="Nhập mô tả (nếu có)" />
      </Form.Item>

      <Form.Item
        label="Đơn vị tính chuẩn hải quan (ID)"
        name="id_dvt_hq"
        rules={[{ required: true, message: 'Vui lòng nhập ID đơn vị tính HQ' }]}
      >
        <InputNumber min={1} placeholder="Nhập ID đơn vị tính HQ" style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  );
};

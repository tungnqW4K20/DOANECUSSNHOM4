import { Form, Input, InputNumber } from 'antd';
import React from 'react';

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const NguyenPhuLieu_Form: React.FC<Props> = ({ formdata }) => {
  return (
    <Form
      layout="vertical"
      form={formdata}
      initialValues={{
        ten_npl: '',
        mo_ta: '',
        id_dvt_hq: undefined,
      }}
    >
      <Form.Item
        label="Tên nguyên phụ liệu"
        name="ten_npl"
        rules={[{ required: true, message: 'Vui lòng nhập tên nguyên phụ liệu' }]}
      >
        <Input placeholder="Nhập tên nguyên phụ liệu (VD: vải, chỉ...)" />
      </Form.Item>

      <Form.Item label="Mô tả" name="mo_ta">
        <Input.TextArea rows={3} placeholder="Nhập mô tả (nếu có)" />
      </Form.Item>

      <Form.Item
        label="Đơn vị tính chuẩn hải quan (ID)"
        name="id_dvt_hq"
        rules={[{ required: true, message: 'Vui lòng nhập ID đơn vị HQ' }]}
      >
        <InputNumber min={1} placeholder="Nhập ID đơn vị tính HQ" style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  );
};

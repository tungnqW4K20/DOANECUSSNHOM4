import { Form, Input } from 'antd';
import { FC } from 'react';

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const DonViTinhHQ_Form: FC<Props> = ({ formdata }) => {
  return (
    <Form
      form={formdata}
      layout="vertical"
      autoComplete="off"
      initialValues={{}}
    >
      <Form.Item
        label="Tên đơn vị tính"
        name="ten_dvt"
        rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị tính!' }]}
      >
        <Input placeholder="Ví dụ: KGM" />
      </Form.Item>

      <Form.Item label="Mô tả" name="mo_ta">
        <Input.TextArea rows={3} placeholder="Ví dụ: kilogam" />
      </Form.Item>
    </Form>
  );
};

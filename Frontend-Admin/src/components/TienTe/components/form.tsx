import { Form, Input } from 'antd';
import { FC } from 'react';

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const TienTeForm: FC<Props> = ({ formdata, isEditing }) => {
  return (
    <Form
      form={formdata}
      layout="vertical"
      initialValues={{}}
      autoComplete="off"
    >
      <Form.Item
        label="Mã tiền tệ (USD, VND...)"
        name="ma_tt"
        rules={[{ required: true, message: 'Vui lòng nhập mã tiền tệ!' }]}
      >
        <Input placeholder="Nhập mã tiền tệ (ví dụ: USD, VND...)" />
      </Form.Item>

      <Form.Item
        label="Tên tiền tệ"
        name="ten_tt"
        rules={[{ required: true, message: 'Vui lòng nhập tên tiền tệ!' }]}
      >
        <Input placeholder="Nhập tên tiền tệ" />
      </Form.Item>
    </Form>
  );
};

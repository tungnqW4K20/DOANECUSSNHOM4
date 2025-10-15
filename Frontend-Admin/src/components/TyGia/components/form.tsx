import { Form, InputNumber, DatePicker, Select } from 'antd';
import { FC } from 'react';

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const TyGiaForm: FC<Props> = ({ formdata, isEditing }) => {
  return (
    <Form
      form={formdata}
      layout="vertical"
      autoComplete="off"
      initialValues={{}}
    >
      <Form.Item
        label="Mã tiền tệ (USD, EUR...)"
        name="id_tt"
        rules={[{ required: true, message: 'Vui lòng chọn mã tiền tệ!' }]}
      >
        <Select
          placeholder="Chọn mã tiền tệ"
          options={[
            { label: 'USD - Đô la Mỹ', value: 1 },
            { label: 'EUR - Euro', value: 2 },
            { label: 'JPY - Yên Nhật', value: 3 },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Ngày hiệu lực tỷ giá"
        name="ngay"
        rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Tỷ giá quy đổi sang VND"
        name="ty_gia"
        rules={[{ required: true, message: 'Vui lòng nhập tỷ giá!' }]}
      >
        <InputNumber
          placeholder="Nhập tỷ giá"
          style={{ width: '100%' }}
          min={0}
          step={100}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
      </Form.Item>
    </Form>
  );
};

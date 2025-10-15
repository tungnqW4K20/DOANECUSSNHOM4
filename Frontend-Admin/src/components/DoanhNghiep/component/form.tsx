'use client';

import { FC } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const DoanhNghiepForm: FC<Props> = ({ formdata, isEditing }) => {
  const { show } = useNotification();

  return (
    <Form
      form={formdata}
      layout="vertical"
      autoComplete="off"
      initialValues={{}}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Tên doanh nghiệp"
            name="ten_dn"
            rules={RULES_FORM.required_max50}
          >
            <Input placeholder="Nhập tên doanh nghiệp" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Mã số thuế"
            name="ma_so_thue"
            rules={RULES_FORM.number}
          >
            <Input placeholder="Nhập mã số thuế" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Địa chỉ"
            name="dia_chi"
            rules={RULES_FORM.required_max50}
          >
            <Input placeholder="Nhập địa chỉ doanh nghiệp" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Email" name="email" rules={RULES_FORM.email}>
            <Input placeholder="Nhập email liên hệ" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Số điện thoại" name="sdt" rules={RULES_FORM.phone}>
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>

        {!isEditing && (
          <Col xs={24} md={12}>
            <Form.Item
              label="Mật khẩu"
              name="mat_khau"
              rules={RULES_FORM.password}
            >
              <Input.Password placeholder="Nhập mật khẩu đăng nhập" />
            </Form.Item>
          </Col>
        )}

        <Col xs={24}>
          <Form.Item
            label="Đường dẫn file giấy phép"
            name="file_giay_phep"
            rules={RULES_FORM.Description_max50}
          >
            <Input placeholder="Nhập hoặc dán URL file giấy phép" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

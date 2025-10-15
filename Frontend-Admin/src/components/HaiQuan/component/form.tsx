'use client';

import { FC } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { RULES_FORM } from '@/utils/validator';

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const HaiQuanForm: FC<Props> = ({ formdata, isEditing }) => {
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
            label="Tên cán bộ / đơn vị hải quan"
            name="ten_hq"
            rules={RULES_FORM.required_max50}
          >
            <Input placeholder="Nhập tên cán bộ hoặc đơn vị hải quan" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Email liên hệ" name="email" rules={RULES_FORM.email}>
            <Input placeholder="Nhập email liên hệ" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Số điện thoại" name="sdt" rules={RULES_FORM.phone}>
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Tên đăng nhập hệ thống"
            name="tai_khoan"
            rules={RULES_FORM.username}
          >
            <Input placeholder="Nhập tài khoản đăng nhập" />
          </Form.Item>
        </Col>

        {!isEditing && (
          <Col xs={24} md={12}>
            <Form.Item
              label="Mật khẩu"
              name="mat_khau"
              rules={RULES_FORM.password}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form>
  );
};

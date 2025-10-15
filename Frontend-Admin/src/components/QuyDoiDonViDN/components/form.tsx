'use client';

import { FC } from 'react';
import { Form, Input, InputNumber, Row, Col } from 'antd';
import { RULES_FORM, checkNumber } from '@/utils/validator';
import { useNotification } from '@/components/UI_shared/Notification';

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const QuyDoiDonViDN_Form: FC<Props> = ({ formdata }) => {
  const { show } = useNotification();

  return (
    <Form
      form={formdata}
      layout="vertical"
      autoComplete="off"
      initialValues={{ he_so: 1 }}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Doanh nghiệp (ID)"
            name="id_dn"
            rules={RULES_FORM.number}
          >
            <Input placeholder="Nhập ID doanh nghiệp" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Nguyên phụ liệu hoặc sản phẩm (ID)"
            name="id_mat_hang"
            rules={RULES_FORM.number}
          >
            <Input placeholder="Nhập ID mặt hàng" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Tên đơn vị DN sử dụng"
            name="ten_dvt_dn"
            rules={RULES_FORM.required_max50}
          >
            <Input placeholder="Ví dụ: Thùng, Bao, Cái..." />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Đơn vị HQ chuẩn (ID)"
            name="id_dvt_hq"
            rules={RULES_FORM.number}
          >
            <Input placeholder="Ví dụ: 1 (KGM)" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Hệ số quy đổi sang đơn vị HQ"
            name="he_so"
            rules={[
              ...RULES_FORM.number,
              {
                validator: (_, value) => {
                  if (checkNumber(value, show)) return Promise.resolve();
                  return Promise.reject('Hệ số phải lớn hơn hoặc bằng 0');
                },
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.000001}
              placeholder="Ví dụ: 20.000000"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

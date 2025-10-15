'use client';

import { Form, Input, DatePicker, Row, Col } from 'antd';
import { RULES_FORM } from '@/utils/validator'; // ✅ dùng đúng import rule

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const LoHang_Form = ({ formdata, isEditing }: Props) => {
  return (
    <Form form={formdata} layout="vertical">
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="id_hd"
            label="Hợp đồng liên quan"
            rules={RULES_FORM.required}
          >
            <Input
              type="number"
              placeholder="Nhập ID hợp đồng"
              disabled={!isEditing}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="file_chung_tu"
            label="File chứng từ lô hàng"
            rules={RULES_FORM.required}
          >
            <Input
              placeholder="Đường dẫn file (PDF)"
              disabled={!isEditing}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="ngay_dong_goi"
            label="Ngày đóng gói"
            rules={RULES_FORM.required}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              disabled={!isEditing}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="ngay_xuat_cang"
            label="Ngày xuất cảng"
            rules={RULES_FORM.required}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              disabled={!isEditing}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="cang_xuat"
            label="Cảng xuất"
            rules={RULES_FORM.required}
          >
            <Input
              placeholder="Nhập cảng xuất"
              disabled={!isEditing}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="cang_nhap"
            label="Cảng nhập"
            rules={RULES_FORM.required}
          >
            <Input
              placeholder="Nhập cảng nhập"
              disabled={!isEditing}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

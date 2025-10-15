'use client';

import { Form, Input, DatePicker, Row, Col } from 'antd';
import { FC } from 'react';
import { RULES_FORM } from '@/utils/validator'; // ✅ dùng rule chung

interface Props {
  formdata: any;
  isEditing: boolean;
}

const VanDonNhap_Form: FC<Props> = ({ formdata, isEditing }) => {
  return (
    <Form form={formdata} layout="vertical">
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Thuộc lô hàng"
            name="id_lh"
            rules={RULES_FORM.required}
          >
            <Input
              type="number"
              placeholder="Nhập ID lô hàng"
              
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Số vận đơn"
            name="so_vd"
            rules={RULES_FORM.required}
          >
            <Input
              placeholder="Nhập số vận đơn"
              
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Ngày phát hành"
            name="ngay_phat_hanh"
            rules={RULES_FORM.required}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="File scan vận đơn"
            name="file_van_don"
            rules={RULES_FORM.required}
          >
            <Input
              placeholder="URL file scan"
              
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Cảng xuất"
            name="cang_xuat"
            rules={RULES_FORM.required}
          >
            <Input
              placeholder="Nhập cảng xuất"
              
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Cảng nhập"
            name="cang_nhap"
            rules={RULES_FORM.required}
          >
            <Input
              placeholder="Nhập cảng nhập"
              
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default VanDonNhap_Form;

'use client';

import { Form, Input, DatePicker, InputNumber, Row, Col } from 'antd';
import { RULES_FORM, validateDates } from '@/utils/validator';
import { useNotification } from '@/components/UI_shared/Notification';

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const HopDong_Form = ({ formdata, isEditing }: Props) => {
  const { show } = useNotification();

  return (
    <Form
      form={formdata}
      layout="vertical"
      autoComplete="off"
      onValuesChange={(changed, all) => {
        if (changed.ngay_hieu_luc || changed.ngay_het_han) {
          const start = all.ngay_hieu_luc?.format?.('YYYY-MM-DD');
          const end = all.ngay_het_han?.format?.('YYYY-MM-DD');
          validateDates(start, end, show);
        }
      }}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="id_dn"
            label="Doanh nghiệp ký hợp đồng"
            rules={RULES_FORM.number}
          >
            <Input type="number" placeholder="Nhập ID doanh nghiệp" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="so_hd"
            label="Số hợp đồng"
            rules={RULES_FORM.required_max50}
          >
            <Input placeholder="Nhập số hợp đồng" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="ngay_ky"
            label="Ngày ký hợp đồng"
            rules={RULES_FORM.required}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="gia_tri" label="Giá trị hợp đồng" rules={RULES_FORM.number}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="ngay_hieu_luc" label="Ngày hiệu lực">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="ngay_het_han" label="Ngày hết hạn">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="id_tt" label="Tiền tệ sử dụng" rules={RULES_FORM.number}>
            <Input type="number" placeholder="Nhập ID tiền tệ" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="file_hop_dong"
            label="File scan hợp đồng"
            rules={RULES_FORM.Description_max50}
          >
            <Input placeholder="Đường dẫn file (PDF)" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

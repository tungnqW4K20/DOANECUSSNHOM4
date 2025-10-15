'use client';

import { Form, Input, DatePicker, InputNumber, Select, Upload, Button, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FC } from 'react';
import moment from 'moment';
import { RULES_FORM } from '@/utils/validator';

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const ToKhaiNhap_Form: FC<Props> = ({ formdata, isEditing }) => {
  return (
    <Form layout="vertical" form={formdata}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Liên kết lô hàng" name="id_lh" rules={RULES_FORM.required}>
            <Input placeholder="Nhập ID lô hàng" type="number" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Số tờ khai" name="so_tk" rules={RULES_FORM.required}>
            <Input placeholder="Nhập số tờ khai" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Ngày tờ khai" name="ngay_tk" rules={RULES_FORM.required}>
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              defaultValue={
                formdata.getFieldValue('ngay_tk')
                  ? moment(formdata.getFieldValue('ngay_tk'))
                  : undefined
              }
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Tổng trị giá" name="tong_tri_gia">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="Nhập tổng trị giá" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Tiền tệ" name="id_tt" rules={RULES_FORM.required}>
            <Select placeholder="Chọn tiền tệ" allowClear>
              <Select.Option value={1}>VND</Select.Option>
              <Select.Option value={2}>USD</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        

        <Col span={12}>
          <Form.Item label="File scan tờ khai" name="file_to_khai" valuePropName="fileList">
            <Upload maxCount={1} beforeUpload={() => false} listType="text">
              <Button icon={<UploadOutlined />}>Upload file</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
      <Col span={24}>
          <Form.Item label="Trạng thái tờ khai" name="trang_thai" rules={RULES_FORM.required}>
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="Chờ duyệt">Chờ duyệt</Select.Option>
              <Select.Option value="Thông quan">Thông quan</Select.Option>
              <Select.Option value="Kiểm tra hồ sơ">Kiểm tra hồ sơ</Select.Option>
              <Select.Option value="Kiểm tra thực tế">Kiểm tra thực tế</Select.Option>
              <Select.Option value="Tái xuất">Tái xuất</Select.Option>
              <Select.Option value="Tịch thu">Tịch thu</Select.Option>
            </Select>
          </Form.Item>
        </Col>
    </Form>
  );
};

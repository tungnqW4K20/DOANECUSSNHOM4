'use client';

import { FC } from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Upload, Button, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const RULES_FORM = {
  required: [{ required: true, message: 'Trường này là bắt buộc' }],
};

interface Props {
  formdata: any;
  isEditing: boolean;
}

export const ToKhaiXuat_Form: FC<Props> = ({ formdata, isEditing }) => {
  return (
    <Form
      layout="vertical"
      form={formdata}
      initialValues={{
        ngay_tk: moment(),
      }}
    >
      <Row gutter={16}>
        {/* Cột trái */}
        <Col span={12}>
          <Form.Item label="Liên kết lô hàng" name="id_lh" rules={RULES_FORM.required}>
            <Input type="number" placeholder="Nhập ID lô hàng" />
          </Form.Item>

          <Form.Item label="Số tờ khai" name="so_tk" rules={RULES_FORM.required}>
            <Input placeholder="Nhập số tờ khai" />
          </Form.Item>

          <Form.Item label="Ngày tờ khai" name="ngay_tk" rules={RULES_FORM.required}>
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              defaultValue={
                formdata.getFieldValue('ngay_tk')
                  ? moment(formdata.getFieldValue('ngay_tk'))
                  : moment()
              }
            />
          </Form.Item>
        </Col>

        {/* Cột phải */}
        <Col span={12}>
          <Form.Item label="Tổng trị giá" name="tong_tri_gia">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="Nhập tổng trị giá" />
          </Form.Item>

          <Form.Item label="Tiền tệ" name="id_tt">
            <Select placeholder="Chọn tiền tệ" allowClear>
              <Select.Option value={1}>VND</Select.Option>
              <Select.Option value={2}>USD</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="File scan tờ khai" name="file_to_khai" valuePropName="fileList">
            <Upload maxCount={1} beforeUpload={() => false} listType="text">
              <Button icon={<UploadOutlined />}>Upload file</Button>
            </Upload>
          </Form.Item>


        </Col>

      </Row>
      <Form.Item label="Trạng thái tờ khai" name="trang_thai">
        <Select placeholder="Chọn trạng thái">
          <Select.Option value="Chờ duyệt">Chờ duyệt</Select.Option>
          <Select.Option value="Thông quan">Thông quan</Select.Option>
          <Select.Option value="Kiểm tra hồ sơ">Kiểm tra hồ sơ</Select.Option>
          <Select.Option value="Kiểm tra thực tế">Kiểm tra thực tế</Select.Option>
          <Select.Option value="Tịch thu">Tịch thu</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

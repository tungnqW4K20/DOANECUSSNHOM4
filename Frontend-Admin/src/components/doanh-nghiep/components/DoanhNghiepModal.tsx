import { Modal, Form, Input, Button, Upload, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { AddDoanhNghiep_DTO, UpDoanhNghiep_DTO } from '../../../model/DoanhNghiep_DTO';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  editing?: UpDoanhNghiep_DTO | null;
  onOk: (values: AddDoanhNghiep_DTO | UpDoanhNghiep_DTO) => void;
  onCancel: () => void;
}

const DoanhNghiepModal = ({ open, editing, onOk, onCancel }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editing) {
      form.setFieldsValue(editing);
    } else {
      form.resetFields();
    }
  }, [editing, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onOk(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={editing ? 'Cập Nhật Doanh Nghiệp' : 'Thêm Doanh Nghiệp'}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={editing ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      width={800} // Tăng chiều rộng modal để phù hợp với 2 cột
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="ten_dn" label="Tên Doanh Nghiệp" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="ma_so_thue" label="Mã Số Thuế" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="dia_chi" label="Địa Chỉ">
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="sdt" label="Số Điện Thoại">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="mat_khau" 
              label="Mật Khẩu" 
              rules={[{ required: !editing, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="File Giấy Phép">
              <Upload
                beforeUpload={() => false}
                onChange={(info) => {
                  if (info.fileList.length > 0) {
                    form.setFieldsValue({ file_giay_phep: `/files/${info.file.name}` });
                  }
                }}
              >
                <Button icon={<UploadOutlined />}>Tải lên</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DoanhNghiepModal;
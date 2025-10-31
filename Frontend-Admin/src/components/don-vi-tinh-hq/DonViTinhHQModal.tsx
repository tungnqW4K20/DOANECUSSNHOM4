// src/features/don-vi-tinh-hq/components/DonViTinhHQModal.tsx
import { Modal, Form, Input } from 'antd';
import { useEffect } from 'react';
import { AddDonViTinhHQ_DTO, GetDonViTinhHQ_DTO, UpDonViTinhHQ_DTO } from '../../model/DonViTinh_DTO';

interface Props {
  open: boolean;
  editing: GetDonViTinhHQ_DTO | null;
  onOk: (values: AddDonViTinhHQ_DTO | UpDonViTinhHQ_DTO) => void;
  onCancel: () => void;
}

const DonViTinhHQModal = ({ open, editing, onOk, onCancel }: Props) => {
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
    });
  };

  return (
    <Modal
      title={editing ? 'Cập Nhật Đơn Vị Tính' : 'Thêm Đơn Vị Tính'}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={editing ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="ten_dvt" label="Tên Đơn Vị (VD: KGM)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="mo_ta" label="Mô Tả (VD: Kilogram)">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DonViTinhHQModal;
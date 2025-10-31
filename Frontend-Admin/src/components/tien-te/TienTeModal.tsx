// src/features/tien-te/components/TienTeModal.tsx
import { Modal, Form, Input } from 'antd';
import { GetTienTe_DTO, AddTienTe_DTO, UpTienTe_DTO } from '../../model/TienTe_DTO';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  editing: GetTienTe_DTO | null;
  onOk: (values: AddTienTe_DTO | UpTienTe_DTO) => void;
  onCancel: () => void;
}

const TienTeModal = ({ open, editing, onOk, onCancel }: Props) => {
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
      title={editing ? 'Cập Nhật Tiền Tệ' : 'Thêm Tiền Tệ'}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={editing ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="ma_tt" label="Mã Tiền Tệ (VD: USD)" rules={[{ required: true, len: 3 }]}>
          <Input maxLength={3} style={{ textTransform: 'uppercase' }} />
        </Form.Item>
        <Form.Item name="ten_tt" label="Tên Tiền Tệ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TienTeModal;
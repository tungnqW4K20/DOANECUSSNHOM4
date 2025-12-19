import React, { useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, Select, InputNumber, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

// Dữ liệu giả lập
const nplList = [{ id: 1, name: 'Vải Cotton' }, { id: 2, name: 'Chỉ may' }];
const spList = [{ id: 1, name: 'Áo phông' }, { id: 2, name: 'Quần Jeans' }];
const dvtHqList = [{ id_dvt_hq: 1, ten_dvt: 'KGM' }, { id_dvt_hq: 2, ten_dvt: 'M' }, { id_dvt_hq: 3, ten_dvt: 'Cái' }];

const initialDataDN = [
    { id_qd: 1, id_mat_hang: 1, ten_dvt_dn: 'Cây vải', id_dvt_hq: 2, he_so: 1000 },
];
const initialDataSP = [
    { id_qd: 101, id_sp: 1, ten_dvt_sp: 'Thùng', id_dvt_hq: 3, he_so: 50 },
];

// Component CRUD Table tái sử dụng
const QuyDoiTable = ({ type, dataSource, setDataSource, itemList }) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const handleAdd = () => { setEditingRecord(null); form.resetFields(); setIsModalVisible(true); };
    const handleEdit = (record) => { setEditingRecord(record); form.setFieldsValue(record); setIsModalVisible(true); };
    const handleDelete = (id_qd) => { setDataSource(dataSource.filter(item => item.id_qd !== id_qd)); message.success('Xóa thành công!'); };

    const onFinish = (values) => {
        if (editingRecord) {
            setDataSource(dataSource.map(item => item.id_qd === editingRecord.id_qd ? { ...editingRecord, ...values } : item));
            message.success('Cập nhật thành công!');
        } else {
            setDataSource([...dataSource, { id_qd: Date.now(), ...values }]);
            message.success('Thêm mới thành công!');
        }
        setIsModalVisible(false);
    };

    const columns = [
        { title: type === 'DN' ? 'Tên Nguyên phụ liệu' : 'Tên Sản phẩm', dataIndex: type === 'DN' ? 'id_mat_hang' : 'id_sp', render: (id) => itemList.find(i => i.id === id)?.name },
        { title: 'Tên ĐVT Doanh nghiệp', dataIndex: type === 'DN' ? 'ten_dvt_dn' : 'ten_dvt_sp' },
        { title: 'Tên ĐVT Hải quan', dataIndex: 'id_dvt_hq', render: (id) => dvtHqList.find(d => d.id_dvt_hq === id)?.ten_dvt },
        { title: 'Hệ số quy đổi', dataIndex: 'he_so' },
        {
            title: 'Hành động', key: 'action', render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id_qd)}>
                        <Button icon={<DeleteOutlined />} danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
                Thêm mới Quy đổi
            </Button>
            <Table columns={columns} dataSource={dataSource} rowKey="id_qd" bordered />
            <Modal title={editingRecord ? 'Chỉnh sửa' : 'Thêm mới'} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name={type === 'DN' ? 'id_mat_hang' : 'id_sp'} label={type === 'DN' ? 'Nguyên phụ liệu' : 'Sản phẩm'} rules={[{ required: true, message: "Không được để trống!" }]}>
                        <Select placeholder="Chọn một mục">{itemList.map(i => <Option key={i.id} value={i.id}>{i.name}</Option>)}</Select>
                    </Form.Item>
                    <Form.Item name={type === 'DN' ? 'ten_dvt_dn' : 'ten_dvt_sp'} label="Tên đơn vị tính của Doanh nghiệp" rules={[{ required: true, message: "Không được bỏ trống!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="id_dvt_hq" label="Đơn vị tính Hải quan chuẩn" rules={[{ required: true, message: "Không được bỏ trống!" }]}>
                        <Select placeholder="Chọn ĐVT HQ">{dvtHqList.map(d => <Option key={d.id_dvt_hq} value={d.id_dvt_hq}>{d.ten_dvt}</Option>)}</Select>
                    </Form.Item>
                    <Form.Item name="he_so" label="Hệ số quy đổi" rules={[{ required: true, message: "Không được bỏ trống!" }]}>
                        <InputNumber min={0.000001} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Lưu</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

const QuyDoiDonVi = () => {
    const [dataDN, setDataDN] = useState(initialDataDN);
    const [dataSP, setDataSP] = useState(initialDataSP);

    return (
        <div>
            <h2>Quản lý Quy đổi Đơn vị tính</h2>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Quy đổi Đơn vị Nguyên phụ liệu" key="1">
                    <QuyDoiTable type="DN" dataSource={dataDN} setDataSource={setDataDN} itemList={nplList} />
                </TabPane>
                <TabPane tab="Quy đổi Đơn vị Sản phẩm" key="2">
                    <QuyDoiTable type="SP" dataSource={dataSP} setDataSource={setDataSP} itemList={spList} />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default QuyDoiDonVi;
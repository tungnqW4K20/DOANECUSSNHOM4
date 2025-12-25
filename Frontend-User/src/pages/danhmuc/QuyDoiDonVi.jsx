import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, Select, InputNumber, Space, Popconfirm, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { 
    getAllQuyDoiNPL, createQuyDoiNPL, updateQuyDoiNPL, deleteQuyDoiNPL,
    getAllQuyDoiSP, createQuyDoiSP, updateQuyDoiSP, deleteQuyDoiSP 
} from '../../services/quydoidonvi.service';
import { getAllNguyenPhuLieu } from '../../services/nguyenphulieu.service';
import { getAllSanPham } from '../../services/sanpham.service';
import { getAllDonViTinhHQ } from '../../services/donvitinhHaiQuan.service';
import { showCreateSuccess, showUpdateSuccess, showDeleteSuccess, showLoadError, showSaveError, showDeleteError } from '../../components/notification';

const { Option } = Select;
const { TabPane } = Tabs;

// Hàm format số theo kiểu Việt Nam (1.000.000)
const formatVNNumber = (value) => {
    if (value === null || value === undefined) return '';
    return Number(value).toLocaleString('vi-VN');
};

// Component CRUD Table tái sử dụng
const QuyDoiTable = ({ type, dataSource, setDataSource, itemList, dvtHqList, loading, fetchData }) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleAdd = useCallback(() => { 
        setEditingRecord(null); 
        form.resetFields(); 
        setIsModalVisible(true); 
    }, [form]);

    const handleEdit = useCallback((record) => { 
        setEditingRecord(record); 
        setTimeout(() => form.setFieldsValue(record), 0);
        setIsModalVisible(true); 
    }, [form]);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setTimeout(() => {
            setEditingRecord(null);
            form.resetFields();
        }, 300);
    }, [form]);
    
    const handleDelete = async (id_qd) => { 
        try {
            if (type === 'NPL') {
                await deleteQuyDoiNPL(id_qd);
            } else {
                await deleteQuyDoiSP(id_qd);
            }
            showDeleteSuccess('Quy đổi đơn vị');
            fetchData();
        } catch (error) {
            showDeleteError('quy đổi đơn vị');
        }
    };

    const onFinish = async (values) => {
        try {
            setSubmitting(true);
            if (editingRecord) {
                if (type === 'NPL') {
                    await updateQuyDoiNPL(editingRecord.id_qd, values);
                } else {
                    await updateQuyDoiSP(editingRecord.id_qd, values);
                }
                showUpdateSuccess('Quy đổi đơn vị');
            } else {
                if (type === 'NPL') {
                    await createQuyDoiNPL(values);
                } else {
                    await createQuyDoiSP(values);
                }
                showCreateSuccess('Quy đổi đơn vị');
            }
            closeModal();
            fetchData();
        } catch (error) {
            showSaveError('quy đổi đơn vị');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { 
            title: type === 'NPL' ? 'Tên Nguyên phụ liệu' : 'Tên Sản phẩm', 
            dataIndex: type === 'NPL' ? 'id_npl' : 'id_sp', 
            render: (id, record) => {
                if (type === 'NPL') {
                    return record.nguyenPhuLieu?.ten_npl || itemList.find(i => i.id_npl === id)?.ten_npl || '-';
                } else {
                    return record.sanPham?.ten_sp || itemList.find(i => i.id_sp === id)?.ten_sp || '-';
                }
            }
        },
        { title: 'Tên ĐVT Doanh nghiệp', dataIndex: type === 'NPL' ? 'ten_dvt_dn' : 'ten_dvt_sp' },
        { 
            title: 'Tên ĐVT Hải quan', 
            dataIndex: 'id_dvt_hq', 
            render: (id, record) => record.donViTinhHQ?.ten_dvt || dvtHqList.find(d => d.id_dvt_hq === id)?.ten_dvt || '-'
        },
        { title: 'Hệ số quy đổi', dataIndex: 'he_so', render: (val) => formatVNNumber(val) },
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
            <Spin spinning={loading}>
                <Table columns={columns} dataSource={dataSource} rowKey="id_qd" bordered />
            </Spin>
            <Modal 
                title={editingRecord ? 'Chỉnh sửa' : 'Thêm mới'} 
                open={isModalVisible} 
                onCancel={closeModal} 
                footer={null}
                destroyOnClose
                maskClosable={false}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item 
                        name={type === 'NPL' ? 'id_npl' : 'id_sp'} 
                        label={type === 'NPL' ? 'Nguyên phụ liệu' : 'Sản phẩm'} 
                        rules={[{ required: true, message: "Không được để trống!" }]}
                    >
                        <Select placeholder="Chọn một mục">
                            {itemList.map(i => (
                                <Option key={type === 'NPL' ? i.id_npl : i.id_sp} value={type === 'NPL' ? i.id_npl : i.id_sp}>
                                    {type === 'NPL' ? i.ten_npl : i.ten_sp}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item 
                        name={type === 'NPL' ? 'ten_dvt_dn' : 'ten_dvt_sp'} 
                        label="Tên đơn vị tính của Doanh nghiệp" 
                        rules={[{ required: true, message: "Không được bỏ trống!" }]}
                    >
                        <Input placeholder="VD: Cây vải, Thùng, Bao..." />
                    </Form.Item>
                    <Form.Item 
                        name="id_dvt_hq" 
                        label="Đơn vị tính Hải quan chuẩn" 
                        rules={[{ required: true, message: "Không được bỏ trống!" }]}
                    >
                        <Select placeholder="Chọn ĐVT HQ">
                            {dvtHqList.map(d => (
                                <Option key={d.id_dvt_hq} value={d.id_dvt_hq}>{d.ten_dvt}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item 
                        name="he_so" 
                        label="Hệ số quy đổi" 
                        rules={[{ required: true, message: "Không được bỏ trống!" }]}
                    >
                        <InputNumber min={0.000001} style={{ width: '100%' }} placeholder="VD: 1000 (1 cây vải = 1000m)" />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button onClick={closeModal}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>Lưu</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

const QuyDoiDonVi = () => {
    const [dataDN, setDataDN] = useState([]);
    const [dataSP, setDataSP] = useState([]);
    const [nplList, setNplList] = useState([]);
    const [spList, setSpList] = useState([]);
    const [dvtHqList, setDvtHqList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [nplRes, spRes, dvtRes] = await Promise.all([
                getAllNguyenPhuLieu(),
                getAllSanPham(),
                getAllDonViTinhHQ()
            ]);
            
            // Xử lý response - có thể là array trực tiếp hoặc { success: true, data: [...] }
            setNplList(Array.isArray(nplRes) ? nplRes : (nplRes?.data || []));
            setSpList(Array.isArray(spRes) ? spRes : (spRes?.data || []));
            setDvtHqList(Array.isArray(dvtRes) ? dvtRes : (dvtRes?.data || []));
            
            await fetchQuyDoiNPL();
            await fetchQuyDoiSP();
        } catch (error) {
            showLoadError('dữ liệu quy đổi đơn vị');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuyDoiNPL = async () => {
        try {
            const res = await getAllQuyDoiNPL();
            // Xử lý response
            setDataDN(Array.isArray(res) ? res : (res?.data || []));
        } catch (error) {
            showLoadError('quy đổi NPL');
        }
    };

    const fetchQuyDoiSP = async () => {
        try {
            const res = await getAllQuyDoiSP();
            // Xử lý response
            setDataSP(Array.isArray(res) ? res : (res?.data || []));
        } catch (error) {
            showLoadError('quy đổi SP');
        }
    };

    return (
        <div>
            <h2 className="page-header-heading" style={{ marginBottom: 16 }}>Quản lý Quy đổi Đơn vị tính</h2>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Quy đổi Đơn vị Nguyên phụ liệu" key="1">
                    <QuyDoiTable 
                        type="NPL" 
                        dataSource={dataDN} 
                        setDataSource={setDataDN} 
                        itemList={nplList}
                        dvtHqList={dvtHqList}
                        loading={loading}
                        fetchData={fetchQuyDoiNPL}
                    />
                </TabPane>
                <TabPane tab="Quy đổi Đơn vị Sản phẩm" key="2">
                    <QuyDoiTable 
                        type="SP" 
                        dataSource={dataSP} 
                        setDataSource={setDataSP} 
                        itemList={spList}
                        dvtHqList={dvtHqList}
                        loading={loading}
                        fetchData={fetchQuyDoiSP}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default QuyDoiDonVi;
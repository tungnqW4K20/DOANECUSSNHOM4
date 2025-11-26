
// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Button,
//   Space,
//   Tag,
//   message,
//   Row,
//   Col,
//   Typography,
//   Card,
//   Input,
//   Dropdown,
//   Drawer,
//   Descriptions,
// } from "antd";
// import {
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   EyeOutlined,
//   MoreOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import axios from "axios";
// import { getAllDoanhNghiep } from "../services/doanhnghiep.service";

// const { Title } = Typography;
// const { Search } = Input;

// const DoanhNghiep = () => {
//   const [dataSource, setDataSource] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [selectedDN, setSelectedDN] = useState(null);

//   // Lấy danh sách doanh nghiệp từ API
//    useEffect(() => {
//     const fetchDN = async () => {
//       try {
//         setLoading(true);

//         const res = await getAllDoanhNghiep(); // gọi service

//         const list = res?.data || [];

//         // Map dữ liệu BE -> FE (giữ nguyên cấu trúc cũ)
//         const mapped = list.map((item) => ({
//           id_dn: item.id_dn,
//           ten_dn: item.ten_dn,
//           ma_so_thue: item.ma_so_thue,
//           email: item.email,
//           sdt: item.sdt,
//           dia_chi: item.dia_chi,
//           file_giay_phep: item.file_giay_phep,
//           trang_thai: item.status, // FE đang dùng "trang_thai"
//           ngay_tao: item.ngay_tao || item.createdAt || null,
//         }));

//         setDataSource(mapped);
//       } catch (err) {
//         message.error(err?.message || "Không lấy được danh sách doanh nghiệp!");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDN();
//   }, []);

//   const showDrawer = (record) => {
//     setSelectedDN(record);
//     setDrawerVisible(true);
//   };

//   const closeDrawer = () => {
//     setDrawerVisible(false);
//   };

//   // Hiện tại chỉ đổi status trên FE, nếu muốn lưu xuống DB thì sau này thêm API update
//   const handleStatusChange = (id_dn, newStatus) => {
//     setDataSource((prev) =>
//       prev.map((item) =>
//         item.id_dn === id_dn ? { ...item, trang_thai: newStatus } : item
//       )
//     );
//     const statusText = newStatus === 1 ? "Duyệt" : "Từ chối";
//     message.success(`${statusText} tài khoản thành công!`);
//   };

//   const getStatusTag = (status) => {
//     if (status === 1) return <Tag color="success">Đã duyệt</Tag>;
//     if (status === 2) return <Tag color="error">Đã từ chối</Tag>;
//     return <Tag color="warning">Chờ duyệt</Tag>;
//   };

//   const columns = [
//     { title: "Tên Doanh nghiệp", dataIndex: "ten_dn", key: "ten_dn" },
//     { title: "Mã số thuế", dataIndex: "ma_so_thue", key: "ma_so_thue" },
//     { title: "Email", dataIndex: "email", key: "email" },
//     {
//       title: "Ngày đăng ký",
//       dataIndex: "ngay_tao",
//       key: "ngay_tao",
//       render: (text) =>
//         text ? dayjs(text).format("DD/MM/YYYY") : "--",
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "trang_thai",
//       key: "trang_thai",
//       render: getStatusTag,
//     },
//     {
//       title: "Hành động",
//       key: "action",
//       width: 120,
//       align: "center",
//       render: (_, record) => (
//         <Space>
//           <Button icon={<EyeOutlined />} onClick={() => showDrawer(record)} />
//           <Dropdown
//             menu={{
//               items: [
//                 {
//                   key: "1",
//                   label: "Duyệt",
//                   icon: <CheckCircleOutlined />,
//                   onClick: () => handleStatusChange(record.id_dn, 1),
//                   disabled: record.trang_thai === 1,
//                 },
//                 {
//                   key: "2",
//                   label: "Từ chối",
//                   icon: <CloseCircleOutlined />,
//                   onClick: () => handleStatusChange(record.id_dn, 2),
//                   disabled: record.trang_thai === 2,
//                 },
//               ],
//             }}
//           >
//             <Button icon={<MoreOutlined />} />
//           </Dropdown>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
//         <Col>
//           <Title level={3} className="page-header-heading">
//             Quản lý Doanh nghiệp
//           </Title>
//         </Col>
//         <Col>
//           <Search
//             placeholder="Tìm kiếm doanh nghiệp..."
//             style={{ width: 300 }}
//           />
//         </Col>
//       </Row>

//       <Card bordered={false} className="content-card">
//         <Table
//           columns={columns}
//           dataSource={dataSource}
//           rowKey="id_dn"
//           loading={loading}
//         />
//       </Card>

//       <Drawer
//         title="Thông tin chi tiết Doanh nghiệp"
//         width={600}
//         onClose={closeDrawer}
//         open={drawerVisible}
//       >
//         {selectedDN && (
//           <Descriptions bordered column={1}>
//             <Descriptions.Item label="Tên DN">
//               {selectedDN.ten_dn}
//             </Descriptions.Item>
//             <Descriptions.Item label="Mã số thuế">
//               {selectedDN.ma_so_thue}
//             </Descriptions.Item>
//             <Descriptions.Item label="Email">
//               {selectedDN.email}
//             </Descriptions.Item>
//             <Descriptions.Item label="Số điện thoại">
//               {selectedDN.sdt}
//             </Descriptions.Item>
//             <Descriptions.Item label="Địa chỉ">
//               {selectedDN.dia_chi}
//             </Descriptions.Item>
//             <Descriptions.Item label="Trạng thái">
//               {getStatusTag(selectedDN.trang_thai)}
//             </Descriptions.Item>
//             <Descriptions.Item label="Ngày đăng ký">
//               {selectedDN.ngay_tao
//                 ? dayjs(selectedDN.ngay_tao).format("DD/MM/YYYY HH:mm")
//                 : "--"}
//             </Descriptions.Item>
//             <Descriptions.Item label="Giấy phép KD">
//               <a href="#">{selectedDN.file_giay_phep}</a>
//             </Descriptions.Item>
//           </Descriptions>
//         )}
//       </Drawer>
//     </>
//   );
// };

// export default DoanhNghiep;

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  message,
  Row,
  Col,
  Typography,
  Card,
  Input,
  Dropdown,
  Drawer,
  Descriptions,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import {
  getAllDoanhNghiep,
  updateStatus,
} from "../services/doanhnghiep.service";

const { Title } = Typography;
const { Search } = Input;

const DoanhNghiep = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedDN, setSelectedDN] = useState(null);

  // ========================
  // FETCH API DOANH NGHIỆP
  // ========================
  useEffect(() => {
    const fetchDN = async () => {
      try {
        setLoading(true);

        const res = await getAllDoanhNghiep();
        const list = res?.data || [];

        // Map BE → FE
        const mapped = list.map((item) => ({
          id_dn: item.id_dn,
          ten_dn: item.ten_dn,
          ma_so_thue: item.ma_so_thue,
          email: item.email,
          sdt: item.sdt,
          dia_chi: item.dia_chi,
          file_giay_phep: item.file_giay_phep,

          // Convert status BE → FE
          trang_thai:
            item.status === "APPROVED"
              ? 1
              : item.status === "REJECTED"
              ? 2
              : 0,

          ngay_tao: item.ngay_tao || item.createdAt || null,
        }));

        setDataSource(mapped);
      } catch (err) {
        message.error(err?.message || "Không lấy được danh sách doanh nghiệp!");
      } finally {
        setLoading(false);
      }
    };

    fetchDN();
  }, []);

  const showDrawer = (record) => {
    setSelectedDN(record);
    setDrawerVisible(true);
  };
  const closeDrawer = () => setDrawerVisible(false);

  // ================================
  // HANDLE APPROVE / REJECT
  // ================================
  const handleApprove = async (record) => {
    try {
      await updateStatus(record.id_dn, "APPROVED");

      setDataSource((prev) =>
        prev.map((item) =>
          item.id_dn === record.id_dn ? { ...item, trang_thai: 1 } : item
        )
      );

      message.success("Duyệt doanh nghiệp thành công!");
    } catch (err) {
      message.error(err?.message || "Lỗi khi duyệt doanh nghiệp");
    }
  };

  const handleReject = async (record) => {
    try {
      await updateStatus(record.id_dn, "REJECTED");

      setDataSource((prev) =>
        prev.map((item) =>
          item.id_dn === record.id_dn ? { ...item, trang_thai: 2 } : item
        )
      );

      message.success("Từ chối doanh nghiệp thành công!");
    } catch (err) {
      message.error(err?.message || "Lỗi khi từ chối doanh nghiệp");
    }
  };

  // ================================
  // STATUS TAG
  // ================================
  const getStatusTag = (status) => {
    if (status === 1) return <Tag color="green">Đã duyệt</Tag>;
    if (status === 2) return <Tag color="red">Đã từ chối</Tag>;
    return <Tag color="orange">Chờ duyệt</Tag>;
  };

  const columns = [
    { title: "Tên Doanh nghiệp", dataIndex: "ten_dn", key: "ten_dn" },
    { title: "Mã số thuế", dataIndex: "ma_so_thue", key: "ma_so_thue" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ngày đăng ký",
      dataIndex: "ngay_tao",
      key: "ngay_tao",
      render: (text) =>
        text ? dayjs(text).format("DD/MM/YYYY") : "--",
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: getStatusTag,
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => showDrawer(record)} />

          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Duyệt",
                  icon: <CheckCircleOutlined />,
                  onClick: () => handleApprove(record),
                  disabled: record.trang_thai === 1,
                },
                {
                  key: "2",
                  label: "Từ chối",
                  icon: <CloseCircleOutlined />,
                  onClick: () => handleReject(record),
                  disabled: record.trang_thai === 2,
                },
              ],
            }}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} className="page-header-heading">
            Quản lý Doanh nghiệp
          </Title>
        </Col>
        <Col>
          <Search placeholder="Tìm kiếm doanh nghiệp..." style={{ width: 300 }} />
        </Col>
      </Row>

      {/* Table */}
      <Card bordered={false} className="content-card">
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id_dn"
          loading={loading}
        />
      </Card>

      {/* Drawer */}
      <Drawer
        title="Thông tin chi tiết Doanh nghiệp"
        width={600}
        onClose={closeDrawer}
        open={drawerVisible}
      >
        {selectedDN && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên DN">
              {selectedDN.ten_dn}
            </Descriptions.Item>
            <Descriptions.Item label="Mã số thuế">
              {selectedDN.ma_so_thue}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedDN.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedDN.sdt}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {selectedDN.dia_chi}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(selectedDN.trang_thai)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đăng ký">
              {selectedDN.ngay_tao
                ? dayjs(selectedDN.ngay_tao).format("DD/MM/YYYY HH:mm")
                : "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Giấy phép KD">
              <a href="#">{selectedDN.file_giay_phep}</a>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  );
};

export default DoanhNghiep;

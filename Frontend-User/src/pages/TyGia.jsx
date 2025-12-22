import React, { useState, useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import tienteService from "../services/tiente.service";
import tygiaService from "../services/tygia.service";

const TyGia = () => {
  const [dataSource, setDataSource] = useState([]);
  const [tienTeList, setTienTeList] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ============================================================
     🟢 LẤY DANH SÁCH TIỀN TỆ
  ============================================================ */
  const fetchTienTe = async () => {
    try {
      const res = await tienteService.getAllTienTe();
      if (res.success) {
        setTienTeList(res.data);
        return res.data; // ⚡ trả về để dùng tiếp
      } else {
        message.warning("Không thể lấy danh sách tiền tệ");
        return [];
      }
    } catch {
      message.error("Lỗi khi tải danh sách tiền tệ");
      return [];
    }
  };

  /* ============================================================
     🟢 CẬP NHẬT TỶ GIÁ TỪ API NGOÀI
  ============================================================ */
  const handleUpdateFromAPI = async (list = tienTeList) => {
    setLoading(true);
    try {
      const res = await tygiaService.updateTyGiaFromAPI();
      if (res.success) {
        const updatedList = res.data?.data || [];
        const mappedData = updatedList.map((item, idx) => ({
          id_tg: idx + 1,
          ma_tt: item.ma_tt,
          id_tt: list.find((t) => t.ma_tt === item.ma_tt)?.id_tt || null,
          ngay: res.data.date,
          ty_gia: item.ty_gia,
        }));
        setDataSource(mappedData);
        message.success(
          `Đã cập nhật tỷ giá thành công (${mappedData.length} loại tiền)!`
        );
      } else {
        message.warning(res.message || "Cập nhật không thành công");
      }
    } catch (err) {
      message.error(err.message || "Lỗi khi cập nhật tỷ giá");
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     🟢 KHỞI TẠO DỮ LIỆU (đảm bảo thứ tự)
  ============================================================ */
  useEffect(() => {
    const init = async () => {
      const list = await fetchTienTe(); // 🟢 đợi danh sách tiền tệ xong
      await handleUpdateFromAPI(list);  // 🟢 rồi mới cập nhật tỷ giá
    };
    init();
  }, []);

  /* ============================================================
     🟢 CỘT TABLE
  ============================================================ */
  const columns = [
    {
      title: "Tên tiền tệ",
      dataIndex: "id_tt",
      key: "id_tt",
      render: (id) =>
        tienTeList.find((t) => t.id_tt === id)?.ten_tt || "Không xác định",
    },
    {
      title: "Mã tiền tệ",
      dataIndex: "ma_tt",
      key: "ma_tt",
      render: (val, record) =>
        val || tienTeList.find((t) => t.id_tt === record.id_tt)?.ma_tt,
    },
    {
      title: "Ngày hiệu lực",
      dataIndex: "ngay",
      key: "ngay",
      sorter: (a, b) => dayjs(a.ngay).unix() - dayjs(b.ngay).unix(),
    },
    {
      title: "Tỷ giá (sang VND)",
      dataIndex: "ty_gia",
      key: "ty_gia",
      render: (val) => Number(val).toLocaleString("vi-VN"),
    },
  ];

  /* ============================================================
     🟢 GIAO DIỆN
  ============================================================ */
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16 }}>
        <h2 className="page-header-heading" style={{ margin: 0 }}>Quản lý Tỷ giá</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            icon={<SyncOutlined />}
            loading={loading}
            onClick={() => handleUpdateFromAPI()}
          >
            Cập nhật lại từ API
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id_tg"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TyGia;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  SettingOutlined,
  SwapOutlined,
  ContainerOutlined,
  ShoppingCartOutlined,
  FileSyncOutlined,
  HomeOutlined,
  BoxPlotOutlined,
} from '@ant-design/icons';

// Hàm tạo item cho menu
function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  // getItem(<Link to="/">Tổng quan</Link>, '1', <DashboardOutlined />),
  getItem(<Link to="/tong-quan">Tổng quan</Link>, '1', <DashboardOutlined />),
  getItem('Quản lý Nghiệp vụ', 'sub1', <AppstoreOutlined />, [
    getItem(<Link to="/hop-dong">Hợp đồng</Link>, '2', <FileTextOutlined />),
    getItem(<Link to="/lo-hang">Quản lý Lô hàng</Link>, 'lo_hang', <BoxPlotOutlined />),
    getItem(<Link to="/san-pham">Sản phẩm</Link>, '3'),
    getItem(<Link to="/nguyen-phu-lieu">Nguyên phụ liệu</Link>, '4'),
    getItem(<Link to="/dinh-muc">Định mức</Link>, '5'),
  ]),

  getItem('Tờ khai Hải quan', 'sub2', <ContainerOutlined />, [
    getItem(<Link to="/to-khai">Quản lý Tờ khai</Link>, 'tk_quan_ly'),
    getItem(<Link to="/to-khai-nhap">Nhập Tờ khai nhập</Link>, '6'),
    getItem(<Link to="/to-khai-xuat">Nhập Tờ khai xuất</Link>, '7'),
  ]),

  getItem('Quản lý Kho', 'sub3', <ShoppingCartOutlined />, [
    getItem(<Link to="/kho">Danh sách kho</Link>, 'kho_list', <HomeOutlined />),
    getItem(<Link to="/kho/nhap-npl">Nhập kho NPL</Link>, '8'),
    getItem(<Link to="/kho/xuat-npl">Xuất kho NPL</Link>, '9'),
    getItem(<Link to="/kho/nhap-sp">Nhập kho SP</Link>, '10'),
    getItem(<Link to="/kho/xuat-sp">Xuất kho SP</Link>, '11'),
  ]),

  getItem(<Link to="/thanh-khoan">Thanh khoản & Báo cáo</Link>, '12', <FileSyncOutlined />),

  getItem('Thiết lập', 'sub4', <SettingOutlined />, [
    getItem(<Link to="/ty-gia">Tỷ giá</Link>, '13', <SwapOutlined />),
    getItem(<Link to="/quy-doi-don-vi">Quy đổi đơn vị</Link>, '15'),
  ]),
];

const Sidebar = () => {
  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={['1']}
      mode="inline"
      items={items}
    />
  );
};

export default Sidebar;
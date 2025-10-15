'use client';
import { useCallback, useMemo } from 'react';
import { ConfigProvider, Menu } from 'antd';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useColorState } from '@/stores/color.store';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  ApartmentOutlined,
  SafetyOutlined,
  TagOutlined,
  DollarOutlined,
  LineChartOutlined,
  ShoppingOutlined,
  ToolOutlined,
  ClusterOutlined,
  SwapOutlined,
  ProjectOutlined,
  ContainerOutlined,
  DeliveredProcedureOutlined,
  FileTextOutlined,
  BookOutlined,
} from '@ant-design/icons';
import styles from '@/modules/shared/siderbar/siderbar.module.scss';

// Import tất cả path constants
import {
  QL_COSO_DOANHNGHIEP_PATH,
  QL_COSO_HAIQUAN_PATH,
  QL_TAICHINH_TIENTE_PATH,
  QL_TAICHINH_TYGIA_PATH,
  QL_COSO_DONVITINHHQ_PATH,
  QL_QUYDOIDONVIDN_PATH,
  QL_HANGHOA_SANPHAM_PATH,
  QL_HANGHOA_NGUYENPHULIEU_PATH,
  QL_HANGHOA_DINHMUCSP_PATH,
  QL_HANGHOA_QUYDOIDONVISP_PATH,
  QL_HOPDONG_PATH,
  QL_LOHANG_PATH,
  QL_VANDON_NHAP_PATH,
  QL_VANDON_XUAT_PATH,
  QL_HOADON_NHAP_PATH,
  QL_HOADON_XUAT_PATH,
  QL_TOKHAI_NHAP_PATH,
  QL_TOKHAI_XUAT_PATH,
} from '@/utils/path';

type MenuItem = Required<MenuProps>['items'][number];
interface SiderBarProps {
  collapsed: boolean;
}

// 🚀 Dùng constants thay vì hard-code
const routeMap: Record<string, string> = {
  'sub0': '/vi/dashboard',

  // Quản lý Danh Mục
  '1': QL_COSO_DOANHNGHIEP_PATH,
  '2': QL_COSO_HAIQUAN_PATH,
  '3': QL_TAICHINH_TIENTE_PATH,
  '4': QL_TAICHINH_TYGIA_PATH,
  '5': QL_COSO_DONVITINHHQ_PATH,
  '6': QL_QUYDOIDONVIDN_PATH,
  '7': QL_HANGHOA_SANPHAM_PATH,
  '8': QL_HANGHOA_NGUYENPHULIEU_PATH,
  '9': QL_HANGHOA_DINHMUCSP_PATH,
  '10': QL_HANGHOA_QUYDOIDONVISP_PATH,

  // Quản lý Nghiệp Vụ
  '11': QL_HOPDONG_PATH,
  '12': QL_LOHANG_PATH,
  '13': QL_VANDON_NHAP_PATH,
  '14': QL_VANDON_XUAT_PATH,
  '15': QL_HOADON_NHAP_PATH,
  '17': QL_HOADON_XUAT_PATH,
  '19': QL_TOKHAI_NHAP_PATH,
  '20': QL_TOKHAI_XUAT_PATH,
};

const SiderBar: React.FC<SiderBarProps> = ({ collapsed }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { themeColor } = useColorState();

  const getCurrentKey = useCallback(() => {
    const entry = Object.entries(routeMap).find(([_, path]) => path === pathname);
    return entry ? entry[0] : 'sub0';
  }, [pathname]);

  const onClick: MenuProps['onClick'] = (e) => {
    const path = routeMap[e.key];
    if (path && path !== pathname) {
      router.push(path);
    }
  };

  const sidebarItems = useMemo<MenuItem[]>(() => [
    {
      key: 'sub0',
      label: 'Dashboard',
      icon: <DashboardOutlined />,
    },
    {
      key: 'sub_dm',
      label: 'I. Quản Lý Danh Mục',
      icon: <SettingOutlined />,
      children: [
        {
          key: 'dm_base',
          label: '1. Quản Lý Cơ Sở',
          icon: <ApartmentOutlined />,
          children: [
            { key: '1', label: 'Quản Lý Doanh Nghiệp', icon: <ApartmentOutlined /> },
            { key: '2', label: 'Quản Lý Hải Quan', icon: <SafetyOutlined /> },
            { key: '5', label: 'Đơn Vị Tính HQ', icon: <TagOutlined /> },
          ],
        },
        {
          key: 'dm_finance',
          label: '2. Quản Lý Tài Chính',
          icon: <DollarOutlined />,
          children: [
            { key: '3', label: 'Tiền Tệ', icon: <DollarOutlined /> },
            { key: '4', label: 'Tỷ Giá', icon: <LineChartOutlined /> },
          ],
        },
        {
          key: 'dm_product',
          label: '3. Quản Lý Hàng Hóa',
          icon: <ShoppingOutlined />,
          children: [
            { key: '7', label: 'Sản Phẩm', icon: <ShoppingOutlined /> },
            { key: '8', label: 'Nguyên Phụ Liệu', icon: <ToolOutlined /> },
            { key: '9', label: 'Định Mức Sản Phẩm', icon: <ClusterOutlined /> },
            { key: '10', label: 'Quy Đổi Đơn Vị SP', icon: <SwapOutlined /> },
          ],
        },
        {
          key: 'dm_convert',
          label: '4. Quản Lý Quy Đổi',
          icon: <SwapOutlined />,
          children: [
            { key: '6', label: 'Quy Đổi Đơn Vị DN', icon: <SwapOutlined /> },
          ],
        },
      ],
    },
    {
      key: 'sub_nv',
      label: 'II. Quản Lý Nghiệp Vụ',
      icon: <BookOutlined />,
      children: [
        {
          key: 'nv_contract',
          label: '1. Hợp Đồng / Lô Hàng',
          icon: <ProjectOutlined />,
          children: [
            { key: '11', label: 'Hợp Đồng', icon: <ProjectOutlined /> },
            { key: '12', label: 'Lô Hàng', icon: <ContainerOutlined /> },
          ],
        },
        {
          key: 'nv_bill',
          label: '2. Vận Đơn',
          icon: <DeliveredProcedureOutlined />,
          children: [
            { key: '13', label: 'Vận Đơn Nhập', icon: <DeliveredProcedureOutlined /> },
            { key: '14', label: 'Vận Đơn Xuất', icon: <DeliveredProcedureOutlined /> },
          ],
        },
        {
          key: 'nv_invoice',
          label: '3. Hóa Đơn',
          icon: <FileTextOutlined />,
          children: [
            { key: '15', label: 'Hóa Đơn Nhập', icon: <FileTextOutlined /> },
            { key: '17', label: 'Hóa Đơn Xuất', icon: <FileTextOutlined /> },
          ],
        },
        {
          key: 'nv_declaration',
          label: '4. Tờ Khai',
          icon: <BookOutlined />,
          children: [
            { key: '19', label: 'Tờ Khai Nhập', icon: <BookOutlined /> },
            { key: '20', label: 'Tờ Khai Xuất', icon: <BookOutlined /> },
          ],
        },
      ],
    },
  ], []);

  const sidebarBg = themeColor?.token?.colorPrimary || 'rgb(13,68,138)';
  const textColor = themeColor?.token?.colorPrimary ? '#ffffff' : '#000000';

  return (
    <div className={styles.menuContainer} style={{ backgroundColor: sidebarBg, color: textColor }}>
      <div className={styles.headerLogo} style={{ backgroundColor: sidebarBg }}>
        <Image
          src={collapsed ? '/image/logotrangnho.png' : '/image/logotrang.png'}
          alt="Logo"
          width={collapsed ? 50 : 150}
          height={60}
          priority
          style={{
            objectFit: 'contain',
            height: 60,
            marginLeft: collapsed ? '-50%' : '20%',
          }}
        />
      </div>

      <ConfigProvider theme={{ token: { colorBgContainer: sidebarBg, colorText: textColor } }}>
        <Menu
          onClick={onClick}
          defaultOpenKeys={collapsed ? [] : ['sub_dm', 'dm_base', 'dm_finance', 'dm_product', 'sub_nv', 'nv_contract', 'nv_bill', 'nv_invoice', 'nv_declaration']}
          selectedKeys={[getCurrentKey()]}
          mode="inline"
          items={sidebarItems}
          inlineCollapsed={collapsed}
          className={styles.menu}
          style={{ backgroundColor: sidebarBg, color: textColor }}
        />
      </ConfigProvider>
    </div>
  );
};

export default SiderBar;

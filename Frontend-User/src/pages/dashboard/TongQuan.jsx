import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileDoneOutlined, 
  CheckCircleOutlined, 
  WarningOutlined,
  ImportOutlined,
  ExportOutlined,
  InboxOutlined
} from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';

// Import components
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';
import LoadingDisplay from '../../components/dashboard/LoadingDisplay';
import ErrorDisplay from '../../components/dashboard/ErrorDisplay';
import LiquidationPieChart from '../../components/dashboard/LiquidationPieChart';
import ImportExportBarChart from '../../components/dashboard/ImportExportBarChart';
import RecentContractsTable from '../../components/dashboard/RecentContractsTable';

// Import services
import hopdongService from '../../services/hopdong.service';
import baocaothanhkhoanService from '../../services/baocaothanhkhoan.service';
import tokhaiService from '../../services/tokhai.service';
import khoService from '../../services/kho.service';

// Import helpers
import { formatCurrency, processInventoryData } from '../../utils/dashboardHelpers';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const TongQuan = () => {
  // ============================================================
  // SUBTASK 8.1: State Management
  // ============================================================
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    contracts: [],
    liquidationReports: [],
    importDeclarations: [],
    exportDeclarations: [],
    inventory: { npl: [], sp: [] },
    trends: []
  });
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly'); // 'monthly' | 'quarterly'
  
  // Ref for dashboard container (for export functionality)
  const dashboardRef = useRef(null);
  
  // Navigation hook
  const navigate = useNavigate();

  // ============================================================
  // SUBTASK 8.2: Data Fetching
  // ============================================================
  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      
      // Debug: Check if token exists
      const token = localStorage.getItem('accessToken');
      console.log('🔑 Token exists:', !!token);
      
      // Fetch all data in parallel using Promise.all
      const [
        contractsRes,
        liquidationRes,
        importDeclRes,
        exportDeclRes,
        inventoryRes
      ] = await Promise.all([
        hopdongService.getAllHopDong().catch(err => {
          console.error('❌ Error fetching contracts:', err);
          throw err;
        }),
        baocaothanhkhoanService.getAllReports().catch(err => {
          console.error('❌ Error fetching liquidation reports:', err);
          throw err;
        }),
        tokhaiService.getAllToKhaiNhap().catch(err => {
          console.error('❌ Error fetching import declarations:', err);
          throw err;
        }),
        tokhaiService.getAllToKhaiXuat().catch(err => {
          console.error('❌ Error fetching export declarations:', err);
          throw err;
        }),
        khoService.getAllKho().catch(err => {
          console.error('❌ Error fetching inventory:', err);
          throw err;
        })
      ]);

      console.log('✅ All data fetched successfully');

      // Normalize API responses
      const contracts = Array.isArray(contractsRes) ? contractsRes : (contractsRes?.data || []);
      const liquidationReports = Array.isArray(liquidationRes) ? liquidationRes : (liquidationRes?.data || []);
      const importDeclarations = Array.isArray(importDeclRes) ? importDeclRes : (importDeclRes?.data || []);
      const exportDeclarations = Array.isArray(exportDeclRes) ? exportDeclRes : (exportDeclRes?.data || []);
      const inventory = Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes?.data || []);

      // Separate inventory into NPL and SP
      const nplInventory = inventory.filter(item => item.loai_kho === 'NPL' || item.type === 'NPL');
      const spInventory = inventory.filter(item => item.loai_kho === 'SP' || item.type === 'SP');

      // Set dashboard data
      setDashboardData({
        contracts,
        liquidationReports,
        importDeclarations,
        exportDeclarations,
        inventory: { npl: nplInventory, sp: spInventory }
      });

    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      
      // Extract detailed error message
      let errorMessage = 'Không thể tải dữ liệu. Vui lòng thử lại.';
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || err.response.statusText || errorMessage;
        console.error('Server error:', err.response.status, err.response.data);
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
        console.error('Network error:', err.request);
      } else {
        // Something else happened
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ============================================================
  // SUBTASK 8.3: Lifecycle Hooks
  // ============================================================
  
  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Refetch trends when timeRange changes
  useEffect(() => {
    if (!loading && dashboardData.contracts.length > 0) {
      // Trends are calculated on-the-fly in the component
      // No need to refetch, just trigger re-render
    }
  }, [timeRange, loading, dashboardData.contracts.length]);

  // Handle refresh with debounce
  const handleRefresh = useCallback(() => {
    if (refreshing) return; // Prevent spam clicks
    
    setRefreshing(true);
    fetchDashboardData();
    message.success('Đang làm mới dữ liệu...');
  }, [refreshing, fetchDashboardData]);

  // Handle export to PDF
  const handleExportPDF = useCallback(async () => {
    try {
      message.loading({ content: 'Đang xuất PDF...', key: 'export' });
      
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`dashboard-${dayjs().format('YYYY-MM-DD-HHmmss')}.pdf`);
      
      message.success({ content: 'Xuất PDF thành công!', key: 'export' });
    } catch (err) {
      console.error('Error exporting PDF:', err);
      message.error({ content: 'Lỗi khi xuất PDF', key: 'export' });
    }
  }, []);

  // Handle export to PNG
  const handleExportPNG = useCallback(async () => {
    try {
      message.loading({ content: 'Đang xuất hình ảnh...', key: 'export' });
      
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dashboard-${dayjs().format('YYYY-MM-DD-HHmmss')}.png`;
        link.click();
        URL.revokeObjectURL(url);
        
        message.success({ content: 'Xuất hình ảnh thành công!', key: 'export' });
      });
    } catch (err) {
      console.error('Error exporting PNG:', err);
      message.error({ content: 'Lỗi khi xuất hình ảnh', key: 'export' });
    }
  }, []);

  // Handle export based on format
  const handleExport = useCallback((format) => {
    if (format === 'pdf') {
      handleExportPDF();
    } else if (format === 'png') {
      handleExportPNG();
    }
  }, [handleExportPDF, handleExportPNG]);

  // Handle contract row click
  const handleContractClick = useCallback((contract) => {
    navigate(`/hop-dong/${contract.id_hd}`);
  }, [navigate]);

  // ============================================================
  // SUBTASK 8.4: Render Logic - Calculate Metrics
  // ============================================================
  
  // Calculate statistics
  const totalContracts = dashboardData.contracts.length;
  const compliantCount = dashboardData.liquidationReports.filter(r => 
    (r.ket_luan_tong_the || r.ket_luan) === 'HopLe'
  ).length;
  const nonCompliantCount = dashboardData.liquidationReports.filter(r => 
    ['ViPham', 'DuNPL', 'CanhBao'].includes(r.ket_luan_tong_the || r.ket_luan)
  ).length;
  const pendingCount = totalContracts - dashboardData.liquidationReports.length;
  const importCount = dashboardData.importDeclarations.length;
  const exportCount = dashboardData.exportDeclarations.length;
  
  // Calculate inventory data (for potential future use)
  const inventoryData = processInventoryData(
    dashboardData.inventory.npl,
    dashboardData.inventory.sp
  );

  // Sort contracts by date for recent contracts table
  const recentContracts = [...dashboardData.contracts]
    .sort((a, b) => dayjs(b.ngay_ky).valueOf() - dayjs(a.ngay_ky).valueOf())
    .slice(0, 5);

  // ============================================================
  // Conditional Rendering
  // ============================================================
  
  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchDashboardData} />;
  }

  // ============================================================
  // Main Render
  // ============================================================
  
  return (
    <div ref={dashboardRef} style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      {/* Dashboard Header */}
      <DashboardHeader 
        onRefresh={handleRefresh}
        onExport={handleExport}
        refreshing={refreshing}
      />

      {/* Statistics Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <StatCard
              title="Tổng số Hợp đồng"
              value={totalContracts}
              icon={<FileDoneOutlined />}
              color="#1890ff"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <StatCard
              title="Thanh khoản Hợp lệ"
              value={compliantCount}
              icon={<CheckCircleOutlined />}
              color="#52c41a"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <StatCard
              title="Vi phạm / Bất thường"
              value={nonCompliantCount}
              icon={<WarningOutlined />}
              color="#ff4d4f"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <StatCard
              title="Chưa thanh khoản"
              value={pendingCount}
              icon={<WarningOutlined />}
              color="#faad14"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <StatCard
              title="Tờ khai Nhập"
              value={importCount}
              icon={<ImportOutlined />}
              color="#1890ff"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <StatCard
              title="Tờ khai Xuất"
              value={exportCount}
              icon={<ExportOutlined />}
              color="#52c41a"
            />
          </Col>
        </Row>

        {/* SUBTASK 8.5: Charts Section */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={10}>
            <ChartCard title="Tỷ lệ Thanh khoản Hợp đồng">
              <LiquidationPieChart
                liquidationReports={dashboardData.liquidationReports}
                contracts={dashboardData.contracts}
              />
            </ChartCard>
          </Col>
          <Col xs={24} lg={14}>
            <ChartCard title="Tờ khai Nhập/Xuất theo Tháng">
              <ImportExportBarChart
                importDeclarations={dashboardData.importDeclarations}
                exportDeclarations={dashboardData.exportDeclarations}
              />
            </ChartCard>
          </Col>
        </Row>

        {/* SUBTASK 8.6: Table Section */}
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <ChartCard title="Các Hợp đồng gần đây">
              <RecentContractsTable
                contracts={recentContracts}
                liquidationReports={dashboardData.liquidationReports}
                onRowClick={handleContractClick}
              />
            </ChartCard>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
};

export default TongQuan;
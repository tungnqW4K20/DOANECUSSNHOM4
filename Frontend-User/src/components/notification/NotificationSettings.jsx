import { useState } from 'react';
import { Modal, Button, Space, Statistic, Row, Col, Card, Divider, message } from 'antd';
import {
  DownloadOutlined,
  UploadOutlined,
  BarChartOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import notificationExportService from '../../services/notificationExport.service';

const NotificationSettings = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  // Load statistics
  const loadStats = () => {
    const statistics = notificationExportService.getStatistics();
    setStats(statistics);
  };

  // Handle export
  const handleExport = async (format) => {
    setLoading(true);
    try {
      let success = false;
      
      if (format === 'json') {
        success = notificationExportService.exportToJSON();
      } else if (format === 'csv') {
        success = notificationExportService.exportToCSV();
      } else if (format === 'txt') {
        success = notificationExportService.exportToText();
      }
      
      if (success) {
        message.success(`Đã xuất file ${format.toUpperCase()} thành công`);
      } else {
        message.error('Không thể xuất file');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi xuất file');
    } finally {
      setLoading(false);
    }
  };

  // Handle import
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setLoading(true);
        try {
          const success = await notificationExportService.importFromJSON(file);
          if (success) {
            message.success('Đã import thành công');
            loadStats();
          } else {
            message.error('Không thể import file');
          }
        } catch (error) {
          message.error('File không hợp lệ');
        } finally {
          setLoading(false);
        }
      }
    };
    input.click();
  };

  // Show statistics
  const handleShowStats = () => {
    loadStats();
  };

  return (
    <Modal
      title="Quản lý Thông báo"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Export Section */}
        <div>
          <h4 style={{ marginBottom: 12 }}>
            <DownloadOutlined style={{ marginRight: 8 }} />
            Xuất dữ liệu
          </h4>
          <Space wrap>
            <Button
              icon={<FileTextOutlined />}
              onClick={() => handleExport('json')}
              loading={loading}
            >
              Xuất JSON
            </Button>
            <Button
              icon={<FileExcelOutlined />}
              onClick={() => handleExport('csv')}
              loading={loading}
            >
              Xuất CSV
            </Button>
            <Button
              icon={<FilePdfOutlined />}
              onClick={() => handleExport('txt')}
              loading={loading}
            >
              Xuất Text
            </Button>
          </Space>
        </div>

        <Divider />

        {/* Import Section */}
        <div>
          <h4 style={{ marginBottom: 12 }}>
            <UploadOutlined style={{ marginRight: 8 }} />
            Nhập dữ liệu
          </h4>
          <Button
            icon={<UploadOutlined />}
            onClick={handleImport}
            loading={loading}
          >
            Import từ JSON
          </Button>
        </div>

        <Divider />

        {/* Statistics Section */}
        <div>
          <h4 style={{ marginBottom: 12 }}>
            <BarChartOutlined style={{ marginRight: 8 }} />
            Thống kê
          </h4>
          <Button
            type="primary"
            icon={<BarChartOutlined />}
            onClick={handleShowStats}
            loading={loading}
          >
            Xem thống kê
          </Button>

          {stats && (
            <Card style={{ marginTop: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Tổng số"
                    value={stats.total}
                    valueStyle={{ color: '#3b82f6' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Chưa đọc"
                    value={stats.unread}
                    valueStyle={{ color: '#ef4444' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Đã đọc"
                    value={stats.read}
                    valueStyle={{ color: '#10b981' }}
                  />
                </Col>
              </Row>

              <Divider />

              <h4 style={{ marginBottom: 12 }}>Theo loại</h4>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Statistic
                    title="Thành công"
                    value={stats.byType.success}
                    valueStyle={{ color: '#10b981', fontSize: 16 }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Lỗi"
                    value={stats.byType.error}
                    valueStyle={{ color: '#ef4444', fontSize: 16 }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Cảnh báo"
                    value={stats.byType.warning}
                    valueStyle={{ color: '#f59e0b', fontSize: 16 }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Thông tin"
                    value={stats.byType.info}
                    valueStyle={{ color: '#3b82f6', fontSize: 16 }}
                  />
                </Col>
              </Row>

              <Divider />

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Hôm nay"
                    value={stats.today}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Tuần này"
                    value={stats.thisWeek}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </div>
      </Space>
    </Modal>
  );
};

export default NotificationSettings;

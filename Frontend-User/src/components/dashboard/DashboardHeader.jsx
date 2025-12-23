import React from 'react';
import { Typography, Space, Button, Dropdown } from 'antd';
import { ReloadOutlined, DownloadOutlined, FilePdfOutlined, FileImageOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './DashboardHeader.css';

const { Title } = Typography;

const DashboardHeader = ({ onRefresh, onExport, refreshing }) => {
  const exportMenuItems = [
    {
      key: 'pdf',
      label: 'Xuất PDF',
      icon: <FilePdfOutlined />,
      onClick: () => onExport('pdf')
    },
    {
      key: 'png',
      label: 'Xuất hình ảnh',
      icon: <FileImageOutlined />,
      onClick: () => onExport('png')
    }
  ];

  return (
    <div className="dashboard-header">
      <Title level={3} className="dashboard-title">Tổng quan</Title>
      <Space className="dashboard-actions">
        <Button 
          icon={<ReloadOutlined />} 
          onClick={onRefresh}
          loading={refreshing}
        >
          Làm mới
        </Button>
        <Dropdown menu={{ items: exportMenuItems }}>
          <Button icon={<DownloadOutlined />}>
            Xuất báo cáo
          </Button>
        </Dropdown>
      </Space>
    </div>
  );
};

DashboardHeader.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  refreshing: PropTypes.bool
};

DashboardHeader.defaultProps = {
  refreshing: false
};

export default DashboardHeader;

import React from 'react';
import { Table, Tag } from 'antd';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import './RecentContractsTable.css';

const RecentContractsTable = ({ contracts, liquidationReports, onRowClick }) => {
  // Helper function to get liquidation status tag
  const getLiquidationStatusTag = (id_hd) => {
    const report = liquidationReports.find(r => r.id_hd === id_hd);
    
    if (!report) {
      return <Tag color="orange" style={{ fontWeight: 600 }}>Chưa thanh khoản</Tag>;
    }
    
    const statusConfig = {
      'HopLe': { 
        color: 'green', 
        text: 'Hợp lệ',
        style: { backgroundColor: '#52c41a', color: 'white', fontWeight: 600, border: 'none' }
      },
      'ViPham': { 
        color: 'red', 
        text: 'Vi phạm',
        style: { backgroundColor: '#ff4d4f', color: 'white', fontWeight: 600, border: 'none' }
      },
      'DuNPL': { 
        color: 'orange', 
        text: 'Dư NPL',
        style: { backgroundColor: '#faad14', color: 'white', fontWeight: 600, border: 'none' }
      },
      'CanhBao': { 
        color: 'volcano', 
        text: 'Cảnh báo',
        style: { backgroundColor: '#ff7a45', color: 'white', fontWeight: 600, border: 'none' }
      }
    };
    
    // Sử dụng ket_luan_tong_the thay vì ket_luan
    const ketLuan = report.ket_luan_tong_the || report.ket_luan;
    const config = statusConfig[ketLuan] || { 
      color: 'default', 
      text: ketLuan,
      style: { fontWeight: 600 }
    };
    
    return <Tag color={config.color} style={config.style}>{config.text}</Tag>;
  };

  // Define table columns
  const columns = [
    {
      title: 'Số Hợp đồng',
      dataIndex: 'so_hd',
      key: 'so_hd',
      width: '25%'
    },
    {
      title: 'Ngày ký',
      dataIndex: 'ngay_ky',
      key: 'ngay_ky',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : '-',
      width: '15%',
      align: 'center'
    },
    {
      title: 'Giá trị',
      dataIndex: 'gia_tri',
      key: 'gia_tri',
      render: (value) => value ? new Intl.NumberFormat('vi-VN').format(value) : '0',
      width: '20%',
      align: 'right'
    },
    {
      title: 'Tiền tệ',
      dataIndex: ['tienTe', 'ma_tt'],
      key: 'tien_te',
      render: (text) => text || 'VND',
      width: '15%',
      align: 'center'
    },
    {
      title: 'Trạng thái Thanh khoản',
      key: 'status',
      render: (_, record) => getLiquidationStatusTag(record.id_hd),
      width: '25%',
      align: 'center'
    }
  ];

  return (
    <div className="recent-contracts-table-wrapper">
      <Table
        columns={columns}
        dataSource={contracts}
        rowKey="id_hd"
        pagination={false}
        onRow={(record) => ({
          onClick: () => onRowClick && onRowClick(record),
          className: 'clickable-row'
        })}
        className="recent-contracts-table"
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: 'Không có hợp đồng nào'
        }}
        tableLayout="fixed"
      />
    </div>
  );
};

RecentContractsTable.propTypes = {
  contracts: PropTypes.array.isRequired,
  liquidationReports: PropTypes.array.isRequired,
  onRowClick: PropTypes.func
};

RecentContractsTable.defaultProps = {
  onRowClick: null
};

export default RecentContractsTable;

import React from 'react';
import { Spin } from 'antd';
import './LoadingDisplay.css';

const LoadingDisplay = () => {
  return (
    <div className="loading-container">
      <Spin size="large" tip="Đang tải dữ liệu..." />
    </div>
  );
};

export default LoadingDisplay;

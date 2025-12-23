import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button, Space } from 'antd';

const TrendLineChart = ({ trendData, timeRange, onTimeRangeChange }) => {
  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Space>
          <Button 
            type={timeRange === 'monthly' ? 'primary' : 'default'}
            onClick={() => onTimeRangeChange('monthly')}
            size="small"
          >
            Theo tháng
          </Button>
          <Button 
            type={timeRange === 'quarterly' ? 'primary' : 'default'}
            onClick={() => onTimeRangeChange('quarterly')}
            size="small"
          >
            Theo quý
          </Button>
        </Space>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="nhap" 
            stroke="#1890ff" 
            strokeWidth={2}
            name="Nhập khẩu"
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-in-out"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="xuat" 
            stroke="#52c41a" 
            strokeWidth={2}
            name="Xuất khẩu"
            animationBegin={200}
            animationDuration={1000}
            animationEasing="ease-in-out"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendLineChart;

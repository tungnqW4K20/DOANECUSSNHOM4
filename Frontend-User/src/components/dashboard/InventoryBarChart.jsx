import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InventoryBarChart = ({ inventoryData }) => {
  // Process data to get top 5 items by quantity
  const processedData = inventoryData
    .map(item => ({
      name: item.name || item.ten_npl || item.ten_sp || 'Unknown',
      quantity: item.quantity || item.ton_kho || 0
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={processedData} 
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={150}
          style={{ fontSize: '12px' }}
        />
        <Tooltip />
        <Bar 
          dataKey="quantity" 
          fill="#722ed1"
          name="Số lượng tồn kho"
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default InventoryBarChart;

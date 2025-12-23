import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const LiquidationPieChart = ({ liquidationReports, contracts }) => {
  // Calculate counts for each status
  const compliantCount = liquidationReports.filter(r => r.ket_luan === 'HopLe').length;
  const nonCompliantCount = liquidationReports.filter(r => 
    ['ViPham', 'DuNPL'].includes(r.ket_luan)
  ).length;
  const pendingCount = contracts.length - liquidationReports.length;

  // Prepare data for pie chart
  const pieData = [
    { name: 'Hợp lệ', value: compliantCount, color: '#52c41a' },
    { name: 'Vi phạm / Bất thường', value: nonCompliantCount, color: '#ff4d4f' },
    { name: 'Chưa thanh khoản', value: pendingCount, color: '#faad14' }
  ];

  // Custom label to show percentage
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-out"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default LiquidationPieChart;

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { processMonthlyData } from '../../utils/dashboardHelpers';

const ImportExportBarChart = ({ importDeclarations, exportDeclarations }) => {
  // Process data using helper function
  const monthlyData = processMonthlyData(importDeclarations, exportDeclarations);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar 
          dataKey="nhap" 
          fill="#1890ff" 
          name="Tờ khai nhập"
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-out"
        />
        <Bar 
          dataKey="xuat" 
          fill="#52c41a" 
          name="Tờ khai xuất"
          animationBegin={100}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ImportExportBarChart;

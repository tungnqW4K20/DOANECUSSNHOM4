import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { TeamOutlined, ContainerOutlined, IssuesCloseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title } = Typography;

const data = [
  { name: 'Tháng 1', "Doanh nghiệp": 4, "Tờ khai": 24 },
  { name: 'Tháng 2', "Doanh nghiệp": 3, "Tờ khai": 13 },
  { name: 'Tháng 3', "Doanh nghiệp": 5, "Tờ khai": 48 },
  { name: 'Tháng 4', "Doanh nghiệp": 2, "Tờ khai": 39 },
];

const TongQuan = () => {
  return (
    <>
      <Title level={3} style={{ marginBottom: 24 }}>Bảng điều khiển</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderLeft: '4px solid #1890ff', background: '#e6f7ff' }}>
            <Statistic title="Tổng số Doanh nghiệp" value={112} prefix={<TeamOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderLeft: '4px solid #faad14', background: '#fffbe6' }}>
            <Statistic title="Tài khoản chờ duyệt" value={5} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }}/>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderLeft: '4px solid #722ed1', background: '#f9f0ff' }}>
            <Statistic title="Tổng số Tờ khai" value={884} prefix={<ContainerOutlined />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
         <Col xs={24} sm={12} md={6}>
          <Card style={{ borderLeft: '4px solid #52c41a', background: '#f6ffed' }}>
            <Statistic title="Tờ khai đã thông quan" value={790} prefix={<IssuesCloseOutlined />} valueStyle={{ color: '#52c41a' }}/>
          </Card>
        </Col>

        <Col span={24}>
            <Card title="Thống kê hoạt động gần đây">
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Doanh nghiệp" fill="#8884d8" />
                        <Bar dataKey="Tờ khai" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </Col>
      </Row>
    </>
  );
};

export default TongQuan;
import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Skeleton } from 'antd';
import {
  TeamOutlined,
  ContainerOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const { Title, Text } = Typography;

const chartData = [
  { name: 'T1', doanhNghiep: 4, toKhai: 24 },
  { name: 'T2', doanhNghiep: 3, toKhai: 13 },
  { name: 'T3', doanhNghiep: 5, toKhai: 48 },
  { name: 'T4', doanhNghiep: 2, toKhai: 39 },
  { name: 'T5', doanhNghiep: 6, toKhai: 52 },
  { name: 'T6', doanhNghiep: 4, toKhai: 35 },
];

const TongQuan = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    pendingApproval: 0,
    totalDeclarations: 0,
    approvedDeclarations: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalBusinesses: 112,
        pendingApproval: 5,
        totalDeclarations: 884,
        approvedDeclarations: 790,
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, value, icon, color, bgColor, growth, delay }) => (
    <Card
      className={`stat-card stat-card-${color} hover-lift fade-in-up stagger-${delay}`}
      style={{
        background: bgColor,
        border: 'none',
        borderRadius: '16px',
      }}
      styles={{ body: { padding: '24px' } }}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>{title}</Text>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: `var(--${color === 'blue' ? 'primary' : color}-color)` }}>
                {value}
              </span>
              {growth && (
                <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 500 }}>
                  <ArrowUpOutlined /> {growth}%
                </span>
              )}
            </div>
          </div>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: `linear-gradient(135deg, var(--${color === 'blue' ? 'primary' : color}-color) 0%, var(--${color === 'blue' ? 'primary' : color}-color)99 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 20px var(--${color === 'blue' ? 'primary' : color}-color)40`,
            }}
          >
            {icon}
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <div>
      {/* Page Header */}
      <div className="fade-in" style={{ marginBottom: '32px' }}>
        <Title level={3} className="page-header-heading">
          Bảng điều khiển
        </Title>
        <Text style={{ color: '#64748b', marginTop: '8px', display: 'block' }}>
          Tổng quan hoạt động hệ thống quản lý xuất nhập khẩu
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng Doanh nghiệp"
            value={stats.totalBusinesses}
            icon={<TeamOutlined style={{ fontSize: '28px', color: 'white' }} />}
            color="blue"
            bgColor="linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
            growth={12}
            delay={1}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Chờ duyệt"
            value={stats.pendingApproval}
            icon={<ClockCircleOutlined style={{ fontSize: '28px', color: 'white' }} />}
            color="warning"
            bgColor="linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
            delay={2}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng Tờ khai"
            value={stats.totalDeclarations}
            icon={<ContainerOutlined style={{ fontSize: '28px', color: 'white' }} />}
            color="secondary"
            bgColor="linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)"
            growth={8}
            delay={3}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Đã thông quan"
            value={stats.approvedDeclarations}
            icon={<CheckCircleOutlined style={{ fontSize: '28px', color: 'white' }} />}
            color="success"
            bgColor="linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
            growth={15}
            delay={4}
          />
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card
            className="content-card gradient-card fade-in-up stagger-5"
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RiseOutlined style={{ color: 'white', fontSize: '20px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>Thống kê hoạt động</div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}>6 tháng gần nhất</div>
                </div>
              </div>
            }
            styles={{ body: { padding: '24px' } }}
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorDN" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="colorTK" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      padding: '12px 16px',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                  <Bar dataKey="doanhNghiep" name="Doanh nghiệp" fill="url(#colorDN)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="toKhai" name="Tờ khai" fill="url(#colorTK)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            className="content-card gradient-card fade-in-up stagger-5"
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ContainerOutlined style={{ color: 'white', fontSize: '20px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>Xu hướng tờ khai</div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}>Biểu đồ tăng trưởng</div>
                </div>
              </div>
            }
            styles={{ body: { padding: '24px' } }}
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="toKhai"
                    name="Tờ khai"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#colorArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TongQuan;

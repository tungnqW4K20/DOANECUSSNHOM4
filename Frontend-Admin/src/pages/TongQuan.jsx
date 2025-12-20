import { Row, Col, Card, Statistic, Typography } from 'antd';
import {
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

// Mock data doanh thu 6 tháng
const revenueData = [
  { month: 'T1', revenue: 45000000 },
  { month: 'T2', revenue: 52000000 },
  { month: 'T3', revenue: 48000000 },
  { month: 'T4', revenue: 61000000 },
  { month: 'T5', revenue: 55000000 },
  { month: 'T6', revenue: 67000000 },
];

const TongQuan = () => {
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = Math.round(totalRevenue / revenueData.length);
  const lastMonthRevenue = revenueData[revenueData.length - 1].revenue;
  const growth = Math.round(((lastMonthRevenue - revenueData[revenueData.length - 2].revenue) / revenueData[revenueData.length - 2].revenue) * 100);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="fade-in" style={{ marginBottom: '24px' }}>
        <Title level={3} className="page-header-heading" style={{ margin: 0 }}>
          Tổng quan
        </Title>
        <Text style={{ color: '#64748b', marginTop: '8px', display: 'block' }}>
          Thống kê doanh thu và hoạt động hệ thống
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card hover-lift fade-in-up stagger-1" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: 'none' }}>
            <Statistic
              title={<span style={{ color: '#64748b' }}>Tổng doanh thu</span>}
              value={totalRevenue}
              formatter={(value) => formatCurrency(value)}
              prefix={<DollarOutlined style={{ color: '#2563eb' }} />}
              valueStyle={{ color: '#2563eb', fontWeight: 700, fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card hover-lift fade-in-up stagger-2" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: 'none' }}>
            <Statistic
              title={<span style={{ color: '#64748b' }}>Doanh thu TB/tháng</span>}
              value={avgRevenue}
              formatter={(value) => formatCurrency(value)}
              prefix={<RiseOutlined style={{ color: '#16a34a' }} />}
              valueStyle={{ color: '#16a34a', fontWeight: 700, fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card hover-lift fade-in-up stagger-3" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: 'none' }}>
            <Statistic
              title={<span style={{ color: '#64748b' }}>Tháng này</span>}
              value={lastMonthRevenue}
              formatter={(value) => formatCurrency(value)}
              prefix={<ShoppingOutlined style={{ color: '#d97706' }} />}
              valueStyle={{ color: '#d97706', fontWeight: 700, fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card hover-lift fade-in-up stagger-4" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', border: 'none' }}>
            <Statistic
              title={<span style={{ color: '#64748b' }}>Tăng trưởng</span>}
              value={growth}
              suffix="%"
              prefix={<TeamOutlined style={{ color: '#8b5cf6' }} />}
              valueStyle={{ color: growth >= 0 ? '#16a34a' : '#dc2626', fontWeight: 700, fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue Chart */}
      <Card
        className="content-card gradient-card fade-in-up stagger-2"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <DollarOutlined style={{ color: 'white', fontSize: '20px' }} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>Biểu đồ doanh thu</div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}>6 tháng gần nhất</div>
            </div>
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                padding: '12px 16px',
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Doanh thu"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ fill: '#2563eb', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default TongQuan;

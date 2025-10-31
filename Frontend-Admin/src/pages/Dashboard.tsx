// src/routes/pages/Dashboard.tsx
import { Card, Col, Row, Typography, Statistic } from 'antd';
import { useAuthStore } from '../store/authStore';

const { Title } = Typography;

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <h1>HELLO AAAAAAAAAAAAAAAAAAAAAAAAAA</h1>
    </div>
  );
};

export default Dashboard;
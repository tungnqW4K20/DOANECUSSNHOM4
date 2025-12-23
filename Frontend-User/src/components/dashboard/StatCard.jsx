import React from 'react';
import { Card, Statistic } from 'antd';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import './StatCard.css';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

const StatCard = ({ title, value, icon, color, prefix }) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="stat-card-wrapper"
    >
      <Card className="stat-card" bordered={false}>
        <Statistic
          title={title}
          value={value}
          prefix={icon}
          valueStyle={{ color: color }}
          suffix={prefix}
        />
      </Card>
    </motion.div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.string,
  prefix: PropTypes.string
};

StatCard.defaultProps = {
  color: '#1890ff',
  icon: null,
  prefix: ''
};

export default StatCard;

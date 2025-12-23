import React from 'react';
import { Card } from 'antd';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import './ChartCard.css';

const chartVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const ChartCard = ({ title, children }) => {
  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className="chart-card-wrapper"
    >
      <Card 
        title={title} 
        className="chart-card" 
        bordered={false}
      >
        {children}
      </Card>
    </motion.div>
  );
};

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default ChartCard;

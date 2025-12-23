import React from 'react';
import { Result, Button } from 'antd';
import PropTypes from 'prop-types';
import './ErrorDisplay.css';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="error-container">
      <Result
        status="error"
        title="Không thể tải dữ liệu"
        subTitle={error || 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.'}
        extra={
          onRetry && (
            <Button type="primary" onClick={onRetry}>
              Thử lại
            </Button>
          )
        }
      />
    </div>
  );
};

ErrorDisplay.propTypes = {
  error: PropTypes.string,
  onRetry: PropTypes.func
};

ErrorDisplay.defaultProps = {
  error: null,
  onRetry: null
};

export default ErrorDisplay;

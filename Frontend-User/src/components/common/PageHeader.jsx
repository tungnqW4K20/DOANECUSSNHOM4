import { Typography } from 'antd';

const { Title } = Typography;

/**
 * PageHeader component with right-aligned actions
 * @param {string} title - Page title
 * @param {ReactNode} actions - Action buttons (search, add, etc.)
 */
const PageHeader = ({ title, actions, children }) => {
  return (
    <div className="page-header-with-actions">
      <div className="left-section">
        <Title level={2} className="page-header-heading">
          {title}
        </Title>
        {children}
      </div>
      {actions && (
        <div className="right-section">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

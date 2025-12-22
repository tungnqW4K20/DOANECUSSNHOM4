import { Input, Button, Space } from 'antd';
import { Search, Plus } from 'lucide-react';

const { Search: SearchInput } = Input;

/**
 * TableToolbar component with search and action buttons aligned right
 * @param {function} onSearch - Search handler
 * @param {function} onAdd - Add button handler
 * @param {string} addText - Add button text
 * @param {string} searchPlaceholder - Search placeholder
 * @param {ReactNode} extraActions - Additional action buttons
 */
const TableToolbar = ({ 
  onSearch, 
  onAdd, 
  addText = 'Thêm mới',
  searchPlaceholder = 'Tìm kiếm...',
  extraActions 
}) => {
  return (
    <div className="table-toolbar">
      {onSearch && (
        <SearchInput
          placeholder={searchPlaceholder}
          allowClear
          onSearch={onSearch}
          style={{ width: 300 }}
          prefix={<Search size={16} />}
        />
      )}
      <Space>
        {extraActions}
        {onAdd && (
          <Button 
            type="primary" 
            icon={<Plus size={16} />}
            onClick={onAdd}
          >
            {addText}
          </Button>
        )}
      </Space>
    </div>
  );
};

export default TableToolbar;

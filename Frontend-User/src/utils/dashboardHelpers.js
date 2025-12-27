import dayjs from 'dayjs';

/**
 * Get the last 6 months from current date
 * @returns {Array<dayjs.Dayjs>} Array of dayjs objects for the last 6 months
 */
export const getLast6Months = () => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    months.push(dayjs().subtract(i, 'month'));
  }
  return months;
};

/**
 * Format currency to Vietnamese Dong format
 * @param {number} value - The numeric value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0 ₫';
  }
  return `${value.toLocaleString('vi-VN')} ₫`;
};

/**
 * Process monthly data for import and export declarations
 * @param {Array} imports - Array of import declarations
 * @param {Array} exports - Array of export declarations
 * @returns {Array} Array of monthly data with import and export counts
 */
export const processMonthlyData = (imports = [], exports = []) => {
  const last6Months = getLast6Months();
  
  return last6Months.map(month => {
    const monthKey = month.format('MM/YYYY');
    
    const importCount = imports.filter(item => {
      if (!item.ngay_tk) return false;
      return dayjs(item.ngay_tk).format('MM/YYYY') === monthKey;
    }).length;
    
    const exportCount = exports.filter(item => {
      if (!item.ngay_tk) return false;
      return dayjs(item.ngay_tk).format('MM/YYYY') === monthKey;
    }).length;
    
    return {
      month: monthKey,
      nhap: importCount,
      xuat: exportCount
    };
  });
};

/**
 * Process inventory data to get top items by quantity
 * @param {Array} nplData - Array of raw materials (NPL) inventory
 * @param {Array} spData - Array of finished products (SP) inventory
 * @returns {Array} Top 5 inventory items sorted by quantity
 */
export const processInventoryData = (nplData = [], spData = []) => {
  const allItems = [
    ...nplData.map(item => ({
      name: item.ten_npl || item.name || 'Unknown',
      quantity: item.ton_kho || item.quantity || 0,
      type: 'NPL',
      unit_price: item.don_gia || item.unit_price || 0
    })),
    ...spData.map(item => ({
      name: item.ten_sp || item.name || 'Unknown',
      quantity: item.ton_kho || item.quantity || 0,
      type: 'SP',
      unit_price: item.don_gia || item.unit_price || 0
    }))
  ];
  
  // Sort by quantity descending and take top 5
  return allItems
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
};

/**
 * Calculate trends for import and export activities
 * @param {Array} importDeclarations - Array of import declarations
 * @param {Array} exportDeclarations - Array of export declarations
 * @param {string} timeRange - Time range: 'monthly' or 'quarterly'
 * @returns {Array} Trend data with period, import and export counts
 */
export const calculateTrends = (importDeclarations = [], exportDeclarations = [], timeRange = 'monthly') => {
  if (timeRange === 'quarterly') {
    return calculateQuarterlyTrends(importDeclarations, exportDeclarations);
  }
  
  // Default to monthly trends
  return processMonthlyData(importDeclarations, exportDeclarations);
};

/**
 * Calculate quarterly trends for import and export activities
 * @param {Array} imports - Array of import declarations
 * @param {Array} exports - Array of export declarations
 * @returns {Array} Quarterly trend data
 */
const calculateQuarterlyTrends = (imports = [], exports = []) => {
  const quarters = [];
  
  // Get last 4 quarters
  for (let i = 3; i >= 0; i--) {
    const quarterDate = dayjs().subtract(i, 'quarter');
    const quarter = quarterDate.quarter();
    const year = quarterDate.year();
    const quarterKey = `Q${quarter}/${year}`;
    
    const quarterStart = quarterDate.startOf('quarter');
    const quarterEnd = quarterDate.endOf('quarter');
    
    const importCount = imports.filter(item => {
      if (!item.ngay_tk) return false;
      const date = dayjs(item.ngay_tk);
      return date.isAfter(quarterStart) && date.isBefore(quarterEnd);
    }).length;
    
    const exportCount = exports.filter(item => {
      if (!item.ngay_tk) return false;
      const date = dayjs(item.ngay_tk);
      return date.isAfter(quarterStart) && date.isBefore(quarterEnd);
    }).length;
    
    quarters.push({
      period: quarterKey,
      nhap: importCount,
      xuat: exportCount
    });
  }
  
  return quarters;
};

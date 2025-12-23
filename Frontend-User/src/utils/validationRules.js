/**
 * Validation Rules for Forms
 * Các quy tắc validation chuyên nghiệp cho form
 */

// Validation cho các trường bắt buộc
export const requiredRule = (fieldName) => ({
  required: true,
  message: `Vui lòng nhập ${fieldName}!`
});

export const requiredSelectRule = (fieldName) => ({
  required: true,
  message: `Vui lòng chọn ${fieldName}!`
});

// Validation cho số lượng
export const quantityRules = (fieldName = 'số lượng') => [
  requiredRule(fieldName),
  {
    type: 'number',
    min: 1,
    message: `${fieldName} phải lớn hơn 0!`
  }
];

// Validation cho giá trị tiền
export const priceRules = (fieldName = 'giá trị') => [
  requiredRule(fieldName),
  {
    type: 'number',
    min: 0,
    message: `${fieldName} không được âm!`
  }
];

// Validation cho mã số thuế (10-13 ký tự số)
export const taxCodeRules = [
  requiredRule('mã số thuế'),
  {
    pattern: /^[0-9]{10,13}$/,
    message: 'Mã số thuế phải từ 10-13 chữ số!'
  }
];

// Validation cho số điện thoại
export const phoneRules = [
  requiredRule('số điện thoại'),
  {
    pattern: /^(0|\+84)[0-9]{9,10}$/,
    message: 'Số điện thoại không hợp lệ!'
  }
];

// Validation cho email
export const emailRules = [
  requiredRule('email'),
  {
    type: 'email',
    message: 'Email không hợp lệ!'
  }
];

// Validation cho mật khẩu
export const passwordRules = [
  requiredRule('mật khẩu'),
  {
    min: 6,
    message: 'Mật khẩu phải có ít nhất 6 ký tự!'
  }
];

// Validation cho tên (không chứa số và ký tự đặc biệt)
export const nameRules = (fieldName) => [
  requiredRule(fieldName),
  {
    pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
    message: `${fieldName} không được chứa số hoặc ký tự đặc biệt!`
  },
  {
    min: 2,
    message: `${fieldName} phải có ít nhất 2 ký tự!`
  }
];

// Validation cho địa chỉ
export const addressRules = [
  requiredRule('địa chỉ'),
  {
    min: 10,
    message: 'Địa chỉ phải có ít nhất 10 ký tự!'
  }
];

// Validation cho ngày tháng
export const dateRules = (fieldName = 'ngày') => [
  {
    required: true,
    message: `Vui lòng chọn ${fieldName}!`
  }
];

// Validation cho ngày không được trong quá khứ
export const futureDateRules = (fieldName = 'ngày') => [
  ...dateRules(fieldName),
  {
    validator: (_, value) => {
      if (!value) return Promise.resolve();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (value.toDate() < today) {
        return Promise.reject(new Error(`${fieldName} không được trong quá khứ!`));
      }
      return Promise.resolve();
    }
  }
];

// Validation cho ngày không được trong tương lai
export const pastDateRules = (fieldName = 'ngày') => [
  ...dateRules(fieldName),
  {
    validator: (_, value) => {
      if (!value) return Promise.resolve();
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (value.toDate() > today) {
        return Promise.reject(new Error(`${fieldName} không được trong tương lai!`));
      }
      return Promise.resolve();
    }
  }
];

// Validation cho số lượng xuất kho (không vượt quá tồn kho)
export const exportQuantityValidator = (tonKho) => ({
  validator: (_, value) => {
    if (!value) return Promise.resolve();
    if (value > tonKho) {
      return Promise.reject(new Error(`Số lượng xuất không được vượt quá tồn kho (${tonKho})!`));
    }
    if (value <= 0) {
      return Promise.reject(new Error('Số lượng xuất phải lớn hơn 0!'));
    }
    return Promise.resolve();
  }
});

// Validation cho mã hợp đồng, mã phiếu (chữ và số, không ký tự đặc biệt)
export const codeRules = (fieldName) => [
  requiredRule(fieldName),
  {
    pattern: /^[A-Z0-9/-]+$/,
    message: `${fieldName} chỉ được chứa chữ in hoa, số và dấu gạch ngang!`
  },
  {
    min: 3,
    message: `${fieldName} phải có ít nhất 3 ký tự!`
  }
];

// Validation cho URL
export const urlRules = (fieldName = 'URL') => [
  {
    type: 'url',
    message: `${fieldName} không hợp lệ!`
  }
];

// Validation cho số CMND/CCCD
export const idCardRules = [
  requiredRule('số CMND/CCCD'),
  {
    pattern: /^[0-9]{9,12}$/,
    message: 'Số CMND/CCCD phải từ 9-12 chữ số!'
  }
];

// Validation tùy chỉnh cho whitespace
export const noWhitespaceRule = {
  whitespace: true,
  message: 'Không được chỉ chứa khoảng trắng!'
};

// Validation cho độ dài tối đa
export const maxLengthRule = (max, fieldName = 'Trường này') => ({
  max,
  message: `${fieldName} không được vượt quá ${max} ký tự!`
});

// Validation cho độ dài tối thiểu
export const minLengthRule = (min, fieldName = 'Trường này') => ({
  min,
  message: `${fieldName} phải có ít nhất ${min} ký tự!`
});

// Validation cho số nguyên dương
export const positiveIntegerRules = (fieldName = 'Giá trị') => [
  {
    type: 'number',
    min: 1,
    message: `${fieldName} phải là số nguyên dương!`
  },
  {
    validator: (_, value) => {
      if (!value) return Promise.resolve();
      if (!Number.isInteger(value)) {
        return Promise.reject(new Error(`${fieldName} phải là số nguyên!`));
      }
      return Promise.resolve();
    }
  }
];

// Validation cho tỷ lệ phần trăm (0-100)
export const percentageRules = [
  requiredRule('tỷ lệ'),
  {
    type: 'number',
    min: 0,
    max: 100,
    message: 'Tỷ lệ phải từ 0 đến 100!'
  }
];

// Validation so sánh hai trường (ví dụ: confirm password)
export const confirmFieldRule = (fieldName, compareFieldName) => ({
  validator: (_, value) => {
    const form = _.field.split('.')[0];
    const compareValue = form.getFieldValue(compareFieldName);
    if (!value || compareValue === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(`${fieldName} không khớp!`));
  }
});

export default {
  requiredRule,
  requiredSelectRule,
  quantityRules,
  priceRules,
  taxCodeRules,
  phoneRules,
  emailRules,
  passwordRules,
  nameRules,
  addressRules,
  dateRules,
  futureDateRules,
  pastDateRules,
  exportQuantityValidator,
  codeRules,
  urlRules,
  idCardRules,
  noWhitespaceRule,
  maxLengthRule,
  minLengthRule,
  positiveIntegerRules,
  percentageRules,
  confirmFieldRule
};

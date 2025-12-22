# 🌙 Dark Mode - Hướng dẫn sử dụng

## ✨ Tính năng

Hệ thống Dark Mode đã được tích hợp hoàn chỉnh cho toàn bộ Admin Panel với các tính năng:

- ✅ **Chuyển đổi toàn hệ thống**: Dark mode áp dụng cho tất cả trang, components
- ✅ **Lưu trữ tự động**: Theme được lưu vào localStorage, giữ nguyên khi reload
- ✅ **Ant Design tích hợp**: Sử dụng darkAlgorithm của Ant Design
- ✅ **Smooth transition**: Chuyển đổi mượt mà giữa light và dark mode
- ✅ **Nút toggle nhanh**: Có nút toggle ở Header để chuyển đổi dễ dàng
- ✅ **Trang Settings**: Có thể chuyển đổi theme trong trang Cài đặt

## 🎨 Cách sử dụng

### 1. Toggle từ Header
- Click vào icon 💡 (bóng đèn) ở góc phải Header
- Light mode: Icon outline
- Dark mode: Icon filled màu vàng

### 2. Thay đổi trong Settings
- Vào trang **Cài đặt** (Settings)
- Chọn **Chế độ hiển thị**
- Chọn **Sáng** hoặc **Tối**

### 3. Sử dụng trong Code

```jsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  );
}
```

## 🎨 CSS Variables

Hệ thống sử dụng CSS variables để quản lý màu sắc:

### Light Mode
```css
--bg-color: #f1f5f9
--bg-white: #ffffff
--bg-card: #ffffff
--text-primary: #1e293b
--text-secondary: #64748b
--border-color: #e2e8f0
--header-bg: #ffffff
```

### Dark Mode
```css
--bg-color: #0f172a
--bg-white: #1e293b
--bg-card: #1e293b
--text-primary: #f1f5f9
--text-secondary: #94a3b8
--border-color: #334155
--header-bg: #1e293b
```

## 🔧 Cấu trúc Files

```
Frontend-Admin/
├── src/
│   ├── contexts/
│   │   └── ThemeContext.jsx          # Theme Provider & Context
│   ├── styles/
│   │   └── dark-mode.css             # Dark mode specific styles
│   ├── index.css                     # Global styles with CSS variables
│   ├── main.jsx                      # Wrap app with ThemeProvider
│   ├── components/
│   │   └── layout/
│   │       └── Header.jsx            # Theme toggle button
│   └── pages/
│       └── CaiDat.jsx                # Settings page with theme selector
```

## 🎯 Components được hỗ trợ

Tất cả Ant Design components đã được tối ưu cho dark mode:

- ✅ Layout (Header, Sidebar, Content, Footer)
- ✅ Table
- ✅ Card
- ✅ Form (Input, Select, DatePicker, etc.)
- ✅ Button
- ✅ Modal
- ✅ Drawer
- ✅ Dropdown
- ✅ Menu
- ✅ Notification
- ✅ Message
- ✅ Tooltip
- ✅ Tag
- ✅ Badge
- ✅ Statistic
- ✅ Progress
- ✅ Upload
- ✅ và tất cả components khác...

## 🎨 Tùy chỉnh màu sắc

### Thêm màu tùy chỉnh cho component

```css
/* Trong file CSS của bạn */
[data-theme="dark"] .my-component {
  background: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--border-color);
}
```

### Sử dụng inline styles với CSS variables

```jsx
<div style={{
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)'
}}>
  Content
</div>
```

## 🚀 Best Practices

1. **Luôn sử dụng CSS variables** thay vì hard-code màu sắc
2. **Test cả 2 modes** khi tạo component mới
3. **Sử dụng useTheme hook** để access theme state
4. **Tránh sử dụng màu cố định** trong inline styles
5. **Kiểm tra contrast** để đảm bảo accessibility

## 🐛 Troubleshooting

### Theme không thay đổi?
- Kiểm tra xem component có được wrap trong ThemeProvider không
- Clear localStorage và thử lại
- Kiểm tra console có lỗi không

### Màu sắc không đúng?
- Kiểm tra xem đã sử dụng CSS variables chưa
- Xem file `dark-mode.css` có được import không
- Kiểm tra specificity của CSS

### Component của bên thứ 3 không hỗ trợ dark mode?
- Thêm custom CSS trong `dark-mode.css`
- Sử dụng `[data-theme="dark"]` selector

## 📚 Tài liệu tham khảo

- [Ant Design Dark Theme](https://ant.design/docs/react/customize-theme#theme)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [React Context](https://react.dev/reference/react/useContext)

## 🎉 Kết quả

Bây giờ bạn có một hệ thống Dark Mode hoàn chỉnh:

- 🌙 Chuyển đổi mượt mà giữa light và dark mode
- 💾 Tự động lưu preference
- 🎨 Tất cả components đều hỗ trợ
- ⚡ Performance tốt
- 🔧 Dễ dàng tùy chỉnh

Enjoy your new Dark Mode! 🚀

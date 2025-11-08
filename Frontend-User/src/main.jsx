import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './index.css';
import { message } from 'antd'; 

// Tạo một component App gốc để chứa ContextHolder
const App = () => {
  // 2. Lấy contextHolder từ message.useMessage()
  const [messageApi, contextHolder] = message.useMessage(); 

  return (
    <>
      {contextHolder} {/* 3. Đặt contextHolder ở đây. Nó sẽ "lắng nghe" và hiển thị message */}
      <RouterProvider router={router} />
    </>
  );
};

// 4. Render component App mới
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
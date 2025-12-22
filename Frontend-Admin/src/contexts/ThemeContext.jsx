import { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === 'dark') {
      // Dark mode colors
      root.setAttribute('data-theme', 'dark');
      root.style.setProperty('--bg-color', '#0f172a');
      root.style.setProperty('--bg-white', '#1e293b');
      root.style.setProperty('--bg-card', '#1e293b');
      root.style.setProperty('--text-primary', '#f1f5f9');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--border-color', '#334155');
      root.style.setProperty('--header-bg', '#1e293b');
      root.style.setProperty('--sidebar-bg', 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)');
      root.style.setProperty('--table-header-bg', '#1e293b');
      root.style.setProperty('--table-row-hover', '#334155');
      root.style.setProperty('--input-bg', '#334155');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.5)');
      document.body.style.background = '#0f172a';
    } else {
      // Light mode colors
      root.setAttribute('data-theme', 'light');
      root.style.setProperty('--bg-color', '#f1f5f9');
      root.style.setProperty('--bg-white', '#ffffff');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#64748b');
      root.style.setProperty('--border-color', '#e2e8f0');
      root.style.setProperty('--header-bg', '#ffffff');
      root.style.setProperty('--sidebar-bg', 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)');
      root.style.setProperty('--table-header-bg', 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)');
      root.style.setProperty('--table-row-hover', '#eff6ff');
      root.style.setProperty('--input-bg', '#ffffff');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
      document.body.style.background = '#f1f5f9';
    }

    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Ant Design theme configuration
  const antdThemeConfig = {
    algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#2563eb',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      colorInfo: '#0ea5e9',
      borderRadius: 10,
      fontSize: 14,
      ...(theme === 'dark' ? {
        colorBgContainer: '#1e293b',
        colorBgElevated: '#1e293b',
        colorBgLayout: '#0f172a',
        colorBorder: '#334155',
        colorText: '#f1f5f9',
        colorTextSecondary: '#94a3b8',
        colorTextTertiary: '#64748b',
        colorTextQuaternary: '#475569',
      } : {}),
    },
    components: {
      Layout: {
        headerBg: theme === 'dark' ? '#1e293b' : '#ffffff',
        bodyBg: theme === 'dark' ? '#0f172a' : '#f1f5f9',
        siderBg: theme === 'dark' ? '#1e293b' : '#0f172a',
      },
      Menu: {
        darkItemBg: 'transparent',
        darkItemSelectedBg: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
        darkItemHoverBg: 'rgba(255, 255, 255, 0.1)',
      },
      Card: {
        colorBgContainer: theme === 'dark' ? '#1e293b' : '#ffffff',
      },
      Table: {
        headerBg: theme === 'dark' ? '#1e293b' : '#f8fafc',
        rowHoverBg: theme === 'dark' ? '#334155' : '#eff6ff',
      },
      Input: {
        colorBgContainer: theme === 'dark' ? '#334155' : '#ffffff',
      },
      Select: {
        colorBgContainer: theme === 'dark' ? '#334155' : '#ffffff',
      },
      Modal: {
        headerBg: theme === 'dark' ? '#1e293b' : '#2563eb',
        contentBg: theme === 'dark' ? '#1e293b' : '#ffffff',
      },
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <ConfigProvider theme={antdThemeConfig}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

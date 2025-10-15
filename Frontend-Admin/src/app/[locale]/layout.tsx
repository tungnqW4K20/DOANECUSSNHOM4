"use client"
import "@/assets/scss/_global.scss"
import type React from "react"
import AppProvider from "./AppProvider"
import { Layout, ConfigProvider, App as AntApp } from "antd"
import SiderBar from "@/modules/shared/siderbar/siderbar"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"

const { Sider, Content } = Layout

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const authPages = [
    "/vi",
    "/vi/register",
    "/vi/login",
    "/vi/home_user",
    "/vi/home_user/home_product",
    "/vi/home_user/home_trainingcouse",
    "/vi/home_user/home_research",
  ]

  const isAuthPage = authPages.includes(pathname)

  // === 🔧 Điều chỉnh kích thước Sider ===
  const siderWidth = 300          // tăng từ 240 -> 280
  const siderCollapsedWidth = 70  // tăng nhẹ khi thu gọn

  const siderStyle: React.CSSProperties = {
    position: "fixed",
    left: 0,
    top: 0,
    height: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
    transition: "all 0.3s",
    backgroundColor: "transparent",
    borderRight: "1px solid rgba(0,0,0,0.06)",
  }

  const toggleButtonStyle: React.CSSProperties = {
    position: "fixed",
    top: "20px",
    left: collapsed ? `${siderCollapsedWidth + 10}px` : `${siderWidth - 15}px`,
    zIndex: 1000,
    transition: "all 0.3s",
    background: "#fff",
    border: "1px solid #d9d9d9",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  }

  return (
    <html lang="en">
      <body style={{ margin: 0, overflow: "hidden" }}>
        <ConfigProvider>
          <AntApp>
            <AppProvider>
              <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
                {!isAuthPage && (
                  <>
                    <Sider
                      collapsed={collapsed}
                      width={siderWidth}
                      collapsedWidth={siderCollapsedWidth}
                      style={siderStyle}
                    >
                      <SiderBar collapsed={collapsed} />
                    </Sider>
                    <div
                      style={toggleButtonStyle}
                      onClick={() => setCollapsed(!collapsed)}
                    >
                      {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </div>
                  </>
                )}
                <Layout
                  style={{
                    // giảm chiều rộng content tương ứng với sider mới
                    marginLeft: isAuthPage ? 0 : collapsed ? siderCollapsedWidth + 10 : siderWidth - 20,
                    transition: "all 0.3s",
                    overflow: "auto",
                    height: "100vh",
                  }}
                >
                  <Content
                    style={{
                      padding: isAuthPage ? 0 : "24px 24px 24px 48px",
                      minHeight: "100vh",
                    }}
                  >
                    {children}
                  </Content>
                </Layout>
              </Layout>
            </AppProvider>
          </AntApp>
        </ConfigProvider>
      </body>
    </html>
  )
}

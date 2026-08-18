import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, Dropdown, Avatar, Space, Badge, Breadcrumb, Typography } from 'antd';
import {
    MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BookOutlined,
    LogoutOutlined, DashboardOutlined, BellOutlined, SettingOutlined
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

export default function AdminDashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const username = localStorage.getItem('username') || 'Admin';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth', { replace: true });
    };

    const userMenu = {
        items: [
            { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân' },
            { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt hệ thống' },
            { type: 'divider' },
            { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', onClick: handleLogout, danger: true },
        ],
    };

    const breadcrumbMap = {
        '/admin': 'Tổng quan',
        '/admin/users': 'Quản lý Tài khoản',
        '/admin/classes': 'Quản lý Lớp học',
    };
    
    // [ĐÃ FIX LỖI MENU] - Sắp xếp đường dẫn từ dài đến ngắn để kiểm tra chính xác tuyệt đối
    const sortedPaths = Object.keys(breadcrumbMap).sort((a, b) => b.length - a.length);
    const currentPath = sortedPaths.find(path => location.pathname.startsWith(path)) || '/admin';
    const currentTitle = breadcrumbMap[currentPath] || 'Tổng quan';

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={260} 
                style={{ boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)', zIndex: 10, overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0 }}>
                <div style={{ 
                    height: 48, margin: '16px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: collapsed ? 16 : 22, fontWeight: '800', letterSpacing: '1.5px', transition: 'all 0.3s ease', overflow: 'hidden', whiteSpace: 'nowrap', cursor: 'pointer'
                }} onClick={() => navigate('/admin')}>
                    {collapsed ? 'LMS' : 'EDUSYSTEM'}
                </div>
                <Menu theme="dark" mode="inline" selectedKeys={[currentPath]} style={{ borderRight: 0, padding: '0 8px' }}
                    items={[
                        { key: '/admin', icon: <DashboardOutlined />, label: 'Tổng quan', onClick: () => navigate('/admin') },
                        { key: '/admin/users', icon: <UserOutlined />, label: 'Quản lý Tài khoản', onClick: () => navigate('/admin/users') },
                        { key: '/admin/classes', icon: <BookOutlined />, label: 'Quản lý Lớp học', onClick: () => navigate('/admin/classes') },
                    ]}
                />
            </Sider>

            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '24px', boxShadow: '0 1px 4px rgba(0,21,41,.08)', position: 'sticky', top: 0, zIndex: 9, height: 64, lineHeight: '64px' }}>
                    <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} style={{ fontSize: '18px', width: 64, height: 64, transition: 'color 0.3s' }} />
                    <Space size="large" align="center">
                        <Badge count={5} size="small" offset={[-2, 6]}>
                            <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: '20px', color: '#555' }}/>} />
                        </Badge>
                        <Dropdown menu={userMenu} placement="bottomRight" arrow trigger={['click']}>
                            <Space style={{ cursor: 'pointer', padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center' }}>
                                <Avatar style={{ backgroundColor: '#1890ff', verticalAlign: 'middle' }} icon={<UserOutlined />} />
                                <Text strong style={{ fontSize: '14px', color: '#333' }}>{username}</Text>
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>

                <Content style={{ margin: '24px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        
                        <Breadcrumb items={[{ title: 'Admin' }, { title: currentTitle }]} />
                    </div>
                    {/* KHU VỰC OUTLET */}
                    <div style={{ padding: 0, background: 'transparent', borderRadius: borderRadiusLG, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Outlet /> 
                    </div>
                </Content>
                
                <Footer style={{ textAlign: 'center', color: '#8c8c8c', padding: '16px 50px', fontSize: '13px' }}>
                    EduSystem (XDPM-OOP) ©{new Date().getFullYear()} Created with Ant Design
                </Footer>
            </Layout>
        </Layout>
    );
}
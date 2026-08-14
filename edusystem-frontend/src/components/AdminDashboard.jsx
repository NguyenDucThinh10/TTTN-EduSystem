import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Layout, Menu, Space, theme } from 'antd';
import {
    BellOutlined,
    BookOutlined,
    DashboardOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReadOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;

const breadcrumbMap = {
    '/admin': 'Tổng quan',
    '/admin/users': 'Quản lý Tài khoản',
    '/admin/courses': 'Quản lý Học phần',
    '/admin/classes': 'Quản lý Lớp học',
};

export default function AdminDashboard({ onLogout }) {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const username = localStorage.getItem('username') || 'Admin';
    const currentTitle = breadcrumbMap[location.pathname] || 'Tổng quan';

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
            return;
        }

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('user');
        navigate('/');
    };

    const userMenu = {
        items: [
            { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân' },
            { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt hệ thống' },
            { type: 'divider' },
            { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', onClick: handleLogout, danger: true },
        ],
    };

    const menuItems = [
        { key: '/admin', icon: <DashboardOutlined />, label: 'Tổng quan', onClick: () => navigate('/admin') },
        { key: '/admin/users', icon: <UserOutlined />, label: 'Quản lý Tài khoản', onClick: () => navigate('/admin/users') },
        { key: '/admin/courses', icon: <ReadOutlined />, label: 'Quản lý Học phần', onClick: () => navigate('/admin/courses') },
        { key: '/admin/classes', icon: <BookOutlined />, label: 'Quản lý Lớp học', onClick: () => navigate('/admin/classes') },
    ];

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={250} style={{ boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)', zIndex: 10 }}>
                <div style={{
                    height: 48,
                    margin: '16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: collapsed ? 16 : 20,
                    fontWeight: '800',
                    letterSpacing: '1px',
                    transition: 'all 0.3s',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                }}>
                    {collapsed ? 'LMS' : 'EDUSYSTEM'}
                </div>
                <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
            </Sider>

            <Layout>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingRight: '24px',
                    boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                    zIndex: 1,
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '18px', width: 64, height: 64 }}
                    />

                    <Space size="large">
                        <Badge count={0} size="small">
                            <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: '18px', color: '#555' }} />} />
                        </Badge>
                        <Dropdown menu={userMenu} placement="bottomRight" arrow>
                            <Space style={{ cursor: 'pointer', padding: '0 8px' }}>
                                <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
                                <span style={{ fontWeight: 500, fontSize: '14px', color: '#333' }}>{username}</span>
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>

                <Content style={{ margin: '24px 24px 0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#1f1f1f' }}>
                            {currentTitle}
                        </h2>
                        <Breadcrumb items={[{ title: 'Admin' }, { title: currentTitle }]} />
                    </div>

                    <div style={{
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        flex: 1,
                    }}>
                        <Outlet />
                    </div>
                </Content>

                <Footer style={{ textAlign: 'center', color: '#888', padding: '16px 50px' }}>
                    EduSystem ©{new Date().getFullYear()} Created with Ant Design
                </Footer>
            </Layout>
        </Layout>
    );
}

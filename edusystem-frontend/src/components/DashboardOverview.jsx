import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Button, Space, message, Spin } from 'antd';
import { 
    TeamOutlined, UserOutlined, BookOutlined, ReadOutlined, 
    PlusCircleOutlined, UserAddOutlined, SettingOutlined 
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

export default function DashboardOverview() {
    const [loading, setLoading] = useState(true);
    
    // State lưu các con số thực tế
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        ongoingClasses: 0,
        totalCourses: 0
    });

    // State lưu dữ liệu thực tế cho Biểu đồ
    const [chartData, setChartData] = useState({
        bar: [],
        pie: []
    });

    const COLORS = ['#00C49F', '#FF8042'];

    // Kéo dữ liệu TỪ CÁC API ĐÃ HOẠT ĐỘNG TỐT thay vì dùng API đếm của Backend
    useEffect(() => {
        const fetchRealData = async () => {
            try {
                // Gọi 3 API đã hoạt động hoàn hảo ở trang Quản lý
                const [userRes, classRes, courseRes] = await Promise.all([
                    axiosClient.get('/api/admin/users?size=1000'),
                    axiosClient.get('/api/admin/classes'),
                    axiosClient.get('/api/admin/courses')
                ]);

                // Xử lý bóc tách data
                const users = userRes.content || userRes || [];
                const classes = Array.isArray(classRes) ? classRes : (classRes.content || []);
                const courses = Array.isArray(courseRes) ? courseRes : (courseRes.content || []);

                // 1. TÍNH TOÁN KPIs THỰC TẾ
                const students = users.filter(u => u.role === 'STUDENT' && u.status === 'ACTIVE');
                const teachers = users.filter(u => u.role === 'TEACHER' && u.status === 'ACTIVE');
                const ongoing = classes.filter(c => c.status === 'ONGOING');

                setStats({
                    totalStudents: students.length,
                    totalTeachers: teachers.length,
                    ongoingClasses: ongoing.length,
                    totalCourses: courses.length
                });

                // 2. TẠO DATA THỰC CHO BIỂU ĐỒ TRÒN (Tỉ lệ trạng thái lớp học)
                const ended = classes.filter(c => c.status !== 'ONGOING');
                setChartData(prev => ({
                    ...prev,
                    pie: [
                        { name: 'Đang diễn ra', value: ongoing.length },
                        { name: 'Đã kết thúc', value: ended.length }
                    ]
                }));

                // 3. TẠO DATA THỰC CHO BIỂU ĐỒ CỘT (Số lượng lớp học theo từng học kỳ)
                const semesterCount = {};
                classes.forEach(c => {
                    const sem = c.semester || 'Chưa phân bổ';
                    semesterCount[sem] = (semesterCount[sem] || 0) + 1;
                });
                
                const barChartData = Object.keys(semesterCount).map(key => ({
                    name: key,
                    classesCount: semesterCount[key]
                }));

                setChartData(prev => ({ ...prev, bar: barChartData }));

            } catch (error) {
                console.error("Lỗi lấy dữ liệu:", error);
                message.error("Không thể tải dữ liệu thống kê từ hệ thống!");
            } finally {
                setLoading(false);
            }
        };

        fetchRealData();
    }, []);

    // Style dùng chung
    const cardStyle = { borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
    const iconWrapperStyle = (bgColor, color) => ({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: '56px', height: '56px', borderRadius: '50%',
        backgroundColor: bgColor, color: color, fontSize: '24px'
    });

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" tip="Đang tải dữ liệu tổng quan..." /></div>;
    }

    return (
        <div style={{ padding: '0 10px' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>Tổng quan hệ thống</Title>
                <Text type="secondary">Dữ liệu được cập nhật theo thời gian thực từ cơ sở dữ liệu.</Text>
            </div>

            {/* HÀNG 1: 4 THẺ THỐNG KÊ (KPIs) */}
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Statistic title="Tổng Sinh Viên" value={stats.totalStudents} valueStyle={{ fontWeight: 'bold', fontSize: '28px' }} />
                            <div style={iconWrapperStyle('#e6f7ff', '#1890ff')}><TeamOutlined /></div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Statistic title="Tổng Giảng Viên" value={stats.totalTeachers} valueStyle={{ fontWeight: 'bold', fontSize: '28px' }} />
                            <div style={iconWrapperStyle('#f6ffed', '#52c41a')}><UserOutlined /></div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Statistic title="Lớp Học Đang Mở" value={stats.ongoingClasses} valueStyle={{ fontWeight: 'bold', fontSize: '28px' }} />
                            <div style={iconWrapperStyle('#fff7e6', '#fa8c16')}><ReadOutlined /></div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Statistic title="Học Phần (Môn học)" value={stats.totalCourses} valueStyle={{ fontWeight: 'bold', fontSize: '28px' }} />
                            <div style={iconWrapperStyle('#f9f0ff', '#722ed1')}><BookOutlined /></div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* HÀNG 2: BIỂU ĐỒ VÀ QUICK ACTIONS */}
            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                {/* Cột 1: Biểu đồ cột (Số lượng Lớp học theo Học kỳ) */}
                <Col xs={24} lg={16}>
                    <Card title="Thống kê Lớp học mở theo Học kỳ" bordered={false} style={{ ...cardStyle, height: '100%' }}>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData.bar} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip cursor={{ fill: '#f5f5f5' }} />
                                    <Bar dataKey="classesCount" fill="#1890ff" radius={[4, 4, 0, 0]} barSize={50} name="Số lượng Lớp" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                {/* Cột 2: Quick Actions & Biểu đồ tròn */}
                <Col xs={24} lg={8}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        
                        {/* Biểu đồ Trạng thái lớp học */}
                        <Card title="Tỉ lệ Trạng thái Lớp học" bordered={false} style={cardStyle}>
                            <div style={{ width: '100%', height: 180 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={chartData.pie} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {chartData.pie.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="middle" align="right" layout="vertical" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Truy cập nhanh */}
                        <Card title="Truy cập nhanh" bordered={false} style={cardStyle}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button type="dashed" block icon={<PlusCircleOutlined />} size="large" style={{ textAlign: 'left' }} href="/admin/classes">
                                    Quản lý Lớp học
                                </Button>
                                <Button type="dashed" block icon={<UserAddOutlined />} size="large" style={{ textAlign: 'left' }} href="/admin/users">
                                    Quản lý Người dùng
                                </Button>
                                <Button type="dashed" block icon={<SettingOutlined />} size="large" style={{ textAlign: 'left' }}>
                                    Cài đặt hệ thống
                                </Button>
                            </Space>
                        </Card>

                    </Space>
                </Col>
            </Row>
        </div>
    );
}
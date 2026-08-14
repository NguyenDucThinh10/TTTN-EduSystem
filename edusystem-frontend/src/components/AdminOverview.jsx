import { useEffect, useState } from 'react';
import { Alert, Card, Col, Row, Statistic } from 'antd';
import {
    AuditOutlined,
    BookOutlined,
    CheckCircleOutlined,
    FileDoneOutlined,
    ReadOutlined,
    SolutionOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const stats = [
    { key: 'totalUsers', title: 'Tổng tài khoản', icon: <UserOutlined /> },
    { key: 'totalStudents', title: 'Sinh viên', icon: <TeamOutlined /> },
    { key: 'totalTeachers', title: 'Giảng viên', icon: <SolutionOutlined /> },
    { key: 'totalCourses', title: 'Học phần', icon: <ReadOutlined /> },
    { key: 'totalClasses', title: 'Lớp học', icon: <BookOutlined /> },
    { key: 'totalAssignments', title: 'Bài tập', icon: <AuditOutlined /> },
    { key: 'totalSubmissions', title: 'Bài nộp', icon: <FileDoneOutlined /> },
    { key: 'totalGradedSubmissions', title: 'Đã chấm', icon: <CheckCircleOutlined /> },
];

export default function AdminOverview() {
    const [dashboard, setDashboard] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await axiosClient.get('/api/admin/dashboard');
                setDashboard(data || {});
            } catch (err) {
                console.error(err);
                setError('Không thể tải số liệu tổng quan.');
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    return (
        <div>
            {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
            <Row gutter={[16, 16]}>
                {stats.map((item) => (
                    <Col xs={24} sm={12} lg={6} key={item.key}>
                        <Card loading={loading} bordered>
                            <Statistic
                                title={item.title}
                                value={dashboard[item.key] ?? 0}
                                prefix={item.icon}
                                valueStyle={{ color: '#1677ff', fontWeight: 700 }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

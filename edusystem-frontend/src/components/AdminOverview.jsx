import { useEffect, useState } from 'react';
import { Alert, Spin } from 'antd';
import axiosClient from '../api/axiosClient';
import { AdminDashboardOverview } from './DashboardOverview';
import '../styles/roleDashboard.css';

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

    if (loading && !Object.keys(dashboard).length) return <div className="dashboard-loading"><Spin size="large" /></div>;
    return <div>{error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}<AdminDashboardOverview dashboard={dashboard} /></div>;
}

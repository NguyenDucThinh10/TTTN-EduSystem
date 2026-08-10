import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Hàm gọi API lấy danh sách user từ Backend
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/api/admin/users');
            
            setUsers(response.content || []); 
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
            message.error("Không thể tải danh sách người dùng!");
        } finally {
            setLoading(false);
        }
    };

    // Chạy hàm fetchUsers ngay khi component vừa được render lần đầu
    useEffect(() => {
        fetchUsers();
    }, []);

    // Cấu hình các cột cho bảng
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '80px',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                let color = role === 'ADMIN' ? 'red' : role === 'TEACHER' ? 'green' : 'blue';
                return <Tag color={color}>{role}</Tag>;
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'ACTIVE' ? 'success' : 'error'}>
                    {status}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" ghost icon={<EditOutlined />}>Sửa</Button>
                    <Button danger icon={<DeleteOutlined />}>Khóa</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Danh sách tài khoản</h3>
                <Button type="primary" icon={<PlusOutlined />}>Thêm người dùng</Button>
            </div>
            <Table 
                columns={columns} 
                dataSource={users} 
                rowKey="id" 
                loading={loading}
                bordered
                pagination={{ pageSize: 8 }} // Tự động phân trang 8 dòng/trang
            />
        </div>
    );
}
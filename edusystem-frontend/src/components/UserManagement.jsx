import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message, Modal, Form, Input, Select, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UnlockOutlined, SearchOutlined } from '@ant-design/icons'; 
import axiosClient from '../api/axiosClient';
import FileUpload from './FileUpload';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- BỔ SUNG STATE CHO TÌM KIẾM ---
    const [searchText, setSearchText] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/api/admin/users?size=2000');
            setUsers(response.content || []); 
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
            message.error("Không thể tải danh sách người dùng!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showAddModal = () => {
        setEditingUser(null);
        form.resetFields(); 
        setIsModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingUser(record);
        form.setFieldsValue({
            username: record.username,
            fullName: record.fullName,
            email: record.email,
            role: record.role,
        });
        setIsModalVisible(true);
    };

    const handleModalSubmit = async (values) => {
        try {
            if (editingUser) {
                await axiosClient.put(`/api/admin/users/${editingUser.id}`, values);
                message.success("Cập nhật thông tin thành công!");
            } else {
                await axiosClient.post('/api/admin/users', values);
                message.success("Thêm người dùng mới thành công!");
            }
            setIsModalVisible(false);
            fetchUsers(); 
        } catch (error) {
            console.error("Lỗi từ Server:", error.response?.data);
            const errorMessage = error.response?.data?.message 
                              || (typeof error.response?.data === 'string' ? error.response.data : null) 
                              || "Có lỗi xảy ra từ hệ thống, vui lòng thử lại!";
            message.error(errorMessage);
        }
    };

    const handleToggleStatus = async (record) => {
        try {
            const newStatus = record.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
            await axiosClient.put(`/api/admin/users/${record.id}/status`, { status: newStatus });
            message.success(`Đã ${newStatus === 'ACTIVE' ? 'mở khóa' : 'khóa'} tài khoản thành công!`);
            fetchUsers(); 
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi thay đổi trạng thái!");
        }
    };

    // --- LOGIC TÌM KIẾM (BỘ LỌC) ---
    // Mảng này sẽ tự động thay đổi mỗi khi bạn gõ phím vào ô Search
    const filteredUsers = users.filter(user => {
        const keyword = searchText.toLowerCase();
        return (
            (user.username && user.username.toLowerCase().includes(keyword)) ||
            (user.fullName && user.fullName.toLowerCase().includes(keyword))
        );
    });

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: '80px' },
        { title: 'Username', dataIndex: 'username', key: 'username', render: (text) => <strong>{text}</strong> },
        { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
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
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => showEditModal(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title={`Bạn có chắc muốn ${record.status === 'ACTIVE' ? 'khóa' : 'mở khóa'} tài khoản này?`}
                        onConfirm={() => handleToggleStatus(record)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button 
                            danger={record.status === 'ACTIVE'} 
                            type={record.status === 'BLOCKED' ? 'dashed' : 'default'}
                            icon={record.status === 'ACTIVE' ? <DeleteOutlined /> : <UnlockOutlined />}
                        >
                            {record.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Thanh công cụ: Tiêu đề - Thanh tìm kiếm - Các nút chức năng */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', minWidth: '200px' }}>Danh sách tài khoản</h3>
                
                {/* GIAO DIỆN THANH TÌM KIẾM */}
                <Input.Search
                    placeholder="Tìm kiếm Username hoặc Họ tên..."
                    allowClear
                    enterButton={<Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>}
                    size="large"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ maxWidth: '400px', flex: 1 }}
                />

                <Space>
                    <FileUpload 
                        buttonText="Import Excel" 
                        accept=".xlsx, .xls" 
                        uploadUrl="/api/admin/users/import" 
                        onUploadSuccess={() => {
                            message.success("Import danh sách sinh viên thành công!");
                            fetchUsers(); 
                        }} 
                    />
                    <Button type="primary" size="large" icon={<PlusOutlined />} onClick={showAddModal}>
                        Thêm người dùng
                    </Button>
                </Space>
            </div>
            
            <Table 
                columns={columns} 
                // Thay dataSource={users} thành dataSource={filteredUsers}
                dataSource={filteredUsers} 
                rowKey="id" 
                loading={loading}
                bordered
                pagination={{ pageSize: 8 }} 
            />

            <Modal
                title={editingUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" onFinish={handleModalSubmit}>
                    <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}>
                        <Input disabled={!!editingUser} /> 
                    </Form.Item>
                    
                    <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập Họ và tên!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập Email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item 
                        name="password" 
                        label="Mật khẩu" 
                        rules={[{ required: !editingUser, message: 'Vui lòng nhập Mật khẩu!' }]}
                        help={editingUser ? "Để trống nếu không muốn đổi mật khẩu" : ""}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
                        <Select placeholder="Chọn vai trò">
                            <Select.Option value="STUDENT">Học viên</Select.Option>
                            <Select.Option value="TEACHER">Giảng viên</Select.Option>
                            <Select.Option value="ADMIN">Quản trị viên</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message, Modal, Form, Input, Select, Popconfirm } from 'antd'; // Bổ sung thư viện
import { EditOutlined, DeleteOutlined, PlusOutlined, UnlockOutlined } from '@ant-design/icons'; // Bổ sung Icon
import axiosClient from '../api/axiosClient';
import FileUpload from './FileUpload';
export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- BỔ SUNG STATE CHO MODAL THÊM/SỬA ---
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    // Hàm gọi API lấy danh sách user từ Backend
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

    // Chạy hàm fetchUsers ngay khi component vừa được render lần đầu
    useEffect(() => {
        fetchUsers();
    }, []);

    // --- BỔ SUNG: CÁC HÀM XỬ LÝ SỰ KIỆN THÊM, SỬA, KHÓA ---

    // 1. Mở Modal Thêm mới
    const showAddModal = () => {
        setEditingUser(null);
        form.resetFields(); // Làm sạch form
        setIsModalVisible(true);
    };

    // 2. Mở Modal Sửa
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

    // 3. Xử lý Gửi Form (Thêm hoặc Sửa)
    const handleModalSubmit = async (values) => {
        try {
            if (editingUser) {
                // Sửa người dùng
                await axiosClient.put(`/api/admin/users/${editingUser.id}`, values);
                message.success("Cập nhật thông tin thành công!");
            } else {
                // Thêm mới người dùng
                await axiosClient.post('/api/admin/users', values);
                message.success("Thêm người dùng mới thành công!");
            }
            setIsModalVisible(false);
            fetchUsers(); // Tải lại bảng dữ liệu
        } catch (error) {
            console.error("Lỗi từ Server:", error.response?.data);
            
            // SỬA LỖI ĐÓNG BĂNG Ở ĐÂY: Bóc tách chính xác chuỗi thông báo lỗi từ Spring Boot
            const errorMessage = error.response?.data?.message 
                              || (typeof error.response?.data === 'string' ? error.response.data : null) 
                              || "Có lỗi xảy ra từ hệ thống, vui lòng thử lại!";
            
            message.error(errorMessage);
        }
    };

    // 4. Xử lý Khóa / Mở Khóa tài khoản
    const handleToggleStatus = async (record) => {
        try {
            // Xác định trạng thái mới sẽ gửi xuống Backend
            const newStatus = record.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
            
            await axiosClient.put(`/api/admin/users/${record.id}/status`, { status: newStatus });
            message.success(`Đã ${newStatus === 'ACTIVE' ? 'mở khóa' : 'khóa'} tài khoản thành công!`);
            fetchUsers(); // Tải lại bảng dữ liệu
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi thay đổi trạng thái!");
        }
    };

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
                    {/* Gắn sự kiện showEditModal vào nút Sửa */}
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => showEditModal(record)}>
                        Sửa
                    </Button>
                    
                    {/* Thay nút Khóa cứng bằng Popconfirm xác nhận Khóa/Mở khóa */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Danh sách tài khoản</h3>
                    <FileUpload 
                        buttonText="Import Excel" 
                        accept=".xlsx, .xls" 
                        uploadUrl="/api/admin/users/import" // Trỏ đúng vào API import vừa tạo
                        onUploadSuccess={() => {
                            message.success("Import danh sách sinh viên thành công!");
                            fetchUsers(); // Tự động load lại bảng để thấy 100 SV mới
                        }} 
                    />
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                    Thêm người dùng
                </Button>
            </div>
            
            <Table 
                columns={columns} 
                dataSource={users} 
                rowKey="id" 
                loading={loading}
                bordered
                pagination={{ pageSize: 8 }} 
            />

            {/* --- KHỐI GIAO DIỆN MODAL FORM --- */}
            <Modal
                title={editingUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" onFinish={handleModalSubmit}>
                    <Form.Item 
                        name="username" 
                        label="Username" 
                        rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}
                    >
                        {/* Không cho phép đổi Username khi đang ở chế độ Sửa */}
                        <Input disabled={!!editingUser} /> 
                    </Form.Item>
                    
                    <Form.Item 
                        name="fullName" 
                        label="Họ và tên" 
                        rules={[{ required: true, message: 'Vui lòng nhập Họ và tên!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item 
                        name="email" 
                        label="Email" 
                        rules={[
                            { required: true, message: 'Vui lòng nhập Email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item 
                        name="password" 
                        label="Mật khẩu" 
                        // Bắt buộc nhập mật khẩu khi thêm mới. Khi sửa thì không bắt buộc (chỉ nhập khi muốn đổi)
                        rules={[{ required: !editingUser, message: 'Vui lòng nhập Mật khẩu!' }]}
                        help={editingUser ? "Để trống nếu không muốn đổi mật khẩu" : ""}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item 
                        name="role" 
                        label="Vai trò" 
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
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
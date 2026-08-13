import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message, Modal, Select, Typography, Card, Tooltip, Form, Input } from 'antd';
import { TeamOutlined, PlusOutlined, BookOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import FileUpload from './FileUpload';
const { Title, Text } = Typography;
const { Option } = Select;

export default function ClassManagement() {
    // === STATES ===
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    // States cho Modal Ghi danh (Enroll)
    const [isEnrollModalVisible, setIsEnrollModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [submittingEnroll, setSubmittingEnroll] = useState(false);

    // States cho Modal Tạo lớp học (Create Class)
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [submittingCreate, setSubmittingCreate] = useState(false);
    const [form] = Form.useForm(); // Hook của Ant Design để quản lý Form

    // === FETCH DATA ===
    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Tải danh sách lớp học
            const classRes = await axiosClient.get('/api/admin/classes');
            setClasses(Array.isArray(classRes) ? classRes : (classRes.content || []));

            // 2. Tải danh sách Users (Lọc ra Sinh viên và Giảng viên)
            const userRes = await axiosClient.get('/api/admin/users?size=1000');
            const allUsers = userRes.content || userRes || [];
            setStudents(allUsers.filter(u => u.role === 'STUDENT' && u.status === 'ACTIVE'));
            setTeachers(allUsers.filter(u => u.role === 'TEACHER' && u.status === 'ACTIVE'));

            // 3. Tải danh sách Môn học (Phục vụ cho việc chọn môn khi tạo lớp)
            // Lưu ý: Đảm bảo Backend của bạn đã có API GET /api/admin/courses
            const courseRes = await axiosClient.get('/api/admin/courses');
            setCourses(Array.isArray(courseRes) ? courseRes : (courseRes.content || []));

        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            message.error("Có lỗi xảy ra khi tải dữ liệu từ máy chủ!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // === HANDLERS CHO TẠO LỚP HỌC ===
    const showCreateModal = () => {
        form.resetFields(); // Xóa trắng form cũ
        setIsCreateModalVisible(true);
    };

    const handleCreateSubmit = async () => {
        try {
            // Validate dữ liệu từ Form
            const values = await form.validateFields();
            setSubmittingCreate(true);
            
            // Gọi API tạo lớp (Endpoint bạn đã viết ở AdminClassController)
            await axiosClient.post('/api/admin/classes', values);
            message.success('Tạo lớp học mới thành công!');
            
            setIsCreateModalVisible(false);
            fetchData(); // Tải lại bảng danh sách lớp
        } catch (error) {
            if (error.errorFields) return; // Lỗi do chưa nhập đủ form
            console.error("Lỗi tạo lớp:", error);
            message.error(error.response?.data || "Lỗi khi tạo lớp học!");
        } finally {
            setSubmittingCreate(false);
        }
    };

    // === HANDLERS CHO GHI DANH ===
    const showEnrollModal = (record) => {
        setSelectedClass(record);
        setSelectedStudentIds([]);
        setIsEnrollModalVisible(true);
    };

    const handleEnrollSubmit = async () => {
        if (selectedStudentIds.length === 0) {
            message.warning("Vui lòng chọn ít nhất 1 sinh viên!");
            return;
        }
        setSubmittingEnroll(true);
        try {
            await axiosClient.post(`/api/admin/classes/${selectedClass.id}/enroll`, selectedStudentIds);
            message.success(`Đã thêm thành công ${selectedStudentIds.length} sinh viên vào lớp!`);
            setIsEnrollModalVisible(false);
        } catch (error) {
            console.error("Lỗi ghi danh:", error);
            message.error(error.response?.data?.message || "Có lỗi xảy ra khi ghi danh!");
        } finally {
            setSubmittingEnroll(false);
        }
    };

    // === CẤU HÌNH TABLE ===
    const columns = [
        { title: 'Mã', dataIndex: 'id', width: '60px', render: (id) => <Text type="secondary">#{id}</Text> },
        { title: 'Tên Lớp Học', dataIndex: 'name', render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text> },
        { title: 'Học Phần (Môn học)', dataIndex: 'courseTitle', render: (course) => <Tag icon={<BookOutlined />} color="cyan">{course || 'Chưa có'}</Tag> },
        { title: 'Giảng viên', dataIndex: 'teacherName', render: (teacher) => <Text strong>{teacher || 'Chưa phân công'}</Text> },
        { title: 'Học kỳ', dataIndex: 'semester' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={status === 'ONGOING' ? 'green' : 'default'} style={{ borderRadius: '12px', padding: '0 10px' }}>
                    {status === 'ONGOING' ? 'Đang diễn ra' : 'Đã kết thúc'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Thêm sinh viên vào lớp này">
                        <Button type="primary" icon={<TeamOutlined />} onClick={() => showEnrollModal(record)}>
                            Ghi danh
                        </Button>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Quản lý Lớp học</Title>
                    <Text type="secondary">Quản lý danh sách lớp, môn học và phân bổ sinh viên</Text>
                </div>
                {/* NÚT TẠO LỚP HỌC ĐÃ ĐƯỢC GẮN SỰ KIỆN onClick */}
                <Button type="primary" icon={<PlusOutlined />} size="large" style={{ borderRadius: '8px' }} onClick={showCreateModal}>
                    Tạo lớp học mới
                </Button>
            </div>
            
            <Table 
                columns={columns} 
                dataSource={classes} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 7, position: ['bottomCenter'] }} 
            />

            {/* MODAL 1: TẠO LỚP HỌC MỚI */}
            <Modal
                title="Tạo Lớp Học Mới"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={handleCreateSubmit}
                confirmLoading={submittingCreate}
                okText="Tạo lớp"
                cancelText="Hủy"
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Form.Item 
                        name="name" 
                        label="Tên lớp học" 
                        rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}
                    >
                        <Input placeholder="VD: Toán Cao Cấp - Nhóm 01" />
                    </Form.Item>

                    <Form.Item 
                        name="courseId" 
                        label="Môn học (Học phần)" 
                        rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
                    >
                        <Select placeholder="-- Chọn môn học --" showSearch optionFilterProp="children">
                            {courses.map(course => (
                                <Option key={course.id} value={course.id}>{course.title} ({course.code})</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item 
                        name="teacherId" 
                        label="Giảng viên phụ trách" 
                        rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
                    >
                        <Select placeholder="-- Chọn giảng viên --" showSearch optionFilterProp="children">
                            {teachers.map(tc => (
                                <Option key={tc.id} value={tc.id}>{tc.fullName || tc.username}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item 
                        name="semester" 
                        label="Học kỳ" 
                        rules={[{ required: true, message: 'Vui lòng nhập học kỳ!' }]}
                        initialValue="Học kỳ 1 - 2024"
                    >
                        <Input placeholder="VD: Học kỳ 1 - 2024" />
                    </Form.Item>

                    <Form.Item 
                        name="status" 
                        label="Trạng thái" 
                        initialValue="ONGOING"
                    >
                        <Select>
                            <Option value="ONGOING">Đang diễn ra</Option>
                            <Option value="ENDED">Đã kết thúc</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* MODAL 2: GHI DANH SINH VIÊN */}
{/* MODAL 2: GHI DANH SINH VIÊN */}
            <Modal
                title={<Space><TeamOutlined style={{ color: '#1890ff' }}/><span>Ghi danh sinh viên - Lớp <Text type="danger">{selectedClass?.name}</Text></span></Space>}
                open={isEnrollModalVisible}
                onCancel={() => setIsEnrollModalVisible(false)}
                onOk={handleEnrollSubmit}
                confirmLoading={submittingEnroll}
                okText="Xác nhận (Thêm tay)"
                cancelText="Đóng"
                width={600}
                destroyOnHidden
            >
                <div style={{ padding: '20px 0' }}>
                    {/* KHU VỰC THÊM HÀNG LOẠT BẰNG EXCEL */}
                    <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '24px' }}>
                        <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1890ff' }}>
                            Cách 1: Nhập hàng loạt từ file Excel (.xlsx)
                        </Text>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '12px', fontSize: '13px' }}>
                            File Excel chỉ cần 1 cột đầu tiên chứa Mã sinh viên (Username).
                        </Text>
                        
                        {/* Gọi Component FileUpload mà bạn đã cất công xây dựng */}
                        <FileUpload 
                            buttonText="Tải lên danh sách Excel" 
                            accept=".xlsx, .xls" 
                            // Truyền ID lớp học động vào URL
                            uploadUrl={`/api/admin/classes/${selectedClass?.id}/enroll/excel`} 
                            onUploadSuccess={() => {
                                message.success("Đã ghi danh toàn bộ sinh viên trong file Excel vào lớp!");
                                setIsEnrollModalVisible(false); // Đóng modal khi xong
                            }} 
                        />
                    </div>

                    {/* KHU VỰC THÊM TAY (CODE CŨ GIỮ NGUYÊN) */}
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                        Cách 2: Tìm kiếm và chọn sinh viên thủ công
                    </Text>
                    <Select
                        mode="multiple"
                        allowClear
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="Gõ mã SV hoặc tên để tìm..."
                        value={selectedStudentIds}
                        onChange={(values) => setSelectedStudentIds(values)}
                        options={students.map(sv => ({ value: sv.id, label: `${sv.username} - ${sv.fullName}` }))}
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    />
                </div>
            </Modal>
        </Card>
    );
}
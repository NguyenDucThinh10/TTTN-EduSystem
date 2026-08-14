/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { BookOutlined, DeleteOutlined, EditOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import axiosClient from '../api/axiosClient';
import FileUpload from './FileUpload';

const { Title, Text } = Typography;
const { Option } = Select;

export default function ClassManagement() {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [classStudents, setClassStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEnrollModalVisible, setIsEnrollModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isStudentsModalVisible, setIsStudentsModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [editingClass, setEditingClass] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [classRes, userRes, courseRes] = await Promise.all([
                axiosClient.get('/api/admin/classes'),
                axiosClient.get('/api/admin/users?size=1000'),
                axiosClient.get('/api/admin/courses'),
            ]);
            const allUsers = userRes.content || userRes || [];
            setClasses(Array.isArray(classRes) ? classRes : (classRes.content || []));
            setStudents(allUsers.filter((user) => user.role === 'STUDENT' && user.status === 'ACTIVE'));
            setTeachers(allUsers.filter((user) => user.role === 'TEACHER' && user.status === 'ACTIVE'));
            setCourses(Array.isArray(courseRes) ? courseRes : (courseRes.content || []));
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra khi tải dữ liệu từ máy chủ!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showCreateModal = () => {
        setEditingClass(null);
        form.resetFields();
        form.setFieldsValue({ status: 'ONGOING' });
        setIsCreateModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingClass(record);
        form.setFieldsValue({
            name: record.name,
            courseId: record.courseId,
            teacherId: record.teacherId,
            semester: record.semester,
            status: record.status,
        });
        setIsCreateModalVisible(true);
    };

    const handleClassSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            if (editingClass) {
                await axiosClient.put(`/api/admin/classes/${editingClass.id}`, values);
                message.success('Cập nhật lớp học thành công!');
            } else {
                await axiosClient.post('/api/admin/classes', values);
                message.success('Tạo lớp học mới thành công!');
            }
            setIsCreateModalVisible(false);
            fetchData();
        } catch (error) {
            if (error.errorFields) return;
            console.error(error);
            message.error(error.response?.data?.message || error.response?.data || 'Lưu lớp học thất bại!');
        } finally {
            setSubmitting(false);
        }
    };

    const showEnrollModal = (record) => {
        setSelectedClass(record);
        setSelectedStudentIds([]);
        setIsEnrollModalVisible(true);
    };

    const handleEnrollSubmit = async () => {
        if (selectedStudentIds.length === 0) {
            message.warning('Vui lòng chọn ít nhất 1 sinh viên!');
            return;
        }
        setSubmitting(true);
        try {
            await axiosClient.post(`/api/admin/classes/${selectedClass.id}/enroll`, selectedStudentIds);
            message.success(`Đã thêm ${selectedStudentIds.length} sinh viên vào lớp!`);
            setIsEnrollModalVisible(false);
            fetchData();
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || error.response?.data || 'Ghi danh thất bại!');
        } finally {
            setSubmitting(false);
        }
    };

    const showStudentsModal = async (record) => {
        setSelectedClass(record);
        setIsStudentsModalVisible(true);
        try {
            const data = await axiosClient.get(`/api/admin/classes/${record.id}/students`);
            setClassStudents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            message.error('Không thể tải danh sách sinh viên trong lớp!');
        }
    };

    const handleRemoveStudent = async (studentId) => {
        try {
            await axiosClient.delete(`/api/admin/classes/${selectedClass.id}/students/${studentId}`);
            message.success('Đã xóa sinh viên khỏi lớp!');
            showStudentsModal(selectedClass);
            fetchData();
        } catch (error) {
            console.error(error);
            message.error('Không thể xóa sinh viên khỏi lớp!');
        }
    };

    const columns = [
        { title: 'Mã', dataIndex: 'id', width: 70, render: (id) => <Text type="secondary">#{id}</Text> },
        { title: 'Tên lớp', dataIndex: 'name', render: (text) => <Text strong style={{ color: '#1677ff' }}>{text}</Text> },
        {
            title: 'Học phần',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Tag icon={<BookOutlined />} color="cyan">{record.courseCode || 'N/A'}</Tag>
                    <Text>{record.courseTitle || 'Chưa có'}</Text>
                    <Text type="secondary">{record.courseCredits ? `${record.courseCredits} tín chỉ` : ''}</Text>
                </Space>
            ),
        },
        { title: 'Giảng viên', dataIndex: 'teacherName', render: (teacher) => <Text strong>{teacher || 'Chưa phân công'}</Text> },
        { title: 'Học kỳ', dataIndex: 'semester' },
        { title: 'Sinh viên', dataIndex: 'studentCount', width: 100, render: (count) => count ?? 0 },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={status === 'ONGOING' ? 'green' : 'default'}>
                    {status === 'ONGOING' ? 'Đang diễn ra' : 'Đã kết thúc'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            align: 'center',
            width: 320,
            render: (_, record) => (
                <Space wrap>
                    <Tooltip title="Sửa lớp học">
                        <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>Sửa</Button>
                    </Tooltip>
                    <Tooltip title="Xem sinh viên trong lớp">
                        <Button icon={<TeamOutlined />} onClick={() => showStudentsModal(record)}>Sinh viên</Button>
                    </Tooltip>
                    <Tooltip title="Thêm sinh viên vào lớp">
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => showEnrollModal(record)}>Ghi danh</Button>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const studentColumns = [
        { title: 'Mã SV', dataIndex: 'username', render: (value) => <strong>{value}</strong> },
        { title: 'Họ tên', dataIndex: 'fullName' },
        { title: 'Email', dataIndex: 'email' },
        {
            title: 'Hành động',
            width: 130,
            render: (_, record) => (
                <Popconfirm
                    title="Xóa sinh viên khỏi lớp?"
                    okText="Xóa"
                    cancelText="Hủy"
                    onConfirm={() => handleRemoveStudent(record.id)}
                >
                    <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Quản lý Lớp học</Title>
                    <Text type="secondary">Quản lý lớp, học phần, giảng viên và sinh viên trong lớp</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={showCreateModal}>
                    Tạo lớp học mới
                </Button>
            </div>

            <Table columns={columns} dataSource={classes} rowKey="id" loading={loading} pagination={{ pageSize: 7, position: ['bottomCenter'] }} />

            <Modal
                title={editingClass ? 'Sửa lớp học' : 'Tạo lớp học mới'}
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={handleClassSubmit}
                confirmLoading={submitting}
                okText={editingClass ? 'Lưu thay đổi' : 'Tạo lớp'}
                cancelText="Hủy"
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên lớp học" rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}>
                        <Input placeholder="VD: CS101-01" />
                    </Form.Item>
                    <Form.Item name="courseId" label="Học phần" rules={[{ required: true, message: 'Vui lòng chọn học phần!' }]}>
                        <Select placeholder="Chọn học phần" showSearch optionFilterProp="label">
                            {courses.map((course) => (
                                <Option key={course.id} value={course.id} label={`${course.code} - ${course.title}`}>
                                    {course.code} - {course.title} ({course.credits} tín chỉ)
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="teacherId" label="Giảng viên phụ trách" rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}>
                        <Select placeholder="Chọn giảng viên" showSearch optionFilterProp="label">
                            {teachers.map((teacher) => (
                                <Option key={teacher.id} value={teacher.id} label={`${teacher.username} - ${teacher.fullName || ''}`}>
                                    {teacher.fullName || teacher.username}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="semester" label="Học kỳ" rules={[{ required: true, message: 'Vui lòng nhập học kỳ!' }]}>
                        <Input placeholder="VD: HK1 2026-2027" />
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái" initialValue="ONGOING">
                        <Select>
                            <Option value="ONGOING">Đang diễn ra</Option>
                            <Option value="COMPLETED">Đã kết thúc</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={`Ghi danh sinh viên - ${selectedClass?.name || ''}`}
                open={isEnrollModalVisible}
                onCancel={() => setIsEnrollModalVisible(false)}
                onOk={handleEnrollSubmit}
                confirmLoading={submitting}
                okText="Xác nhận"
                cancelText="Đóng"
                width={640}
                destroyOnHidden
            >
                <div style={{ padding: '12px 0' }}>
                    <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8, marginBottom: 24 }}>
                        <Text strong style={{ display: 'block', marginBottom: 8, color: '#1677ff' }}>
                            Cách 1: Nhập hàng loạt từ file Excel
                        </Text>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                            File Excel cần cột đầu tiên chứa mã sinh viên/username.
                        </Text>
                        <FileUpload
                            buttonText="Tải lên danh sách Excel"
                            accept=".xlsx, .xls"
                            uploadUrl={`/api/admin/classes/${selectedClass?.id}/enroll/excel`}
                            onUploadSuccess={() => {
                                message.success('Đã ghi danh sinh viên từ file Excel!');
                                setIsEnrollModalVisible(false);
                                fetchData();
                            }}
                        />
                    </div>

                    <Text strong style={{ display: 'block', marginBottom: 8 }}>Cách 2: Chọn sinh viên thủ công</Text>
                    <Select
                        mode="multiple"
                        allowClear
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="Gõ mã SV hoặc tên để tìm..."
                        value={selectedStudentIds}
                        onChange={setSelectedStudentIds}
                        options={students.map((student) => ({ value: student.id, label: `${student.username} - ${student.fullName || ''}` }))}
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    />
                </div>
            </Modal>

            <Modal
                title={`Sinh viên trong lớp - ${selectedClass?.name || ''}`}
                open={isStudentsModalVisible}
                onCancel={() => setIsStudentsModalVisible(false)}
                footer={null}
                width={760}
                destroyOnHidden
            >
                <Table columns={studentColumns} dataSource={classStudents} rowKey="id" pagination={{ pageSize: 6 }} />
            </Modal>
        </Card>
    );
}

import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message, Modal, Select, Typography, Card, Tooltip, Form, Input } from 'antd';
// Đã bổ sung thêm FolderOpenOutlined vào dòng import dưới đây
import { TeamOutlined, PlusOutlined, BookOutlined, EyeOutlined, FolderOpenOutlined } from '@ant-design/icons'; 
import axiosClient from '../api/axiosClient';
import FileUpload from './FileUpload';
import ClassMaterials from './ClassMaterials';

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
    const [form] = Form.useForm(); 

    // States cho Modal Xem danh sách sinh viên ===
    const [isViewStudentsModalVisible, setIsViewStudentsModalVisible] = useState(false);
    const [classListStudents, setClassListStudents] = useState([]);
    const [viewingClass, setViewingClass] = useState(null);
    const [loadingStudents, setLoadingStudents] = useState(false);

    // States cho Modal Tài liệu
    const [isMaterialModalVisible, setIsMaterialModalVisible] = useState(false);
    const [materialClass, setMaterialClass] = useState(null);

    // Hàm mở Modal Tài liệu
    const showMaterialModal = (record) => {
        setMaterialClass(record);
        setIsMaterialModalVisible(true);
    };

    // === FETCH DATA ===
    const fetchData = async () => {
        setLoading(true);
        try {
            const classRes = await axiosClient.get('/api/admin/classes');
            setClasses(Array.isArray(classRes) ? classRes : (classRes.content || []));

            const userRes = await axiosClient.get('/api/admin/users?size=1000');
            const allUsers = userRes.content || userRes || [];
            setStudents(allUsers.filter(u => u.role === 'STUDENT' && u.status === 'ACTIVE'));
            setTeachers(allUsers.filter(u => u.role === 'TEACHER' && u.status === 'ACTIVE'));

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
        form.resetFields(); 
        setIsCreateModalVisible(true);
    };

    const handleCreateSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmittingCreate(true);
            
            await axiosClient.post('/api/admin/classes', values);
            message.success('Tạo lớp học mới thành công!');
            
            setIsCreateModalVisible(false);
            fetchData(); 
        } catch (error) {
            if (error.errorFields) return; 
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

    // === HANDLER XEM DANH SÁCH SINH VIÊN ===
    const handleViewStudents = async (record) => {
        setViewingClass(record);
        setIsViewStudentsModalVisible(true);
        setLoadingStudents(true);
        try {
            const response = await axiosClient.get(`/api/admin/classes/${record.id}/students`);
            setClassListStudents(Array.isArray(response) ? response : []);
        } catch (error) {
            message.error("Không thể tải danh sách sinh viên của lớp!");
        } finally {
            setLoadingStudents(false);
        }
    };

// === CẤU HÌNH TABLE ===
    const columns = [
        { 
            title: 'Mã', 
            dataIndex: 'id', 
            render: (id) => <div style={{ whiteSpace: 'nowrap' }}><Text type="secondary">#{id}</Text></div> 
        },
        { 
            title: 'Tên Lớp Học', 
            dataIndex: 'name', 
            render: (text) => <div style={{ whiteSpace: 'nowrap' }}><Text strong style={{ color: '#1890ff' }}>{text}</Text></div> 
        },
        { 
            title: 'Học Phần (Môn học)', 
            dataIndex: 'courseTitle', 
            render: (course) => <div style={{ whiteSpace: 'nowrap' }}><Tag icon={<BookOutlined />} color="cyan">{course || 'Chưa có'}</Tag></div> 
        },
        { 
            title: 'Giảng viên', 
            dataIndex: 'teacherName', 
            render: (teacher) => <div style={{ whiteSpace: 'nowrap' }}><Text strong>{teacher || 'Chưa phân công'}</Text></div> 
        },
        { 
            title: 'Học kỳ', 
            dataIndex: 'semester', 
            render: (text) => <div style={{ whiteSpace: 'nowrap' }}>{text}</div> 
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => (
                <div style={{ whiteSpace: 'nowrap' }}>
                    <Tag color={status === 'ONGOING' ? 'green' : 'default'} style={{ borderRadius: '12px', padding: '0 10px' }}>
                        {status === 'ONGOING' ? 'Đang diễn ra' : 'Đã kết thúc'}
                    </Tag>
                </div>
            )
        },
        {
            title: 'Hành động',
            align: 'center',
            // Đã xóa `fixed: 'right'` và `width` để cột không bị nổi đè lên các cột khác
            render: (_, record) => (
                <Space size="middle" style={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Quản lý tài liệu học tập">
                        <Button icon={<FolderOpenOutlined />} onClick={() => showMaterialModal(record)}>
                            Tài liệu
                        </Button>
                    </Tooltip>

                    <Tooltip title="Xem danh sách sinh viên trong lớp">
                        <Button icon={<EyeOutlined />} onClick={() => handleViewStudents(record)}>
                            Sĩ số
                        </Button>
                    </Tooltip>

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
                scroll={{ x: 'max-content' }} // <--- Cập nhật dòng này
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
                    <Form.Item name="name" label="Tên lớp học" rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}>
                        <Input placeholder="VD: Toán Cao Cấp - Nhóm 01" />
                    </Form.Item>

                    <Form.Item name="courseId" label="Môn học (Học phần)" rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
                        <Select placeholder="-- Chọn môn học --" showSearch optionFilterProp="children">
                            {courses.map(course => (
                                <Option key={course.id} value={course.id}>{course.title} ({course.code})</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="teacherId" label="Giảng viên phụ trách" rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}>
                        <Select placeholder="-- Chọn giảng viên --" showSearch optionFilterProp="children">
                            {teachers.map(tc => (
                                <Option key={tc.id} value={tc.id}>{tc.fullName || tc.username}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="semester" label="Học kỳ" rules={[{ required: true, message: 'Vui lòng nhập học kỳ!' }]} initialValue="Học kỳ 1 - 2024">
                        <Input placeholder="VD: Học kỳ 1 - 2024" />
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái" initialValue="ONGOING">
                        <Select>
                            <Option value="ONGOING">Đang diễn ra</Option>
                            <Option value="ENDED">Đã kết thúc</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

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
                    <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '24px' }}>
                        <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1890ff' }}>
                            Cách 1: Nhập hàng loạt từ file Excel (.xlsx)
                        </Text>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '12px', fontSize: '13px' }}>
                            File Excel chỉ cần 1 cột đầu tiên chứa Mã sinh viên (Username).
                        </Text>
                        
                        <FileUpload 
                            buttonText="Tải lên danh sách Excel" 
                            accept=".xlsx, .xls" 
                            uploadUrl={`/api/admin/classes/${selectedClass?.id}/enroll/excel`} 
                            onUploadSuccess={(responseMessage) => {
                                message.success(responseMessage || "Đã ghi danh toàn bộ sinh viên trong file Excel vào lớp!");
                                setIsEnrollModalVisible(false);
                                fetchData(); 
                            }} 
                        />
                    </div>

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

            {/* MODAL 3: XEM DANH SÁCH SINH VIÊN */}
            <Modal
                title={
                    <Space>
                        <TeamOutlined style={{ color: '#1890ff' }}/>
                        <span>
                            Sĩ số lớp <Text type="danger">{viewingClass?.name}</Text> 
                            <Tag color="blue" style={{ marginLeft: 8 }}>{classListStudents.length} sinh viên</Tag>
                        </span>
                    </Space>
                }
                open={isViewStudentsModalVisible}
                onCancel={() => setIsViewStudentsModalVisible(false)}
                footer={[
                    <Button key="close" type="primary" onClick={() => setIsViewStudentsModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={700}
                destroyOnHidden
            >
                <Table
                    dataSource={classListStudents}
                    rowKey="id"
                    loading={loadingStudents}
                    pagination={{ pageSize: 5 }}
                    columns={[
                        { title: 'ID', dataIndex: 'id', width: '60px' },
                        { title: 'Mã SV (Username)', dataIndex: 'username', render: (text) => <Text strong>{text}</Text> },
                        { title: 'Họ và tên', dataIndex: 'fullName' },
                        { title: 'Email', dataIndex: 'email' },
                    ]}
                    style={{ marginTop: '16px' }}
                />
            </Modal>

            {/* MODAL 4: QUẢN LÝ TÀI LIỆU (BỔ SUNG) */}
            <Modal
                title={
                    <Space>
                        <FolderOpenOutlined style={{ color: '#1890ff' }}/>
                        <span>Tài liệu lớp <Text type="danger">{materialClass?.name}</Text></span>
                    </Space>
                }
                open={isMaterialModalVisible}
                onCancel={() => setIsMaterialModalVisible(false)}
                footer={null}
                width={800}
                destroyOnHidden
            >
                <ClassMaterials classId={materialClass?.id} isTeacherOrAdmin={true} />
            </Modal>

        </Card>
    );
}
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Popconfirm, Space, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReadOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const formatMoney = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [form] = Form.useForm();

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/api/admin/courses');
            setCourses(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error(error);
            message.error('Không thể tải danh sách học phần!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const showAddModal = () => {
        setEditingCourse(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingCourse(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingCourse) {
                await axiosClient.put(`/api/admin/courses/${editingCourse.id}`, values);
                message.success('Cập nhật học phần thành công!');
            } else {
                await axiosClient.post('/api/admin/courses', values);
                message.success('Thêm học phần thành công!');
            }
            setIsModalVisible(false);
            fetchCourses();
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || error.response?.data || 'Lưu học phần thất bại!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosClient.delete(`/api/admin/courses/${id}`);
            message.success('Đã xóa học phần!');
            fetchCourses();
        } catch (error) {
            console.error(error);
            message.error('Không thể xóa học phần đang được dùng bởi lớp học.');
        }
    };

    const columns = [
        { title: 'Mã học phần', dataIndex: 'code', render: (code) => <Tag color="blue">{code}</Tag> },
        { title: 'Tên học phần', dataIndex: 'title', render: (title) => <strong>{title}</strong> },
        { title: 'Số tín chỉ', dataIndex: 'credits', width: 120 },
        { title: 'Học phí', dataIndex: 'tuitionFee', width: 160, render: formatMoney },
        {
            title: 'Hành động',
            width: 220,
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>Sửa</Button>
                    <Popconfirm
                        title="Xóa học phần này?"
                        description="Chỉ nên xóa khi học phần chưa được gắn với lớp học."
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>
                    <ReadOutlined /> Quản lý học phần
                </h3>
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                    Thêm học phần
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={courses}
                rowKey="id"
                loading={loading}
                bordered
                pagination={{ pageSize: 8 }}
            />

            <Modal
                title={editingCourse ? 'Sửa học phần' : 'Thêm học phần'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="code" label="Mã học phần" rules={[{ required: true, message: 'Vui lòng nhập mã học phần!' }]}>
                        <Input placeholder="VD: CS101" />
                    </Form.Item>
                    <Form.Item name="title" label="Tên học phần" rules={[{ required: true, message: 'Vui lòng nhập tên học phần!' }]}>
                        <Input placeholder="VD: Nhập môn lập trình" />
                    </Form.Item>
                    <Form.Item name="credits" label="Số tín chỉ" rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}>
                        <InputNumber min={1} max={10} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
